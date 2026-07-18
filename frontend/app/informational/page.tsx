'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
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
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// LEVELS will be populated from the API data
const UX_DESIGNER_LEVELS = [
  { id: 0, name: 'Pre-Schema Designer', label: '0', description: 'Complete prerequisite requirements with manager approval', color: 'rgb(var(--color-neutral-500))' },
  { id: 1, name: 'Designer (I)', label: '1', description: "As an L1 Designer (I), you are a supporting-level player honing your craft and working to understand GovTech's organisational context, design standards, and workflows.", color: 'rgb(var(--color-primary-600))' },
  { id: 2, name: 'Designer (II)', label: '2', description: "As an L2 Designer (II), you are a key contributing member of the design team, applying your skills to create user-centered solutions and working with autonomy.", color: 'rgb(var(--color-primary-600))' },
  { id: 3, name: 'Senior Designer', label: '3', description: "As an L3 Senior Designer, you are an experienced practitioner and emerging leader who elevates standards of design practice and collaboration. You solve problems creatively, going beyond best practices, and significantly influence your team's processes, its output, and its stakeholder relationships.", color: 'rgb(var(--color-primary-600))' },
  { id: 4, name: 'Lead Designer', label: '4', description: "As an L4 Lead Designer, you are an experienced leader of craft, expertise, and rigor, expertly solving complex problems, building strong partnerships, and owning cross-team, cross-program initiatives, all while multiplying impact through effective communication and mentorship.", color: 'rgb(var(--color-primary-600))' },
  { id: 5, name: 'Principal Designer', label: '5', description: "As a L5 Principal Designer, you are a leader in design strategy and execution — capable of navigating teams through complex large-scale, high-impact problems, and demonstrating domain leadership.", color: 'rgb(var(--color-primary-600))' },
  { id: 6, name: 'Distinguished Designer', label: '6', description: "As a L6 Distinguished Designer, you are a design leader not only in GovTech but in the Public Service. Your expertise and experience is tapped on in growing organisational design capabilities at scale.", color: 'rgb(var(--color-primary-600))' },
  { id: 7, name: 'LEVEL OUT OF RANGE', label: '7', description: 'Your level is so high nobody knows what you are even', color: 'rgb(var(--color-primary-600))' },
];

const PRODUCT_MANAGER_LEVELS = [
  { id: 0, name: 'Pre-Schema Product Manager', label: '0', description: 'Complete prerequisite requirements with manager approval', color: 'rgb(var(--color-neutral-500))' },
  { id: 1, name: 'Product Manager (I)', label: '1', description: "As an L1 Product Manager (I), you are an entry-level position designed for individuals new (0-2 years of experience) to product management.", color: 'rgb(var(--color-primary-600))' },
  { id: 2, name: 'Product Manager (II)', label: '2', description: "As an L2 Product Manager (II), you are responsible for owning a product or feature area and driving its success from conception to launch.", color: 'rgb(var(--color-primary-600))' },
  { id: 3, name: 'Senior Product Manager', label: '3', description: "As an L3 Senior Product Manager, you are expected to lead more complex products or initiatives, demonstrating a high degree of ownership and strategic thinking.", color: 'rgb(var(--color-primary-600))' },
  { id: 4, name: 'Lead Product Manager', label: '4', description: "As an L4 Lead Product Manager, you are a senior leadership position that focuses on overseeing a product or a group of related products, ensuring successful execution and alignment with strategic goals. LPMs act as the primary owner of a product line, driving product vision, roadmapping, and prioritization while leading junior PMs.", color: 'rgb(var(--color-primary-600))' },
  { id: 5, name: 'Principal Product Manager', label: '5', description: "As a L5 Principal Product Manager, you are a highly experienced product leader who drives strategic initiatives across multiple product areas or on a programme level. You operate at a higher strategic level, focusing on long-term product planning, business impact, and market positioning.", color: 'rgb(var(--color-primary-600))' },
  { id: 6, name: 'Director, Product Management', label: '6', description: "As a L6 Director, Product Management, you take on high-level leadership roles, overseeing entire product areas or departments within GovTech.", color: 'rgb(var(--color-primary-600))' },
  { id: 7, name: 'LEVEL OUT OF RANGE', label: '7', description: 'Your level is so high nobody knows what you are even', color: 'rgb(var(--color-primary-600))' },
];

