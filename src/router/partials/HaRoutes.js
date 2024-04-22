const HADashboard = () =>
  import(/* webpackChunkName: "HADashboardView"  */ "@/views/HA/Dashboard");
const HAPermissionGroups = () =>
  import(
    /* webpackChunkName: "HAPermissionGroupsView"  */ "@/views/HA/PermissionGroups"
  );
const HAPermissionGroupsCreate = () =>
  import(
    /* webpackChunkName: "HAPermissionGroupsCreateView"  */ "@/views/HA/PermissionGroupsCreate"
  );
const HAPermissionGroupsUpdate = () =>
  import(
    /* webpackChunkName: "HAPermissionGroupsUpdateView"  */ "@/views/HA/PermissionGroupsUpdate"
  );
const HAAdministratorUsers = () =>
  import(
    /* webpackChunkName: "HAAdministratorUsersView"  */ "@/views/HA/AdministratorUsers"
  );

const HAAdministratorUsersCreate = () =>
  import(
    /* webpackChunkName: "HAAdministratorUsersCreateView"  */ "@/views/HA/AdministratorUsersCreate"
  );

const HAAdministratorUsersUpdate = () =>
  import(
    /* webpackChunkName: "HAAdministratorUsersUpdateView"  */ "@/views/HA/AdministratorUsersUpdate"
  );

const routes = [
  {
    path: "dashboard",
    name: "ha-dashboard",
    component: HADashboard,
  },
  {
    path: "permission-groups",
    name: "ha-permission-groups",
    component: HAPermissionGroups,
  },
  {
    path: "permission-groups/create",
    name: "ha-permission-groups-create",
    component: HAPermissionGroupsCreate,
  },
  {
    path: "permission-groups/:id",
    name: "ha-permission-groups-update",
    component: HAPermissionGroupsUpdate,
  },
  {
    path: "administrator-users",
    name: "ha-administrator-users",
    component: HAAdministratorUsers,
  },
  {
    path: "administrator-users/create",
    name: "ha-administrator-users-create",
    component: HAAdministratorUsersCreate,
  },
  {
    path: "administrator-users/:id",
    name: "ha-administrator-users-update",
    component: HAAdministratorUsersUpdate,
  },
];

export default routes;
