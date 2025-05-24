"use client";


import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { Document, Card } from '@/types';
import { templates, TemplateType } from "@/components/document-templates/index";

interface TemplateRendererProps {
  document: Document;
  cards: Card[];
}

const TemplateRenderer = ({ document, cards }: TemplateRendererProps) => {
  if (!(document.template in templates)) {
    return <div className="text-red-500">Unknown template type: {document.template}</div>;
  }
  
  const Template = templates[document.template];
  return <Template document={document} cards={cards} />;
};


export default function DocumentPage() {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const documentId = params.id;

  useEffect(() => {
    const supabase = createClient();
    
    const fetchDocumentAndCards = async () => {
      try {
        setIsLoading(true);
        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/sign-in");
          return;
        }

        // Fetch document and cards in parallel
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

        if (cardsResponse.error) {
          setError(cardsResponse.error.message);
          return;
        }

        setDocument(documentResponse.data);
        setCards(cardsResponse.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentAndCards();
  }, [documentId, router]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center mb-8">Document Page</h2>

      {document && (
        <div className="max-w-6xl mx-auto">
          <TemplateRenderer document={document} cards={cards} />
        </div>
      )}
    </div>
  );
}