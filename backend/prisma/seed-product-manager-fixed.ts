import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProductManager() {
  console.log('Seeding Product Manager pathway (FIXED)...');

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    throw new Error('Admin user not found. Please run main seed first.');
  }

  // Delete existing PM pathway if it exists
  const existingPM = await prisma.pathway.findFirst({
    where: { name: 'Product Manager Pathway' },
  });

  if (existingPM) {
    console.log('Deleting existing Product Manager pathway...');
    // Delete related records first
    await prisma.schemaLevelCourse.deleteMany({
      where: {
        schemaLevel: {
          pathwayId: existingPM.id
        }
      }
    });
    await prisma.schemaLevel.deleteMany({
      where: { pathwayId: existingPM.id }
    });
    await prisma.course.deleteMany({
      where: {
        id: { startsWith: 'course-pm-' }
      }
    });
    await prisma.pathway.delete({
      where: { id: existingPM.id }
    });
  }

  // Create Product Manager pathway
  const pmPathway = await prisma.pathway.create({
    data: {
      id: 'pathway-pm-1',
      name: 'Product Manager Pathway',
      description: 'Professional development pathway for Product Managers',
      createdBy: adminUser.id,
    },
  });

  console.log('✓ Created Product Manager pathway:', pmPathway.name);

  // Create schema levels
  const pmFoundation = await prisma.schemaLevel.create({
    data: {
      id: 'level-preschema-pm',
      pathwayId: pmPathway.id,
      levelType: 'PRE_SCHEMA',
      levelOrder: 0,
      name: 'Foundation',
      description: 'Complete these foundational courses before starting your Product Manager journey',
    },
  });

  const pmLevel1 = await prisma.schemaLevel.create({
    data: {
      id: 'level-1-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_1',
      levelOrder: 1,
      name: 'Product Manager I',
      description: 'Foundation level for Product Managers learning core product management skills',
    },
  });

  const pmLevel2 = await prisma.schemaLevel.create({
    data: {
      id: 'level-2-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_2',
      levelOrder: 2,
      name: 'Product Manager II',
      description: 'Intermediate level for Product Managers mastering product strategy and execution',
    },
  });

  const pmLevel3 = await prisma.schemaLevel.create({
    data: {
      id: 'level-3-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_3',
      levelOrder: 3,
      name: 'Senior Product Manager',
      description: 'Senior level for Product Managers leading product strategy and teams',
    },
  });

  const pmLevel4 = await prisma.schemaLevel.create({
    data: {
      id: 'level-4-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_4',
      levelOrder: 4,
      name: 'Lead Product Manager',
      description: 'Lead level for Product Managers driving organizational product vision',
    },
  });

  console.log('✓ Created schema levels');

  // Product Manager Courses - ALL courses from Excel
  const pmCourses = [
    // Foundation - 2 Core
    {
      id: 'course-pm-f-1',
      name: 'Product 101 (Product Learning Hub)',
      description: 'Introduction to product management fundamentals',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-101-product-learning-hub',
      estimatedHours: 10,
      level: pmFoundation.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-pm-f-2',
      name: 'Product 201',
      description: 'Advanced introduction to product management',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-201',
      estimatedHours: 12,
      level: pmFoundation.id,
      isRequired: true,
      orderIndex: 2,
    },
    // Level 1 - 4 Core, 4 Elective
    {
      id: 'course-pm-l1-1',
      name: 'Product Management Basics Certification',
      description: 'Core certification for product management basics',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-management-basics-certification',
      estimatedHours: 20,
      level: pmLevel1.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-pm-l1-2',
      name: 'Reforge: Product Foundations',
      description: 'Foundational product management skills from Reforge',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-foundations',
      estimatedHours: 15,
      level: pmLevel1.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-pm-l1-3',
      name: 'AI for Product Management Course',
      description: 'Learn how AI impacts product management',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/ai-for-product-management-course',
      estimatedHours: 10,
      level: pmLevel1.id,
      isRequired: true,
      orderIndex: 3,
    },
    {
      id: 'course-pm-l1-4',
      name: 'IBM Product Manager Professional Certificate',
      description: 'Professional certificate from IBM for product managers',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/ibm-product-manager-professional-certificate',
      estimatedHours: 25,
      level: pmLevel1.id,
      isRequired: true,
      orderIndex: 4,
    },
    {
      id: 'course-pm-l1-5',
      name: 'Managing Digital Products',
      description: 'Learn to manage digital products effectively',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/managing-digital---products',
      estimatedHours: 12,
      level: pmLevel1.id,
      isRequired: false,
      orderIndex: 5,
    },
    {
      id: 'course-pm-l1-6',
      name: 'Digital Product Management Bootcamp',
      description: 'Intensive bootcamp for digital product management',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/tda-digital-product-management-bootcamp',
      estimatedHours: 40,
      level: pmLevel1.id,
      isRequired: false,
      orderIndex: 6,
    },
    {
      id: 'course-pm-l1-7',
      name: 'Product Management Mastery: From Idea to Execution (2026)',
      description: 'Comprehensive product management course',
      externalLink: '',
      estimatedHours: 30,
      level: pmLevel1.id,
      isRequired: false,
      orderIndex: 7,
    },
    {
      id: 'course-pm-l1-8',
      name: 'Become a Product Manager: Learn the Skills & Get the Job',
      description: 'Career-focused product management training',
      externalLink: '',
      estimatedHours: 25,
      level: pmLevel1.id,
      isRequired: false,
      orderIndex: 8,
    },
    // Level 2 - 2 Core, 5 Elective
    {
      id: 'course-pm-l2-1',
      name: 'Reforge: Mastering Product Management',
      description: 'Master advanced product management techniques',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/mastering-product-management',
      estimatedHours: 20,
      level: pmLevel2.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-pm-l2-2',
      name: 'AI Strategy',
      description: 'Strategic approach to AI in product development',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/ai-strategy',
      estimatedHours: 15,
      level: pmLevel2.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-pm-l2-3',
      name: 'Digital Product Strategy (DPS)',
      description: 'Develop comprehensive digital product strategies',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-product--strategy',
      estimatedHours: 18,
      level: pmLevel2.id,
      isRequired: false,
      orderIndex: 3,
    },
    {
      id: 'course-pm-l2-4',
      name: 'Reforge: Mastering Experimentation',
      description: 'Advanced experimentation techniques for product managers',
      externalLink: '',
      estimatedHours: 15,
      level: pmLevel2.id,
      isRequired: false,
      orderIndex: 4,
    },
    {
      id: 'course-pm-l2-5',
      name: 'Reforge: Mastering Product Analytics',
      description: 'Deep dive into product analytics and metrics',
      externalLink: '',
      estimatedHours: 15,
      level: pmLevel2.id,
      isRequired: false,
      orderIndex: 5,
    },
    {
      id: 'course-pm-l2-6',
      name: 'NTU PACE: SCTP Advanced Professional Certificate in Product Management for AI & Digital Finance',
      description: 'Advanced professional certificate focusing on AI and digital finance',
      externalLink: '',
      estimatedHours: 40,
      level: pmLevel2.id,
      isRequired: false,
      orderIndex: 6,
    },
    {
      id: 'course-pm-l2-7',
      name: 'SMU Product Management Programme (AI-Integrated)',
      description: 'AI-integrated product management program from SMU',
      externalLink: '',
      estimatedHours: 35,
      level: pmLevel2.id,
      isRequired: false,
      orderIndex: 7,
    },
    // Level 3 - 2 Core, 3 Elective
    {
      id: 'course-pm-l3-1',
      name: 'Reforge: Product Strategy',
      description: 'Advanced product strategy from Reforge',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-strategy',
      estimatedHours: 20,
      level: pmLevel3.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-pm-l3-2',
      name: 'AI Product Strategy Course',
      description: 'Strategic AI implementation in product development',
      externalLink: '',
      estimatedHours: 18,
      level: pmLevel3.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-pm-l3-3',
      name: 'Reforge: Mastering Product Analytics',
      description: 'Advanced product analytics techniques',
      externalLink: '',
      estimatedHours: 15,
      level: pmLevel3.id,
      isRequired: false,
      orderIndex: 3,
    },
    {
      id: 'course-pm-l3-4',
      name: 'Reforge: Mastering Experimentation',
      description: 'Advanced experimentation and testing strategies',
      externalLink: '',
      estimatedHours: 15,
      level: pmLevel3.id,
      isRequired: false,
      orderIndex: 4,
    },
    {
      id: 'course-pm-l3-5',
      name: 'Architecting Platforms as a Business',
      description: 'Learn platform business architecture',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/tda-architecting-platforms-as-a-business',
      estimatedHours: 15,
      level: pmLevel3.id,
      isRequired: false,
      orderIndex: 5,
    },
    // Level 4 - 1 Core, 4 Elective
    {
      id: 'course-pm-l4-1',
      name: 'Reforge: Product Strategy',
      description: 'Advanced product strategy for senior leaders',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-strategy',
      estimatedHours: 20,
      level: pmLevel4.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-pm-l4-2',
      name: 'Reforge: Mastering Experimentation',
      description: 'Leadership-level experimentation strategies',
      externalLink: '',
      estimatedHours: 15,
      level: pmLevel4.id,
      isRequired: false,
      orderIndex: 2,
    },
    {
      id: 'course-pm-l4-3',
      name: 'Reforge: Mastering Product Analytics',
      description: 'Leadership-level product analytics',
      externalLink: '',
      estimatedHours: 15,
      level: pmLevel4.id,
      isRequired: false,
      orderIndex: 3,
    },
    {
      id: 'course-pm-l4-4',
      name: 'Reforge: Building Products with Network Effects',
      description: 'Building scalable products with network effects',
      externalLink: '',
      estimatedHours: 18,
      level: pmLevel4.id,
      isRequired: false,
      orderIndex: 4,
    },
    {
      id: 'course-pm-l4-5',
      name: 'AI Evals Certification',
      description: 'Certification in AI evaluation and assessment',
      externalLink: '',
      estimatedHours: 20,
      level: pmLevel4.id,
      isRequired: false,
      orderIndex: 5,
    },
  ];

  // Create all courses
  for (const courseData of pmCourses) {
    const course = await prisma.course.create({
      data: {
        id: courseData.id,
        name: courseData.name,
        description: courseData.description,
        externalLink: courseData.externalLink,
        estimatedHours: courseData.estimatedHours,
      },
    });

    await prisma.schemaLevelCourse.create({
      data: {
        schemaLevelId: courseData.level,
        courseId: course.id,
        isRequired: courseData.isRequired,
        orderIndex: courseData.orderIndex,
      },
    });
  }

  console.log('✓ Created all Product Manager courses');

  // Verify counts
  console.log('\nVerifying course counts:');
  const levels = [
    { level: pmFoundation, name: 'Foundation' },
    { level: pmLevel1, name: 'Level 1' },
    { level: pmLevel2, name: 'Level 2' },
    { level: pmLevel3, name: 'Level 3' },
    { level: pmLevel4, name: 'Level 4' },
  ];

  for (const { level, name } of levels) {
    const coreCount = await prisma.schemaLevelCourse.count({
      where: { schemaLevelId: level.id, isRequired: true }
    });
    const electiveCount = await prisma.schemaLevelCourse.count({
      where: { schemaLevelId: level.id, isRequired: false }
    });
    console.log(`  ${name}: ${coreCount} Core, ${electiveCount} Elective`);
  }

  console.log('\n✅ Product Manager pathway seed completed successfully!');
}

seedProductManager()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
