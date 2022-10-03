import {Request, Response} from "express";
import prismaClient from "../clients/prismaClient";


async function debug(request: Request, response: Response): Promise<void> {
    const dump: any = {};

    dump.members = await prismaClient.member.findMany();
    dump.students = await prismaClient.student.findMany();

    response.status(200).json(dump);
}

export {
    debug,
};