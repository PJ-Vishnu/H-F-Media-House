import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-2xl font-bold font-headline text-primary tracking-tight", className)}>
        <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <Camera />
        </div>
      <span className="text-foreground">H&F Media</span>
    </Link>
  );
}
