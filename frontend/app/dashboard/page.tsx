'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push('/');
      return;
    }

    apiClient('/users/me', userId)
      .then((data) => {
        setUser(data.data);
        // Redirect based on role
        if (data.data.role === 'STAFF') {
          router.push(`/staff?userId=${userId}`);
        } else if (data.data.role === 'MANAGER') {
          router.push(`/manager?userId=${userId}`);
        } else {
          router.push(`/staff?userId=${userId}`); // Admin can view as staff for demo
        }
      })
      .catch(() => {
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="flex flex-col items-center gap-[var(--space-4)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[rgb(var(--color-primary-200))] border-t-[rgb(var(--color-primary-600))]"></div>
          <p className="text-[rgb(var(--color-text-secondary))] text-sm font-medium">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="flex flex-col items-center gap-[var(--space-4)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[rgb(var(--color-primary-200))] border-t-[rgb(var(--color-primary-600))]"></div>
          <p className="text-[rgb(var(--color-text-secondary))] text-sm font-medium">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
