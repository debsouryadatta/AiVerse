import { PrismaClient } from "@prisma/client";
import "server-only";
 
declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}

// Creating Prisma client instance for using it with db
export let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) { // looking for if there is already a prisma instance
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}