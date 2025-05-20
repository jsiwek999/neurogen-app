// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Augment the NodeJS global to hold our PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Reuse existing client if it’s already on `global`
// (prevents exhausting your database connections in dev with hot reloads)
const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
