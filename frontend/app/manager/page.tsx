'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FAKE_STAFF_LIST = [
  {
    id: 'staff-1',
    name: 'John Tan',
    email: 'john.tan@example.com',
    currentLevel: 0,
    pathway: 'UX Designer',
  },
  {
    id: 'staff-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    currentLevel: 1,
    pathway: 'UX Designer',
  },
  {
    id: 'staff-3',
    name: 'Michael Wong',
    email: 'michael.wong@example.com',
    currentLevel: 0,
    pathway: 'UX Designer',
  },
  {
    id: 'staff-4',
    name: 'Emily Lim',
    email: 'emily.lim@example.com',
    currentLevel: 2,
    pathway: 'UX Designer',
  },
  {
    id: 'staff-5',
    name: 'David Kumar',
    email: 'david.kumar@example.com',
    currentLevel: 1,
    pathway: 'UX Designer',
  },
];

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = FAKE_STAFF_LIST.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-[rgb(var(--color-border))] sticky top-0 z-50 shadow-[var(--shadow-xs)]">
        <div className="container mx-auto px-[var(--space-6)]">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-[var(--space-4)]">
              <div className="flex items-center gap-[var(--space-3)]">
                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-text-primary))] flex items-center justify-center text-white font-serif font-bold text-sm shadow-[var(--shadow-base)]">
                  LP
                </div>
                <div>
                  <h1 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] leading-none mb-0.5">
                    Learning Pathway
                  </h1>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">Manager Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[var(--space-4)]">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-neutral-100))]">
                  <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  <span className="hidden sm:inline">Switch</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-[var(--space-6)] py-[var(--space-12)] max-w-7xl">
        {/* Header */}
        <header className="mb-[var(--space-8)]">
          <h1 className="font-serif text-[length:var(--text-4xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
            Manager Dashboard
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))] text-[length:var(--text-lg)]">
            View and manage your team's learning pathways
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-[var(--space-6)]">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              px-4 py-3
              bg-white
              border-2 border-[rgb(var(--color-border))]
              rounded-xl
              text-sm
              text-[rgb(var(--color-text-primary))]
              placeholder:text-[rgb(var(--color-text-muted))]
              focus:outline-none
              focus:ring-2
              focus:ring-[rgb(var(--color-primary-400))]
              focus:border-[rgb(var(--color-primary-400))]
              transition-all
              shadow-sm
            "
          />
        </div>

        {/* Staff List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
          {filteredStaff.map((staff) => (
            <Link
              key={staff.id}
              href={`/staff?userId=${staff.id}&managerId=manager-1&managerName=Sarah Manager`}
            >
              <Card className="shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all cursor-pointer bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary-300))]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-[length:var(--text-xl)] mb-[var(--space-1)] text-[rgb(var(--color-text-primary))]">
                        {staff.name}
                      </CardTitle>
                      <CardDescription className="text-[rgb(var(--color-text-secondary))]">
                        {staff.email}
                      </CardDescription>
                    </div>
                    <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-[var(--space-4)]">
                    <div className="flex-1">
                      <p className="text-xs text-[rgb(var(--color-text-muted))] mb-1">Pathway</p>
                      <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {staff.pathway}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[rgb(var(--color-text-muted))] mb-1">Current Level</p>
                      <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {staff.currentLevel === 0 ? 'Pre-Schema' : `Level ${staff.currentLevel}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-[var(--space-12)]">
            <p className="text-[rgb(var(--color-text-muted))]">No staff members found</p>
          </div>
        )}
      </div>
    </div>
  );
}
