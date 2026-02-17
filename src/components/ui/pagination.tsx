import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {lastPage}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
