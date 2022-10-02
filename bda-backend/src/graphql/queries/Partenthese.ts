import {Arg, Authorized, Ctx, Field, ID, InputType, Mutation, Query, Resolver} from "type-graphql";
import {Partenthese} from "../types/Partenthese";
import {Member, Role} from "@prisma/client";
import prismaClient from "../../clients/prismaClient";
import {GraphqlContext} from "../graphqlContext";

@InputType()
class UpdatePartentheseArgs {
    @Field(() => ID)
    id: string;

    @Field(() => ID, {nullable: true})
    categoryId?: string;

    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    content?: string;
}

@InputType()
class CreatePartentheseArgs implements Partial<Partenthese> {
    @Field()
    title: string;

    @Field()
    content: string;

    @Field()
    categoryId: string;
}

@Resolver(Partenthese)
export class PartentheseResolver {
    @Authorized([Role.MEMBER, Role.ADMIN])
    @Mutation(returns => Boolean!, {nullable: true})
    async deletePartenthese(@Arg("id") id: number): Promise<void> {
        await prismaClient.partenthese.delete({
            where: {
                id: id
            }
        });
    }

    @Authorized([Role.MEMBER, Role.ADMIN])
    @Mutation(of => Partenthese)
    async updatePartenthese(@Ctx() context: GraphqlContext, @Arg("data") updatePartentheseArgs: UpdatePartentheseArgs) {
        const data: any = {};

        if (updatePartentheseArgs.categoryId) {
            data.partentheseCategory = {
                connect: {
                    id: parseInt(updatePartentheseArgs.categoryId)
                }
            }
        }

        if (updatePartentheseArgs.title) {
            data.title = updatePartentheseArgs.title;
        }

        if (updatePartentheseArgs.content) {
            data.content = updatePartentheseArgs.content;
        }

        return prismaClient.partenthese.update({
            where: {
                id: parseInt(updatePartentheseArgs.id)
            },
            data: {
                ...data,
                lastUpdater: {
                    connect: {
                        id: context.user.id
                    }
                }
            },
        });
    }

    @Authorized([Role.MEMBER, Role.ADMIN])
    @Mutation(of => Partenthese)
    async createPartenthese(@Ctx() context: GraphqlContext, @Arg("data") createPartentheseArgs: CreatePartentheseArgs) {
        function isMemberOfCurrentBureau(member: Member): Promise<boolean> {
            return new Promise(async (resolve, reject) => {
                // Find all member's years
                await prismaClient.member.findMany({
                    select: {
                        year: true
                    }
                }).then(members => {
                    if (!members || members.length === 0) {
                        return resolve(false);
                    }

                    // The current member has a year equal or greater than all members
                    return resolve(members.every((m: any) => member.year >= m.year));
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        // Find all members for a given user
        let members: any = await prismaClient.member.findMany({
            where: {
                studentId: context.user.id,
            }
        });

        if (!members || members.length === 0) {
            throw new Error("User is not a member of any year");
        }

        const memberOfCurrentBureau: Member = members.find((m: Member) => isMemberOfCurrentBureau(m));

        return prismaClient.partenthese.create({
            data: {
                title: createPartentheseArgs.title,
                partentheseCategory: {
                    connect: {
                        id: parseInt(createPartentheseArgs.categoryId)
                    }
                },
                content: createPartentheseArgs.content,
                author: {
                    connect: {
                        id: memberOfCurrentBureau.id
                    }
                },
                year: new Date().getFullYear()
            }
        });
    }

    @Query(returns => [Partenthese])
    async partentheses() {
        const partentheses = await prismaClient.partenthese.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                year: true,
                author: {
                    select: {
                        id: true,
                        student: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                            }
                        }
                    }
                },
                partentheseCategory: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return partentheses;
    }

    @Query(returns => Partenthese)
    async partenthese(@Arg("id") id: number) {
        const partenthese = await prismaClient.partenthese.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                year: true,
                partentheseCategory: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                author: {
                    select: {
                        id: true,
                        student: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                            }
                        }
                    }
                }
            }
        });

        return partenthese;
    }

}