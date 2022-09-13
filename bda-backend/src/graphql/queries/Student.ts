import {Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver} from "type-graphql";
import {Role} from "@prisma/client";
import {Student} from "../types/Student";
import prismaClient from "../../clients/prismaClient";
import {GraphqlContext} from "../graphqlContext";
import redisClient from "../../clients/redisClient";

@InputType()
class DeleteStudentArgs implements Partial<Student> {
    @Field()
    id: number;
}

@InputType()
class CreateStudentArgs implements Partial<Student> {
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
}

@InputType()
class UpdateStudentArgs implements Partial<Student> {
    @Field()
    id: number;

    @Field({nullable: true})
    name?: string;

    @Field({nullable: true})
    surname?: string;

    @Field({nullable: true})
    uid?: string;

    @Field({nullable: true})
    email?: string;
}

@Resolver(Student)
export class StudentResolver {
    @Authorized([Role.ADMIN])
    @Mutation(returns => Boolean!, {nullable: true})
    async deleteStudent(@Arg("data") deleteStudentArgs: DeleteStudentArgs): Promise<void> {
        await prismaClient.member.delete({
            where: {
                studentId: deleteStudentArgs.id
            }
        });

        await prismaClient.student.delete({
            where: {
                id: deleteStudentArgs.id
            }
        });

        // Get all redis keys
        redisClient.keys("*", (err, keys) => {
            if (!keys || err) {
                return;
            }

            keys.forEach(key => {
                // Get the value of each key
                redisClient.get(key, (err, value) => {
                    if (!value || err) {
                        return;
                    }

                    // Deserialize the value
                    const parsedValue = JSON.parse(value);

                    // If no user is connected, skip
                    if (!parsedValue.user) {
                        return;
                    }

                    // If the user is the one we want to delete, delete the key
                    if (parsedValue.user.id === deleteStudentArgs.id) {
                        redisClient.del(key);
                    }
                });
            });
        });
    }

    @Authorized([Role.ADMIN])
    @Mutation(of => Student)
    async createStudent(@Arg("data") createStudentArgs: CreateStudentArgs): Promise<Student> {
        const student = await prismaClient.student.create({
            data: {
                name: createStudentArgs.name,
                surname: createStudentArgs.surname,
                uid: createStudentArgs.uid,
                email: createStudentArgs.email,
                role: createStudentArgs.role
            }
        });

        if (!student) {
            throw new Error("Student not created");
        }

        return student;
    }

    @Authorized([Role.ADMIN])
    @Mutation(of => Student)
    async updateStudent(@Arg("data") updateStudentArgs: UpdateStudentArgs): Promise<Student> {
        const data: any = {};

        if (updateStudentArgs.name) {
            data.name = updateStudentArgs.name;
        }

        if (updateStudentArgs.surname) {
            data.surname = updateStudentArgs.surname;
        }

        if (updateStudentArgs.uid) {
            data.uid = updateStudentArgs.uid;
        }

        if (updateStudentArgs.email) {
            data.email = updateStudentArgs.email;
        }

        return await prismaClient.student.update({
            where: {
                id: updateStudentArgs.id
            },
            data: {
                ...data
            }
        });
    }

    @Query(returns => Student)
    async myStudent(@Ctx() context: GraphqlContext) {
        if (!context.user) {
            throw new Error("User not authenticated");
        }

        const student = await prismaClient.student.findUnique({
            where: {
                id: context.user.id
            },
            include: {
                member: true
            }
        });

        if (!student) {
            throw new Error(`Student not found`);
        }

        return student;
    }

    @Query(returns => [Student])
    async students() {
        return await prismaClient.student.findMany({
            include: {
                member: true
            }
        });
    }

    @Query(returns => Student)
    async student(@Arg("id") id: number) {
        return await prismaClient.student.findUnique({
            where: {
                id
            },
            include: {
                member: true
            }
        });
    }

    @Query(returns => Student)
    async studentByUid(@Arg("uid") uid: string) {
        return await prismaClient.student.findUnique({
            where: {
                uid
            },
            include: {
                member: true
            }
        });
    }
}


