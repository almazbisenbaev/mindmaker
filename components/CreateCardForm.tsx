import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

interface CreateCardFormProps {
  documentId: string;
  columnId: string;
  onCardCreated: () => void;
}

export function CreateCardForm({ documentId, columnId, onCardCreated }: CreateCardFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // Get the highest position number for this column
      const { data: existingCards } = await supabase
        .from('cards')
        .select('position')
        .eq('document_id', documentId)
        .eq('column_id', columnId)
        .order('position', { ascending: false })
        .limit(1);

      const newPosition = existingCards?.[0]?.position ?? 0;

      // Insert the new card
      const { error } = await supabase
        .from('cards')
        .insert({
          document_id: documentId,
          column_id: columnId,
          content: content.trim(),
          position: newPosition + 1,
        });

      if (error) throw error;

      // Clear form and notify parent
      setContent('');
      await onCardCreated(); // Make sure to await the callback
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a new card..."
        className="w-full p-2 text-sm border rounded-md resize-none"
        rows={3}
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full mt-2"
        size="sm"
      >
        {isSubmitting ? 'Adding...' : 'Add Card'}
      </Button>
    </form>
  );
}