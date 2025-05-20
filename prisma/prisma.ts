// prisma/prisma.ts
import { PrismaClient } from '@prisma/client'
import type { PrismaClient as PrismaClientType } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined
}

const client: PrismaClientType = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client
}

export default client
