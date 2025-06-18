import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportAsPNG } from "@/utils/export";
import { Document, Card, CardComment } from '@/types';
import { templates } from "@/components/document-templates";
import { createClient } from "@/utils/supabase/client";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  cards: Card[];
  comments: CardComment[];
}

export function ExportModal({ isOpen, onClose, document, cards: initialCards, comments: initialComments }: ExportModalProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [comments, setComments] = useState<CardComment[]>(initialComments);
  const exportViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const refreshData = async () => {
        const supabase = createClient();
        
        // Fetch fresh cards
        const { data: updatedCards } = await supabase
          .from('cards')
          .select('*')
          .eq('document_id', document.id)
          .order('position');

        if (updatedCards) {
          setCards(updatedCards);
        }

        // Fetch fresh comments
        const { data: updatedComments } = await supabase
          .from('comments')
          .select('*')
          .in('card_id', updatedCards?.map(card => card.id) || [])
          .order('created_at');

        if (updatedComments) {
          setComments(updatedComments);
        }
      };

      refreshData();
    }
  }, [isOpen, document.id]);

  const handleExport = async () => {
    if (!exportViewRef.current) return;

    try {
      setIsExporting(true);
      // Wait for the export view to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      await exportAsPNG('export-view', document?.title || 'document-export');
    } catch (error) {
      console.error('Error exporting document:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const Template = templates[document.template];

  return (
    <>
      {/* Hidden export view */}
      <div 
        ref={exportViewRef}
        className="fixed left-0 top-0 -z-50 opacity-0"
        style={{ width: '1200px' }}
      >
        <div id="export-view" className="p-6">
          <Template 
            document={document} 
            cards={cards} 
            comments={comments}
            isExporting={true}
          />
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[1200px] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Export Document</span>
              <Button 
                onClick={handleExport} 
                variant="outline"
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Download PNG'}
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-x-auto">
            <div style={{ width: '1200px' }}>
              <Template 
                document={document} 
                cards={cards} 
                comments={comments}
                isExporting={true}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 