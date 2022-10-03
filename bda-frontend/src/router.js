import {createRouter, createWebHashHistory} from "vue-router";
import {getMyStudent} from "@/services/studentService";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
    },
    {
        path: "/auth",
        name: "Authentification",
        component: () => import("@/views/AuthenticationView.vue"),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: "/dashboard/members",
        name: "Gestion des membres",
        component: () => import("@/views/members/MemberManagementView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/students",
        name: "Gestion des étudiants",
        component: () => import("@/views/students/StudentManagementView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/students/add",
        name: "Ajouter un.e étudiant.e",
        component: () => import("@/views/students/StudentAddView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/members/add",
        name: "Ajouter un.e membre",
        component: () => import("@/views/members/MemberAddView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/students/:id/edit",
        name: "Modifier un.e étudiant.e",
        component: () => import("@/views/students/StudentEditView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/members/:id/edit",
        name: "Modifier un.e membre",
        component: () => import("@/views/members/MemberEditView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN"]
        }
    },
    {
        path: "/dashboard/partentheses-categories",
        name: "Gestion des catégories",
        component: () => import("@/views/categories/CategoryManagementView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/dashboard/partentheses",
        name: "Gestion des parenthèses",
        component: () => import("@/views/partentheses/PartentheseManagementView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/dashboard/partentheses/add",
        name: "Ajout de partenthèse",
        component: () => import("@/views/partentheses/PartentheseAddView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/dashboard/partentheses/:id/edit",
        name: "Modifier une p'Art'enthèse",
        component: () => import("@/views/partentheses/PartentheseEditView.vue"),
        meta: {
            requiresAuth: true,
            requiresRoles: ["ADMIN", "PPC", "MEMBER"]
        }
    },
    {
        path: "/partentheses",
        name: "Les p'Art'enthèses",
        component: () => import("@/views/partentheses/PartentheseListView.vue"),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: "/partentheses/:id",
        name: "Une p'Art'enthèse",
        component: () => import("@/views/partentheses/PartentheseView.vue"),
        meta: {
            requiresAuth: false
        }
    }
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