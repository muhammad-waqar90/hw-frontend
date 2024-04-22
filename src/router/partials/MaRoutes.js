const MADashboard = () =>
  import(/* webpackChunkName: "MADashboardView"  */ "@/views/MA/Dashboard");
const MACreationRequests = () =>
  import(
    /* webpackChunkName: "MACreationRequestsView"  */ "@/views/MA/CreationRequests"
  );
const MAAdministratorUsers = () =>
  import(
    /* webpackChunkName: "MAAdministratorUsersView"  */ "@/views/MA/AdministratorUsers"
  );

const routes = [
  {
    path: "dashboard",
    name: "ma-dashboard",
    component: MADashboard,
  },
  {
    path: "creation-requests",
    name: "ma-creation-requests",
    component: MACreationRequests,
  },
  {
    path: "ha",
    name: "ma-administrator-users",
    component: MAAdministratorUsers,
  },
];

export default routes;
