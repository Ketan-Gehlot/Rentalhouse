const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'gehlotchetan86@gmail.com';
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log(`User with email ${email} not found in the database.`);
    console.log(`Please make sure they have logged into RentMate at least once so their account is created!`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  });
  
  console.log(`Successfully promoted ${email} to ADMIN!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
