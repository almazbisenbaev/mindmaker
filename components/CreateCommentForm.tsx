import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

interface CreateCommentFormProps {
  cardId: string;
  onCommentCreated: () => Promise<void>;
  onCancel: () => void;
}

export function CreateCommentForm({ cardId, onCommentCreated, onCancel }: CreateCommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          card_id: cardId,
          content: content.trim(),
          user_id: user.id,
          created_at: new Date().toISOString(), // Explicitly set created_at
        });

      if (error) throw error;

      // Clear form and notify parent
      setContent('');
      await onCommentCreated();
      onCancel(); // Close the form after successful submission
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 text-sm border rounded-md resize-none"
        rows={2}
        disabled={isSubmitting}
      />
      <div className="flex gap-2 mt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          size="sm"
        >
          {isSubmitting ? 'Adding...' : 'Add Comment'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}