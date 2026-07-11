import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { name: 'Ketan' },
    data: { role: 'ADMIN' }
  });
  console.log("Successfully updated to ADMIN.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
