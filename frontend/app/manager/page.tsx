'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FAKE_STAFF_LIST = [
  // Designers
  {
    id: 'staff-1',
    name: 'John Tan',
    email: 'john.tan@example.com',
    currentLevel: 0,
    pathway: 'UX Designer',
    preSchemaCompletion: 75, // completed 3 out of 4 steps
  },
  {
    id: 'staff-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    currentLevel: 0,
    pathway: 'UX Designer',
    preSchemaCompletion: 50, // completed 2 out of 4 steps
  },
  {
    id: 'staff-3',
    name: 'Michael Wong',
    email: 'michael.wong@example.com',
    currentLevel: 2,
    pathway: 'UX Designer',
  },
  {
    id: 'staff-4',
    name: 'Emily Lim',
    email: 'emily.lim@example.com',
    currentLevel: 1,
    pathway: 'UX Designer',
  },
  {
    id: 'staff-5',
    name: 'David Kumar',
    email: 'david.kumar@example.com',
    currentLevel: 2,
    pathway: 'UX Designer',
  },
  // Product Managers
  {
    id: 'staff-6',
    name: 'Rachel Ng',
    email: 'rachel.ng@example.com',
    currentLevel: 0,
    pathway: 'Product Manager',
    preSchemaCompletion: 0, // completed 0 out of 4 steps
  },
  {
    id: 'staff-7',
    name: 'Kevin Lee',
    email: 'kevin.lee@example.com',
    currentLevel: 0,
    pathway: 'Product Manager',
    preSchemaCompletion: 0,
  },
  {
    id: 'staff-8',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    currentLevel: 2,
    pathway: 'Product Manager',
  },
  {
    id: 'staff-9',
    name: 'Daniel Teo',
    email: 'daniel.teo@example.com',
    currentLevel: 1,
    pathway: 'Product Manager',
  },
  {
    id: 'staff-10',
    name: 'Amanda Goh',
    email: 'amanda.goh@example.com',
    currentLevel: 2,
    pathway: 'Product Manager',
  },
  // Product Ops Specialists
  {
    id: 'staff-11',
    name: 'Marcus Lim',
    email: 'marcus.lim@example.com',
    currentLevel: 0,
    pathway: 'Product Ops',
    preSchemaCompletion: 0, // completed 0 out of 4 steps
  },
  {
    id: 'staff-12',
    name: 'Jessica Tan',
    email: 'jessica.tan@example.com',
    currentLevel: 0,
    pathway: 'Product Ops',
    preSchemaCompletion: 0,
  },
  {
    id: 'staff-13',
    name: 'Ryan Ong',
    email: 'ryan.ong@example.com',
    currentLevel: 2,
    pathway: 'Product Ops',
  },
  {
    id: 'staff-14',
    name: 'Sophie Koh',
    email: 'sophie.koh@example.com',
    currentLevel: 1,
    pathway: 'Product Ops',
  },
  {
    id: 'staff-15',
    name: 'Benjamin Yap',
    email: 'benjamin.yap@example.com',
    currentLevel: 1,
    pathway: 'Product Ops',
  },
  {
    id: 'staff-21',
    name: 'Catherine Lee',
    email: 'catherine.lee@example.com',
    currentLevel: 2,
    pathway: 'Product Ops',
  },
  {
    id: 'staff-22',
    name: 'Henry Tan',
    email: 'henry.tan@example.com',
    currentLevel: 1,
    pathway: 'Product Ops',
  },
  // Software Engineers
  {
    id: 'staff-16',
    name: 'Alex Chua',
    email: 'alex.chua@example.com',
    currentLevel: 0,
    pathway: 'Software Engineer',
    preSchemaCompletion: 0, // completed 0 out of 4 steps
  },
  {
    id: 'staff-17',
    name: 'Melissa Wong',
    email: 'melissa.wong@example.com',
    currentLevel: 0,
    pathway: 'Software Engineer',
    preSchemaCompletion: 0,
  },
  {
    id: 'staff-18',
    name: 'Jonathan Sim',
    email: 'jonathan.sim@example.com',
    currentLevel: 2,
    pathway: 'Software Engineer',
  },
  {
    id: 'staff-19',
    name: 'Victoria Tan',
    email: 'victoria.tan@example.com',
    currentLevel: 1,
    pathway: 'Software Engineer',
  },
  {
    id: 'staff-20',
    name: 'Nicholas Liu',
    email: 'nicholas.liu@example.com',
    currentLevel: 2,
    pathway: 'Software Engineer',
  },
  {
    id: 'staff-23',
    name: 'Thomas Chen',
    email: 'thomas.chen@example.com',
    currentLevel: 1,
    pathway: 'Software Engineer',
  },
  {
    id: 'staff-24',
    name: 'Grace Ng',
    email: 'grace.ng@example.com',
    currentLevel: 2,
    pathway: 'Software Engineer',
  },
  {
    id: 'staff-25',
    name: 'Brandon Koh',
    email: 'brandon.koh@example.com',
    currentLevel: 1,
    pathway: 'Software Engineer',
  },
  {
    id: 'staff-26',
    name: 'Olivia Lim',
    email: 'olivia.lim@example.com',
    currentLevel: 2,
    pathway: 'Software Engineer',
  },
];

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = FAKE_STAFF_LIST.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const levelCounts = {
    preSchema: FAKE_STAFF_LIST.filter(s => s.currentLevel === 0).length,
    level1: FAKE_STAFF_LIST.filter(s => s.currentLevel === 1).length,
    level2: FAKE_STAFF_LIST.filter(s => s.currentLevel === 2).length,
  };

  const pathwayCounts = {
    'UX Designer': FAKE_STAFF_LIST.filter(s => s.pathway === 'UX Designer').length,
    'Product Manager': FAKE_STAFF_LIST.filter(s => s.pathway === 'Product Manager').length,
    'Product Ops': FAKE_STAFF_LIST.filter(s => s.pathway === 'Product Ops').length,
    'Software Engineer': FAKE_STAFF_LIST.filter(s => s.pathway === 'Software Engineer').length,
  };

  // Calculate actual pre-schema step completion based on real staff data
  // John Tan (staff-1): Steps 1, 2, 3 completed (75%), Step 4 pending
  // Sarah Chen (staff-2): Steps 1, 2 completed (50%), Step 3 ongoing
  // All others: 0% completion
  const preSchemaSteps = {
    step1: 2, // John + Sarah completed step 1
    step2: 2, // John + Sarah completed step 2
    step3: 1, // Only John completed step 3 (Sarah is ongoing)
    step4: 0, // John is pending, not completed
  };

  // Calculate pre-schema completion percentage
  const totalPreSchemaSteps = levelCounts.preSchema * 4; // 4 steps per person
  const completedPreSchemaSteps = preSchemaSteps.step1 + preSchemaSteps.step2 + preSchemaSteps.step3 + preSchemaSteps.step4;
  const preSchemaCompletionPercentage = totalPreSchemaSteps > 0 ? Math.round((completedPreSchemaSteps / totalPreSchemaSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-[rgb(var(--color-border))] sticky top-0 z-50 shadow-[var(--shadow-xs)]">
        <div className="container mx-auto px-4 sm:px-[var(--space-6)]">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-[var(--space-4)]">
              <div className="flex items-center gap-[var(--space-3)]">
                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-text-primary))] flex items-center justify-center text-white font-serif font-bold text-sm shadow-[var(--shadow-base)]">
                  LP
                </div>
                <div>
                  <h1 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] leading-none mb-0.5">
                    Learning Pathway
                  </h1>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">Manager / Practice Lead Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[var(--space-4)]">
              <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="font-medium">Sarah Manager</span>
              </div>
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

      <div className="container mx-auto px-4 sm:px-[var(--space-6)] py-6 sm:py-[var(--space-12)] max-w-7xl">
        {/* Header */}
        <header className="mb-6 sm:mb-[var(--space-8)]">
          <h1 className="font-serif text-2xl sm:text-[length:var(--text-4xl)] font-bold text-[rgb(var(--color-text-primary))] mb-2 sm:mb-[var(--space-2)]">
            Manager / Practice Lead Dashboard
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))] text-base sm:text-[length:var(--text-lg)]">
            View and manage your team's learning pathways
          </p>
        </header>

        {/* Dashboard Stats */}
        <div className="mb-8 space-y-6">
          {/* Level Distribution */}
          <div className="bg-[rgb(var(--color-surface))] rounded-xl p-6 shadow-[var(--shadow-sm)]">
            <h3 className="font-serif text-xl font-bold text-[rgb(var(--color-text-primary))] mb-4">Team Level Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[rgb(var(--color-neutral-50))] rounded-lg p-4 border-2 border-[rgb(var(--color-border))]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium text-[rgb(var(--color-text-secondary))]">Pre-Schema</span>
                  <span className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">{levelCounts.preSchema}</span>
                </div>
                <div className="w-full h-2 bg-[rgb(var(--color-neutral-200))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[rgb(var(--color-neutral-500))] rounded-full"
                    style={{ width: `${(levelCounts.preSchema / FAKE_STAFF_LIST.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-[rgb(var(--color-primary-50))] rounded-lg p-4 border-2 border-[rgb(var(--color-primary-200))]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium text-[rgb(var(--color-text-secondary))]">Level 1</span>
                  <span className="text-2xl font-bold text-[rgb(var(--color-primary-700))]">{levelCounts.level1}</span>
                </div>
                <div className="w-full h-2 bg-[rgb(var(--color-primary-100))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[rgb(var(--color-primary-600))] rounded-full"
                    style={{ width: `${(levelCounts.level1 / FAKE_STAFF_LIST.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-[rgb(var(--color-accent-50))] rounded-lg p-4 border-2 border-[rgb(var(--color-accent-200))]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium text-[rgb(var(--color-text-secondary))]">Level 2</span>
                  <span className="text-2xl font-bold text-[rgb(var(--color-accent-700))]">{levelCounts.level2}</span>
                </div>
                <div className="w-full h-2 bg-[rgb(var(--color-accent-100))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[rgb(var(--color-accent-600))] rounded-full"
                    style={{ width: `${(levelCounts.level2 / FAKE_STAFF_LIST.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pathway Distribution - Bar Chart */}
            <div className="bg-[rgb(var(--color-surface))] rounded-xl p-6 shadow-[var(--shadow-sm)]">
              <h3 className="font-serif text-xl font-bold text-[rgb(var(--color-text-primary))] mb-6">Team by Functional Role</h3>
              <div className="space-y-4">
                {Object.entries(pathwayCounts).map(([pathway, count]) => (
                  <div key={pathway} className="flex items-center gap-4">
                    <div className="w-36 flex-shrink-0">
                      <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{pathway}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-10 bg-[rgb(var(--color-neutral-100))] rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[rgb(var(--color-primary-500))] to-[rgb(var(--color-primary-600))] flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${(count / Math.max(...Object.values(pathwayCounts))) * 100}%` }}
                        >
                          {count > 0 && (
                            <span className="text-sm font-bold text-white">{count}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-8 text-right">
                        <span className="text-base font-bold text-[rgb(var(--color-text-primary))]">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Schema Step Progress */}
            <div className="bg-[rgb(var(--color-surface))] rounded-xl p-6 shadow-[var(--shadow-sm)]">
              <h3 className="font-serif text-xl font-bold text-[rgb(var(--color-text-primary))] mb-4">Pre-Schema Progress</h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">{levelCounts.preSchema} staff members in Pre-Schema</p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Completed Step 1</span>
                    <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{preSchemaSteps.step1} / {levelCounts.preSchema}</span>
                  </div>
                  <div className="w-full h-2 bg-[rgb(var(--color-neutral-200))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgb(34,197,94)] rounded-full"
                      style={{ width: `${(preSchemaSteps.step1 / levelCounts.preSchema) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Completed Step 2</span>
                    <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{preSchemaSteps.step2} / {levelCounts.preSchema}</span>
                  </div>
                  <div className="w-full h-2 bg-[rgb(var(--color-neutral-200))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgb(34,197,94)] rounded-full"
                      style={{ width: `${(preSchemaSteps.step2 / levelCounts.preSchema) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Completed Step 3</span>
                    <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{preSchemaSteps.step3} / {levelCounts.preSchema}</span>
                  </div>
                  <div className="w-full h-2 bg-[rgb(var(--color-neutral-200))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgb(34,197,94)] rounded-full"
                      style={{ width: `${(preSchemaSteps.step3 / levelCounts.preSchema) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Completed Step 4</span>
                    <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{preSchemaSteps.step4} / {levelCounts.preSchema}</span>
                  </div>
                  <div className="w-full h-2 bg-[rgb(var(--color-neutral-200))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgb(34,197,94)] rounded-full"
                      style={{ width: `${(preSchemaSteps.step4 / levelCounts.preSchema) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              href={`/staff?userId=${staff.id}&managerId=manager-1&managerName=Sarah Manager&pathway=${encodeURIComponent(staff.pathway)}&level=${staff.currentLevel}&staffName=${encodeURIComponent(staff.name)}`}
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
                        {staff.currentLevel === 0
                          ? `Pre-Schema (${staff.preSchemaCompletion || 0}%)`
                          : `Level ${staff.currentLevel}`
                        }
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
