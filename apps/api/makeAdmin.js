require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { users } = require('@clerk/clerk-sdk-node');

const prisma = new PrismaClient();

async function main() {
  const targetEmail = 'gehlotchetan86@gmail.com';
  console.log(`Looking up exact email: ${targetEmail} in Clerk Auth...`);

  try {
    // 1. Ask Clerk Auth to find the user by their real email
    const userList = await users.getUserList({ emailAddress: [targetEmail] });
    
    if (!userList || userList.length === 0) {
      console.log(`Error: User with email ${targetEmail} not found in Clerk!`);
      console.log(`Please make sure you have signed up and logged in with this exact email.`);
      return;
    }

    const clerkUserId = userList[0].id;
    console.log(`Found Clerk User ID: ${clerkUserId}`);

    // 2. Now that we have the real ID, find them in your local PostgreSQL database
    const localUser = await prisma.user.findUnique({ where: { id: clerkUserId } });

    if (!localUser) {
       console.log(`Error: User was found in Clerk, but not in your local database yet.`);
       console.log(`Please log in with this email and click on your Profile page to sync the account, then run this script again.`);
       return;
    }

    // 3. Promote ONLY this exact user to ADMIN
    await prisma.user.update({
      where: { id: clerkUserId },
      data: { role: 'ADMIN' }
    });

    console.log(`Success! ONLY ${targetEmail} has been promoted to ADMIN!`);

  } catch (error) {
    console.error("Error occurred:", error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
