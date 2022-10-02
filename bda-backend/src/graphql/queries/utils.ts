import prismaClient from "../../clients/prismaClient";
import {Member} from "@prisma/client";

export async function studentGetMostRecentMember(student: any) {
    let member = student.member;

    if (member === undefined) {
        member = await prismaClient.member.findMany({
            where: {
                studentId: student.id
            }
        });
    }

    return getMostRecentMember(member);
}

export function getMostRecentMember(members: Member[]) {
    // Sort members by year descending
    members.sort((a, b) => b.year - a.year);

    return members[0];
}