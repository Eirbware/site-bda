import {Request, Response} from "express";
import {Role, Student} from "@prisma/client";
import axios from "axios";
import prisma from "../clients/prismaClient";
import prismaClient from "../clients/prismaClient";

/**
 * Validates a CAS ticket and returns the username of the user who owns the ticket.
 *
 * @param casServerUrl {string} The URL of the CAS server.
 * @param serviceUrl {string} The URL of the reflection service.
 * @param ticket {string} The ticket to validate.
 *
 * @returns {Promise<string | null>} The username of the user who owns the ticket or null if the ticket is invalid.
 */
async function validateCasTicket(casServerUrl: string, serviceUrl: string, ticket: string): Promise<string | null> {
    const response = await axios.get(`${casServerUrl}/serviceValidate?service=${encodeURIComponent(serviceUrl)}&ticket=${ticket}`);
    const body = await response.data;

    return (body.split('<cas:user>')[1] || "").split('</cas:user>')[0] || null;
}

/**
 * Loads the student data from the LDAP server.
 *
 * @param uid {string} The username of the student (ex: "mcaravati" for Matteo Caravati).
 * @param response {Response} The response to send back to the client.
 */
async function loadStudentData(uid: string, response: Response) {
    const handleError = (err: Error) => {
        response.status(500).json({
            success: false,
            error: {
                message: err.message
            }
        });
    }

    return new Promise((resolve, reject) => {
        axios.get(`${process.env.LDAP_PROXY_URL}/uid/${uid}`)
            .then(response => {
                prismaClient.student.create({
                    data: {
                        uid: uid,
                        name: response.data.user.surname, // C'est inversé parce que je sais pas coder mdr
                        surname: response.data.user.name,
                        email: response.data.user.email,
                        role: Role.USER
                    }
                }).then((student: Student) => {
                    resolve(student);
                });
            }).catch(err => {
                handleError(err);
                reject(err);
            });
    });
}

/**
 * Authentication route handler.
 * Authenticates the user and stores the user in the session.
 *
 * @param request {Request} The request object.
 * @param response {Response} The response object.
 */
async function authenticate(request: Request, response: Response): Promise<void> {
    // Handle the case where the user sends a wrong request
    if (!request.query.ticket || !request.query.token) {
        response.status(400).json({
            success: false,
            error: {
                message: 'Missing ticket or token'
            }
        });
        return;
    }

    // Extract the ticket and the token from the request
    const ticket: string = `${request.query.ticket}`;
    const token: string = `${request.query.token}`;
    const [serviceEncoded, domain] = token.split('@');

    // Check that that isn't some nasty hacker
    if (domain !== 'bordeaux-inp.fr') {
        response.status(400).json({
            success: false,
            error: {
                message: 'Invalid CAS server'
            }
        });
        return;
    }

    // Decode the service
    const casServiceUrl = `https://aboin.vvv.enseirb-matmeca.fr/casAuth/?token=${serviceEncoded}@${domain}`;
    const casServerUrl = `https://cas.${domain}`;

    // Validate the ticket
    const username = await validateCasTicket(
        casServerUrl,
        casServiceUrl,
        ticket
    );

    // If the ticket is invalid, return an error
    if (!username) {
        response.status(400).json({
            success: false,
            error: {
                message: 'Invalid CAS ticket'
            }
        });
        return;
    }

    // Get the student from the database
    let student: any = await prisma.student.findUnique({
        where: {
            uid: username
        },
        select: {
            id: true,
            uid: true,
            name: true,
            surname: true,
            email: true,
            role: true
        }
    });

    // If the student hasn't been found
    if (!student) {
        student = await loadStudentData(username, response);

        // If the student couldn't be loaded
        if (!student) {
            return;
        }
    } else {
        student.member = await prisma.member.findFirst({
            where: {
                student: {
                    id: student.id
                }
            }
        });
    }

    // Store the student in the session
    // @ts-ignore
    request.session.user = student;

    response.status(200).json({
        success: true,
        student: student
    });
}

/**
 * Logout route handler.
 * Logs the user out of the session.
 *
 * @param request {Request} The request object.
 * @param response {Response} The response object.
 */
async function logout(request: Request, response: Response): Promise<void> {
    // The user cannot log out if he is not logged in
    // @ts-ignore
    if (!request.session.user) {
        response.status(401)
            .json({
                success: false,
                error: {
                    message: 'User not authenticated'
                }
            });
        return;
    }

    // Destroy the session
    request.session.destroy(error => {
        // Handle the possible errors
        if (error) {
            console.error(error);
            response.status(500).json({
                success: false,
                error: {
                    message: 'Error while logging out'
                }
            });
            return;
        }

        // Inform the client that the user has been logged out
        response.status(200).json({
            success: true,
            message: 'User logged out'
        });
    });
}

export {
    authenticate,
    logout,
};