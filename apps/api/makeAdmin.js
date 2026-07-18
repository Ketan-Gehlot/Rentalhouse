const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clerkUserId = process.argv[2];

  if (!clerkUserId) {
    console.log("Error: You must provide your Clerk User ID!");
    console.log("Usage: node makeAdmin.js <your_clerk_user_id>");
    return;
  }

  const localUser = await prisma.user.findUnique({ where: { id: clerkUserId } });

  if (!localUser) {
     console.log(`Error: User with ID ${clerkUserId} not found in your local database.`);
     console.log(`Please make sure you have logged into the website at least once!`);
     return;
  }

  await prisma.user.update({
    where: { id: clerkUserId },
    data: { role: 'ADMIN' }
  });

  console.log(`Success! The user has been securely promoted to ADMIN!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
