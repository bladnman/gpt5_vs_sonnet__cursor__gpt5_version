import {PrismaClient} from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  return global.prisma;
}

export const prisma = getPrismaClient();
