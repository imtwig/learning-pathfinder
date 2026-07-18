import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProductOps() {
  console.log('Seeding Product Ops pathway (FIXED)...');

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    throw new Error('Admin user not found. Please run main seed first.');
  }

  // Delete existing PO pathway if it exists
  const existingPO = await prisma.pathway.findFirst({
    where: { name: 'Product Ops Pathway' },
  });

  if (existingPO) {
    console.log('Deleting existing Product Ops pathway...');
    // Delete related records first
    await prisma.schemaLevelCourse.deleteMany({
      where: {
        schemaLevel: {
          pathwayId: existingPO.id
        }
      }
    });
    await prisma.schemaLevel.deleteMany({
      where: { pathwayId: existingPO.id }
    });
    await prisma.course.deleteMany({
      where: {
        id: { startsWith: 'course-po-' }
      }
    });
    await prisma.pathway.delete({
      where: { id: existingPO.id }
    });
  }

  // Create Product Ops pathway
  const poPathway = await prisma.pathway.create({
    data: {
      id: 'pathway-po-1',
      name: 'Product Ops Pathway',
      description: 'Professional development pathway for Product Operations specialists',
      createdBy: adminUser.id,
    },
  });

  console.log('✓ Created Product Ops pathway:', poPathway.name);

  // Create schema levels
  const poFoundation = await prisma.schemaLevel.create({
    data: {
      id: 'level-preschema-po',
      pathwayId: poPathway.id,
      levelType: 'PRE_SCHEMA',
      levelOrder: 0,
      name: 'Foundation',
      description: 'Complete these foundational courses before starting your Product Ops journey',
    },
  });

  const poLevel1 = await prisma.schemaLevel.create({
    data: {
      id: 'level-1-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_1',
      levelOrder: 1,
      name: 'Product Ops Specialist (I)',
      description: 'Foundation level for Product Ops specialists learning core operational skills',
    },
  });

  const poLevel2 = await prisma.schemaLevel.create({
    data: {
      id: 'level-2-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_2',
      levelOrder: 2,
      name: 'Product Ops Specialist (II)',
      description: 'Intermediate level for Product Ops specialists mastering operations and processes',
    },
  });

  const poLevel3 = await prisma.schemaLevel.create({
    data: {
      id: 'level-3-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_3',
      levelOrder: 3,
      name: 'Senior Product Ops Specialist',
      description: 'Senior level for Product Ops specialists leading operational excellence',
    },
  });

  const poLevel4 = await prisma.schemaLevel.create({
    data: {
      id: 'level-4-po',
      pathwayId: poPathway.id,
      levelType: 'LEVEL_4',
      levelOrder: 4,
      name: 'Assistant Director, Product Ops',
      description: 'Lead level for Product Ops driving organizational operational strategy',
    },
  });

  console.log('✓ Created schema levels');

  // Product Ops Courses - ALL courses from Excel
  const poCourses = [
    // Foundation - 2 Core
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
    // Level 1 - 3 Core, 6 Elective
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
      name: 'Prod Ops: 101 — Getting Started with Product Operations',
      description: 'Getting started with product operations fundamentals',
      externalLink: '',
      estimatedHours: 12,
      level: poLevel1.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-po-l1-3',
      name: 'Prod Ops: 101 — Craft Module',
      description: 'Craft module for product operations',
      externalLink: '',
      estimatedHours: 10,
      level: poLevel1.id,
      isRequired: true,
      orderIndex: 3,
    },
    {
      id: 'course-po-l1-4',
      name: 'Product Management Programme (with AI)',
      description: 'AI-integrated product management program',
      externalLink: '',
      estimatedHours: 30,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 4,
    },
    {
      id: 'course-po-l1-5',
      name: 'Digital Transformation (Product Operations module)',
      description: 'Digital transformation specific to product ops',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-transformation-product-operations',
      estimatedHours: 15,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 5,
    },
    {
      id: 'course-po-l1-6',
      name: 'Data-Driven Product Management',
      description: 'Learn data-driven approaches to product management',
      externalLink: '',
      estimatedHours: 12,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 6,
    },
    {
      id: 'course-po-l1-7',
      name: 'Improve Processes and Deliver Operational Excellence (Learning Path)',
      description: 'Learn to improve processes and deliver operational excellence',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/improve-processes-and-deliver-operational-excellence',
      estimatedHours: 25,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 7,
    },
    {
      id: 'course-po-l1-8',
      name: 'Introduction to KPIs: Measuring Success in Business',
      description: 'Introduction to key performance indicators',
      externalLink: '',
      estimatedHours: 10,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 8,
    },
    {
      id: 'course-po-l1-9',
      name: 'Managing Digital Products (MDP)',
      description: 'Managing digital products in an operational context',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/managing-digital---products',
      estimatedHours: 12,
      level: poLevel1.id,
      isRequired: false,
      orderIndex: 9,
    },
    // Level 2 - 3 Core, 7 Elective
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
      name: 'Product Operations Certified: Core',
      description: 'Core certification for product operations',
      externalLink: '',
      estimatedHours: 18,
      level: poLevel2.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-po-l2-3',
      name: 'Product Management Programme (with AI)',
      description: 'AI-integrated product management program',
      externalLink: '',
      estimatedHours: 30,
      level: poLevel2.id,
      isRequired: true,
      orderIndex: 3,
    },
    {
      id: 'course-po-l2-4',
      name: 'Advanced Certificate in Product Management Essentials',
      description: 'Advanced certificate in product management essentials',
      externalLink: '',
      estimatedHours: 25,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 4,
    },
    {
      id: 'course-po-l2-5',
      name: 'Digital Transformation (Product Operations module)',
      description: 'Advanced digital transformation for product ops',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-transformation-product-operations',
      estimatedHours: 15,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 5,
    },
    {
      id: 'course-po-l2-6',
      name: 'Digital Products Delivery (DPD)',
      description: 'Learn digital product delivery best practices',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-products-delivery',
      estimatedHours: 18,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 6,
    },
    {
      id: 'course-po-l2-7',
      name: 'Agile Digital Product Management: Strategy to Launch',
      description: 'Agile approaches to digital product management',
      externalLink: '',
      estimatedHours: 20,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 7,
    },
    {
      id: 'course-po-l2-8',
      name: 'Data-Driven Product Management',
      description: 'Advanced data-driven product management',
      externalLink: '',
      estimatedHours: 12,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 8,
    },
    {
      id: 'course-po-l2-9',
      name: 'Improve Processes and Deliver Operational Excellence (Learning Path)',
      description: 'Advanced process improvement and operational excellence',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/improve-processes-and-deliver-operational-excellence',
      estimatedHours: 25,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 9,
    },
    {
      id: 'course-po-l2-10',
      name: 'Introduction to KPIs: Measuring Success in Business',
      description: 'Advanced KPIs and metrics',
      externalLink: '',
      estimatedHours: 10,
      level: poLevel2.id,
      isRequired: false,
      orderIndex: 10,
    },
    // Level 3 - 4 Core, 8 Elective
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
      name: 'Product Operations Certified: Masters',
      description: 'Master certification for product operations',
      externalLink: '',
      estimatedHours: 25,
      level: poLevel3.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-po-l3-3',
      name: 'Professional Certificate in Digital Product Management',
      description: 'Professional certificate in digital product management',
      externalLink: '',
      estimatedHours: 30,
      level: poLevel3.id,
      isRequired: true,
      orderIndex: 3,
    },
    {
      id: 'course-po-l3-4',
      name: 'Product Operations Certified: Core',
      description: 'Core certification for senior product operations',
      externalLink: '',
      estimatedHours: 18,
      level: poLevel3.id,
      isRequired: true,
      orderIndex: 4,
    },
    {
      id: 'course-po-l3-5',
      name: 'Product Operations and Infrastructure',
      description: 'Learn product operations infrastructure',
      externalLink: '',
      estimatedHours: 15,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 5,
    },
    {
      id: 'course-po-l3-6',
      name: 'Product Operating Model and Business Transformation',
      description: 'Product operating models and transformation',
      externalLink: '',
      estimatedHours: 20,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 6,
    },
    {
      id: 'course-po-l3-7',
      name: 'Product Management Programme (with AI)',
      description: 'Advanced AI-integrated product management',
      externalLink: '',
      estimatedHours: 30,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 7,
    },
    {
      id: 'course-po-l3-8',
      name: 'Digital Products Delivery (DPD)',
      description: 'Advanced digital product delivery',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-products-delivery',
      estimatedHours: 18,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 8,
    },
    {
      id: 'course-po-l3-9',
      name: 'Agile Digital Product Management: Strategy to Launch',
      description: 'Advanced agile product management',
      externalLink: '',
      estimatedHours: 20,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 9,
    },
    {
      id: 'course-po-l3-10',
      name: 'Data-Driven Product Management',
      description: 'Expert-level data-driven product management',
      externalLink: '',
      estimatedHours: 12,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 10,
    },
    {
      id: 'course-po-l3-11',
      name: 'Facilitating and Leading Cross-Functional Collaboration',
      description: 'Leading cross-functional teams',
      externalLink: '',
      estimatedHours: 15,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 11,
    },
    {
      id: 'course-po-l3-12',
      name: 'Digital Product Strategy (DPS)',
      description: 'Strategic digital product planning',
      externalLink: 'https://www.thedigitalacademy.tech.gov.sg/course/detail/digital-product--strategy',
      estimatedHours: 18,
      level: poLevel3.id,
      isRequired: false,
      orderIndex: 12,
    },
    // Level 4 - 3 Core, 6 Elective
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
    {
      id: 'course-po-l4-2',
      name: 'Product Operating Model and Business Transformation',
      description: 'Leadership-level operating models',
      externalLink: '',
      estimatedHours: 20,
      level: poLevel4.id,
      isRequired: true,
      orderIndex: 2,
    },
    {
      id: 'course-po-l4-3',
      name: 'Product Strategy (Advanced)',
      description: 'Advanced product strategy for leaders',
      externalLink: '',
      estimatedHours: 22,
      level: poLevel4.id,
      isRequired: true,
      orderIndex: 3,
    },
    {
      id: 'course-po-l4-4',
      name: 'Product Operations Certification (3-course series: Foundations + Insight + Product Operations)',
      description: 'Comprehensive product operations certification series',
      externalLink: '',
      estimatedHours: 40,
      level: poLevel4.id,
      isRequired: false,
      orderIndex: 4,
    },
    {
      id: 'course-po-l4-5',
      name: 'Product Operations Certified: Masters',
      description: 'Master certification for leadership',
      externalLink: '',
      estimatedHours: 25,
      level: poLevel4.id,
      isRequired: false,
      orderIndex: 5,
    },
    {
      id: 'course-po-l4-6',
      name: 'Systems Thinking Certificate',
      description: 'Systems thinking for product operations',
      externalLink: '',
      estimatedHours: 18,
      level: poLevel4.id,
      isRequired: false,
      orderIndex: 6,
    },
    {
      id: 'course-po-l4-7',
      name: 'Leading Organizational Change',
      description: 'Leading organizational transformation',
      externalLink: '',
      estimatedHours: 16,
      level: poLevel4.id,
      isRequired: false,
      orderIndex: 7,
    },
    {
      id: 'course-po-l4-8',
      name: 'Digital Transformation Strategies for Leaders',
      description: 'Digital transformation leadership',
      externalLink: '',
      estimatedHours: 18,
      level: poLevel4.id,
      isRequired: false,
      orderIndex: 8,
    },
    {
      id: 'course-po-l4-9',
      name: 'Facilitating and Leading Cross-Functional Collaboration',
      description: 'Leadership-level cross-functional collaboration',
      externalLink: '',
      estimatedHours: 15,
      level: poLevel4.id,
      isRequired: false,
      orderIndex: 9,
    },
  ];

  // Create all courses
  for (const courseData of poCourses) {
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

  console.log('✓ Created all Product Ops courses');

  // Verify counts
  console.log('\nVerifying course counts:');
  const levels = [
    { level: poFoundation, name: 'Foundation' },
    { level: poLevel1, name: 'Level 1' },
    { level: poLevel2, name: 'Level 2' },
    { level: poLevel3, name: 'Level 3' },
    { level: poLevel4, name: 'Level 4' },
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

  console.log('\n✅ Product Ops pathway seed completed successfully!');
}

seedProductOps()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
