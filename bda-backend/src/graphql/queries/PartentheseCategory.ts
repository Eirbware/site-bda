import {Arg, Authorized, Field, InputType, Mutation, Query, Resolver} from "type-graphql";
import {PartentheseCategory} from "../types/PartentheseCategory";
import {Role} from "@prisma/client";
import prismaClient from "../../clients/prismaClient";

@InputType()
class DeletePartentheseCategoryArgs implements Partial<PartentheseCategory> {
    @Field()
    id: number;
}

@InputType()
class UpdatePartentheseCategoryArgs implements Partial<PartentheseCategory> {
    @Field()
    id: number;

    @Field({nullable: true})
    name: string;
}

@InputType()
class CreatePartentheseCategoryArgs implements Partial<PartentheseCategory> {
    @Field()
    name: string;
}

@Resolver(PartentheseCategory)
export class PartentheseCategoryResolver {
    @Authorized([Role.MEMBER, Role.ADMIN])
    @Mutation(returns => Boolean!, {nullable: true})
    async deletePartentheseCategory(@Arg("id") id: number): Promise<void> {
        // Delete all the partenthese of this category, then delete the category
        await prismaClient.partenthese.deleteMany({
            where: {
                partentheseCategoryId: id
            }
        });

        await prismaClient.partentheseCategory.delete({
            where: {
                id: id
            }
        });
    }

    @Authorized([Role.MEMBER])
    @Mutation(of => PartentheseCategory)
    async updatePartentheseCategoryOrder(@Arg("data") updatePartentheseCategoryArgs: UpdatePartentheseCategoryArgs) {
        return await prismaClient.partentheseCategory.update({
            where: {
                id: updatePartentheseCategoryArgs.id
            },
            data: {
                name: updatePartentheseCategoryArgs.name
            },
            include: {
                partentheses: true
            }
        });
    }

    @Authorized([Role.MEMBER, Role.ADMIN])
    @Mutation(of => PartentheseCategory)
    async createPartentheseCategory(@Arg("name") name: string) {
        return await prismaClient.partentheseCategory.create({
            data: {
                name: name
            },
            include: {
                partentheses: true
            }
        });
    }

    @Query(returns => [PartentheseCategory])
    async partentheseCategories() {
        return await prismaClient.partentheseCategory.findMany({
            include: {
                partentheses: true
            }
        });
    }

    @Query(returns => PartentheseCategory)
    async partentheseCategory(@Arg("id") id: number) {
        return await prismaClient.partentheseCategory.findUnique({
            where: {
                id
            },
            include: {
                partentheses: true
            }
        });
    }
}