import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProductPathways() {
  console.log('Seeding Product Manager and Product Ops pathways...');

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    throw new Error('Admin user not found. Please run main seed first.');
  }

  // Create Product Manager pathway
  const pmPathway = await prisma.pathway.upsert({
    where: { id: 'pathway-pm-1' },
    update: {},
    create: {
      id: 'pathway-pm-1',
      name: 'Product Manager Pathway',
      description: 'Professional development pathway for Product Managers',
      createdBy: adminUser.id,
    },
  });

  console.log('✓ Created Product Manager pathway:', pmPathway.name);

  // Create Product Ops pathway
  const poPathway = await prisma.pathway.upsert({
    where: { id: 'pathway-po-1' },
    update: {},
    create: {
      id: 'pathway-po-1',
      name: 'Product Ops Pathway',
      description: 'Professional development pathway for Product Operations specialists',
      createdBy: adminUser.id,
    },
  });

  console.log('✓ Created Product Ops pathway:', poPathway.name);

  // Create schema levels for Product Manager pathway
  const pmFoundation = await prisma.schemaLevel.upsert({
    where: { id: 'level-preschema-pm' },
    update: {},
    create: {
      id: 'level-preschema-pm',
      pathwayId: pmPathway.id,
      levelType: 'PRE_SCHEMA',
      levelOrder: 0,
      name: 'Foundation',
      description: 'Complete these foundational courses before starting your Product Manager journey',
    },
  });

  const pmLevel1 = await prisma.schemaLevel.upsert({
    where: { id: 'level-1-pm' },
    update: {},
    create: {
      id: 'level-1-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_1',
      levelOrder: 1,
      name: 'Product Manager I',
      description: 'Foundation level for Product Managers learning core product management skills',
    },
  });

  const pmLevel2 = await prisma.schemaLevel.upsert({
    where: { id: 'level-2-pm' },
    update: {},
    create: {
      id: 'level-2-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_2',
      levelOrder: 2,
      name: 'Product Manager II',
      description: 'Intermediate level for Product Managers mastering product strategy and execution',
    },
  });

  const pmLevel3 = await prisma.schemaLevel.upsert({
    where: { id: 'level-3-pm' },
    update: {},
    create: {
      id: 'level-3-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_3',
      levelOrder: 3,
      name: 'Senior Product Manager',
      description: 'Senior level for Product Managers leading product strategy and teams',
    },
  });

  const pmLevel4 = await prisma.schemaLevel.upsert({
    where: { id: 'level-4-pm' },
    update: {},
    create: {
      id: 'level-4-pm',
      pathwayId: pmPathway.id,
      levelType: 'LEVEL_4',
      levelOrder: 4,
      name: 'Lead Product Manager',
      description: 'Lead level for Product Managers driving organizational product vision',
    },
  });

  // Create schema levels for Product Ops pathway
  const poFoundation = await prisma.schemaLevel.upsert({
    where: { id: 'level-preschema-po' },
    update: {},
    create: {
      id: 'level-preschema-po',
      pathwayId: poPathway.id,
      levelType: 'PRE_SCHEMA',
      levelOrder: 0,
      name: 'Foundation',
      description: 'Complete these foundational courses before starting your Product Ops journey',
    },
  });

  const poLevel1 = await prisma.schemaLevel.upsert({
    where: { id: 'level-1-po' },
    update: {},
    create: {
      id: 'level-1-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_1',
      levelOrder: 1,
      name: 'Product Ops Specialist (I)',
      description: 'Foundation level for Product Ops specialists learning core operational skills',
    },
  });

  const poLevel2 = await prisma.schemaLevel.upsert({
    where: { id: 'level-2-po' },
    update: {},
    create: {
      id: 'level-2-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_2',
      levelOrder: 2,
      name: 'Product Ops Specialist (II)',
      description: 'Intermediate level for Product Ops specialists mastering operations and processes',
    },
  });

  const poLevel3 = await prisma.schemaLevel.upsert({
    where: { id: 'level-3-po' },
    update: {},
    create: {
      id: 'level-3-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_3',
      levelOrder: 3,
      name: 'Senior Product Ops Specialist',
      description: 'Senior level for Product Ops specialists leading operational excellence',
    },
  });

  const poLevel4 = await prisma.schemaLevel.upsert({
    where: { id: 'level-4-po' },
    update: {},
    create: {
      id: 'level-4-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_4',
      levelOrder: 4,
      name: 'Assistant Director, Product Ops',
      description: 'Lead level for Product Ops driving organizational operational strategy',
    },
  });

  console.log('✓ Created schema levels for both pathways');

  // Product Manager Courses
  const pmCourses = [
    // Foundation
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
    // Level 1
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
    // Level 2
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
    // Level 3
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
      name: 'Architecting Platforms as a Business',
      description: 'Learn platform business architecture',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/tda-architecting-platforms-as-a-business',
      estimatedHours: 15,
      level: pmLevel3.id,
      isRequired: false,
      orderIndex: 2,
    },
    // Level 4
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
  ];

  // Product Ops Courses
  const poCourses = [
    // Foundation
    {
      id: 'course-po-f-1',
      name: 'Product 101 (Product Learning Hub)',
      description: 'Introduction to product fundamentals',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-101-product-learning-hub',
      estimatedHours: 10,
      level: poFoundation.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-po-f-2',
      name: 'Product 201',
      description: 'Advanced introduction to product operations',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/product-201',
      estimatedHours: 12,
      level: poFoundation.id,
      isRequired: true,
      orderIndex: 2,
    },
    // Level 1
    {
      id: 'course-po-l1-1',
      name: 'Mastering Product Operations',
      description: 'Master the fundamentals of product operations',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/mastering-product-operations',
      estimatedHours: 20,
      level: poLevel1.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-po-l1-2',
      name: 'Digital Transformation (Product Operations module)',
      description: 'Digital transformation specific to product ops',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-transformation-product-operations',
      estimatedHours: 15,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 2,
    },
    {
      id: 'course-po-l1-3',
      name: 'Improve Processes and Deliver Operational Excellence (Learning Path)',
      description: 'Learn to improve processes and deliver operational excellence',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/improve-processes-and-deliver-operational-excellence',
      estimatedHours: 25,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 3,
    },
    {
      id: 'course-po-l1-4',
      name: 'Managing Digital Products (MDP)',
      description: 'Managing digital products in an operational context',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/managing-digital---products',
      estimatedHours: 12,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 4,
    },
    // Level 2
    {
      id: 'course-po-l2-1',
      name: 'Mastering Product Operations',
      description: 'Advanced product operations techniques',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/mastering-product-operations',
      estimatedHours: 20,
      level: poLevel2.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-po-l2-2',
      name: 'Digital Transformation (Product Operations module)',
      description: 'Advanced digital transformation for product ops',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-transformation-product-operations',
      estimatedHours: 15,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 2,
    },
    {
      id: 'course-po-l2-3',
      name: 'Digital Products Delivery (DPD)',
      description: 'Learn digital product delivery best practices',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-products-delivery',
      estimatedHours: 18,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 3,
    },
    {
      id: 'course-po-l2-4',
      name: 'Improve Processes and Deliver Operational Excellence (Learning Path)',
      description: 'Advanced process improvement and operational excellence',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/improve-processes-and-deliver-operational-excellence',
      estimatedHours: 25,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 4,
    },
    // Level 3
    {
      id: 'course-po-l3-1',
      name: 'Mastering Product Operations',
      description: 'Expert-level product operations',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/mastering-product-operations',
      estimatedHours: 20,
      level: poLevel3.id,
      isRequired: true,
      orderIndex: 1,
    },
    {
      id: 'course-po-l3-2',
      name: 'Digital Products Delivery (DPD)',
      description: 'Advanced digital product delivery',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-products-delivery',
      estimatedHours: 18,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 2,
    },
    {
      id: 'course-po-l3-3',
      name: 'Digital Product Strategy (DPS)',
      description: 'Strategic digital product planning',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-product--strategy',
      estimatedHours: 18,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 3,
    },
    // Level 4
    {
      id: 'course-po-l4-1',
      name: 'Mastering Product Operations',
      description: 'Leadership-level product operations',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/mastering-product-operations',
      estimatedHours: 20,
      level: poLevel4.id,
      isRequired: true,
      orderIndex: 1,
    },
  ];

  // Create all courses
  for (const courseData of [...pmCourses, ...poCourses]) {
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
        courseId: course.id,
      },
    });

    if (!existingLink) {
      await prisma.schemaLevelCourse.create({
        data: {
          schemaLevelId: courseData.level,
          courseId: course.id,
          isRequired: courseData.isRequired,
          orderIndex: courseData.orderIndex,
        },
      });
    }
  }

  console.log('✓ Created courses for Product Manager and Product Ops pathways');
  console.log('\n✅ Product pathways seed completed successfully!');
}

seedProductPathways()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
