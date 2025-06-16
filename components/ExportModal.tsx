import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportAsPNG } from "@/utils/export";
import { Document, Card, CardComment } from '@/types';
import { templates } from "@/components/document-templates";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  cards: Card[];
  comments: CardComment[];
}

export function ExportModal({ isOpen, onClose, document, cards, comments }: ExportModalProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const exportViewRef = useRef<HTMLDivElement>(null);

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
        className="fixed left-0 top-0 -z-50"
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
        <DialogContent className="max-w-[1200px] w-full">
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