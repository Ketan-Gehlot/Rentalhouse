import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { email: { endsWith: '@clerk.dev' } },
    data: { email: 'mandrisk371@gmail.com' } // Using their admin email
  });
  console.log(`Fixed ${result.count} dummy emails!`);
}
main();
