"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Document, Card, CardComment } from '@/types';
import { templates, TemplateType } from "@/components/document-templates/index";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { exportAsPNG } from "@/utils/export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Download, Link } from "lucide-react";
import { ExportModal } from "@/components/ExportModal";
import { DocumentProvider } from './DocumentContext';

interface TemplateRendererProps {
  document: Document;
  isExporting?: boolean;
}

const TemplateRenderer = ({ document, isExporting }: TemplateRendererProps) => {
  if (!(document.template in templates)) {
    return <div className="text-red-500">Unknown template type: {document.template}</div>;
  }
  const Template = templates[document.template];
  return <Template document={document} isExporting={isExporting} />;
};

export default function DocumentPage() {
  const [document, setDocument] = useState<Document | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [comments, setComments] = useState<CardComment[]>([]);
  const [author, setAuthor] = useState<{ username?: string, avatar_url?: string, email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState<string>("");

  const params = useParams();
  const documentId = params.id;

  const updateDocumentStatus = async (status: 'private' | 'public') => {
    const supabase = createClient();
    
    try {
      const response = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: documentId,
          status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document status');
      }

      const updatedDocument = await response.json();
      setDocument(updatedDocument);
      toast.success(`Document visibility changed to ${status}`);
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error('Failed to update document visibility');
    }
  };

  const updateDocumentTitle = async (newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: documentId,
          title: newTitle.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document title');
      }

      const updatedDocument = await response.json();
      setDocument(updatedDocument);
      toast.success('Document title updated successfully');
    } catch (error) {
      console.error('Error updating document title:', error);
      toast.error('Failed to update document title');
    }
  };

  const handleTitleClick = () => {
    if (isOwner) {
      setIsEditingTitle(true);
      setTitleValue(document?.title || "");
    }
  };

  const handleTitleBlur = () => {
    if (isEditingTitle) {
      setIsEditingTitle(false);
      if (titleValue !== document?.title) {
        updateDocumentTitle(titleValue);
      }
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleValue(document?.title || "");
    }
  };

  const refreshCards = async () => {
    const supabase = createClient();
    const { data: updatedCards } = await supabase
      .from('cards')
      .select('*')
      .eq('document_id', documentId)
      .order('position');

    if (updatedCards) {
      setCards(updatedCards);
    }
  };

  const refreshComments = async () => {
    const supabase = createClient();
    const { data: updatedComments } = await supabase
      .from('comments')
      .select('*')
      .in('card_id', cards.map(card => card.id))
      .order('created_at');

    if (updatedComments) {
      setComments(updatedComments);
    }
  };

  const handleCardCreated = async () => {
    await refreshCards();
  };

  const handleCommentsUpdated = async () => {
    await refreshComments();
  };

  useEffect(() => {
    const supabase = createClient();
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Check auth status but don't redirect
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);

        // First fetch document and cards
        const [documentResponse, cardsResponse] = await Promise.all([
          supabase
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .single(),
          supabase
            .from('cards')
            .select('*')
            .eq('document_id', documentId)
            .order('created_at', { ascending: true })
        ]);

        if (documentResponse.error) {
          setError(documentResponse.error.message);
          return;
        }

        // Check if document is private and user is not logged in
        if (documentResponse.data.status === 'private' && !user) {
          setError('This document is private');
          return;
        }

        // Check if user is the owner
        setIsOwner(user?.id === documentResponse.data.user_id);

        // Fetch author's profile
        const { data: authorProfile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', documentResponse.data.user_id)
          .single();
        
        // Get author's email as fallback
        const { data: { user: author } } = await supabase.auth.admin.getUserById(documentResponse.data.user_id);
        
        setAuthor({
          username: authorProfile?.username,
          avatar_url: authorProfile?.avatar_url,
          email: author?.email
        });

        if (cardsResponse.error) {
          setError(cardsResponse.error.message);
          return;
        }

        const fetchedCards = cardsResponse.data || [];
        setDocument(documentResponse.data);
        setCards(fetchedCards);

        // Now fetch comments using the card IDs we just got
        if (fetchedCards.length > 0) {
          const commentsResponse = await supabase
            .from('comments')
            .select('*')
            .in('card_id', fetchedCards.map(card => card.id))
            .order('created_at', { ascending: true });

          if (commentsResponse.error) {
            console.error('Error fetching comments:', commentsResponse.error);
            return;
          }

          setComments(commentsResponse.data || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  // Memoize handlers for context
  const refreshCardsCb = useCallback(refreshCards, [documentId]);
  const refreshCommentsCb = useCallback(refreshComments, [cards, documentId]);
  const handleCardCreatedCb = useCallback(handleCardCreated, [refreshCards]);
  const handleCommentsUpdatedCb = useCallback(handleCommentsUpdated, [refreshComments]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <DocumentProvider value={{
      document,
      setDocument,
      cards,
      setCards,
      comments,
      setComments,
      refreshCards: refreshCardsCb,
      refreshComments: refreshCommentsCb,
      handleCardCreated: handleCardCreatedCb,
      handleCommentsUpdated: handleCommentsUpdatedCb,
      isOwner,
    }}>
      <Toaster />

      <div className="container mx-auto pb-12">

        <div className="flex items-center justify-between my-8 border-b border-gray-200 pb-8">
          <div>
            {isEditingTitle ? (
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-2xl mb-2 bg-gray-100 border-none outline-none rounded py-1 w-full"
                autoFocus
              />
            ) : (
              <h2 
                className={`text-2xl mb-2 ${isOwner ? 'cursor-pointer hover:bg-gray-100 rounded py-1 transition-colors' : ''}`}
                onClick={handleTitleClick}
              >
                {document?.title}
              </h2>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {author?.avatar_url && (
                <img 
                  src={author.avatar_url}
                  alt="Author's avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span>By {author?.username || author?.email}</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Select 
                  defaultValue={document?.status}
                  onValueChange={(value: 'private' | 'public') => updateDocumentStatus(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                {document?.status === 'public' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = window.location.href;
                      navigator.clipboard.writeText(url)
                        .then(() => {
                          toast.success('Link copied to clipboard');
                        })
                        .catch(() => {
                          toast.error('Failed to copy link');
                        });
                    }}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Copy link
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsExportModalOpen(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export as PNG
              </Button>
            </div>
          )}
        </div>
        
        {document && (
          <>
            <TemplateRenderer 
              document={document} 
              isExporting={isExporting}
            />
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              document={document}
              cards={cards}
              comments={comments}
            />
          </>
        )}
      </div>
    </DocumentProvider>
  );
}