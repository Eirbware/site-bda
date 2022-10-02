import {Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver} from "type-graphql";
import {GraphqlContext} from "../graphqlContext";
import prismaClient from "../../clients/prismaClient";
import {Member as PrismaMember, Role} from "@prisma/client";
import {Member} from "../types/Member";
import {unlink} from "fs";
import {getMostRecentMember} from "./utils";

@InputType()
class DeleteMemberArgs implements Partial<Member> {
    @Field()
    id: number;
}

@InputType()
class UpdateMemberArgs implements Partial<Member> {
    @Field()
    id: number;

    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    picture?: string;

    @Field({nullable: true})
    description?: string;

    @Field({nullable: true})
    year?: number;

    @Field({nullable: true})
    order?: number;

    @Field({nullable: true})
    role?: Role;
}

@InputType()
class CreateMemberArgs implements Partial<Member> {
    @Field()
    studentId: number;

    @Field()
    title: string;

    @Field()
    picture: string;

    @Field()
    description: string;

    @Field()
    year: number;

    @Field()
    role: Role;
}

@InputType()
class UpdateMemberOrderArgs {
    @Field()
    id: number;

    @Field()
    order: number;
}

@Resolver(Member)
export class MemberResolver {
    @Authorized([Role.ADMIN])
    @Mutation(returns => Boolean!, {nullable: true})
    async deleteMember(@Arg("data") deleteMemberArgs: DeleteMemberArgs): Promise<void> {
        // Delete the picture from the server
        const member: any = await prismaClient.member.findUnique({
            where: {
                id: deleteMemberArgs.id
            }
        });

        if (member) {
            // Delete the picture from disk
            unlink(`public/images/members/${member.picture}`, (err) => {
                if (err) {
                    // Ok, don't care
                }
            });
        }

        await prismaClient.member.delete({
            where: {
                id: deleteMemberArgs.id
            }
        });
    }

    @Authorized([Role.ADMIN])
    @Mutation(of => Member)
    async updateMember(@Arg("data") updateMemberArgs: UpdateMemberArgs): Promise<Member> {
        // Only update what's needed
        const data: any = {};

        if (updateMemberArgs.title) {
            data.title = updateMemberArgs.title;
        }

        if (updateMemberArgs.picture) {
            data.picture = updateMemberArgs.picture;
        }

        if (updateMemberArgs.description) {
            data.description = updateMemberArgs.description;
        }

        if (updateMemberArgs.year) {
            data.year = updateMemberArgs.year;
        }

        if (updateMemberArgs.order) {
            data.order = updateMemberArgs.order;
        }

        const member: any = await prismaClient.member.update({
            where: {
                id: updateMemberArgs.id
            },
            data: data,
            include: {
                student: true
            }
        });

        if (!member) {
            throw new Error(`Member not found`);
        }

        // Update the member's role
        if (updateMemberArgs.role) {
            // Find student associated with this member
            await prismaClient.student.update({
                where: {
                    id: member.studentId
                },
                data: {
                    role: updateMemberArgs.role
                }
            });
        }

        return member;
    }


    @Authorized([Role.ADMIN])
    @Mutation(of => Member)
    async createMember(@Arg("data") createMemberArgs: CreateMemberArgs){
        const student = await prismaClient.student.findUnique({
            where: {
                id: createMemberArgs.studentId
            }
        });

        if (!student) {
            throw new Error(`Student not found`);
        }

        const isMember = await prismaClient.member.findFirst({
            where: {
                studentId: createMemberArgs.studentId,
                year: createMemberArgs.year
            }
        });

        if (isMember) {
            throw new Error(`Étudiant.e déjà membre pour cette année`);
        }

        const member = await prismaClient.member.create({
            data: {
                title: createMemberArgs.title,
                picture: createMemberArgs.picture,
                description: createMemberArgs.description,
                year: createMemberArgs.year,
                student: {
                    connect: {
                        id: createMemberArgs.studentId
                    }
                }
            },
            include: {
                student: true
            }
        });

        if (!member) {
            throw new Error(`Erreur lors de l'opération`);
        }

        return member;
    }

    @Authorized([Role.ADMIN])
    @Mutation(returns => Boolean!, {nullable: true})
    async reorderMembers(@Arg("data", type => [UpdateMemberOrderArgs]) updateMemberOrderArgs: UpdateMemberOrderArgs[]): Promise<void> {
        for (const id of updateMemberOrderArgs) {
            await prismaClient.member.update({
                where: {
                    id: id.id
                },
                data: {
                    order: id.order
                }
            });
        }
    }

    @Query(returns => Member)
    async myMember(@Ctx() context: GraphqlContext) {
        if (!context.user) {
            throw new Error(`User not authenticated`);
        }

        const members = await prismaClient.member.findMany({
            where: {
                id: context.user.id
            },
            include: {
                student: true
            }
        });

        if (!members) {
            throw new Error(`Member not found`);
        }

        return getMostRecentMember(members as PrismaMember[]);
    }

    @Query(returns => [Member])
    async members() {
        const users = await prismaClient.member.findMany({
            include: {
                student: true
            }
        });

        return users || [];
    }

    @Query(returns => Member)
    async member(@Arg("id") id: number) {
        const members = await prismaClient.member.findMany({
            where: {
                id: id
            },
            include: {
                student: true
            }
        });

        if (!members) {
            throw new Error(`Member not found`);
        }

        return getMostRecentMember(members as PrismaMember[]);
    }
}