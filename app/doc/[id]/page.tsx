"use client";


import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Document, Card, CardComment } from '@/types';
import { templates, TemplateType } from "@/components/document-templates/index";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"

interface TemplateRendererProps {
  document: Document;
  cards: Card[];
  comments: CardComment[];
}

const TemplateRenderer = ({ document, cards, comments }: TemplateRendererProps) => {
  if (!(document.template in templates)) {
    return <div className="text-red-500">Unknown template type: {document.template}</div>;
  }
  
  const Template = templates[document.template];
  return <Template document={document} cards={cards} comments={comments} />;
};

export default function DocumentPage() {
  const [document, setDocument] = useState<Document | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [comments, setComments] = useState<CardComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

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

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Toaster />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl">{document?.title}</h2>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Label htmlFor="status">Visibility</Label>
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
              </div>
            )}
          </div>
          
          {document && (
            <TemplateRenderer 
              document={document} 
              cards={cards} 
              comments={comments}
            />
          )}
        </div>
      </div>
    </>
  );
}