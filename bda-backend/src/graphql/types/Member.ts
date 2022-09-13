import {Field, ID, ObjectType} from "type-graphql";
import {Student} from "./Student";

@ObjectType()
export class Member {
    @Field(type => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    picture: string;

    @Field()
    description: string;

    @Field()
    year: number;

    @Field(type => Student)
    student: Student;

    @Field()
    order: number;
}