import { createRouter, createWebHistory } from "vue-router";
import CommonRoutes from "./CommonRoutes";
import MenuRoutes from "./MenuRoutes";
import AuthRoutes from "./AuthRoutes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: CommonRoutes.concat(AuthRoutes).concat(MenuRoutes)
});

export default router;