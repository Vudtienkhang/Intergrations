// routers.js
import { lazy } from "react";

const routers = [
  {
    path: '/dashboardadmin',
    Component: lazy(() => import('@/pages/DashBoardAdmin/DashBoardAdmin'))
  },

];

export default routers;
