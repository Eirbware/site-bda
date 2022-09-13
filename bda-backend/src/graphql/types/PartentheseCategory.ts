import {Field, ID, ObjectType} from "type-graphql";
import {Partenthese} from "./Partenthese";

@ObjectType()
export class PartentheseCategory {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field(type => [Partenthese])
    partentheses: Partenthese[];
}