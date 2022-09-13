import {PrismaClient} from '@prisma/client';

// Create a new prisma client
const prisma = new PrismaClient();

// Connect to the database
(async () => {
    await prisma.$connect();
    console.log("[*] Connected to Prisma");
})();

// Export a singleton instance of PrismaClient
export default prisma;