import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupProductPathways() {
  console.log('Cleaning up Product Manager and Product Ops pathways...');

  // Find Product Manager pathway
  const pmPathway = await prisma.pathway.findFirst({
    where: {
      OR: [
        { name: { contains: 'Product Manager' } },
        { id: 'pathway-pm-1' }
      ]
    },
  });

  if (pmPathway) {
    console.log('Found Product Manager pathway, deleting...');

    // Delete all related data
    await prisma.schemaLevelCourse.deleteMany({
      where: {
        schemaLevel: {
          pathwayId: pmPathway.id
        }
      }
    });
    console.log('  ✓ Deleted schema level courses');

    await prisma.schemaLevel.deleteMany({
      where: { pathwayId: pmPathway.id }
    });
    console.log('  ✓ Deleted schema levels');

    await prisma.course.deleteMany({
      where: {
        id: { startsWith: 'course-pm-' }
      }
    });
    console.log('  ✓ Deleted courses');

    await prisma.pathway.delete({
      where: { id: pmPathway.id }
    });
    console.log('  ✓ Deleted pathway');
  } else {
    console.log('No Product Manager pathway found');
  }

  // Find Product Ops pathway
  const poPathway = await prisma.pathway.findFirst({
    where: {
      OR: [
        { name: { contains: 'Product Ops' } },
        { id: 'pathway-po-1' }
      ]
    },
  });

  if (poPathway) {
    console.log('\nFound Product Ops pathway, deleting...');

    // Delete all related data
    await prisma.schemaLevelCourse.deleteMany({
      where: {
        schemaLevel: {
          pathwayId: poPathway.id
        }
      }
    });
    console.log('  ✓ Deleted schema level courses');

    await prisma.schemaLevel.deleteMany({
      where: { pathwayId: poPathway.id }
    });
    console.log('  ✓ Deleted schema levels');

    await prisma.course.deleteMany({
      where: {
        id: { startsWith: 'course-po-' }
      }
    });
    console.log('  ✓ Deleted courses');

    await prisma.pathway.delete({
      where: { id: poPathway.id }
    });
    console.log('  ✓ Deleted pathway');
  } else {
    console.log('\nNo Product Ops pathway found');
  }

  console.log('\n✅ Cleanup completed!');
}

cleanupProductPathways()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
