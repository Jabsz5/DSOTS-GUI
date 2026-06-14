import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import UploadView from "./views/UploadView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView
  },
  {
    path: "/upload-video",
    name: "UploadView",
    component: UploadView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
