'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InformationalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to UX Designer pathway by default
    router.replace('/informational/ux-designer');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
      <div className="flex flex-col items-center gap-[var(--space-4)]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[rgb(var(--color-primary-200))] border-t-[rgb(var(--color-primary-600))]"></div>
        <p className="text-[rgb(var(--color-text-secondary))] text-base font-medium">Redirecting...</p>
      </div>
    </div>
  );
}
