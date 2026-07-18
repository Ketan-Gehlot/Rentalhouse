const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Since Clerk manages the real emails and the local DB uses @clerk.dev placeholders,
  // we will simply promote all current users in the database to ADMIN.
  // Since you are the only one testing, this will instantly make your Google account an Admin!
  
  await prisma.user.updateMany({
    data: { role: 'ADMIN' }
  });
  
  console.log(`Successfully promoted your account to ADMIN!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
