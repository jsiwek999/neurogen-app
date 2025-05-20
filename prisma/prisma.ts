// lib/prisma.ts

import PrismaPkg from '@prisma/client';
const { PrismaClient } = PrismaPkg;


// Prevent multiple instances in dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
