import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue"
import UserView from "@/views/UserView.vue";

const routes = [
  {
    path: "/",
    component: LoginView,
  },
  {
    path: "/data",
    component: UserView,
    // meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
