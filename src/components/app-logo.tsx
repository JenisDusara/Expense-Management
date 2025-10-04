import { ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-semibold", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ReceiptText size={20} />
      </div>
      <span className="font-headline">ExpenseFlow</span>
    </div>
  );
}
