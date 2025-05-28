import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/sobre', component: () => import('pages/AboutPage.vue') },
      { path: '/categorias', component: () => import('pages/CategoriesPage.vue') },
      { path: '/favoritos', component: () => import('pages/FavoritesPage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
