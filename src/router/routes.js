const routes = [
  {
    path: "/inicio",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "index",
        component: () => import("src/pages/IndexPage.vue")
      },
      {
        path: "permisos",
        component: () => import("src/pages/PermisosRoles.vue")
      },
      {
        path: "inspeccion",
        component: () => import("src/pages/InspeccionPage.vue")
      },
      {
        path: "orden",
        component: () => import("src/pages/OrdenPage.vue")
      },
      {
        path: "perfil",
        component: () => import("src/pages/PerfilPage.vue")
      },
      {
        path: "pendientes",
        component: () => import("src/pages/PendientePage.vue")
      },
      {
        path: "tramite",
        component: () => import("src/pages/TramitePage.vue")
      },
      {
        path: "tercero",
        component: () => import("src/pages/TerceroPage.vue")
      },
      {
        path: "reportes",
        component: () => import("src/pages/ReportesPage.vue")
      },
      {
        path: "distribuidora",
        component: () => import("src/pages/DistribuidoraPage.vue")
      },
      {
        path: "grupo",
        component: () => import("src/pages/GrupoPage.vue")
      }
      ,
      {
        path: "mapa",
        component: () => import("src/pages/MapasPage.vue")
      }
    ],
  },
  {

    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/login",
    component: () => import("src/layouts/LoginLayout.vue")
  },
  {
    path: "",
    redirect: "/inicio/index"
  }
];

export default routes;
