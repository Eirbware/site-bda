import {PrismaClient, Student} from "@prisma/client";

/**
 * The context used by the Secreteirb GraphQL server.
 */
interface GraphqlContext {
    prisma: PrismaClient;
    user: Student;
}

export {GraphqlContext};