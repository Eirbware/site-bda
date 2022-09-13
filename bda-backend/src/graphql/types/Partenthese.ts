import {Field, ID, ObjectType} from "type-graphql";
import {Member} from "./Member";
import {PartentheseCategory} from "./PartentheseCategory";

@ObjectType()
export class Partenthese {
    @Field(type => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field()
    year: number;

    @Field(type => Member)
    author: Member;

    @Field(type => PartentheseCategory)
    category: PartentheseCategory;
}