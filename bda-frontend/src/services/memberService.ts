import graphqlClient from "../utils/graphqlClient";
import {gql} from 'graphql-tag';

export function getMyMember() {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                myMember {
                    id
                    title
                    picture
                    description
                    year
                }
            }
        `
        }).then(({data}) => {
            resolve(data.myMember);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getAllMembers() {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                members {
                    id
                    title
                    picture
                    description
                    year
                    order
                    student {
                        name
                        surname
                        uid
                    }
                }
            }
        `
        }).then((response) => {
            resolve(response.data.members);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function createMember(member: any) {
    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation MemberCreation($member: CreateMemberArgs!) {
                createMember(data: $member) {
                    id
                }
            }
        `,
            variables: {
                member: {
                    title: member.title,
                    picture: member.picture,
                    description: member.description,
                    year: member.year,
                    role: member.student.role,
                    studentId: member.studentId
                }
            }
        }).then((response) => {
            resolve(response.data.createMember);
        }).catch((error) => {
            reject(error);
        });
    });
}
export function deleteMember(id: number) {
    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation {
                deleteMember(data: {
                    id: ${id}
                })
            }
        `
        }).then((response) => {
            resolve(response.data.deleteMember);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getMember(id: number) {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                member(id: ${id}) {
                    id
                    title
                    picture
                    description
                    year
                    student {
                        name
                        surname
                        role
                    }
                }
            }
        `
        }).then((response) => {
            resolve(response.data.member);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function updateMember(member: any) {
    const processedMember = {
        id: parseInt(member.id),
        title: member.title,
        picture: member.picture,
        description: member.description,
        year: parseInt(member.year),
        order: parseInt(member.order),
        role: member.student.role
    };

    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation updateMember($data: UpdateMemberArgs!) {
                updateMember(data: $data) {
                    id
                }
            }
        `,
            variables: {
                data: processedMember
            }
        }).then((response) => {
            resolve(response.data.updateMember);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function reorderMembers(members: any) {
    const mappedMembers = members.map((member: any) => {
        return {
            id: parseInt(member.id),
            order: parseInt(member.order)
        };
    });

    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation reorderMembers($members: [UpdateMemberOrderArgs!]!) {
                reorderMembers(data: $members)
            }
        `,
            variables: {
                members: mappedMembers
            }
        }).then((response) => {
            resolve(response.data.reorderMembers);
        }).catch((error) => {
            reject(error);
        });
    });
}