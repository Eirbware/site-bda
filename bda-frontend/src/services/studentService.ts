import graphqlClient from "../utils/graphqlClient";
import {gql} from 'graphql-tag';
import axios from "axios";

export function getMyStudent() {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                myStudent {
                    id
                    surname
                    name
                    email
                    role
                }
            }
        `
        }).then(({data}) => {
            if (data) {
                resolve(data.myStudent);
            } else {
                resolve(null);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getAllStudents() {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                students {
                    id
                    surname
                    name
                    role
                    uid
                    email
                    member {
                        id
                        year
                    }
                }
            }`
        }).then(({data}) => {
            resolve(data.students);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function queryLDAP(query: string) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        axios.post(`${import.meta.env.VITE_LDAP_PROXY_ADDRESS}/search`, {query})
            .then((response) => {
                const result = response.data.results;
                if (!result) {
                    reject("Pas de résultat");
                    return;
                }
                resolve(result);
            }).catch((error) => {
            reject(error);
        });
    });
}

export function createStudent(student: any) {
    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation {
                createStudent(data: {
                    name: "${student.name}",
                    surname: "${student.surname}",
                    email: "${student.email}",
                    uid: "${student.uid}",
                    role: ${student.role}
                }) {
                    id
                }
            }`
        }).then(({data}) => {
            resolve(data.createStudent);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function deleteStudent(id: number) {
    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation {
                deleteStudent(data: {
                    id: ${id}
                })
            }`
        }).then(({data}) => {
            resolve(data.deleteStudent);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function fetchStudentsUID() {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                students {
                    id
                    uid
                }
            }`
        }).then(({data}) => {
            resolve(data.students);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getStudent(id: number) {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                student(id: ${id}) {
                    id
                    surname
                    name
                    email
                    role
                    uid
                    member {
                        id
                        year
                    }
                }
            }`
        }).then(({data}) => {
            resolve(data.student);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function updateStudent(student: any) {
    return new Promise((resolve, reject) => {
        graphqlClient.mutate({
            mutation: gql`
            mutation {
                updateStudent(data: {
                    id: ${student.id},
                    name: "${student.name}",
                    surname: "${student.surname}",
                    email: "${student.email}",
                    uid: "${student.uid}"
                }) {
                    id
                }
            }`
        }).then(({data}) => {
            resolve(data.updateStudent);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getStudentByUid(uid: string) {
    return new Promise((resolve, reject) => {
        graphqlClient.query({
            query: gql`
            query {
                studentByUid(uid: "${uid}") {
                    id
                    surname
                    name
                    email
                    role
                    uid
                    member {
                        id
                        year
                    }
                }
            }`
        }).then(({data}) => {
            resolve(data.studentByUid);
        }).catch((error) => {
            reject(error);
        });
    });
}