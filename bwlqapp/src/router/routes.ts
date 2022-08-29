import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "Home",
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Index.vue"),
        meta: { requiresAuth: true },
      },
      // {
      //   path: "/profile",
      //   component: () => import("pages/Profile"),
      //   meta: { requiresAuth: true },
      // },
    ],
  },
  {
    name: "SignIn",
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  {
    name: "SignUp",
    path: "/register",
    component: () => import("src/pages/Register.vue"),
  },
  {
    name: "Recover",
    path: "/recover",
    component: () => import("src/pages/Recover.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
