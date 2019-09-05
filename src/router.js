import Vue from "vue";
import Router from "vue-router";
import FlowContainer from "@/views/flow-container";
import Initialization from "@/views/initialization";
import DownloadVideo from "@/views/download-video";
import EditVideo from "@/views/edit-video";
import SavingVideo from "@/views/saving-video";

Vue.use(Router);

export const videoArr = [
  {
    path: "/",
    name: "Download",
    component: DownloadVideo
  },
  {
    path: "/edit",
    name: "edit",
    component: EditVideo
  },
  {
    path: "/saving",
    name: "saving",
    component: SavingVideo
  }
];

export default new Router({
  routes: [
    {
      path: "/",
      name: "initialization",
      component: Initialization
    },
    {
      path: "/flow",
      component: FlowContainer,
      children: videoArr
    }
  ]
});
