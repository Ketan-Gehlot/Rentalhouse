const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.property.updateMany({
    where: { status: 'DRAFT' },
    data: { status: 'ACTIVE' }
  });
  console.log('All DRAFT properties updated to ACTIVE');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
