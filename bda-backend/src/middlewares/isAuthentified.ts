import {Request, Response} from "express";

/**
 * Checks if the user is authenticated.
 *
 * @param request {Request} The request object.
 * @param response {Response} The response object.
 * @param next {() => void} The next function to continue the request.
 */
export default (request: Request, response: Response, next: () => void) => {
    // If the user is logged in, the request can continue
    // @ts-ignore
    if (request.session.user) {
        next();
    }

    // Otherwise, the user is not authenticated
    return response.status(401).json({
        success: false,
        error: {
            message: 'User not authenticated'
        }
    });
}