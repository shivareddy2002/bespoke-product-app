import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  viewAllPath?: string;
}

export default function SectionHeader({ title, viewAllPath }: SectionHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {viewAllPath && (
        <button
          onClick={() => navigate(viewAllPath)}
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          View All <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