const PRODUCT_OPS_LEVELS = [
  { id: 0, name: 'Pre-Schema Product Ops Specialist', label: '0', description: 'Complete prerequisite requirements with manager approval', color: 'rgb(var(--color-neutral-500))' },
  { id: 1, name: 'Product Ops Specialist (I)', label: '1', description: "As an L1 Product Ops Specialist (I), you are an entry-level position designed for individuals new to product operations.", color: 'rgb(var(--color-primary-600))' },
  { id: 2, name: 'Product Ops Specialist (II)', label: '2', description: "As an L2 Product Ops Specialist (II), you are responsible for managing operational aspects of products or feature areas and driving their success from implementation to ongoing support.", color: 'rgb(var(--color-primary-600))' },
  { id: 3, name: 'Senior Product Ops Specialist', label: '3', description: "As an L3 Senior Product Ops Specialist, you are an expert operator able to achieve success in complex and ambiguous spaces.", color: 'rgb(var(--color-primary-600))' },
  { id: 4, name: 'Assistant Director, Product Ops', label: '4', description: "As an L4 Assistant Director, Product Ops, you are a competent people manager who raises the standard of their team while maintaining strong operational expertise.", color: 'rgb(var(--color-primary-600))' },
  { id: 5, name: 'Deputy Director, Product Ops', label: '5', description: "As a L5 Deputy Director, Product Ops, you are a senior leader who defines the vision and strategy for product operations across a cluster of agencies.", color: 'rgb(var(--color-primary-600))' },
  { id: 6, name: 'Director, Product Ops', label: '6', description: "As a L6 Director, Product Ops, you lead product operations across government.", color: 'rgb(var(--color-primary-600))' },
  { id: 7, name: 'LEVEL OUT OF RANGE', label: '7', description: 'Your level is so high nobody knows what you are even', color: 'rgb(var(--color-primary-600))' },
];

const SOFTWARE_ENGINEER_LEVELS = [
  { id: 0, name: 'Pre-Schema Software Engineer', label: '0', description: 'Complete prerequisite requirements with manager approval', color: 'rgb(var(--color-neutral-500))' },
  { id: 1, name: 'Software Engineer (I)', label: '1', description: "As an L1 Software Engineer (I), your primary focus is on building foundational software development skills.", color: 'rgb(var(--color-primary-600))' },
  { id: 2, name: 'Software Engineer (II)', label: '2', description: "As an L2 Software Engineer (II), your scope includes contributing to multiple components or features within your team, with growing independence in driving development.", color: 'rgb(var(--color-primary-600))' },
  { id: 3, name: 'Senior Software Engineer', label: '3', description: "As an L3 Senior Software Engineer, you are a trusted technical contributor who consistently delivers high-quality, maintainable, and impactful features and components within your team.", color: 'rgb(var(--color-primary-600))' },
  { id: 4, name: 'Staff Software Engineer', label: '4', description: "As an L4 Staff Software Engineer, you are a senior technical leader whose impact extends across multiple teams, or a single team with a larger or more complex domain. Your ownership and influence are not limited to a single small team—you are expected to drive technical quality, scalability, and maintainability for systems and initiatives that span teams, or for a team responsible for a significant product area or domain.", color: 'rgb(var(--color-primary-600))' },
  { id: 5, name: 'Principal Software Engineer', label: '5', description: "As an L5 Principal Software Engineer, you are a highly trusted technical leader who defines and drives the engineering strategy across multiple teams or product areas.", color: 'rgb(var(--color-primary-600))' },
  { id: 6, name: 'Distinguished Software Engineer', label: '6', description: "As an L6 Distinguished Engineer, you steward long-term technical vision across the organisation and contribute to WOG-scale engineering challenges.", color: 'rgb(var(--color-primary-600))' },
  { id: 7, name: 'LEVEL OUT OF RANGE', label: '7', description: 'Your level is so high nobody knows what you are even', color: 'rgb(var(--color-primary-600))' },
];

function StaffDashboardContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const managerId = searchParams.get('managerId') || null;
  const managerName = searchParams.get('managerName') || 'Manager';
  const urlPathway = searchParams.get('pathway') || 'UX Designer';
  const urlLevel = searchParams.get('level') ? parseInt(searchParams.get('level')!) : 0;
  const staffName = searchParams.get('staffName') || '';
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
  const [currentLevel, setCurrentLevel] = useState(urlLevel);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(urlLevel);
  const [levels, setLevels] = useState<any[]>(
    urlPathway === 'Product Manager' ? PRODUCT_MANAGER_LEVELS :
    urlPathway === 'Product Ops' ? PRODUCT_OPS_LEVELS :
    urlPathway === 'Software Engineer' ? SOFTWARE_ENGINEER_LEVELS :
    UX_DESIGNER_LEVELS
  );
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [levelCourses, setLevelCourses] = useState<{[key: string]: any[]}>({});
  const [selectedPathway, setSelectedPathway] = useState(urlPathway);
  const [showFullPathway, setShowFullPathway] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  // Initialize pre-schema statuses based on userId
  const getInitialPreSchemaStatuses = () => {
    if (userId === 'staff-0') {
      // Demo User: all steps at "Not Yet"
      return {
        '1': 'Not Yet',
        '2': 'Not Yet',
        '3': 'Not Yet',
        '4': 'Not Yet',
      };
    } else if (userId === 'staff-1') {
      // John Tan: completed step 3, pending emplacement on step 4
      return {
        '1': 'Completed',
        '2': 'Passed',
        '3': 'Completed',
        '4': 'Pending Emplacement for Apprenticeship',
      };
    } else if (userId === 'staff-2') {
      // Sarah Chen: completed step 2, ongoing step 3
      return {
        '1': 'Completed',
        '2': 'Passed',
        '3': 'Ongoing',
        '4': 'Not Yet',
      };
    } else {
      // All other demo users start with "Not Yet"
      return {
        '1': 'Not Yet',
        '2': 'Not Yet',
        '3': 'Not Yet',
        '4': 'Not Yet',
      };
    }
  };

  const [preSchemaStatuses, setPreSchemaStatuses] = useState<{[key: string]: string}>(getInitialPreSchemaStatuses());
  const [openStatusPopover, setOpenStatusPopover] = useState<string | null>(null);
  const [popoverDirection, setPopoverDirection] = useState<'down' | 'up'>('down');
  const [step3UploadedFile, setStep3UploadedFile] = useState<File | null>(null);
  const [step3SampleCertificate, setStep3SampleCertificate] = useState<boolean>(
    userId === 'staff-1' || userId === 'staff-2' // John and Sarah have certificates
  );

  // Reset pre-schema statuses when userId changes
  useEffect(() => {
    setPreSchemaStatuses(getInitialPreSchemaStatuses());
    setStep3SampleCertificate(userId === 'staff-1' || userId === 'staff-2'); // Only John and Sarah have certificates
    setStep3UploadedFile(null);
  }, [userId]);
  const [endorsements, setEndorsements] = useState<{[key: string]: string}>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const [demoState, setDemoState] = useState<string>('none');
  const [pathwaySearchOpen, setPathwaySearchOpen] = useState(false);
  const [pathwaySearchQuery, setPathwaySearchQuery] = useState('');
  const [pathwayPickerMobile, setPathwayPickerMobile] = useState(false);
  const pathwayButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{top: number, left: number, width: number}>({ top: 0, left: 0, width: 0 });

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
      { value: 'Not Yet', color: 'rgb(156, 163, 175)' },
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
    setToastMessage('You have been successfully registered for the Google UX Design Certification course!');
    setShowToast(true);
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
          '1': 'Not Yet',
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
        setCurrentLevel(1);
        setExpandedLevel(0);
        break;
    }
  };

  const pathwayOptions = [
    { value: 'UX Designer', label: 'Designer Pathway' },
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

  // Update levels when pathway changes
  useEffect(() => {
    if (selectedPathway === 'UX Designer') {
      setLevels(UX_DESIGNER_LEVELS);
    } else if (selectedPathway === 'Product Manager') {
      setLevels(PRODUCT_MANAGER_LEVELS);
    } else if (selectedPathway === 'Product Ops') {
      setLevels(PRODUCT_OPS_LEVELS);
    } else if (selectedPathway === 'Software Engineer') {
      setLevels(SOFTWARE_ENGINEER_LEVELS);
    }
  }, [selectedPathway]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const updatePathwayPickerMode = () => setPathwayPickerMobile(mediaQuery.matches);

    updatePathwayPickerMode();
    mediaQuery.addEventListener('change', updatePathwayPickerMode);

    return () => mediaQuery.removeEventListener('change', updatePathwayPickerMode);
  }, []);

  // Close pathway dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (pathwaySearchOpen && !target.closest('.pathway-dropdown') && !target.closest('.pathway-dropdown-menu')) {
        setPathwaySearchOpen(false);
        setPathwaySearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pathwaySearchOpen]);

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
          // Use appropriate levels array based on pathway
          let levelsArray = UX_DESIGNER_LEVELS;
          if (selectedPathway === 'Product Manager') {
            levelsArray = PRODUCT_MANAGER_LEVELS;
          } else if (selectedPathway === 'Product Ops') {
            levelsArray = PRODUCT_OPS_LEVELS;
          } else if (selectedPathway === 'Software Engineer') {
            levelsArray = SOFTWARE_ENGINEER_LEVELS;
          }
          const defaultLevel = levelsArray.find(dl => dl.id === level.levelOrder);
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
        <div className="container mx-auto px-4 sm:px-[var(--space-6)] py-3 sm:py-[var(--space-5)]">
          <div className="flex justify-between items-center">
            {isManagerView ? (
              <>
                {/* Manager Navigation */}
                <div className="flex items-center gap-[var(--space-4)]">
                  <div className="flex items-center gap-[var(--space-3)]">
                    <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-text-primary))] flex items-center justify-center text-white font-serif font-bold text-sm shadow-[var(--shadow-base)]">
                      LP
                    </div>
                    <div className="hidden sm:block">
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
                    <Button variant="outline" size="sm" className="bg-white text-[rgb(var(--color-text-primary))] border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-neutral-100))]">
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
                    <Button variant="outline" size="sm" className="bg-white text-[rgb(var(--color-text-primary))] border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-neutral-100))]">
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
      <div className="container mx-auto px-4 sm:px-[var(--space-6)] py-6 sm:py-[var(--space-12)] max-w-7xl">

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
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">You are viewing this staff member's pathway progress</p>
            </div>
          </div>
        )}

        {/* Career Progression Header */}
        <header className="mb-6 sm:mb-[var(--space-12)] animate-fadeInUp">
          <div className="bg-[rgb(var(--color-surface))] border-2 border-[rgb(var(--color-border))] rounded-xl sm:rounded-2xl p-4 sm:p-[var(--space-8)] shadow-[var(--shadow-lg)] overflow-visible">
            <div className="mb-4 sm:mb-[var(--space-6)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-visible">
              <div className="flex-1">
                <h2 className="font-serif text-2xl sm:text-[length:var(--text-4xl)] font-bold leading-[1.2] sm:leading-[1.22] text-[rgb(var(--color-text-primary))]">
                  {staffName ? `${staffName.split(' ')[0]}'s Progress` : user?.firstName ? `${user.firstName}'s Progress` : 'Career Progression Pathway'}
                </h2>
              </div>

              {/* Pathway Selector Dropdown - Hidden in manager view */}
              {!isManagerView && (
                <div className="sm:ml-[var(--space-4)] relative w-full sm:w-auto pathway-dropdown">
                  <button
                    ref={pathwayButtonRef}
                    onClick={() => {
                      if (pathwayButtonRef.current && !pathwayPickerMobile) {
                        const rect = pathwayButtonRef.current.getBoundingClientRect();
                        setDropdownStyle({
                          top: rect.bottom + window.scrollY + 8,
                          left: rect.left + window.scrollX,
                          width: rect.width
                        });
                      }
                      setPathwaySearchOpen(!pathwaySearchOpen);
                    }}
                    className="
                      w-full sm:w-auto
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
                      shadow-sm
                      sm:min-w-[240px]
                      text-left
                    "
                  >
                    {pathwayOptions.find(opt => opt.value === selectedPathway)?.label}
                  </button>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Dropdown Menu - Rendered with Portal */}
              {!isManagerView && pathwaySearchOpen && typeof window !== 'undefined' && (
                createPortal(
                  <div
                    className={`pathway-dropdown-menu fixed bg-white z-[100] ${
                      pathwayPickerMobile
                        ? 'inset-0 flex flex-col border-0 rounded-none shadow-none'
                        : 'border-2 border-[rgb(var(--color-border))] rounded-xl shadow-lg'
                    }`}
                    style={pathwayPickerMobile ? undefined : {
                      top: `${dropdownStyle.top}px`,
                      left: `${dropdownStyle.left}px`,
                      width: `${dropdownStyle.width}px`
                    }}
                    role={pathwayPickerMobile ? 'dialog' : 'listbox'}
                    aria-modal={pathwayPickerMobile ? true : undefined}
                    aria-label="Select pathway"
                  >
                      {pathwayPickerMobile && (
                        <div className="flex items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] px-4 py-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
                          <div>
                            <p className="text-sm font-medium text-[rgb(var(--color-text-muted))]">Pathway</p>
                            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">Choose a pathway</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPathwaySearchOpen(false);
                              setPathwaySearchQuery('');
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--color-border))] bg-white text-[rgb(var(--color-text-primary))] shadow-sm"
                            aria-label="Close pathway picker"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                      <div className={pathwayPickerMobile ? 'p-4' : 'p-2'}>
                        <input
                          type="text"
                          placeholder="Search pathways..."
                          value={pathwaySearchQuery}
                          onChange={(e) => setPathwaySearchQuery(e.target.value)}
                          className="
                            w-full
                            px-3 py-2
                            bg-[rgb(var(--color-neutral-50))]
                            border border-[rgb(var(--color-border))]
                            rounded-lg
                            text-base sm:text-sm
                            text-[rgb(var(--color-text-primary))]
                            placeholder:text-[rgb(var(--color-text-muted))]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[rgb(var(--color-primary-400))]
                            focus:border-[rgb(var(--color-primary-400))]
                          "
                          autoFocus={!pathwayPickerMobile}
                        />
                      </div>
                      <div className={pathwayPickerMobile ? 'flex-1 overflow-y-auto px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]' : 'max-h-60 overflow-y-auto'}>
                        {pathwayOptions
                          .filter(option =>
                            option.label.toLowerCase().includes(pathwaySearchQuery.toLowerCase())
                          )
                          .map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedPathway(option.value);
                                setPathwaySearchOpen(false);
                                setPathwaySearchQuery('');
                              }}
                              className={`
                                w-full
                                text-left
                                px-4
                                ${pathwayPickerMobile ? 'py-3 rounded-lg text-base' : 'py-2.5 text-sm'}
                                transition-colors
                                ${selectedPathway === option.value
                                  ? 'bg-[rgb(var(--color-primary-50))] text-[rgb(var(--color-primary-700))] font-semibold'
                                  : 'text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-neutral-50))]'
                                }
                              `}
                            >
                              {option.label}
                            </button>
                          ))}
                        {pathwayOptions.filter(option =>
                          option.label.toLowerCase().includes(pathwaySearchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-6 text-center text-base sm:text-sm text-[rgb(var(--color-text-muted))]">
                            No pathways found
                          </div>
                        )}
                      </div>
                    </div>,
                  document.body
                )
              )}
            </div>

            {/* Level Progress Indicator - Focused View */}
            <div className="py-4 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-2">
              <div className="flex items-center justify-start gap-3 sm:gap-4 min-w-max">
                {(() => {
                  // Calculate visible levels: completed + current + next 2
                  const visibleLevels = [];
                  const remainingLevels = [];

                  // Add all completed levels
                  for (let i = 0; i < currentLevel; i++) {
                    visibleLevels.push(levels[i]);
                  }

                  // Add current level
                  visibleLevels.push(levels[currentLevel]);

                  // Add next 2 levels (if they exist)
                  if (levels[currentLevel + 1]) visibleLevels.push(levels[currentLevel + 1]);
                  if (levels[currentLevel + 2]) visibleLevels.push(levels[currentLevel + 2]);

                  // Remaining levels
                  for (let i = currentLevel + 3; i < levels.length; i++) {
                    remainingLevels.push(levels[i]);
                  }

                  const hasMoreLevels = remainingLevels.length > 0;

                  return (
                    <>
                      {visibleLevels.map((level, index) => (
                        <React.Fragment key={level.id}>
                          <div className="flex flex-col items-center gap-2 relative">
                            <button
                              onClick={() => setExpandedLevel(level.id)}
                              className="group"
                            >
                              <div
                                className={`
                                  w-12 h-12 sm:w-14 sm:h-14 rounded-full inline-flex items-center justify-center font-serif font-bold text-base sm:text-lg
                                  transition-all duration-300
                                  ${level.id === currentLevel
                                    ? 'bg-[rgb(34,197,94)] text-white shadow-lg ring-4 ring-[rgb(34,197,94)]/20'
                                    : level.id < currentLevel
                                    ? 'bg-[rgb(21,128,61)] text-white shadow-md'
                                    : 'bg-[rgb(var(--color-neutral-200))] text-[rgb(var(--color-text-muted))] shadow-sm'
                                  }
                                  group-hover:scale-105 cursor-pointer
                                `}
                                style={{ lineHeight: '1' }}
                              >
                                <span>
                                  {level.id === 0 ? '0' : level.label}
                                </span>
                              </div>
                            </button>
                            <button
                              onClick={() => setExpandedLevel(level.id)}
                              className="text-[10px] sm:text-xs font-medium text-center whitespace-nowrap cursor-pointer"
                            >
                              <p className={`
                                ${level.id === currentLevel ? 'text-[rgb(34,197,94)] font-semibold' : level.id < currentLevel ? 'text-[rgb(21,128,61)]' : 'text-[rgb(var(--color-text-muted))]'}
                              `}>
                                {level.id === 0 ? 'Pre-Schema' : `Lvl ${level.label}`}
                              </p>
                            </button>
                            {/* Active Level Indicator Triangle */}
                            {expandedLevel === level.id && (
                              <div className="absolute -bottom-3">
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                  <path d="M4 0L8 6H0L4 0Z" fill="rgb(34, 197, 94)" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Connecting Line */}
                          {index < visibleLevels.length - 1 && (
                            <div className="flex items-center -mt-6">
                              <div className={`
                                h-0.5 w-8 sm:w-12 transition-colors duration-300
                                ${level.id < currentLevel ? 'bg-[rgb(21,128,61)]' : 'bg-[rgb(var(--color-neutral-300))]'}
                              `}></div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                      {/* More Ahead Indicator (Clickable) or Remaining Levels */}
                      {hasMoreLevels && !showFullPathway && (
                        <>
                          <div className="flex items-center -mt-6 transition-opacity duration-300">
                            <div className="h-0.5 w-8 sm:w-12 bg-[rgb(var(--color-neutral-300))]"></div>
                          </div>
                          <button
                            onClick={() => setShowFullPathway(true)}
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full inline-flex items-center justify-center bg-[rgb(var(--color-neutral-100))] text-[rgb(var(--color-text-muted))] opacity-60 group-hover:opacity-100 group-hover:bg-[rgb(var(--color-neutral-200))] transition-all duration-200 group-hover:scale-105">
                              <span className="text-lg">⋯</span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-medium text-[rgb(var(--color-text-muted))] opacity-60 group-hover:opacity-100 group-hover:text-[rgb(var(--color-primary-600))] transition-all duration-200">
                              More ahead
                            </p>
                          </button>
                        </>
                      )}

                      {/* Show Remaining Levels when expanded */}
                      {hasMoreLevels && (showFullPathway || isCollapsing) && (
                        <>
                          <div className="flex items-center -mt-6">
                            <div className="h-0.5 w-8 sm:w-12 bg-[rgb(var(--color-neutral-300))]"></div>
                          </div>
                          {remainingLevels.map((level, index) => (
                            <React.Fragment key={level.id}>
                              <div
                                className={`flex flex-col items-center gap-2 relative ${isCollapsing ? 'animate-glideOutDown' : 'animate-glideInUp'}`}
                                style={{ animationDelay: isCollapsing ? `${(remainingLevels.length - index - 1) * 50}ms` : `${index * 60}ms` }}
                              >
                                <button
                                  onClick={() => setExpandedLevel(level.id)}
                                  className="group"
                                >
                                  <div
                                    className={`
                                      w-12 h-12 sm:w-14 sm:h-14 rounded-full inline-flex items-center justify-center font-serif font-bold text-base sm:text-lg
                                      transition-all duration-300 shadow-[var(--shadow-md)]
                                      bg-[rgb(var(--color-neutral-200))] text-[rgb(var(--color-text-muted))]
                                      group-hover:scale-105 cursor-pointer
                                    `}
                                    style={{ lineHeight: '1' }}
                                  >
                                    {level.id === 0 ? '0' : level.label}
                                  </div>
                                </button>
                                <button
                                  onClick={() => setExpandedLevel(level.id)}
                                  className="text-[10px] sm:text-xs font-medium text-center whitespace-nowrap cursor-pointer"
                                >
                                  <p className="text-[rgb(var(--color-text-muted))]">
                                    {level.id === 0 ? 'Pre-Schema' : `Lvl ${level.label}`}
                                  </p>
                                </button>
                                {/* Active Level Indicator Triangle */}
                                {expandedLevel === level.id && (
                                  <div className="absolute -bottom-3">
                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                      <path d="M4 0L8 6H0L4 0Z" fill="rgb(34, 197, 94)" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Connecting Line */}
                              {index < remainingLevels.length - 1 && (
                                <div
                                  className={`flex items-center -mt-6 ${isCollapsing ? 'animate-glideOutDown' : 'animate-fadeIn'}`}
                                  style={{ animationDelay: isCollapsing ? `${(remainingLevels.length - index - 1) * 50 + 30}ms` : `${(index * 60) + 30}ms` }}
                                >
                                  <div className="h-0.5 w-8 sm:w-12 bg-[rgb(var(--color-neutral-300))]"></div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}

                          {/* Show Focus View Link */}
                          <button
                            onClick={() => {
                              setIsCollapsing(true);
                              setTimeout(() => {
                                setShowFullPathway(false);
                                setIsCollapsing(false);
                              }, 500);
                            }}
                            className={`flex items-center ml-4 cursor-pointer group -mt-6 ${isCollapsing ? 'animate-glideOutDown' : 'animate-fadeIn'}`}
                            style={{ animationDelay: isCollapsing ? '0ms' : `${remainingLevels.length * 60}ms` }}
                          >
                            <p className="text-xs sm:text-sm font-medium text-[rgb(var(--color-primary-600))] hover:text-[rgb(var(--color-primary-700))] underline transition-colors duration-200 whitespace-nowrap">
                              Focus view
                            </p>
                          </button>
                        </>
                      )}
                    </>
                  );
                })()}
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
                    hidden sm:flex items-center justify-center
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
                    hidden sm:flex items-center justify-center
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-[var(--space-3)] mb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <CardTitle className="font-serif text-[length:var(--text-2xl)] text-[rgb(var(--color-text-primary))] leading-tight">
                          {levels[expandedLevel]?.id === 0 ? levels[expandedLevel]?.name : `${levels[expandedLevel]?.name}`}
                        </CardTitle>
                        {levels[expandedLevel]?.id === currentLevel && (
                          <Badge className="bg-[rgb(var(--color-primary-600))] text-white uppercase tracking-[var(--tracking-wide)] text-xs font-semibold px-2.5 py-1 leading-none w-fit">
                            Current Level
                          </Badge>
                        )}
                      </div>
                      {expandedLevel >= 1 && expandedLevel <= 6 && (
                        <a
                          href={
                            selectedPathway === 'Product Manager'
                              ? 'https://appraise.tech.gov.sg/schemas/role/cmnd18pf2002j0clbuvybnyxh'
                              : selectedPathway === 'Product Ops'
                              ? 'https://appraise.tech.gov.sg/schemas/role/cmnd18pfh002q0clb5dy700v0'
                              : selectedPathway === 'Software Engineer'
                              ? 'https://appraise.tech.gov.sg/schemas/role/cmnd18p9g00080clbqru5ngyb'
                              : 'https://appraise.tech.gov.sg/schemas/role/cmnd18pco001o0clbcz1vqx1f'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden sm:inline-flex bg-[rgb(var(--color-neutral-600))] hover:bg-[rgb(var(--color-neutral-700))] text-white shadow-sm h-8 px-2.5 items-center justify-center text-sm font-medium rounded-lg transition-all shrink-0"
                        >
                          See Schema in Appraise
                        </a>
                      )}
                    </div>
                    <CardDescription className="text-[rgb(var(--color-text-secondary))] text-sm leading-relaxed">
                      {levels[expandedLevel]?.description}
                    </CardDescription>
                    {expandedLevel >= 1 && expandedLevel <= 6 && (
                      <a
                        href={
                          selectedPathway === 'Product Manager'
                            ? 'https://appraise.tech.gov.sg/schemas/role/cmnd18pf2002j0clbuvybnyxh'
                            : selectedPathway === 'Product Ops'
                            ? 'https://appraise.tech.gov.sg/schemas/role/cmnd18pfh002q0clb5dy700v0'
                            : selectedPathway === 'Software Engineer'
                            ? 'https://appraise.tech.gov.sg/schemas/role/cmnd18p9g00080clbqru5ngyb'
                            : 'https://appraise.tech.gov.sg/schemas/role/cmnd18pco001o0clbcz1vqx1f'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:hidden inline-flex bg-[rgb(var(--color-neutral-600))] hover:bg-[rgb(var(--color-neutral-700))] text-white shadow-sm h-8 px-2.5 items-center justify-center text-sm font-medium rounded-lg transition-all mt-3"
                      >
                        See Schema in Appraise
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-[var(--space-6)] overflow-visible">
                  {expandedLevel === 0 ? (
                    // Pre-Schema Steps
                    <div className="space-y-[var(--space-6)] overflow-visible">
                      <div className="mb-[var(--space-6)]">
                        <h4 className="font-serif text-[length:var(--text-xl)] font-bold leading-[1.2] sm:leading-[1.22] text-[rgb(var(--color-text-primary))] mb-[var(--space-2)]">
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

                      {selectedPathway === 'Product Manager' || selectedPathway === 'Product Ops' || selectedPathway === 'Software Engineer' ? (
                        // Product Manager / Product Ops / Software Engineer Pre-Schema - Coming Soon
                        <div className="text-center py-[var(--space-16)]">
                          <div className="w-20 h-20 rounded-2xl bg-[rgb(var(--color-neutral-100))] flex items-center justify-center mx-auto mb-[var(--space-4)]">
                            <svg className="w-10 h-10 text-[rgb(var(--color-text-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">Coming Soon</h3>
                          <p className="text-[rgb(var(--color-text-secondary))] max-w-md mx-auto">
                            Pre-Schema requirements for {selectedPathway} pathway are currently being developed.
                          </p>
                        </div>
                      ) : selectedPathway === 'UX Designer' ? (
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
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-[var(--space-4)]">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-2)]">
                                      <span className="text-sm font-semibold text-[rgb(var(--color-text-muted))]">Step {index + 1}</span>
                                    </div>
                                    <CardTitle className="font-serif text-[length:var(--text-xl)] mb-[var(--space-2)] text-[rgb(var(--color-text-primary))] leading-snug">
                                      {step.title}
                                    </CardTitle>
                                    <CardDescription className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                      {step.description}
                                    </CardDescription>
                                  </div>

                                  {/* Action Buttons - Top Right on desktop, below description on mobile */}
                                  {!isManagerView && step.id === '1' && preSchemaStatuses['1'] === 'Not Yet' && (
                                    <Button
                                      onClick={handleRegisterClick}
                                      className="
                                        bg-[rgb(var(--color-primary-600))]
                                        hover:bg-[rgb(var(--color-primary-700))]
                                        text-white
                                        shadow-sm
                                        sm:shrink-0
                                        w-full sm:w-auto
                                      "
                                    >
                                      Register for Course
                                    </Button>
                                  )}

                                  {!isManagerView && step.id === '2' && preSchemaStatuses['2'] === 'Not Yet' && (
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
                                        sm:shrink-0
                                        w-full sm:w-auto
                                      "
                                    >
                                      Take assessment
                                    </Button>
                                  )}

                                  {step.id === '4' && (
                                    <button
                                      className="bg-[rgb(var(--color-neutral-600))] hover:bg-[rgb(var(--color-neutral-700))] text-white shadow-sm h-8 px-4 inline-flex items-center justify-center text-sm font-medium rounded-lg transition-all sm:shrink-0 w-full sm:w-auto"
                                    >
                                      View Apprenticeship Site
                                    </button>
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
                                    ) : expandedLevel === 1 ? (
                    // Level 1
                    <div className="space-y-[var(--space-6)]">
                      {/* Core */}
                      <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/google-ux-design-professional-certificate-course-1-4"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Google UX Design Professional Certificate (Course 1 – 4)
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/google-ux-design-professional-certificate-course-5-8"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Google UX Design Professional Certificate (Course 5 – 8)
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/lean-ux-and-agile"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Lean UX and Agile
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/running-effective-design-critiques"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Running Effective Design Critiques
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/uiux-design-with-gen-ai-wireframing-prototyping"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                UI/UX Wireframing and Prototyping with Figma
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/uiux-wireframing-and-prototyping-with-figma"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                UI/UX Design with Gen AI: Wireframing & Prototyping
                              </span>
                            </a>

                          </div>
                        </div>

                        {/* Electives */}
                        <div>
                          <h4 className="font-serif text-[length:var(--space-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Electives
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/design-rules-principles-and-practices-for-great-ui-design"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Human-Computer Interaction
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/human-computer-interaction"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Interaction Intelligence: Advanced Prototyping with Figma
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/interaction-intelligence-advanced-prototyping-with-figma"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Writing is Designing: UX Content & Interface Strategy
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/writing-is-designing-ux-content-interface-strategy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Design Rules: Principles and practices for Great UI Design
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/how-to-design-for-accessibility"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                How to Design for Accessibility
                              </span>
                            </a>

                          </div>
                        </div>
                    </div>
                                    ) : expandedLevel === 2 ? (
                    // Level 2
                    <div className="space-y-[var(--space-6)]">
                      {/* Core */}
                      <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/advanced-design-thinking-certificate"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Advanced Design Thinking Certificate
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/ai-essentials-for-user-experience-designers"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                User Research - Methods and Best Practice
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/communication-with-stakeholders"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Product Design
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/product-design"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Service Design
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/user-research-step-by-step-ux-research-methods"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                AI Essentials for User Experience Designers
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/service---design"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Communication with Stakeholders
                              </span>
                            </a>

                          </div>
                        </div>
                    </div>
                                    ) : expandedLevel === 3 ? (
                    // Level 3 Senior Designer
                    <div className="space-y-[var(--space-6)]">
                        {/* Core */}
                        <div className="mb-[var(--space-6)]">
                          <h4 className="font-serif text-[length:var(--text-xl)] font-bold text-[rgb(var(--color-text-primary))] mb-[var(--space-4)]">
                            Core
                          </h4>
                          <div className="space-y-[var(--space-3)]">
                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/human-centered-systems-thinking"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Human-Centered Systems Thinking
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/leadership-practical-leadership-skills"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Leadership: Practical Leadership Skills
                              </span>
                            </a>

                            <a
                              href="https://www.thedigitalacademy.tech.gov.sg/course/detail/navigate-conflict-and-deliver-feedback"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[var(--color-primary-300))] hover:bg-[rgb(var(--color-primary-50))] transition-all group"
                            >
                              <svg className="w-5 h-5 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary-600))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              <span className="text-[rgb(var(--color-text-primary))] font-medium group-hover:text-[rgb(var(--color-primary-700))] transition-colors">
                                Navigate Conflict and Deliver Feedback
                              </span>
                            </a>

                          </div>
                        </div>
                    </div>
                                    ) : expandedLevel === 4 ? (
                    // Level 4 Lead Designer
                    <div className="space-y-[var(--space-6)]">
                      <p className="text-[rgb(var(--color-text-secondary))] text-center py-8">
                        Course information coming soon
                      </p>
                    </div>
                                    ) : expandedLevel === 5 ? (
                    // Level 5 Principal Designer
                    <div className="space-y-[var(--space-6)]">
                      <p className="text-[rgb(var(--color-text-secondary))] text-center py-8">
                        Course information coming soon
                      </p>
                    </div>
                                    ) : expandedLevel === 6 ? (
                    // Level 6 Distinguished Designer
                    <div className="space-y-[var(--space-6)]">
                      <p className="text-[rgb(var(--color-text-secondary))] text-center py-8">
                        Course information coming soon
                      </p>
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
            className={`fixed right-0 top-0 h-full w-full sm:w-80 bg-white border-l-2 border-[rgb(var(--color-border))] shadow-[var(--shadow-xl)] z-[var(--z-modal)] transition-transform duration-300 flex flex-col ${
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
