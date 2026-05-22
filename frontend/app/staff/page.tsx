'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileInput } from '@/components/FileInput';
import { Spinner } from '@/components/Spinner';

// LEVELS will be populated from the API data
const DEFAULT_LEVELS = [
  { id: 0, name: 'Pre-Schema', label: '0', description: 'Complete prerequisite requirements with manager approval', color: 'rgb(var(--color-neutral-500))' },
  { id: 1, name: 'Designer (I)', label: '1', description: "As an L1 Designer (I), you are a supporting-level player honing your craft and working to understand GovTech's organisational context, design standards, and workflows.", color: 'rgb(var(--color-primary-600))' },
  { id: 2, name: 'Designer (II)', label: '2', description: "As an L2 Designer (II), you are a key contributing member of the design team, applying your skills to create user-centered solutions and working with autonomy.", color: 'rgb(var(--color-primary-600))' },
  { id: 3, name: 'Senior Designer', label: '3', description: "As an L3 Senior Designer, you are an experienced practitioner and emerging leader who elevates standards of design practice and collaboration. You solve problems creatively, going beyond best practices, and significantly influence your team's processes, its output, and its stakeholder relationships.", color: 'rgb(var(--color-primary-600))' },
  { id: 4, name: 'Lead Designer', label: '4', description: "As an L4 Lead Designer, you are an experienced leader of craft, expertise, and rigor, expertly solving complex problems, building strong partnerships, and owning cross-team, cross-program initiatives, all while multiplying impact through effective communication and mentorship.", color: 'rgb(var(--color-primary-600))' },
  { id: 5, name: 'Principal Designer', label: '5', description: "As a L5 Principal Designer, you are a leader in design strategy and execution — capable of navigating teams through complex large-scale, high-impact problems, and demonstrating domain leadership.", color: 'rgb(var(--color-primary-600))' },
  { id: 6, name: 'Distinguished Designer', label: '6', description: "As a L6 Distinguished Designer, you are a design leader not only in GovTech but in the Public Service. Your expertise and experience is tapped on in growing organisational design capabilities at scale.", color: 'rgb(var(--color-primary-600))' },
  { id: 7, name: 'LEVEL OUT OF RANGE', label: '7', description: 'Your level is so high nobody knows what you are even', color: 'rgb(var(--color-primary-600))' },
];

function StaffDashboardContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const managerId = searchParams.get('managerId') || null;
  const managerName = searchParams.get('managerName') || 'Manager';
  const isManagerView = !!managerId;
  const [user, setUser] = useState<any>(null);
  const [pathway, setPathway] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [completedSelf, setCompletedSelf] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0);
  const [levels, setLevels] = useState<any[]>(DEFAULT_LEVELS);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [levelCourses, setLevelCourses] = useState<{[key: string]: any[]}>({});
  const [selectedPathway, setSelectedPathway] = useState('UX Designer');
  const [preSchemaStatuses, setPreSchemaStatuses] = useState<{[key: string]: string}>({
    '1': 'Not Started',
    '2': 'Not Yet',
    '3': 'Not Yet',
    '4': 'Not Yet',
  });
  const [openStatusPopover, setOpenStatusPopover] = useState<string | null>(null);
  const [popoverDirection, setPopoverDirection] = useState<'down' | 'up'>('down');
  const [step3UploadedFile, setStep3UploadedFile] = useState<File | null>(null);
  const [step3SampleCertificate, setStep3SampleCertificate] = useState<boolean>(false);
  const [endorsements, setEndorsements] = useState<{[key: string]: string}>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const [demoState, setDemoState] = useState<string>('none');

  const handleStatusPopoverToggle = (stepId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (openStatusPopover === stepId) {
      setOpenStatusPopover(null);
      return;
    }

    // Check if there's enough space below
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popoverHeight = 280; // Approximate height of popover with 4 options

    if (spaceBelow < popoverHeight) {
      setPopoverDirection('up');
    } else {
      setPopoverDirection('down');
    }

    setOpenStatusPopover(stepId);
  };

  const getStatusOptionsForStep = (stepId: string) => {
    if (stepId === '2') {
      return [
        { value: 'Not yet', color: 'rgb(156, 163, 175)' }, // gray
        { value: 'Passed', color: 'rgb(34, 197, 94)' }, // green
        { value: 'Failed', color: 'rgb(239, 68, 68)' }, // red
      ];
    } else if (stepId === '4') {
      return [
        { value: 'Ongoing', color: 'rgb(249, 115, 22)' }, // orange
        { value: 'Completed', color: 'rgb(34, 197, 94)' }, // green
        { value: 'N/A', color: 'rgb(156, 163, 175)' }, // gray
      ];
    } else {
      return [
        { value: 'Registered', color: 'rgb(59, 130, 246)' }, // blue
        { value: 'Ongoing', color: 'rgb(249, 115, 22)' }, // orange
        { value: 'Completed', color: 'rgb(34, 197, 94)' }, // green
        { value: 'N/A', color: 'rgb(156, 163, 175)' }, // gray
      ];
    }
  };

  const statusOptions = [
    { value: 'Registered', color: 'rgb(59, 130, 246)' }, // blue
    { value: 'Ongoing', color: 'rgb(249, 115, 22)' }, // orange
    { value: 'Completed', color: 'rgb(34, 197, 94)' }, // green
    { value: 'N/A', color: 'rgb(156, 163, 175)' }, // gray
  ];

  const getStatusColor = (status: string | null, stepId?: string) => {
    if (!status) return 'rgb(156, 163, 175)';

    // Check all possible status options
    const allOptions = [
      ...statusOptions,
      { value: 'Not Started', color: 'rgb(156, 163, 175)' },
      { value: 'Not Yet', color: 'rgb(156, 163, 175)' },
      { value: 'Not yet', color: 'rgb(156, 163, 175)' },
      { value: 'Pending Assessment', color: 'rgb(249, 115, 22)' }, // orange
      { value: 'Passed', color: 'rgb(34, 197, 94)' },
      { value: 'Failed', color: 'rgb(239, 68, 68)' },
      { value: 'Pending Emplacement for Apprenticeship', color: 'rgb(249, 115, 22)' }, // orange
      { value: 'Placed on Apprenticeship', color: 'rgb(59, 130, 246)' }, // blue
      { value: 'Completed', color: 'rgb(34, 197, 94)' }, // green
    ];

    return allOptions.find(s => s.value === status)?.color || 'rgb(156, 163, 175)';
  };

  const handleRegisterClick = () => {
    setPreSchemaStatuses(prev => ({ ...prev, '1': 'Registered' }));
    setDemoState('registered');
  };

  const handleTakeAssessmentClick = () => {
    setPreSchemaStatuses(prev => ({ ...prev, '2': 'Pending Assessment' }));
    setToastMessage('Your Practice will reach out to you to schedule the assessment shortly!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleDemoStateChange = (state: string) => {
    setDemoState(state);

    switch(state) {
      case 'none':
        setPreSchemaStatuses({
          '1': 'Not Started',
          '2': 'Not Yet',
          '3': 'Not Yet',
          '4': 'Not Yet',
        });
        setStep3SampleCertificate(false);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'registered':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Registered',
        }));
        setStep3SampleCertificate(false);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'ongoing':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Ongoing',
        }));
        setStep3SampleCertificate(false);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'completed4':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Completed',
          '2': 'Not Yet',
          '3': 'Not Yet',
          '4': 'Not Yet',
        }));
        setStep3SampleCertificate(false);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'passed':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Completed',
          '2': 'Passed',
          '3': 'Ongoing',
          '4': 'Not Yet',
        }));
        setStep3SampleCertificate(false);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'certCompleted':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Completed',
          '2': 'Passed',
          '3': 'Completed',
          '4': 'Pending Emplacement for Apprenticeship',
        }));
        setStep3SampleCertificate(true);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'emplaced':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Completed',
          '2': 'Passed',
          '3': 'Completed',
          '4': 'Placed on Apprenticeship',
        }));
        setStep3SampleCertificate(true);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
      case 'apprenticeshipCompleted':
        setPreSchemaStatuses(prev => ({
          ...prev,
          '1': 'Completed',
          '2': 'Passed',
          '3': 'Completed',
          '4': 'Completed',
        }));
        setStep3SampleCertificate(true);
        setCurrentLevel(0);
        setExpandedLevel(0);
        break;
    }
  };

  const pathwayOptions = [
    { value: 'UX Designer', label: 'UX Designer Pathway' },
    { value: 'Product Manager', label: 'Product Manager Pathway' },
    { value: 'Product Ops', label: 'Product Ops Pathway' },
    { value: 'Software Engineer', label: 'Software Engineer Pathway' },
  ];

  useEffect(() => {
    loadData();

    // Failsafe timeout - show mock data after 3 seconds regardless
    const failsafeTimeout = setTimeout(() => {
      if (loading) {
        console.log('Failsafe timeout triggered, loading mock data');
        loadMockData();
      }
    }, 3000);

    return () => clearTimeout(failsafeTimeout);
  }, [userId]);

  const loadMockData = () => {
    setUser({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      role: 'STAFF'
    });
    setPathway({
      pathway: {
        name: 'UX Design Pathway',
        description: 'Professional development pathway for UX designers'
      },
      schemaLevel: {
        name: 'Pre-Schema'
      }
    });
    setSteps([
      {
        id: '1',
        title: 'Complete Professional Development Agreement',
        description: 'Review and sign your professional development agreement with your manager',
        requiresProof: true,
        progress: { status: 'NOT_STARTED' }
      },
      {
        id: '2',
        title: 'Attend Orientation Workshop',
        description: 'Complete the mandatory orientation workshop for new pathway participants',
        requiresProof: true,
        progress: { status: 'IN_PROGRESS' }
      },
      {
        id: '3',
        title: 'Set Up Development Portfolio',
        description: 'Create your online portfolio to track and showcase your professional development work',
        requiresProof: true,
        progress: { status: 'NOT_STARTED' }
      }
    ]);
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const [userData, pathwayData, stepsData] = await Promise.all([
        apiClient('/users/me', userId),
        apiClient('/pathways/my-pathway', userId),
        apiClient('/pre-schema/steps', userId),
      ]);
      setUser(userData.data);
      setPathway(pathwayData.data);
      setSteps(stepsData.data);

      // Transform schema levels from API into the format needed for the UI
      if (pathwayData.data?.pathway?.schemaLevels) {
        const transformedLevels = pathwayData.data.pathway.schemaLevels.map((level: any, index: number) => {
          // Use DEFAULT_LEVELS for name and description to ensure correct content
          const defaultLevel = DEFAULT_LEVELS.find(dl => dl.id === level.levelOrder);
          return {
            id: level.levelOrder,
            name: defaultLevel?.name || level.name,
            label: level.levelOrder.toString(),
            description: defaultLevel?.description || level.description,
            color: level.levelOrder === 0 ? 'rgb(var(--color-neutral-500))' : 'rgb(var(--color-primary-600))',
            fullData: level, // Store the full level data for additional info
          };
        });
        setLevels(transformedLevels);

        // Fetch competencies for the pathway
        if (pathwayData.data?.pathway?.competencies) {
          console.log('Loaded competencies:', pathwayData.data.pathway.competencies.length);
          setCompetencies(pathwayData.data.pathway.competencies);
        }

        // Fetch courses for each level
        const coursesPromises = pathwayData.data.pathway.schemaLevels.map((level: any) =>
          apiClient(`/pathways/levels/${level.id}/courses`, userId)
            .then(response => {
              console.log(`Loaded courses for ${level.id}:`, response.data.length);
              return { levelId: level.id, courses: response.data };
            })
            .catch((err) => {
              console.log(`Failed to load courses for ${level.id}:`, err);
              return { levelId: level.id, courses: [] };
            })
        );

        Promise.all(coursesPromises).then(results => {
          const coursesMap: {[key: string]: any[]} = {};
          results.forEach(result => {
            coursesMap[result.levelId] = result.courses;
          });
          console.log('Final courses map:', coursesMap);
          setLevelCourses(coursesMap);
        });
      }

      // Set expanded level to current level by default
      setExpandedLevel(currentLevel);
    } catch (error) {
      console.log('API error, loading mock data:', error);
      loadMockData();
    }
  };

  const handleStart = async (stepId: string) => {
    try {
      await apiClient(`/pre-schema/steps/${stepId}/start`, userId, {
        method: 'POST',
      });
      await loadData();
    } catch (error) {
      // Error handled silently - shows empty state
    }
  };

  const handleSubmit = async (stepId: string) => {
    setSubmitting(stepId);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('proof', selectedFile);
      }
      formData.append('notes', notes);
      formData.append('completedSelf', completedSelf.toString());

      await apiClient(`/pre-schema/steps/${stepId}/submit`, userId, {
        method: 'POST',
        body: formData,
      });

      setSelectedFile(null);
      setNotes('');
      setCompletedSelf(false);
      setSubmitSuccess(stepId);
      setTimeout(() => setSubmitSuccess(null), 5000);
      await loadData();
    } catch (error) {
      setSubmitError(stepId);
      setTimeout(() => setSubmitError(null), 5000);
    } finally {
      setSubmitting(null);
    }
  };

  // Helper function to get competencies for a specific level based on naming convention
  const getCompetenciesForLevel = (expandedLevelValue: number) => {
    // expandedLevel 0 = Pre-Schema (no competencies)
    // expandedLevel 1 = Level 1 (comp-l1-)
    // expandedLevel 2 = Level 2 (comp-l2-)
    // expandedLevel 3 = Level 3 (comp-l3-)
    // expandedLevel 4 = Level 4 (comp-l4-)
    // expandedLevel 5 = Level 5 (comp-l5-)
    // expandedLevel 6 = Level 6 (comp-l6-)
    // expandedLevel 7 = No content

    if (expandedLevelValue < 1 || expandedLevelValue > 6) return []; // Only levels 1-6 have competencies

    const levelPrefix = `comp-l${expandedLevelValue}-`;
    return competencies.filter(comp => comp.id.startsWith(levelPrefix));
  };

  // Helper function to get courses for a specific level
  const getCoursesForLevel = (levelId: string) => {
    return levelCourses[levelId] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="flex flex-col items-center gap-[var(--space-4)]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[rgb(var(--color-primary-200))] border-t-[rgb(var(--color-primary-600))]"></div>
          <p className="text-[rgb(var(--color-text-secondary))] text-base font-medium">Loading your pathway...</p>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'outline';
      case 'IN_PROGRESS': return 'default';
      case 'SUBMITTED': return 'secondary';
      case 'APPROVED': return 'default';
      case 'REJECTED': return 'destructive';
      default: return 'outline';
    }
  };

  const formatStatus = (status: string) => status.replace('_', ' ');

  const approvedCount = steps.filter(s => s.progress?.status === 'APPROVED').length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (approvedCount / totalSteps) * 100 : 0;

  // Calculate UX Designer pre-schema progress
  const getUxDesignerProgress = () => {
    let completed = 0;
    if (preSchemaStatuses['1'] === 'Completed') completed++;
    if (preSchemaStatuses['2'] === 'Passed') completed++;
    if (preSchemaStatuses['3'] === 'Completed') completed++;
    if (preSchemaStatuses['4'] === 'Completed') completed++;
    return completed;
  };

  const uxDesignerApprovedCount = getUxDesignerProgress();
  const uxDesignerProgressPercentage = (uxDesignerApprovedCount / 4) * 100;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">

      {/* Navigation */}
      <nav className="bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] shadow-[var(--shadow-sm)] sticky top-0 z-[var(--z-sticky)] backdrop-blur-sm bg-[rgb(var(--color-surface))]/95">
        <div className="container mx-auto px-[var(--space-6)] py-[var(--space-5)]">
          <div className="flex justify-between items-center">
            {isManagerView ? (
              <>
                {/* Manager Navigation */}
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
                  <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="font-medium">{managerName}</span>
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
              </>
            ) : (
              <>
                {/* Staff Navigation */}
                <div className="flex items-center gap-[var(--space-4)]">
                  <div className="flex items-center gap-[var(--space-3)]">
                    <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-text-primary))] flex items-center justify-center text-white font-serif font-bold text-sm shadow-[var(--shadow-base)]">
                      LP
                    </div>
                    <div>
                      <h1 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] leading-none mb-0.5">
                        Learning Pathway
                      </h1>
                      <p className="text-xs text-[rgb(var(--color-text-muted))]">Staff Dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[var(--space-4)]">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">{user?.email}</p>
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-[var(--space-6)] py-[var(--space-12)] max-w-7xl">

        {/* Breadcrumb for Manager View */}
        {isManagerView && (
          <div className="mb-6">
            <Link href="/manager">
              <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary-600))] transition-colors cursor-pointer w-fit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </div>
            </Link>
          </div>
        )}

        {/* Manager View Banner */}
        {isManagerView && (
          <div className="mb-6 bg-[rgb(var(--color-secondary-50))] border-2 border-[rgb(var(--color-secondary-200))] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgb(var(--color-secondary-600))] text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[rgb(var(--color-text-primary))]">Manager View</p>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">You are viewing and can endorse this staff member's pathway progress</p>
            </div>
          </div>
        )}

        {/* Career Progression Header */}
        <header className="mb-[var(--space-12)] animate-fadeInUp">
          <div className="bg-[rgb(var(--color-surface))] rounded-2xl p-[var(--space-8)] shadow-[var(--shadow-lg)]">
            <div className="mb-[var(--space-6)] flex items-center justify-between">
              <div className="flex-1">
                <h2 className="font-serif text-[length:var(--text-4xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
                  Career Progression Pathway
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))] text-[length:var(--text-lg)]">
                  Your journey from Pre-Schema through Level 7 in {selectedPathway}
                </p>
              </div>

              {/* Pathway Selector Dropdown - Hidden in manager view */}
              {!isManagerView && (
                <div className="ml-[var(--space-4)] relative">
                  <select
                    value={selectedPathway}
                    onChange={(e) => setSelectedPathway(e.target.value)}
                    className="
                      pl-4 pr-10 py-2.5
                      bg-white
                      border-2 border-[rgb(var(--color-border))]
                      rounded-xl
                      text-sm font-semibold
                      text-[rgb(var(--color-text-primary))]
                      hover:border-[rgb(var(--color-primary-400))]
                      hover:shadow-md
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[rgb(var(--color-primary-400))]
                      focus:border-[rgb(var(--color-primary-400))]
                      transition-all
                      cursor-pointer
                      appearance-none
                      shadow-sm
                      min-w-[240px]
                    "
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  >
                    {pathwayOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Level Progress Indicator */}
            <div className="py-4 px-2">
              <div className="flex items-start justify-between">
                {levels.map((level, index) => (
                  <div key={level.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setExpandedLevel(level.id)}
                        className="group mb-2"
                      >
                        <div
                          className={`
                            w-12 h-12 rounded-full inline-flex items-center justify-center font-serif font-bold text-lg
                            transition-all duration-300 shadow-[var(--shadow-md)]
                            ${level.id === currentLevel
                              ? 'bg-[rgb(var(--color-primary-600))] text-white scale-110 ring-4 ring-[rgb(var(--color-primary-200))]'
                              : level.id < currentLevel
                              ? 'bg-[rgb(var(--color-secondary-600))] text-white'
                              : 'bg-[rgb(var(--color-neutral-200))] text-[rgb(var(--color-text-muted))]'
                            }
                            ${expandedLevel === level.id ? 'ring-2 ring-[rgb(var(--color-primary-400))]' : ''}
                            group-hover:scale-105
                          `}
                          style={{ lineHeight: '1' }}
                        >
                          {level.id === 0 ? '0' : level.label}
                        </div>
                      </button>
                      <button
                        onClick={() => setExpandedLevel(level.id)}
                        className="text-xs font-medium text-center whitespace-nowrap"
                      >
                        <p className={`
                          ${level.id === currentLevel ? 'text-[rgb(var(--color-primary-600))]' : 'text-[rgb(var(--color-text-muted))]'}
                        `}>
                          {level.id === 0 ? 'Pre-Schema' : `Level ${level.label}`}
                        </p>
                      </button>
                    </div>
                    {/* Connecting Line */}
                    {index < levels.length - 1 && (
                      <div className="flex items-center flex-1 px-3 -mt-8">
                        <div className={`
                          h-0.5 w-full transition-colors duration-300
                          ${level.id < currentLevel ? 'bg-[rgb(var(--color-secondary-600))]' : 'bg-[rgb(var(--color-neutral-300))]'}
                        `}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Level Content */}
        <section className="overflow-visible relative">
          {expandedLevel !== null && (
            <>
              {/* Left Navigation Button */}
              {expandedLevel > 0 && (
                <button
                  onClick={() => setExpandedLevel(expandedLevel - 1)}
                  className="
                    absolute left-[-80px] top-1/2 -translate-y-1/2
                    w-16 h-16
                    bg-white
                    border-2 border-[rgb(var(--color-border))]
                    rounded-full
                    shadow-[var(--shadow-md)]
                    hover:shadow-[var(--shadow-lg)]
                    hover:border-[rgb(var(--color-primary-400))]
                    hover:bg-[rgb(var(--color-primary-50))]
                    transition-all
                    flex items-center justify-center
                    text-[rgb(var(--color-text-primary))]
                    hover:text-[rgb(var(--color-primary-600))]
                    z-10
                  "
                  aria-label="Previous level"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              {/* Right Navigation Button */}
              {expandedLevel < levels.length - 1 && (
                <button
                  onClick={() => setExpandedLevel(expandedLevel + 1)}
                  className="
                    absolute right-[-80px] top-1/2 -translate-y-1/2
                    w-16 h-16
                    bg-white
                    border-2 border-[rgb(var(--color-border))]
                    rounded-full
                    shadow-[var(--shadow-md)]
                    hover:shadow-[var(--shadow-lg)]
                    hover:border-[rgb(var(--color-primary-400))]
                    hover:bg-[rgb(var(--color-primary-50))]
                    transition-all
                    flex items-center justify-center
                    text-[rgb(var(--color-text-primary))]
                    hover:text-[rgb(var(--color-primary-600))]
                    z-10
                  "
                  aria-label="Next level"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}

            <Card className="shadow-[var(--shadow-lg)] bg-[rgb(var(--color-surface))] overflow-visible">
              <CardHeader className="border-b border-[rgb(var(--color-border))] py-[var(--space-4)]">
                <div className="flex items-start gap-[var(--space-3)]">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-[var(--shadow-sm)] shrink-0
                    ${levels[expandedLevel]?.id === currentLevel ? 'bg-[rgb(var(--color-primary-600))] text-white' : 'bg-[rgb(var(--color-neutral-100))] text-[rgb(var(--color-text-primary))]'}
                  `}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-[var(--space-2)] mb-1">
                      <CardTitle className="font-serif text-[length:var(--text-2xl)] text-[rgb(var(--color-text-primary))] leading-tight">
                        {levels[expandedLevel]?.id === 0 ? levels[expandedLevel]?.name : `${levels[expandedLevel]?.name}`}
                      </CardTitle>
                      {levels[expandedLevel]?.id === currentLevel && (
                        <Badge className="bg-[rgb(var(--color-primary-600))] text-white uppercase tracking-[var(--tracking-wide)] text-xs font-semibold px-2.5 py-1 leading-none">
                          Current Level
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-[rgb(var(--color-text-secondary))] text-sm">
                      {levels[expandedLevel]?.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-[var(--space-6)] overflow-visible">
                  {expandedLevel === 0 ? (
                    // Pre-Schema Steps
                    <div className="space-y-[var(--space-6)] overflow-visible">
                      <div className="mb-[var(--space-6)]">
                        <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
                          Pre-Schema Requirements
                        </h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                          Complete these {selectedPathway === 'UX Designer' ? '4' : totalSteps} foundational steps with manager approval before progressing to Level 1
                        </p>
                        <div className="mt-[var(--space-4)] flex items-center gap-[var(--space-3)]">
                          <div className="flex-1 h-2 bg-[rgb(var(--color-neutral-200))] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[rgb(34,197,94)] transition-all duration-500 rounded-full"
                              style={{ width: `${selectedPathway === 'UX Designer' ? uxDesignerProgressPercentage : progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] min-w-[60px] text-right">
                            {selectedPathway === 'UX Designer' ? uxDesignerApprovedCount : approvedCount} / {selectedPathway === 'UX Designer' ? '4' : totalSteps}
                          </span>
                        </div>
                      </div>

                      {selectedPathway === 'UX Designer' ? (
                        // UX Designer Pre-Schema Steps
                        <>
                          {[
                            { id: '1', title: 'Complete Google UX Design Certification up to Course 4', description: 'Finish the first 4 courses of the Google UX Design Professional Certificate on Coursera.' },
                            { id: '2', title: 'Pass assessment by the Design Practice', description: 'Successfully complete the design assessment conducted by the Design Practice team.' },
                            { id: '3', title: 'Complete all of Google UX Design Certification', description: 'Finish all remaining courses in the Google UX Design Professional Certificate program.' },
                            { id: '4', title: 'Be placed on Apprenticeship', description: 'Receive formal placement into the apprenticeship program with manager approval.' },
                          ].map((step, index) => (
                            <Card key={step.id} className="shadow-[var(--shadow-sm)] bg-[rgb(var(--color-surface))] overflow-visible">
                              <CardHeader className="pb-[var(--space-4)]">
                                <div className="flex justify-between items-start gap-[var(--space-4)]">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-2)]">
                                      <span className="text-sm font-semibold text-[rgb(var(--color-text-muted))]">Step {index + 1}</span>
                                    </div>
                                    <CardTitle className="font-serif text-[length:var(--text-xl)] mb-[var(--space-2)] text-[rgb(var(--color-text-primary))]">
                                      {step.title}
                                    </CardTitle>
                                    <CardDescription className="text-[rgb(var(--color-text-secondary))]">
                                      {step.description}
                                    </CardDescription>
                                  </div>

                                  {/* Action Buttons - Top Right */}
                                  {!isManagerView && step.id === '1' && preSchemaStatuses['1'] === 'Not Started' && (
                                    <Button
                                      onClick={handleRegisterClick}
                                      className="
                                        bg-[rgb(var(--color-primary-600))]
                                        hover:bg-[rgb(var(--color-primary-700))]
                                        text-white
                                        shadow-sm
                                        shrink-0
                                      "
                                    >
                                      Register for Course
                                    </Button>
                                  )}

                                  {!isManagerView && step.id === '2' && (
                                    <Button
                                      onClick={handleTakeAssessmentClick}
                                      disabled={preSchemaStatuses['1'] !== 'Completed'}
                                      className="
                                        bg-[rgb(var(--color-primary-600))]
                                        hover:bg-[rgb(var(--color-primary-700))]
                                        text-white
                                        shadow-sm
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                        shrink-0
                                      "
                                    >
                                      Take assessment
                                    </Button>
                                  )}


                                  {isManagerView && (
                                    <Button
                                      onClick={() => {
                                        if (endorsements[step.id]) {
                                          // Unendorse - remove the endorsement
                                          const newEndorsements = {...endorsements};
                                          delete newEndorsements[step.id];
                                          setEndorsements(newEndorsements);
                                        } else {
                                          // Endorse
                                          setEndorsements({...endorsements, [step.id]: managerName});
                                        }
                                      }}
                                      className={`
                                        text-white
                                        shadow-sm
                                        shrink-0
                                        transition-colors
                                        ${endorsements[step.id]
                                          ? 'bg-[rgb(var(--color-neutral-400))] hover:bg-[rgb(var(--color-neutral-500))]'
                                          : 'bg-[rgb(var(--color-secondary-600))] hover:bg-[rgb(var(--color-secondary-700))]'
                                        }
                                      `}
                                    >
                                      {endorsements[step.id] ? 'Unendorse' : 'Endorse'}
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="overflow-visible">
                                {/* Sample Certificate for Step 3 */}
                                {step.id === '3' && step3SampleCertificate && (
                                  <div className="mb-4">
                                    <div className="border-2 border-[rgb(var(--color-border))] rounded-lg p-4 bg-[rgb(var(--color-neutral-50))]">
                                      <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-[rgb(var(--color-primary-100))] rounded-lg flex items-center justify-center shrink-0">
                                          <svg className="w-6 h-6 text-[rgb(var(--color-primary-600))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-[rgb(var(--color-text-primary))] mb-1">Google UX Design Certificate</p>
                                          <p className="text-sm text-[rgb(var(--color-text-secondary))]">Sample_Certificate_Completion.pdf</p>
                                          <p className="text-xs text-[rgb(var(--color-primary-600))] mt-2">✓ Certificate verified</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 flex-wrap">

                                  {/* Status Display */}
                                  <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[rgb(var(--color-border))] rounded-lg text-sm font-medium">
                                    <div
                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: getStatusColor(preSchemaStatuses[step.id], step.id) }}
                                    ></div>
                                    <span className="text-[rgb(var(--color-text-primary))]">{preSchemaStatuses[step.id]}</span>
                                  </div>

                                  {/* Endorsement Text */}
                                  {endorsements[step.id] && (
                                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-secondary-700))] bg-[rgb(var(--color-secondary-50))] px-3 py-1.5 rounded-lg">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span className="font-medium">Endorsed by {endorsements[step.id]}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </>
                      ) : (
                        steps.map((step, index) => (
                        <Card key={step.id} className="shadow-[var(--shadow-sm)] bg-[rgb(var(--color-surface))]">
                          <CardHeader className="pb-[var(--space-4)]">
                            <div className="flex justify-between items-start gap-[var(--space-4)]">
                              <div className="flex-1">
                                <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-2)]">
                                  <span className="text-sm font-semibold text-[rgb(var(--color-text-muted))]">Step {index + 1}</span>
                                  {step.progress && (
                                    <Badge
                                      variant={getStatusVariant(step.progress.status)}
                                      className={`
                                        uppercase tracking-[var(--tracking-wide)] text-xs font-semibold px-3 py-1
                                        ${step.progress.status === 'APPROVED' ? 'bg-[rgb(var(--color-secondary-600))] text-white' : ''}
                                        ${step.progress.status === 'SUBMITTED' ? 'bg-[rgb(var(--color-neutral-200))] text-[rgb(var(--color-text-primary))]' : ''}
                                        ${step.progress.status === 'IN_PROGRESS' ? 'bg-[rgb(var(--color-neutral-200))] text-[rgb(var(--color-text-primary))]' : ''}
                                      `}
                                    >
                                      {formatStatus(step.progress.status)}
                                    </Badge>
                                  )}
                                </div>
                                <CardTitle className="font-serif text-[length:var(--text-xl)] mb-[var(--space-2)] text-[rgb(var(--color-text-primary))]">
                                  {step.title}
                                </CardTitle>
                                <CardDescription className="text-[rgb(var(--color-text-secondary))]">
                                  {step.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent>
                            {!step.progress || step.progress.status === 'NOT_STARTED' ? (
                              <Button
                                onClick={() => handleStart(step.id)}
                                className="bg-[rgb(var(--color-primary-600))] hover:bg-[rgb(var(--color-primary-700))] text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
                              >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                </svg>
                                Begin This Step
                              </Button>
                            ) : step.progress.status === 'IN_PROGRESS' || step.progress.status === 'REJECTED' ? (
                              <div className="space-y-[var(--space-5)] pt-[var(--space-5)] border-t border-[rgb(var(--color-border))]">
                                <FileInput
                                  label="Upload Proof of Completion"
                                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                  helperText={step.requiresProof ? "Required — attach evidence of completion" : "Optional — attach supporting documentation"}
                                />
                                <div className="flex items-center gap-[var(--space-3)]">
                                  <input
                                    type="checkbox"
                                    id={`completed-self-${step.id}`}
                                    checked={completedSelf}
                                    onChange={(e) => setCompletedSelf(e.target.checked)}
                                    className="w-4 h-4 rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary-600))] focus:ring-2 focus:ring-[rgb(var(--color-primary-600))] focus:ring-offset-2"
                                  />
                                  <label htmlFor={`completed-self-${step.id}`} className="text-sm text-[rgb(var(--color-text-primary))] cursor-pointer">
                                    I completed this step myself
                                  </label>
                                </div>
                                <Button
                                  onClick={() => handleSubmit(step.id)}
                                  disabled={submitting === step.id}
                                  className="bg-[rgb(var(--color-secondary-600))] hover:bg-[rgb(var(--color-secondary-700))] text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
                                >
                                  {submitting === step.id ? (
                                    <>
                                      <Spinner size="sm" variant="white" />
                                      <span className="ml-2">Submitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Submit for Review
                                    </>
                                  )}
                                </Button>
                                {step.progress.status === 'REJECTED' && step.progress.notes && (
                                  <Card className="bg-[rgb(var(--color-danger-50))] border-2 border-[rgb(var(--color-danger-300))]">
                                    <CardContent className="pt-[var(--space-4)]">
                                      <div className="flex items-start gap-[var(--space-3)]">
                                        <div className="w-8 h-8 rounded-xl bg-[rgb(var(--color-danger-600))] text-white flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
                                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-bold text-[rgb(var(--color-danger-800))] mb-1.5">Manager Feedback</p>
                                          <p className="text-sm text-[rgb(var(--color-danger-700))] leading-[var(--leading-relaxed)]">{step.progress.notes}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                                {submitSuccess === step.id && (
                                  <Card className="bg-[rgb(var(--color-success-50))] border-2 border-[rgb(var(--color-success-600))]">
                                    <CardContent className="pt-[var(--space-4)]">
                                      <div className="flex items-center gap-[var(--space-3)]">
                                        <div className="w-8 h-8 rounded-xl bg-[rgb(var(--color-success-600))] text-white flex items-center justify-center shadow-[var(--shadow-sm)]">
                                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <p className="text-sm font-bold text-[rgb(var(--color-success-800))]">Submitted successfully for manager review</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                                {submitError === step.id && (
                                  <Card className="bg-[rgb(var(--color-danger-50))] border-2 border-[rgb(var(--color-danger-600))]">
                                    <CardContent className="pt-[var(--space-4)]">
                                      <div className="flex items-center gap-[var(--space-3)]">
                                        <div className="w-8 h-8 rounded-xl bg-[rgb(var(--color-danger-600))] text-white flex items-center justify-center shadow-[var(--shadow-sm)]">
                                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <p className="text-sm font-bold text-[rgb(var(--color-danger-800))]">Submission failed. Please try again.</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            ) : step.progress.status === 'SUBMITTED' ? (
                              <div className="flex items-center gap-[var(--space-3)] p-[var(--space-4)] bg-[oklch(0.98_0.008_260/1)] rounded-lg">
                                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-primary-600))] text-white flex items-center justify-center shadow-[var(--shadow-sm)]">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">Awaiting Manager Review</p>
                                  <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">Your submission is being reviewed</p>
                                </div>
                              </div>
                            ) : step.progress.status === 'APPROVED' ? (
                              <div className="flex items-center gap-[var(--space-3)] p-[var(--space-4)] bg-[rgb(var(--color-success-50))] rounded-lg">
                                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-secondary-600))] text-white flex items-center justify-center shadow-[var(--shadow-sm)]">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-[rgb(var(--color-success-800))]">Approved</p>
                                  <p className="text-xs text-[rgb(var(--color-success-700))] mt-0.5">Completed successfully</p>
                                </div>
                              </div>
                            ) : null}
                          </CardContent>
                        </Card>
                      )))}
                    </div>
                  ) : selectedPathway === 'UX Designer' && expandedLevel === 1 ? (
                    // Level 1 Designer (I)
                    <div className="space-y-[var(--space-6)]">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Scope & Direction</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-3)]">
                          Working on well-defined tasks within established processes and guidelines, you receive direction and oversight from senior designers or a manager, ensuring your work is aligned with project requirements and GovTech's standards.
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Impact At Level</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                          You reliably contribute to the team's productivity by completing assigned tasks on time, with attention to detail, learning and adhering to GovTech's standards. You actively seek and integrate feedback for your work, setting the foundation for your growth as a designer.
                        </p>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        <div className="space-y-[var(--space-4)]">
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Craft & Execution</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Builds foundational skills, delivers well-scoped work, learns and applies</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Uses basic research, evidence, and testing to understand user needs and assess design effectiveness.</li>
                              <li>Understands service context and constraints; asks useful questions when problem boundaries are unclear.</li>
                              <li>Produces well-scoped work with guidance; improves quality through feedback, iteration, standards, and accessibility.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Ownership</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Work with manager guidance, take ownership of well-defined tasks, seek and apply feedback for growth.</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Proactively seek clarity on assigned tasks</li>
                              <li>Complete tasks accurately and on time</li>
                              <li>Actively seek feedback and listen to others' ideas, incorporate learnings for growth</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Strategic Alignment</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Learn and align with team direction</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Seek to understand the purpose behind their work and how it fits into the team's objectives.</li>
                              <li>Adapt to changes in project scope and priorities with guidance</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Culture and Organisational Influence</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Adopt org values, engage with others</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Take initiative to learn new skills</li>
                              <li>Focus on solutions when problems arise</li>
                              <li>Proactively offer help to colleagues</li>
                              <li>Participate in information-sharing activities within your team or with peers</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <a
                            href="https://www.thedigitalacademy.tech.gov.sg/course/detail/tda-digital-user-experience-design"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                          >
                            <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                              TDA Digital User Experience Design
                            </span>
                          </a>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/design-thinking-hands-on-course"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Design Thinking Hands-on Course
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/service-design-overview-course"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Service Design Overview Course
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPathway === 'UX Designer' && expandedLevel === 2 ? (
                    // Level 2: Developing content
                    <div className="space-y-[var(--space-6)]">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Scope & Direction</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-3)]">
                          You confidently take on broader responsibilities, leading key projects and making independent decisions that align with user needs and product goals. Your strong communication and collaboration skills enable you to mentor junior designers and work effectively with stakeholders.
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Impact At Level</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                          You consistently deliver high-quality work while seeking ways to improve and innovate within the team. At this stage, you're competent and successfully shipping good products and features.
                        </p>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        <div className="space-y-[var(--space-4)]">
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Craft & Execution</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Applies best practices to problem-solving and solutions development</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Independently moves from defined problem to validated solution using evidence, iteration, and testing.</li>
                              <li>Produces accessible, coherent designs within product, service, and operational constraints; uses AI tools with critical judgment.</li>
                              <li>Makes sound trade-offs in moderately complex situations and explains decisions using evidence.</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Ownership</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Own problem outcomes, help peers</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Independently own assigned tasks and projects</li>
                              <li>Identify and address issues proactively with minimal guidance, and know when to engage appropriate help</li>
                              <li>Identify opportunities and recommend next steps to improve processes or outcomes in own work</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Strategic Alignment</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Align own work with team strategy</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Align tasks with team goals and priorities</li>
                              <li>Focus on tasks that provide most expected business value</li>
                              <li>Adapt to changing priorities independently</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Culture and Organizational Influence</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Contribute to team culture</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Collaborate with peers and stakeholders to ensure tasks are executed effectively</li>
                              <li>Address minor conflicts constructively and respectfully</li>
                              <li>Suggest improvements that enhance team effectiveness</li>
                              <li>Share knowledge, resources, as well as successes and failures openly to ensure team success</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <a
                            href="https://www.thedigitalacademy.tech.gov.sg/course/detail/service---design"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                          >
                            <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                              Service Design
                            </span>
                          </a>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/ux-design-and-delivery"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                UX Design and Delivery
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/coaching-clinic-for-digital-user-experience-design"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Coaching Clinic for Digital User Experience Design
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPathway === 'UX Designer' && expandedLevel === 3 ? (
                    // Level 3 Senior Designer
                    <div className="space-y-[var(--space-6)]">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Scope & Direction</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-3)]">
                          You are comfortable with complexity and ambiguity; and can lead multiple projects confidently. Your experience allows you to work independently while guiding others to grow. You take full ownership of product strategy and designs and have a growing influence on the planning and objectives of larger programs.
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Impact At Level</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                          Your leadership strengthens the team by sharing knowledge, improving workflows, and driving design excellence. Your expertise shapes key projects and your team's design culture. You consistently deliver outstanding work that creates measurable value and impact.
                        </p>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        <div className="space-y-[var(--space-4)]">
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Craft & Execution</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Shapes problems, leads complex work, delivers advanced quality</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Shapes problems as well as solutions, using user-centered methods to influence direction and identify the right questions.</li>
                              <li>Delivers high-quality work across complex journeys, balancing user needs, service quality, accessibility, constraints, and feasibility.</li>
                              <li>Raises team design quality through critique, mentoring, experimentation, and strong judgment under ambiguity.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Ownership</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Lead end-to-end delivery, mentor others</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Take full ownership of broad, ambiguously-scoped projects, ensuring successful outcomes.</li>
                              <li>Take calculated risks, learning from both successes and failures</li>
                              <li>Mentor and support junior team members through sharing knowledge, breaking down problems, and providing constructive feedback - actively raising team productivity</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Strategic Alignment</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Contribute to team strategy and planning</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Translate team goals into actionable plans including breaking down and prioritising tasks, and contribute to project strategy</li>
                              <li>Proactively identify opportunities and drive workstreams, synthesize data into clear recommendations, and connect analyses to organisational impact</li>
                              <li>Identify and mitigate risks at the project level, anticipating potential challenges</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Culture and Organisational Influence</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Influence and reinforce team culture</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Coordinate cross-functional collaboration and guide team members to ensure projects are delivered effectively</li>
                              <li>Navigate and help resolve disagreements constructively, facilitating alignment among team members and stakeholders</li>
                              <li>Constructively challenge existing processes for continuous improvement and drive change initiatives at the team/division level</li>
                              <li>Actively share successes and failures and provide recommendations to enhance team performance and learning</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">People Management</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Transitional People Management</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>This is a transitional people management stage. You continue to contribute technically while learning the basics of people management. With manager's close guidance, you:</li>
                              <li>Support team coordination by communicating simple project goals and priorities to team members and how individual tasks connect to broader objectives</li>
                              <li>Conduct check-ins with 1/2 direct or indirect team members, focusing on immediate work progress and basic feedback delivery</li>
                              <li>Help team members with day-to-day blockers and provide technical mentoring</li>
                              <li>Participate in recruitment activities where applicable</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <a
                            href="https://www.thedigitalacademy.tech.gov.sg/course/detail/coaching-clinic-for-service-design"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                          >
                            <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                              Coaching Clinic for Service Design
                            </span>
                          </a>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/tda-managing-business-analytics-projects"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                TDA Managing Business Analytics Projects
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/product-thinking-for-organisation"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Product Thinking for Organisation
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPathway === 'UX Designer' && expandedLevel === 4 ? (
                    // Level 4 Lead Designer
                    <div className="space-y-[var(--space-6)]">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Scope & Direction</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-3)]">
                          You take charge of significant product initiatives that require coordination across multiple teams and domains. Your exemplary craft and collaborative approach inspire others, helping teams achieve ambitious goals. Your influence shapes not just your immediate team, but extends across the organization.
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Impact At Level</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                          You're an active force in driving innovation, identifying opportunities, and delivering on strategic initiatives. Your work shapes product direction and contributes significantly to the GovTech's broader vision and success.
                        </p>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        <div className="space-y-[var(--space-4)]">
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Craft & Execution</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Solves higher-order problems, establishes quality standards across teams</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Tackles ambiguous, higher-order problems requiring new framing, systems thinking, and cross-functional alignment.</li>
                              <li>Establishes quality standards across teams, covering discovery, accessibility, experimentation, service coherence, and evidence-based decisions.</li>
                              <li>Delivers consistently excellent design work while establishing and upholding quality standards across multiple teams or product areas. Builds repeatable quality through reviews, methods, patterns, coaching, and disciplined AI use.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Ownership</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Support division's strategic agenda, drive key projects, work through others</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Independently identify key projects that support divisional strategic objectives and take proactive steps to drive them forward</li>
                              <li>Actively invest in the growth of peers and junior team members through mentorship, sponsorship, and knowledge sharing.</li>
                              <li>Mentor L3 and below officers beyond your immediate team, measurably improving the capability of colleagues across levels.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Strategic Alignment</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Execute initiatives to further department's strategy</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Provide direction on initiatives with a strong ability to measure outcomes and adjust strategies when needed</li>
                              <li>Develop roadmaps for complex initiatives, breaking down workstreams and coordinating with team members and partners across teams to deliver.</li>
                              <li>Identify and manage risk for their team</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Culture and Organisational Influence</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Build cross-team collaboration</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Lead cross-functional collaboration across multiple teams and/or within department to ensure projects are executed in alignment with department goals.</li>
                              <li>Resolve complex stakeholder conflicts and facilitate solutioning across multiple teams and/or within department to achieve strategic outcomes</li>
                              <li>Champion and role model continuous improvement, anticipating future needs and challenges for your area and the wider function, and actively building capability in your areas of expertise.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">People Management</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Team Leadership</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Align team goals with departmental objectives</li>
                              <li>Contribute to hiring standards and expectations, improving hiring and interview processes</li>
                              <li>Conduct regular 1:1s with direct/indirect reports to align and coach performance, reinforcing and improving team's performance standards aligned to schema</li>
                              <li>Provide opportunities to stretch and grow direct/indirect reports to the next level by delegating/empowering teams for better outcomes and identify reports with management potential</li>
                              <li>Create a productive environment by providing resources, removing barriers, setting up the right team structure, norms, and motivating teams to perform at their best</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <a
                            href="https://www.thedigitalacademy.tech.gov.sg/course/detail/coaching-clinic-for-digital-user-experience-design"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                          >
                            <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                              Coaching Clinic for Digital User Experience Design
                            </span>
                          </a>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/strategic-product-market--fit"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Strategic Product Market Fit
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/business-analysis-for--agile--practitioners"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Business Analysis for Agile Practitioners
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPathway === 'UX Designer' && expandedLevel === 5 ? (
                    // Level 5 Principal Designer
                    <div className="space-y-[var(--space-6)]">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Scope & Direction</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-3)]">
                          You shape and communicate a clear design vision, collaborate with leaders from other departments, and mentor senior designers and emerging design leaders. You provide thought leadership and strategic direction to your program and teams in your care. You operate with a high degree of autonomy and are responsible for the overall design direction and impact of the organization.
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Impact At Level</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                          You ensure the long-term success of your teams by mentoring and developing future design leaders. You drive significant improvements in user experience across your programme and domain, and exert substantial influence on programme's overall direction, shaping product strategy and culture — driving GovTech's strategic goals.
                        </p>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        <div className="space-y-[var(--space-4)]">
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Craft & Execution</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Leads quality at organizational scale, demonstrates domain leadership</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Defines standards and practices that strengthen design quality at organizational scale; develops emerging design leaders.</li>
                              <li>Directs problem-solving for entire domains or strategic projects; ensures evidence-based, user-centric approach throughout.</li>
                              <li>Shapes design vision and strategy across programs; establishes relationships with agency leadership to drive transformational outcomes.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Ownership</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Own department strategy and outcomes, drive key projects across teams, grow leaders</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Take accountability for the success of the department, contributing to the definition of outcomes and goals and driving their achievement.</li>
                              <li>Identify and remove systemic inefficiencies and barriers, advocating for the resources, tools and processes teams need to work effectively.</li>
                              <li>Drive accountability and ownership across multiple teams, taking decisive action to navigate challenges and seize opportunities.</li>
                              <li>Cultivate a high-performing team, focusing on long-term growth and talent development.</li>
                              <li>Mentor future leaders within the organization</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Strategic Alignment</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Influence department strategy</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Take initiative to lead workstreams and guide colleagues towards achieving these outcomes. Translate divisional goals into a theory of success and OKRs, working with teams to align effort.</li>
                              <li>Develop long-term roadmaps and executes within and across teams to deliver</li>
                              <li>Anticipate and manage systemic risks and changes across teams</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Culture and Organisational Influence</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Shape department culture</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Build and maintain stategic cross-functional and/or departmental partnerships to effectively navigate matrix relationships and competing priorities</li>
                              <li>Lead through influence, facilitates strategic discussions, build alignment</li>
                              <li>Drive a culture of continuous improvement and innovation across multiple teams, champion open communication and collaboration, by ensuring that diverse perspectives are heard and implementing structural changes that enable teams to operate more effectively</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">People Management</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Departmental Leadership</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Align departmental goals with organizational objectives, setting high standards while empowering teams and coaching people managers and leaders to maintain the bar.</li>
                              <li>Lead recruitment efforts, ensuring top talent is brought in and continuously developed, set hiring standards and expectations, improve hiring and interview processes.</li>
                              <li>Conduct regular 1:1s with direct/indirect reports to align and coach performance, setting the standards for leaders and people managers to align across the department</li>
                              <li>Create a productive environment on wider scope eg. gather feedback from across department on team health, provide the resources and infrastructure for optimal productivity, while motivating teams to stay engaged and perform consistently.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <a
                            href="https://www.thedigitalacademy.tech.gov.sg/course/detail/graduate-certificate-in-designing-and-managing-products-and-platforms---practice-module"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                          >
                            <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                              Graduate Certificate in Designing and Managing Products and Platforms - Practice Module
                            </span>
                          </a>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-product-strategy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Digital Product Strategy
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/data-wrangling-analysis-and-visualisation"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Data Wrangling Analysis and Visualisation
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPathway === 'UX Designer' && expandedLevel === 6 ? (
                    // Level 6 Distinguished Designer
                    <div className="space-y-[var(--space-6)]">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Scope & Direction</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-3)]">
                          You lead transformational initiatives and projects of strategic or national significance. You serve as a thought leader and advisor on design strategy and innovation to senior leaders in GovTech and agency partners. Your work is evaluated based on its long-term impact on the organization, the industry, and society as a whole.
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-[var(--space-2)]">
                          <strong>Impact Made At Level</strong>
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                          You shape the future of design in Government by developing emerging design leaders and setting design standards across GovTech and the Public Service. Your influence reaches senior leadership and across programmes — driving design excellence and user-centricity across every level of GovTech and beyond.
                        </p>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        <div className="space-y-[var(--space-4)]">
                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Craft & Execution</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Shapes design standards and experience strategy in GovTech and/or public service</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Sets direction for design quality across GovTech and/or public service, including discovery, accessibility, service quality, experimentation, and AI. Builds institutional conditions for quality at scale through standards, leadership, and cross-government influence.</li>
                              <li>Leads framing of systemic service problems and strategic direction spanning agencies, policies, operations, and citizen experience.</li>
                              <li>Delivers outcomes that fundamentally improve public service at national scale. Champions innovative approaches to systemic challenges.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Ownership</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Set vision for division, forward org agenda, develop leadership pipeline.</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Set and take full ownership and accountability of the long term division's vision, strategy, outcomes and performance, aligned to the organisational overall vision and strategy</li>
                              <li>Proactively identify opportunities to forward organisational agenda, aligned with org goals and strategy</li>
                              <li>Develop a leadership pipeline and champion a culture of growth and empowerment</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Strategic Alignment</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Influence org strategy, represent division strategy</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Communicate the overaching organisational strategy and vision, set clear theory of success and OKRs, aligning all teams under your division</li>
                              <li>Foresee and manage large-scale, org-wide risks and uncertainties.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">Culture and Organisational Influence</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Shape and steward the overall organizational culture</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Lead by example in navigating complex relationships with peers, senior leadership, and external stakeholders across functions/departments/divisions to effectively manage matrix relationships and resolve competing organisational priorities</li>
                              <li>Foster a culture of open communication and collaboration across the organisation</li>
                              <li>Drive divisional transformation by championing innovative practices and implementing fundamental and systemic/structural changes that align with organisational priorities</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">People Management</h5>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] italic mb-[var(--space-2)]">Divisional Leadership</p>
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] space-y-1 list-disc pl-5">
                              <li>Set and communicate strategic goals aligned with organisational priorities throughout division, empowering teams to take ownership and achieve ambitious outcomes</li>
                              <li>Lead talent strategy, driving recruitment, development, and retention of top performers for division</li>
                              <li>Conduct regular 1:1s to align and coach performance, setting the standards for leaders and people managers to align across the division while improving the schema</li>
                              <li>Identify and grow effective leaders within the division, delegate and empower teams for better outcomes while contributing to managerial and leadership growth throughout the organisation.</li>
                              <li>Gather feedback on org health of division from all levels and ensure the department has the resources, tools, processes and environment necessary for high performance, while inspiring teams to maintain strong motivation and engagement.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[rgb(var(--color-border))] pt-[var(--space-4)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <a
                            href="https://www.thedigitalacademy.tech.gov.sg/course/detail/graduate-certificate-in-designing-and-managing-products-and-platforms---practice-module"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                          >
                            <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                              Graduate Certificate in Designing and Managing Products and Platforms - Practice Module
                            </span>
                          </a>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/strategic-product-market--fit"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Strategic Product Market Fit
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/business-process--reengineering"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Business Process Reengineering
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : expandedLevel === 7 ? (
                    // Level 7: No content
                    <div className="text-center py-[var(--space-12)]">
                      <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-primary-100))] flex items-center justify-center mx-auto mb-[var(--space-4)]">
                        <svg className="w-8 h-8 text-[rgb(var(--color-primary-600))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <h4 className="font-serif text-[length:var(--text-2xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
                        Master Level
                      </h4>
                      <p className="text-[length:var(--text-lg)] text-[rgb(var(--color-text-secondary))] mx-auto whitespace-nowrap">
                        There's no one who knows what to teach you anymore!
                      </p>
                    </div>
                  ) : expandedLevel >= 1 && expandedLevel <= 6 ? (
                    // Other pathways - no data yet
                    <div className="text-center py-[var(--space-12)]">
                      <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-neutral-100))] flex items-center justify-center mx-auto mb-[var(--space-4)]">
                        <svg className="w-8 h-8 text-[rgb(var(--color-text-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <h4 className="font-serif text-[length:var(--text-2xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
                        Content Coming Soon
                      </h4>
                      <p className="text-[rgb(var(--color-text-secondary))] max-w-md mx-auto">
                        {selectedPathway} pathway content is not available yet. Please check back later or switch to the UX Designer pathway.
                      </p>
                    </div>
                  ) : (
                    // Apprenticeship or any other level
                    <div className="text-center py-[var(--space-12)]">
                      <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-primary-100))] flex items-center justify-center mx-auto mb-[var(--space-4)]">
                        <svg className="w-8 h-8 text-[rgb(var(--color-primary-600))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <h4 className="font-serif text-[length:var(--text-2xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
                        Master Level
                      </h4>
                      <p className="text-[length:var(--text-lg)] text-[rgb(var(--color-text-secondary))] mx-auto whitespace-nowrap">
                        There's no one who knows what to teach you anymore!
                      </p>
                    </div>
                  )}
                </CardContent>
            </Card>
            </>
          )}
        </section>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-[var(--z-tooltip)] animate-fadeInUp">
          <div className="bg-white border-2 border-[rgb(var(--color-primary-300))] rounded-xl shadow-[var(--shadow-xl)] p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[rgb(var(--color-primary-100))] rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[rgb(var(--color-primary-600))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[rgb(var(--color-text-primary))] mb-1">Assessment Request Sent</p>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-primary))]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Drawer */}
      {!isManagerView && (
        <>
          {/* Demo Tab */}
          <button
            onClick={() => setDemoDrawerOpen(!demoDrawerOpen)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-[rgb(var(--color-accent-600))] text-white px-3 py-6 rounded-l-lg shadow-[var(--shadow-lg)] z-[var(--z-fixed)] font-semibold text-sm hover:bg-[rgb(var(--color-accent-700))] transition-colors"
            style={{ writingMode: 'vertical-rl' }}
          >
            DEMO
          </button>

          {/* Demo Drawer Panel */}
          <div
            className={`fixed right-0 top-0 h-full w-80 bg-white border-l-2 border-[rgb(var(--color-border))] shadow-[var(--shadow-xl)] z-[var(--z-modal)] transition-transform duration-300 flex flex-col ${
              demoDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6 border-b border-[rgb(var(--color-border))] shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[length:var(--text-2xl)] font-bold text-[rgb(var(--color-text-primary))]">Demo Controls</h3>
                <button
                  onClick={() => setDemoDrawerOpen(false)}
                  className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-primary))]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
                  Simulate different stages of the pathway progression:
                </p>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="none"
                    checked={demoState === 'none'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">Default State</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">All steps at "Not Started"/"Not Yet"</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="registered"
                    checked={demoState === 'registered'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User has registered Google UX Design Certification</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Step 1 status: Registered</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="ongoing"
                    checked={demoState === 'ongoing'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User is undergoing Google UX Design Certification</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Step 1 status: Ongoing</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="completed4"
                    checked={demoState === 'completed4'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User has completed 4 courses in Google UX Design Certification</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Step 1 status: Completed</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="passed"
                    checked={demoState === 'passed'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User has passed the assessment by their practice</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Step 2 status: Passed, Step 3 status: Ongoing</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="certCompleted"
                    checked={demoState === 'certCompleted'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User has completed Google UX Design Certification</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Step 3 status: Completed, Step 4: Pending Emplacement for Apprenticeship</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="emplaced"
                    checked={demoState === 'emplaced'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User has been emplaced</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Step 4 status: Placed on Apprenticeship</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary-300))] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="demoState"
                    value="apprenticeshipCompleted"
                    checked={demoState === 'apprenticeshipCompleted'}
                    onChange={(e) => handleDemoStateChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm mb-1">User completed apprenticeship</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Moves to Level 1 - Designer (I)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Drawer Backdrop */}
          {demoDrawerOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-[var(--z-modal-backdrop)]"
              onClick={() => setDemoDrawerOpen(false)}
            ></div>
          )}
        </>
      )}
    </div>
  );
}

export default function StaffDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="flex flex-col items-center gap-[var(--space-4)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[rgb(var(--color-primary-200))] border-t-[rgb(var(--color-primary-600))]"></div>
          <p className="text-[rgb(var(--color-text-secondary))] text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    }>
      <StaffDashboardContent />
    </Suspense>
  );
}
