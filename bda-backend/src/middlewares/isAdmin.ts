import {Request, Response} from "express";
import {Role} from "@prisma/client";

/**
 * Checks if the user is authenticated.
 *
 * @param request {Request} The request object.
 * @param response {Response} The response object.
 * @param next {() => void} The next function to continue the request.
 */
export default (request: Request, response: Response, next: () => void) => {
    // @ts-ignore
    if (request.session.user.role === Role.ADMIN) {
        next();
    }
}