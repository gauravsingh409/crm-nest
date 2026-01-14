import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { PERMISSIONS } from 'src/modules/permission/permission';

// 1. Load .env file explicitly before using process.env
config();

// 2. Check if DATABASE_URL is actually loaded
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env');
}

const connectionString = `${process.env.DATABASE_URL}`
export const defaultRole = `${process.env.DEFAULT_ROLE}`


const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


async function main() {
  // 1. Seed permissions
  await prisma.permission.createMany({
    data: Object.values(PERMISSIONS).map((name) => ({ name })),
    skipDuplicates: true,
  });

  // 2. Seed super admin role
  const adminRole = await prisma.role.upsert({
    where: { name: defaultRole },
    update: {},
    create: { name: defaultRole },
  });

  // 3. Assign all permissions to super admin role
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

  console.log('Seeding ');
}

main()
  .catch((e) => {
    console.error(`Error while seeding the value `, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  