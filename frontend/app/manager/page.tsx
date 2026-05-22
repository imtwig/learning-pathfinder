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
    preSchemaCompletion: 75, // 3 out of 4 steps completed, currently at step 4
  },
  {
    id: 'staff-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    currentLevel: 0,
    pathway: 'UX Designer',
    preSchemaCompletion: 50, // 2 out of 4 steps completed, currently at step 3
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
  const [activeFilter, setActiveFilter] = useState<{ type: 'level' | 'step' | 'pathway' | null, value: any }>({ type: null, value: null });

  const handleFilterClick = (type: 'level' | 'step' | 'pathway', value: any) => {
    if (activeFilter.type === type && activeFilter.value === value) {
      // Unclick - clear filter
      setActiveFilter({ type: null, value: null });
    } else {
      // Set new filter
      setActiveFilter({ type, value });
    }
  };

  let filteredStaff = FAKE_STAFF_LIST.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply active filter
  if (activeFilter.type === 'level') {
    filteredStaff = filteredStaff.filter(s => s.currentLevel === activeFilter.value);
  } else if (activeFilter.type === 'step') {
    // Filter to pre-schema (level 0) and specific step
    const stepPercentages: { [key: string]: number } = {
      'step1': 0,
      'step2': 25,
      'step3': 50,
      'step4': 75,
    };
    filteredStaff = filteredStaff.filter(s =>
      s.currentLevel === 0 && (s.preSchemaCompletion || 0) === stepPercentages[activeFilter.value]
    );
  } else if (activeFilter.type === 'pathway') {
    filteredStaff = filteredStaff.filter(s => s.pathway === activeFilter.value);
  }

  // Calculate statistics
  const levelCounts = {
    preSchema: FAKE_STAFF_LIST.filter(s => s.currentLevel === 0).length,
    level1: FAKE_STAFF_LIST.filter(s => s.currentLevel === 1).length,
    level2: FAKE_STAFF_LIST.filter(s => s.currentLevel === 2).length,
    level3: FAKE_STAFF_LIST.filter(s => s.currentLevel === 3).length,
    level4: FAKE_STAFF_LIST.filter(s => s.currentLevel === 4).length,
    level5: FAKE_STAFF_LIST.filter(s => s.currentLevel === 5).length,
    level6: FAKE_STAFF_LIST.filter(s => s.currentLevel === 6).length,
    level7: FAKE_STAFF_LIST.filter(s => s.currentLevel === 7).length,
  };

  const pathwayCounts = {
    'UX Designer': FAKE_STAFF_LIST.filter(s => s.pathway === 'UX Designer').length,
    'Product Manager': FAKE_STAFF_LIST.filter(s => s.pathway === 'Product Manager').length,
    'Product Ops': FAKE_STAFF_LIST.filter(s => s.pathway === 'Product Ops').length,
    'Software Engineer': FAKE_STAFF_LIST.filter(s => s.pathway === 'Software Engineer').length,
  };

  // Calculate how many people are currently AT each step
  // Completion % determines which step they're working on:
  // 0% = 0 steps done, currently at step 1
  // 25% = 1 step done, currently at step 2
  // 50% = 2 steps done, currently at step 3
  // 75% = 3 steps done, currently at step 4
  const preSchemaStaff = FAKE_STAFF_LIST.filter(s => s.currentLevel === 0);
  const preSchemaSteps = {
    step1: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 0).length,
    step2: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 25).length,
    step3: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 50).length,
    step4: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 75).length,
  };

  // Get staff members at each step for the dots
  const staffAtStep = {
    step1: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 0),
    step2: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 25),
    step3: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 50),
    step4: preSchemaStaff.filter(s => (s.preSchemaCompletion || 0) === 75),
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
          {/* Level Distribution - Vertical Bar Chart */}
          <div className="bg-[rgb(var(--color-surface))] rounded-xl p-6 shadow-[var(--shadow-sm)]">
            <h3 className="font-serif text-xl font-bold text-[rgb(var(--color-text-primary))] mb-6">Team Level Distribution</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {[
                { label: 'Pre', level: 0, count: levelCounts.preSchema, color: 'rgb(156, 163, 175)' },
                { label: 'L1', level: 1, count: levelCounts.level1, color: 'rgb(99, 102, 241)' },
                { label: 'L2', level: 2, count: levelCounts.level2, color: 'rgb(139, 92, 246)' },
                { label: 'L3', level: 3, count: levelCounts.level3, color: 'rgb(236, 72, 153)' },
                { label: 'L4', level: 4, count: levelCounts.level4, color: 'rgb(245, 158, 11)' },
                { label: 'L5', level: 5, count: levelCounts.level5, color: 'rgb(99, 102, 241)' },
                { label: 'L6', level: 6, count: levelCounts.level6, color: 'rgb(139, 92, 246)' },
                { label: 'L7', level: 7, count: levelCounts.level7, color: 'rgb(236, 72, 153)' },
              ].map(({ label, level, count, color }) => {
                const maxCount = Math.max(...Object.values(levelCounts), 1);
                const height = (count / maxCount) * 100;
                const isActive = activeFilter.type === 'level' && activeFilter.value === level;
                return (
                  <div
                    key={label}
                    className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => handleFilterClick('level', level)}
                  >
                    <div className="w-full flex flex-col items-center justify-end" style={{ height: '160px' }}>
                      <span className="text-sm font-bold text-[rgb(var(--color-text-primary))] mb-1">{count}</span>
                      <div
                        className={`w-full rounded-t-lg ${isActive ? 'ring-4 ring-[rgb(var(--color-primary-500))] ring-opacity-50' : 'group-hover:ring-2 group-hover:ring-[rgb(var(--color-primary-400))] group-hover:ring-opacity-30'}`}
                        style={{
                          height: count > 0 ? `${Math.max(height, 12.5)}%` : '0%',
                          backgroundColor: color,
                          boxShadow: isActive ? '0 0 20px rgba(var(--color-primary-500), 0.4)' : undefined,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))] text-center whitespace-nowrap">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pre-Schema Step Progress */}
            <div className="bg-[rgb(var(--color-surface))] rounded-xl p-6 shadow-[var(--shadow-sm)]">
              <h3 className="font-serif text-xl font-bold text-[rgb(var(--color-text-primary))] mb-4">Pre-Schema Progress</h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-6">{levelCounts.preSchema} staff members in Pre-Schema</p>
              <div className="space-y-5">
                {[
                  { step: 'Step 1', stepKey: 'step1', count: preSchemaSteps.step1, staffList: staffAtStep.step1 },
                  { step: 'Step 2', stepKey: 'step2', count: preSchemaSteps.step2, staffList: staffAtStep.step2 },
                  { step: 'Step 3', stepKey: 'step3', count: preSchemaSteps.step3, staffList: staffAtStep.step3 },
                  { step: 'Step 4', stepKey: 'step4', count: preSchemaSteps.step4, staffList: staffAtStep.step4 },
                ].map(({ step, stepKey, count, staffList }) => {
                  const isActive = activeFilter.type === 'step' && activeFilter.value === stepKey;
                  return (
                    <div
                      key={step}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[rgb(var(--color-primary-50))] ring-2 ring-[rgb(var(--color-primary-400))] shadow-lg'
                          : 'bg-[rgb(var(--color-neutral-50))] hover:bg-[rgb(var(--color-neutral-100))] hover:ring-2 hover:ring-[rgb(var(--color-primary-200))]'
                      }`}
                      onClick={() => handleFilterClick('step', stepKey)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Currently at {step}</span>
                        <span className="text-base font-bold text-[rgb(var(--color-text-primary))]">{count}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {staffList.map((staff) => (
                          <Link
                            key={staff.id}
                            href={`/staff?userId=${staff.id}&managerId=manager-1&managerName=Sarah Manager&pathway=${encodeURIComponent(staff.pathway)}&level=${staff.currentLevel}&staffName=${encodeURIComponent(staff.name)}`}
                            className="group relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className="w-3 h-3 rounded-full bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] cursor-pointer transition-colors"
                              title={staff.name}
                            ></div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[rgb(var(--color-text-primary))] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {staff.name}
                            </div>
                          </Link>
                        ))}
                        {count === 0 && (
                          <span className="text-xs text-[rgb(var(--color-text-muted))]">No one at this step</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team by Functional Role - Pie Chart */}
            <div className="bg-[rgb(var(--color-surface))] rounded-xl p-6 shadow-[var(--shadow-sm)]">
              <h3 className="font-serif text-xl font-bold text-[rgb(var(--color-text-primary))] mb-6">Team by Functional Role</h3>
              <div className="flex justify-center">
                {/* Pie Chart SVG with Labels */}
                <svg viewBox="0 0 500 300" className="w-full max-w-lg">
                  {(() => {
                    const total = FAKE_STAFF_LIST.length;
                    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
                    const centerX = 250;
                    const centerY = 150;
                    const radius = 70;

                    // First, calculate all slice data in original order
                    let cumulativePercent = 0;
                    const sliceData = Object.entries(pathwayCounts).map(([pathway, count], index) => {
                      const percent = count / total;
                      const startAngle = cumulativePercent * 360;
                      const endAngle = startAngle + percent * 360;
                      const midAngle = (startAngle + endAngle) / 2;
                      cumulativePercent += percent;

                      // Pie slice
                      const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                      const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                      const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
                      const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
                      const largeArc = percent > 0.5 ? 1 : 0;

                      // Label line points
                      const innerX = centerX + radius * Math.cos((midAngle - 90) * Math.PI / 180);
                      const innerY = centerY + radius * Math.sin((midAngle - 90) * Math.PI / 180);
                      const midX = centerX + (radius + 20) * Math.cos((midAngle - 90) * Math.PI / 180);
                      const midY = centerY + (radius + 20) * Math.sin((midAngle - 90) * Math.PI / 180);
                      const outerX = midX + (midAngle > 180 && midAngle < 360 ? -50 : 50);
                      const outerY = midY;

                      const textAnchor = (midAngle > 180 && midAngle < 360) ? 'end' : 'start';
                      const textX = outerX + (textAnchor === 'end' ? -5 : 5);

                      const displayName = pathway
                        .replace('UX Designer', 'Designer')
                        .replace('Product Manager', 'Product Mgr')
                        .replace('Software Engineer', 'Software Eng.');

                      const isActive = activeFilter.type === 'pathway' && activeFilter.value === pathway;

                      return {
                        pathway,
                        count,
                        index,
                        isActive,
                        startX,
                        startY,
                        endX,
                        endY,
                        largeArc,
                        innerX,
                        innerY,
                        midX,
                        midY,
                        outerX,
                        outerY,
                        textX,
                        textAnchor,
                        displayName,
                      };
                    });

                    // Sort so active slice renders last (on top), but positions stay the same
                    const sortedSlices = [...sliceData].sort((a, b) => {
                      if (a.isActive) return 1;
                      if (b.isActive) return -1;
                      return 0;
                    });

                    return sortedSlices.map(({
                      pathway,
                      count,
                      index,
                      isActive,
                      startX,
                      startY,
                      endX,
                      endY,
                      largeArc,
                      innerX,
                      innerY,
                      midX,
                      midY,
                      outerX,
                      outerY,
                      textX,
                      textAnchor,
                      displayName,
                    }) => (
                      <g
                        key={pathway}
                        className="cursor-pointer"
                        onClick={() => handleFilterClick('pathway', pathway)}
                      >
                        {/* Pie slice */}
                        <path
                          d={`M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`}
                          fill={colors[index]}
                          stroke={isActive ? 'rgb(var(--color-primary-500))' : 'white'}
                          strokeWidth={isActive ? '4' : '2'}
                          className="hover:opacity-80 transition-opacity"
                          style={{
                            filter: isActive ? 'drop-shadow(0 0 8px rgba(var(--color-primary-500), 0.5))' : undefined
                          }}
                        />
                        {/* Label line */}
                        <polyline
                          points={`${innerX},${innerY} ${midX},${midY} ${outerX},${outerY}`}
                          fill="none"
                          stroke={colors[index]}
                          strokeWidth="2"
                        />
                        {/* Label text - two lines */}
                        <text
                          x={textX}
                          y={outerY - 6}
                          textAnchor={textAnchor}
                          dominantBaseline="middle"
                          className="text-xs font-semibold pointer-events-none"
                          fill="rgb(var(--color-text-primary))"
                        >
                          {displayName}
                        </text>
                        <text
                          x={textX}
                          y={outerY + 8}
                          textAnchor={textAnchor}
                          dominantBaseline="middle"
                          className="text-xs font-bold pointer-events-none"
                          fill="rgb(var(--color-text-primary))"
                        >
                          ({count})
                        </text>
                      </g>
                    ));
                  })()}
                </svg>
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
