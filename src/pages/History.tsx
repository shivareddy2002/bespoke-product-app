import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/EmptyState';
import { Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function History() {
  const { history } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="pb-3 pt-6">
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">{history.length} pages visited</p>
      </header>

      {history.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No browsing history"
          description="Products you open externally will appear here."
        />
      ) : (
        <div className="space-y-2 pt-2">
          {history.map((entry, i) => (
            <a
              key={`${entry.productId}-${i}`}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover"
            >
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-card-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.visitedAt), { addSuffix: true })}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
