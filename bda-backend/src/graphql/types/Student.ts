import {Field, ID, ObjectType, registerEnumType} from "type-graphql";
import {Role} from "@prisma/client";
import {Member} from "./Member";


@ObjectType()
export class Student {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    surname: string;

    @Field()
    uid: string;

    @Field()
    email: string;

    @Field(() => Role)
    role: Role;

    @Field(type => Member, {
        nullable: true
    })
    member?: Member | null;
}

registerEnumType(Role, {
    name: "Role",
});