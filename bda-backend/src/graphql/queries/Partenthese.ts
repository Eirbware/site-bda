import {Arg, Authorized, Ctx, Field, ID, InputType, Mutation, Query, Resolver} from "type-graphql";
import {Partenthese} from "../types/Partenthese";
import {Role} from "@prisma/client";
import prismaClient from "../../clients/prismaClient";
import {PartentheseCategory} from "../types/PartentheseCategory";
import {GraphqlContext} from "../graphqlContext";

@InputType()
class UpdatePartentheseArgs implements Partial<Partenthese> {
    @Field(() => ID)
    id: number;

    @Field(() => ID, {nullable: true})
    categoryId?: number;

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
    async updatePartentheseOrder(@Arg("data") updatePartentheseArgs: UpdatePartentheseArgs) {
        const data: any = {};

        if (updatePartentheseArgs.categoryId) {
            data.partentheseCategoryId = updatePartentheseArgs.categoryId;
        }

        if (updatePartentheseArgs.title) {
            data.title = updatePartentheseArgs.title;
        }

        if (updatePartentheseArgs.content) {
            data.content = updatePartentheseArgs.content;
        }

        return await prismaClient.partenthese.update({
            where: {
                id: updatePartentheseArgs.id
            },
            data: data,
        });
    }

    @Authorized([Role.MEMBER, Role.ADMIN])
    @Mutation(of => Partenthese)
    async createPartenthese(@Ctx() context: GraphqlContext, @Arg("data") createPartentheseArgs: CreatePartentheseArgs) {
        // Get associated member
        const member = await prismaClient.member.findUnique({
            where: {
                studentId: context.user.id
            }
        });

        return await prismaClient.partenthese.create({
            data: {
                title: createPartentheseArgs.title,
                content: createPartentheseArgs.content,
                partentheseCategoryId: parseInt(createPartentheseArgs.categoryId),
                // @ts-ignore
                authorId: member.id,
                year: new Date().getFullYear()
            },
        });
    }

    @Query(returns => [Partenthese])
    async partentheses() {
        return await prismaClient.partenthese.findMany({
            include: {
                author: true,
                PartentheseCategory: true
            }
        });
    }

}