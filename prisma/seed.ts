import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { PERMISSIONS } from 'src/constant/permission';
import { SUPER_ADMIN_ROLE } from 'src/constant/role';

config();
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env');
}

const connectionString = `${process.env.DATABASE_URL}`



const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


async function main() {

  await prisma.permission.createMany({
    data: Object.values(PERMISSIONS).map((name) => ({ name })),
    skipDuplicates: true,
  });

  const adminRole = await prisma.role.upsert({
    where: { name: SUPER_ADMIN_ROLE },
    update: {},
    create: { name: SUPER_ADMIN_ROLE },
  });

  const permissions = await prisma.permission.findMany({
    where: {
      name: { in: Object.values(PERMISSIONS) },
    },
  });

  await prisma.rolePermission.createMany({
    data: permissions.map((p) => ({
      roleId: adminRole.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

}
/**
 * ==========================================
 * EXECUTION GUARD
 * ==========================================
 * This block ensures the seeding logic ONLY runs when explicitly executed from the CLI.
 * It prevents the 'main()' function from triggering as a side-effect if this file 
 * is imported by a NestJS Service, Controller, or Module.
 * * ------------------------------------------
 * 1. require.main === module
 * ------------------------------------------
 * Checks if this file is the "Entry Point" of the current Node process.
 * - TRUE:  If you run 'npx ts-node prisma/seed.ts'.
 * - FALSE: If NestJS imports this file to use a constant (like PERMISSIONS).
 * * ------------------------------------------
 * 2. process.argv[1]?.includes('seed.ts')
 * ------------------------------------------
 * Acts as a fallback check against the literal command line arguments.
 * - If you run: npx ts-node prisma/seed.ts
 * process.argv will be: [
 * '/usr/bin/node',
 * '/home/user/project/prisma/seed.ts'  <-- process.argv[1]
 * ]
 * The check returns TRUE because the string contains 'seed.ts'.
 * * - If you run: npm run start:dev (NestJS startup)
 * process.argv[1] will typically be: '/path/to/dist/main.js'
 * The check returns FALSE, skipping the seed execution.
 */
console.log(process.argv)
if (require.main === module || process.argv[1]?.includes('seed.ts')) {

  main()
    .catch((e) => {
      console.error(`Error while seeding the value `, e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });  
}