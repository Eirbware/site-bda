import {createRouter, createWebHashHistory} from "vue-router";

import MemberManagementView from "@/views/members/MemberManagementView.vue";
import AuthenticationView from "@/views/AuthenticationView.vue";
import {getMyStudent} from "@/services/studentService";
import StudentManagementView from "@/views/students/StudentManagementView.vue";
import StudentAddView from "@/views/students/StudentAddView.vue";
import MemberAddView from "@/views/members/MemberAddView.vue";
import StudentEditView from "@/views/students/StudentEditView.vue";
import MemberEditView from "@/views/members/MemberEditView.vue";
import HomeView from "@/views/HomeView.vue";
import CategoryManagementView from "@/views/categories/CategoryManagementView.vue";
import PartentheseManagementView from "@/views/partentheses/PartentheseManagementView.vue";
import PartentheseAddView from "@/views/partentheses/PartentheseAddView.vue";
import PartentheseEditView from "@/views/partentheses/PartentheseEditView.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView
    },
    {
        path: "/auth",
        name: "Authentification",
        component: AuthenticationView,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: "/dashboard/members",
        name: "Gestion des membres",
        component: MemberManagementView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/students",
        name: "Gestion des étudiants",
        component: StudentManagementView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/students/add",
        name: "Ajouter un.e étudiant.e",
        component: StudentAddView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/members/add",
        name: "Ajouter un.e membre",
        component: MemberAddView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/students/:id/edit",
        name: "Modifier un.e étudiant.e",
        component: StudentEditView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/members/:id/edit",
        name: "Modifier un.e membre",
        component: MemberEditView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/partentheses-categories",
        name: "Gestion des catégories",
        component: CategoryManagementView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/dashboard/partentheses",
        name: "Gestion des parenthèses",
        component: PartentheseManagementView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/dashboard/partentheses/add",
        name: "Ajout de partenthèse",
        component: PartentheseAddView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/dashboard/partentheses/:id/edit",
        name: "Modifier une p'Art'enthèse",
        component: PartentheseEditView,
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        getMyStudent().then((student) => {
            if (!student) {
                next({name: "Authentification"});
            } else {
                if (to.meta.requiresRoles) {
                    if (to.meta.requiresRoles.includes(student.role)) {
                        next();
                    } else {
                        next({name: "Home"});
                    }
                } else {
                    next();
                }
            }
        }).catch(() => {
            next({name: "Authentification"});
        });
    } else {
        next();
    }
})

export default router;