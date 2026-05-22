import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'admin-1',
      clerkUserId: 'clerk_admin_1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      id: 'manager-1',
      clerkUserId: 'clerk_manager_1',
      email: 'manager@example.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'MANAGER',
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      id: 'staff-1',
      clerkUserId: 'clerk_staff_1',
      email: 'staff@example.com',
      firstName: 'John',
      lastName: 'Staff',
      role: 'STAFF',
    },
  });

  console.log('✓ Created users:', { admin: adminUser.email, manager: managerUser.email, staff: staffUser.email });

  // Create a Design pathway
  const designPathway = await prisma.pathway.upsert({
    where: { id: 'pathway-design-1' },
    update: {},
    create: {
      id: 'pathway-design-1',
      name: 'UX Design Pathway',
      description: 'Professional development pathway for UX designers',
      createdBy: adminUser.id,
    },
  });

  console.log('✓ Created pathway:', designPathway.name);

  // Create schema levels for the pathway
  const preSchemaLevel = await prisma.schemaLevel.upsert({
    where: { id: 'level-preschema-1' },
    update: {},
    create: {
      id: 'level-preschema-1',
      pathwayId: designPathway.id,
      levelType: 'PRE_SCHEMA',
      levelOrder: 0,
      name: 'Pre-Schema Requirements',
      description: 'Complete these foundational steps before starting your apprenticeship',
    },
  });

  const level1 = await prisma.schemaLevel.upsert({
    where: { id: 'level-1-design' },
    update: {},
    create: {
      id: 'level-1-design',
      pathwayId: designPathway.id,
      levelType: 'LEVEL_1',
      levelOrder: 1,
      name: 'Designer (I)',
      description: 'As an L1 Designer (I), you are a supporting-level player honing your craft and working to understand GovTech\'s organisational context, design standards, and workflows.',
    },
  });

  const level2 = await prisma.schemaLevel.upsert({
    where: { id: 'level-2-design' },
    update: {},
    create: {
      id: 'level-2-design',
      pathwayId: designPathway.id,
      levelType: 'LEVEL_2',
      levelOrder: 2,
      name: 'Designer (II)',
      description: 'As an L2 Designer (II), you are a key contributing member of the design team, applying your skills to create user-centered solutions and working with autonomy.',
    },
  });

  const level3 = await prisma.schemaLevel.upsert({
    where: { id: 'level-3-design' },
    update: {},
    create: {
      id: 'level-3-design',
      pathwayId: designPathway.id,
      levelType: 'LEVEL_3',
      levelOrder: 3,
      name: 'Senior Designer',
      description: 'As an L3 Senior Designer, you are an experienced practitioner and emerging leader who elevates standards of design practice and collaboration. You solve problems creatively, going beyond best practices, and significantly influence your team\'s processes, its output, and its stakeholder relationships.',
    },
  });

  const level4 = await prisma.schemaLevel.upsert({
    where: { id: 'level-4-design' },
    update: {},
    create: {
      id: 'level-4-design',
      pathwayId: designPathway.id,
      levelType: 'LEVEL_4',
      levelOrder: 4,
      name: 'Lead Designer',
      description: 'As an L4 Lead Designer, you are an experienced leader of craft, expertise, and rigor, expertly solving complex problems, building strong partnerships, and owning cross-team, cross-program initiatives, all while multiplying impact through effective communication and mentorship.',
    },
  });

  const level5 = await prisma.schemaLevel.upsert({
    where: { id: 'level-5-design' },
    update: {},
    create: {
      id: 'level-5-design',
      pathwayId: designPathway.id,
      levelType: 'LEVEL_5',
      levelOrder: 5,
      name: 'Principal Designer',
      description: 'As a L5 Principal Designer, you are a leader in design strategy and execution — capable of navigating teams through complex large-scale, high-impact problems, and demonstrating domain leadership.',
    },
  });

  const level6 = await prisma.schemaLevel.upsert({
    where: { id: 'level-6-design' },
    update: {},
    create: {
      id: 'level-6-design',
      pathwayId: designPathway.id,
      levelType: 'LEVEL_6',
      levelOrder: 6,
      name: 'Distinguished Designer',
      description: 'As a L6 Distinguished Designer, you are a design leader not only in GovTech but in the Public Service. Your expertise and experience is tapped on in growing organisational design capabilities at scale.',
    },
  });

  console.log('✓ Created schema levels');

  // Create competencies for each level
  const level1Competencies = [
    {
      id: 'comp-l1-craft',
      pathwayId: designPathway.id,
      name: 'Craft & Execution',
      description: 'Builds foundational skills, delivers well-scoped work, learns and applies. Uses basic research, evidence, and testing to understand user needs and assess design effectiveness. Understands service context and constraints; asks useful questions when problem boundaries are unclear. Produces well-scoped work with guidance; improves quality through feedback, iteration, standards, and accessibility.',
    },
    {
      id: 'comp-l1-ownership',
      pathwayId: designPathway.id,
      name: 'Ownership',
      description: 'Work with manager guidance, take ownership of well-defined tasks, seek and apply feedback for growth. Proactively seek clarity on assigned tasks. Complete tasks accurately and on time. Actively seek feedback and listen to others\' ideas, incorporate learnings for growth.',
    },
    {
      id: 'comp-l1-strategic',
      pathwayId: designPathway.id,
      name: 'Strategic Alignment',
      description: 'Learn and align with team direction. Seek to understand the purpose behind their work and how it fits into the team\'s objectives. Adapt to changes in project scope and priorities with guidance.',
    },
    {
      id: 'comp-l1-culture',
      pathwayId: designPathway.id,
      name: 'Culture and Organizational Influence',
      description: 'Adopt org values, engage with others. Take initiative to learn new skills. Focus on solutions when problems arise. Proactively offer help to colleagues. Participate in information-sharing activities within your team or with peers.',
    },
  ];

  const level2Competencies = [
    {
      id: 'comp-l2-craft',
      pathwayId: designPathway.id,
      name: 'Craft & Execution',
      description: 'Applies best practices to problem-solving and solutions development. Independently moves from defined problem to validated solution using evidence, iteration, and testing. Produces accessible, coherent designs within product, service, and operational constraints; uses AI tools with critical judgment. Makes sound trade-offs in moderately complex situations and explains decisions using evidence.',
    },
    {
      id: 'comp-l2-ownership',
      pathwayId: designPathway.id,
      name: 'Ownership',
      description: 'Own problem outcomes, help peers. Independently own assigned tasks and projects. Identify and address issues proactively with minimal guidance, and know when to engage appropriate help. Identify opportunities and recommend next steps to improve processes or outcomes in own work.',
    },
    {
      id: 'comp-l2-strategic',
      pathwayId: designPathway.id,
      name: 'Strategic Alignment',
      description: 'Align own work with team strategy. Align tasks with team goals and priorities. Focus on tasks that provide most expected business value. Adapt to changing priorities independently.',
    },
    {
      id: 'comp-l2-culture',
      pathwayId: designPathway.id,
      name: 'Culture and Organizational Influence',
      description: 'Contribute to team culture. Collaborate with peers and stakeholders to ensure tasks are executed effectively. Address minor conflicts constructively and respectfully. Suggest improvements that enhance team effectiveness. Share knowledge, resources, as well as successes and failures openly to ensure team success.',
    },
  ];

  const level3Competencies = [
    {
      id: 'comp-l3-craft',
      pathwayId: designPathway.id,
      name: 'Craft & Execution',
      description: 'Shapes problems, leads complex work, delivers advanced quality. Shapes problems as well as solutions, using user-centered methods to influence direction and identify the right questions. Delivers high-quality work across complex journeys, balancing user needs, service quality, accessibility, constraints, and feasibility. Raises team design quality through critique, mentoring, experimentation, and strong judgment under ambiguity.',
    },
    {
      id: 'comp-l3-ownership',
      pathwayId: designPathway.id,
      name: 'Ownership',
      description: 'Lead end-to-end delivery, mentor others. Take full ownership of broad, ambiguously-scoped projects, ensuring successful outcomes. Take calculated risks, learning from both successes and failures. Mentor and support junior team members through sharing knowledge, breaking down problems, and providing constructive feedback - actively raising team productivity.',
    },
    {
      id: 'comp-l3-strategic',
      pathwayId: designPathway.id,
      name: 'Strategic Alignment',
      description: 'Contribute to team strategy and planning. Translate team goals into actionable plans including breaking down and prioritising tasks, and contribute to project strategy. Proactively identify opportunities and drive workstreams, synthesize data into clear recommendations, and connect analyses to organisational impact. Identify and mitigate risks at the project level, anticipating potential challenges.',
    },
    {
      id: 'comp-l3-culture',
      pathwayId: designPathway.id,
      name: 'Culture and Organizational Influence',
      description: 'Influence and reinforce team culture. Coordinate cross-functional collaboration and guide team members to ensure projects are delivered effectively. Navigate and help resolve disagreements constructively, facilitating alignment among team members and stakeholders. Constructively challenge existing processes for continuous improvement and drive change initiatives at the team/division level. Actively share successes and failures and provide recommendations to enhance team performance and learning.',
    },
    {
      id: 'comp-l3-people',
      pathwayId: designPathway.id,
      name: 'People Management',
      description: 'Transitional People Management. This is a transitional people management stage. You continue to contribute technically while learning the basics of people management. Support team coordination by communicating simple project goals and priorities to team members. Conduct check-ins with 1/2 direct or indirect team members, focusing on immediate work progress and basic feedback delivery. Help team members with day-to-day blockers and provide technical mentoring.',
    },
  ];

  const level4Competencies = [
    {
      id: 'comp-l4-craft',
      pathwayId: designPathway.id,
      name: 'Craft & Execution',
      description: 'Solves higher-order problems, establishes quality standards across teams. Tackles ambiguous, higher-order problems requiring new framing, systems thinking, and cross-functional alignment. Establishes quality standards across teams, covering discovery, accessibility, experimentation, service coherence, and evidence-based decisions. Delivers consistently excellent design work while establishing and upholding quality standards across multiple teams or product areas.',
    },
    {
      id: 'comp-l4-ownership',
      pathwayId: designPathway.id,
      name: 'Ownership',
      description: 'Support division\'s strategic agenda, drive key projects, work through others. Independently identify key projects that support divisional strategic objectives and take proactive steps to drive them forward. Actively invest in the growth of peers and junior team members through mentorship, sponsorship, and knowledge sharing. Mentor L3 and below officers beyond your immediate team, measurably improving the capability of colleagues across levels.',
    },
    {
      id: 'comp-l4-strategic',
      pathwayId: designPathway.id,
      name: 'Strategic Alignment',
      description: 'Execute initiatives to further department\'s strategy. Provide direction on initiatives with a strong ability to measure outcomes and adjust strategies when needed. Develop roadmaps for complex initiatives, breaking down workstreams and coordinating with team members and partners across teams to deliver. Identify and manage risk for their team.',
    },
    {
      id: 'comp-l4-culture',
      pathwayId: designPathway.id,
      name: 'Culture and Organizational Influence',
      description: 'Build cross-team collaboration. Lead cross-functional collaboration across multiple teams and/or within department to ensure projects are executed in alignment with department goals. Resolve complex stakeholder conflicts and facilitate solutioning across multiple teams. Champion and role model continuous improvement, anticipating future needs and challenges for your area and the wider function.',
    },
    {
      id: 'comp-l4-people',
      pathwayId: designPathway.id,
      name: 'People Management',
      description: 'Team Leadership. Align team goals with departmental objectives. Contribute to hiring standards and expectations, improving hiring and interview processes. Conduct regular 1:1s with direct/indirect reports to align and coach performance. Provide opportunities to stretch and grow direct/indirect reports to the next level by delegating/empowering teams for better outcomes. Create a productive environment by providing resources, removing barriers, setting up the right team structure, norms, and motivating teams to perform at their best.',
    },
  ];

  const level5Competencies = [
    {
      id: 'comp-l5-craft',
      pathwayId: designPathway.id,
      name: 'Craft & Execution',
      description: 'Leads quality at organizational scale, demonstrates domain leadership. Defines standards and practices that strengthen design quality at organizational scale; develops emerging design leaders. Directs problem-solving for entire domains or strategic projects; ensures evidence-based, user-centric approach throughout. Shapes design vision and strategy across programs; establishes relationships with agency leadership to drive transformational outcomes.',
    },
    {
      id: 'comp-l5-ownership',
      pathwayId: designPathway.id,
      name: 'Ownership',
      description: 'Own department strategy and outcomes, drive key projects across teams, grow leaders. Take accountability for the success of the department, contributing to the definition of outcomes and goals. Identify and remove systemic inefficiencies and barriers, advocating for the resources, tools and processes teams need. Drive accountability and ownership across multiple teams. Cultivate a high-performing team, focusing on long-term growth and talent development. Mentor future leaders within the organization.',
    },
    {
      id: 'comp-l5-strategic',
      pathwayId: designPathway.id,
      name: 'Strategic Alignment',
      description: 'Influence department strategy. Take initiative to lead workstreams and guide colleagues towards achieving these outcomes. Translate divisional goals into a theory of success and OKRs, working with teams to align effort. Develop long-term roadmaps and execute within and across teams to deliver. Anticipate and manage systemic risks and changes across teams.',
    },
    {
      id: 'comp-l5-culture',
      pathwayId: designPathway.id,
      name: 'Culture and Organizational Influence',
      description: 'Shape department culture. Build and maintain strategic cross-functional and/or departmental partnerships to effectively navigate matrix relationships and competing priorities. Lead through influence, facilitate strategic discussions, build alignment. Drive a culture of continuous improvement and innovation across multiple teams, champion open communication and collaboration.',
    },
    {
      id: 'comp-l5-people',
      pathwayId: designPathway.id,
      name: 'People Management',
      description: 'Departmental Leadership. Align departmental goals with organizational objectives, setting high standards while empowering teams and coaching people managers. Lead recruitment efforts, ensuring top talent is brought in and continuously developed. Conduct regular 1:1s with direct/indirect reports to align and coach performance. Create a productive environment on wider scope, provide the resources and infrastructure for optimal productivity.',
    },
  ];

  const level6Competencies = [
    {
      id: 'comp-l6-craft',
      pathwayId: designPathway.id,
      name: 'Craft & Execution',
      description: 'Shapes design standards and experience strategy in GovTech and/or public service. Sets direction for design quality across GovTech and/or public service, including discovery, accessibility, service quality, experimentation, and AI. Builds institutional conditions for quality at scale through standards, leadership, and cross-government influence. Leads framing of systemic service problems and strategic direction spanning agencies, policies, operations, and citizen experience.',
    },
    {
      id: 'comp-l6-ownership',
      pathwayId: designPathway.id,
      name: 'Ownership',
      description: 'Set vision for division, forward org agenda, develop leadership pipeline. Set and take full ownership and accountability of the long term division\'s vision, strategy, outcomes and performance. Proactively identify opportunities to forward organisational agenda, aligned with org goals and strategy. Develop a leadership pipeline and champion a culture of growth and empowerment.',
    },
    {
      id: 'comp-l6-strategic',
      pathwayId: designPathway.id,
      name: 'Strategic Alignment',
      description: 'Influence org strategy, represent division strategy. Communicate the overarching organisational strategy and vision, set clear theory of success and OKRs, aligning all teams under your division. Foresee and manage large-scale, org-wide risks and uncertainties.',
    },
    {
      id: 'comp-l6-culture',
      pathwayId: designPathway.id,
      name: 'Culture and Organizational Influence',
      description: 'Shape and steward the overall organizational culture. Lead by example in navigating complex relationships with peers, senior leadership, and external stakeholders across functions/departments/divisions. Foster a culture of open communication and collaboration across the organisation. Drive divisional transformation by championing innovative practices and implementing fundamental and systemic/structural changes.',
    },
    {
      id: 'comp-l6-people',
      pathwayId: designPathway.id,
      name: 'People Management',
      description: 'Divisional Leadership. Set and communicate strategic goals aligned with organisational priorities throughout division, empowering teams to take ownership. Lead talent strategy, driving recruitment, development, and retention of top performers. Conduct regular 1:1s to align and coach performance. Identify and grow effective leaders within the division. Gather feedback on org health of division from all levels and ensure the department has the resources, tools, processes and environment necessary for high performance.',
    },
  ];

  // Upsert all competencies
  for (const comp of [...level1Competencies, ...level2Competencies, ...level3Competencies, ...level4Competencies, ...level5Competencies, ...level6Competencies]) {
    await prisma.competency.upsert({
      where: { id: comp.id },
      update: {},
      create: comp,
    });
  }

  console.log('✓ Created competencies for all levels');

  // Create Pre-Schema steps
  const step1 = await prisma.preSchemaStep.upsert({
    where: { id: 'step-1' },
    update: {},
    create: {
      id: 'step-1',
      schemaLevelId: preSchemaLevel.id,
      title: 'Complete Google UX Design Certification (Courses 1-4)',
      description: 'Finish the first 4 courses of the Google UX Design Certificate on Coursera',
      requiresProof: true,
      orderIndex: 1,
    },
  });

  const step2 = await prisma.preSchemaStep.upsert({
    where: { id: 'step-2' },
    update: {},
    create: {
      id: 'step-2',
      schemaLevelId: preSchemaLevel.id,
      title: 'Pass Design Practice Assessment',
      description: 'Complete the design practice evaluation with the design team',
      requiresProof: true,
      orderIndex: 2,
    },
  });

  const step3 = await prisma.preSchemaStep.upsert({
    where: { id: 'step-3' },
    update: {},
    create: {
      id: 'step-3',
      schemaLevelId: preSchemaLevel.id,
      title: 'Complete Full Google UX Design Certification',
      description: 'Finish all 7 courses of the Google UX Design Certificate',
      requiresProof: true,
      orderIndex: 3,
    },
  });

  console.log('✓ Created Pre-Schema steps');

  // Assign staff to pathway
  const pathwayAssignment = await prisma.pathwayAssignment.upsert({
    where: { id: 'assignment-1' },
    update: {},
    create: {
      id: 'assignment-1',
      userId: staffUser.id,
      pathwayId: designPathway.id,
      schemaLevelId: preSchemaLevel.id,
      assignedBy: adminUser.id,
      status: 'ACTIVE',
    },
  });

  console.log('✓ Assigned staff to pathway');

  // Create user progress for Pre-Schema steps
  const progress1 = await prisma.userProgress.findFirst({
    where: {
      userId: staffUser.id,
      pathwayAssignmentId: pathwayAssignment.id,
      preSchemaStepId: step1.id,
    },
  });
  if (!progress1) {
    await prisma.userProgress.create({
      data: {
        userId: staffUser.id,
        pathwayAssignmentId: pathwayAssignment.id,
        preSchemaStepId: step1.id,
        status: 'NOT_STARTED',
      },
    });
  }

  const progress2 = await prisma.userProgress.findFirst({
    where: {
      userId: staffUser.id,
      pathwayAssignmentId: pathwayAssignment.id,
      preSchemaStepId: step2.id,
    },
  });
  if (!progress2) {
    await prisma.userProgress.create({
      data: {
        userId: staffUser.id,
        pathwayAssignmentId: pathwayAssignment.id,
        preSchemaStepId: step2.id,
        status: 'NOT_STARTED',
      },
    });
  }

  const progress3 = await prisma.userProgress.findFirst({
    where: {
      userId: staffUser.id,
      pathwayAssignmentId: pathwayAssignment.id,
      preSchemaStepId: step3.id,
    },
  });
  if (!progress3) {
    await prisma.userProgress.create({
      data: {
        userId: staffUser.id,
        pathwayAssignmentId: pathwayAssignment.id,
        preSchemaStepId: step3.id,
        status: 'NOT_STARTED',
      },
    });
  }

  console.log('✓ Created user progress records');

  // Assign manager to staff
  const existingAssignment = await prisma.managerAssignment.findFirst({
    where: {
      staffUserId: staffUser.id,
      managerUserId: managerUser.id,
      endedAt: null,
    },
  });
  if (!existingAssignment) {
    await prisma.managerAssignment.create({
      data: {
        staffUserId: staffUser.id,
        managerUserId: managerUser.id,
        isPrimary: true,
        assignedBy: adminUser.id,
      },
    });
  }

  console.log('✓ Assigned manager to staff');

  // Create courses for all levels
  const courses = [
    // Level 1 Courses
    {
      id: 'course-l1-1',
      name: 'User Research Fundamentals',
      description: 'Learn basic research methods, user interviews, and usability testing',
      externalLink: 'https://www.coursera.org/learn/user-research',
      estimatedHours: 10,
      level: level1.id,
      orderIndex: 1,
    },
    {
      id: 'course-l1-2',
      name: 'Figma for Beginners',
      description: 'Master Figma basics: interface design, prototyping, and collaboration',
      externalLink: 'https://www.figma.com/resources/learn-design/',
      estimatedHours: 8,
      level: level1.id,
      orderIndex: 2,
    },
    {
      id: 'course-l1-3',
      name: 'Accessibility Foundations',
      description: 'Understanding WCAG standards and designing for accessibility',
      externalLink: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
      estimatedHours: 6,
      level: level1.id,
      orderIndex: 3,
    },
    // Level 2 Courses
    {
      id: 'course-l2-1',
      name: 'Advanced User Research Methods',
      description: 'Deep dive into qualitative and quantitative research techniques',
      externalLink: 'https://www.nngroup.com/courses/',
      estimatedHours: 12,
      level: level2.id,
      orderIndex: 1,
    },
    {
      id: 'course-l2-2',
      name: 'Design Systems Building',
      description: 'Learn to build and maintain scalable design systems',
      externalLink: 'https://www.designsystems.com/',
      estimatedHours: 15,
      level: level2.id,
      orderIndex: 2,
    },
    {
      id: 'course-l2-3',
      name: 'Prototyping and Interaction Design',
      description: 'Advanced prototyping techniques and interaction patterns',
      externalLink: 'https://www.interaction-design.org/',
      estimatedHours: 10,
      level: level2.id,
      orderIndex: 3,
    },
    // Level 3 Courses
    {
      id: 'course-l3-1',
      name: 'Service Design Thinking',
      description: 'Design end-to-end services and customer journeys',
      externalLink: 'https://www.servicedesigntools.org/',
      estimatedHours: 20,
      level: level3.id,
      orderIndex: 1,
    },
    {
      id: 'course-l3-2',
      name: 'Design Leadership Fundamentals',
      description: 'Learn to lead design teams and mentor junior designers',
      externalLink: 'https://www.invisionapp.com/design-leadership-handbook',
      estimatedHours: 12,
      level: level3.id,
      orderIndex: 2,
    },
    {
      id: 'course-l3-3',
      name: 'Strategic UX Planning',
      description: 'Align design work with business objectives and user needs',
      externalLink: 'https://www.uxstrategy.com/',
      estimatedHours: 15,
      level: level3.id,
      orderIndex: 3,
    },
    // Level 4 Courses
    {
      id: 'course-l4-1',
      name: 'Cross-Team Design Operations',
      description: 'Manage design processes across multiple teams and products',
      externalLink: 'https://www.designops.com/',
      estimatedHours: 18,
      level: level4.id,
      orderIndex: 1,
    },
    {
      id: 'course-l4-2',
      name: 'Design Quality Standards',
      description: 'Establish and maintain quality standards at scale',
      externalLink: 'https://www.designquality.org/',
      estimatedHours: 12,
      level: level4.id,
      orderIndex: 2,
    },
    {
      id: 'course-l4-3',
      name: 'Stakeholder Management for Designers',
      description: 'Navigate complex stakeholder relationships and drive alignment',
      externalLink: 'https://www.stakeholdermanagement.com/',
      estimatedHours: 10,
      level: level4.id,
      orderIndex: 3,
    },
    // Level 5 Courses
    {
      id: 'course-l5-1',
      name: 'Design Strategy and Vision',
      description: 'Shape long-term design vision and organizational strategy',
      externalLink: 'https://www.designstrategy.org/',
      estimatedHours: 20,
      level: level5.id,
      orderIndex: 1,
    },
    {
      id: 'course-l5-2',
      name: 'Executive Leadership for Designers',
      description: 'Lead at the executive level and influence organizational culture',
      externalLink: 'https://www.executiveleadership.com/',
      estimatedHours: 15,
      level: level5.id,
      orderIndex: 2,
    },
    {
      id: 'course-l5-3',
      name: 'Design Capability Building',
      description: 'Scale design practice and develop future design leaders',
      externalLink: 'https://www.designcapability.org/',
      estimatedHours: 18,
      level: level5.id,
      orderIndex: 3,
    },
    // Level 6 Courses
    {
      id: 'course-l6-1',
      name: 'Public Service Design Excellence',
      description: 'Transform government services and set public service standards',
      externalLink: 'https://www.gov.uk/service-manual',
      estimatedHours: 25,
      level: level6.id,
      orderIndex: 1,
    },
    {
      id: 'course-l6-2',
      name: 'Cross-Government Transformation',
      description: 'Lead systemic change across agencies and policies',
      externalLink: 'https://www.digitaltransformation.gov/',
      estimatedHours: 20,
      level: level6.id,
      orderIndex: 2,
    },
    {
      id: 'course-l6-3',
      name: 'Design Policy and Standards',
      description: 'Set national design standards and influence policy',
      externalLink: 'https://www.designpolicy.org/',
      estimatedHours: 15,
      level: level6.id,
      orderIndex: 3,
    },
  ];

  // Create all courses and link them to levels
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { id: courseData.id },
      update: {},
      create: {
        id: courseData.id,
        name: courseData.name,
        description: courseData.description,
        externalLink: courseData.externalLink,
        estimatedHours: courseData.estimatedHours,
      },
    });

    // Check if the course-level relationship already exists
    const existingLink = await prisma.schemaLevelCourse.findFirst({
      where: {
        schemaLevelId: courseData.level,
        courseId: course.id
      },
    });

    if (!existingLink) {
      await prisma.schemaLevelCourse.create({
        data: {
          schemaLevelId: courseData.level,
          courseId: course.id,
          isRequired: false,
          orderIndex: courseData.orderIndex,
        },
      });
    }
  }

  console.log('✓ Created courses for all levels');

  console.log('\n✅ Seed data created successfully!');
  console.log('\nDemo Users:');
  console.log('  Staff:   userId=staff-1   (John Staff)');
  console.log('  Manager: userId=manager-1 (Sarah Manager)');
  console.log('  Admin:   userId=admin-1   (Admin User)');
  console.log('\nTo login as a user, use: ?userId=staff-1');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
