import {ArgsDictionary, AuthChecker} from "type-graphql";
import {GraphqlContext} from "./graphqlContext";
import {GraphQLResolveInfo} from "graphql";

/**
 * Custom authentication checker for the Secreteirb GraphQL server.
 *
 * @param root {any} The requested root resource.
 * @param args {ArgsDictionary} The arguments of the query.
 * @param context {GraphqlContext} The context of the request.
 * @param info {GraphQLResolveInfo} The information about the query.
 * @param roles {string[]} The roles that the user must have.
 */
export const graphqlAuthChecker: AuthChecker<GraphqlContext> = async (
    {root, args, context, info},
    roles,
) => {
    // If the user is not logged in, deny the access to the resource
    if (!context.user) {
        return false;
    }

    // Check that the user still exists
    const user = await context.prisma.student.findUnique({
        where: {
            id: context.user.id
        }
    });

    // Handle the case where the user does not exist
    if (!user) {
        return false;
    }

    // If no roles are specified, then the user just has to be logged in
    // Allowed to access the resource
    if (roles.length === 0) {
        return true
    }

    // Check that the user has one of the required roles
    // @ts-ignore
    return roles.some(role => user.role === role);
}