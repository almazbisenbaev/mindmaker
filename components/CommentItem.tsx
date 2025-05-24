import { CardComment } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: CardComment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="py-2 px-3 bg-gray-50 rounded text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
        <time className="text-xs text-gray-500 whitespace-nowrap">
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
        </time>
      </div>
    </div>
  );
}