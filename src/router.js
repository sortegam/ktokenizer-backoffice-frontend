import Vue from 'vue';
import Router from 'vue-router';
import { AuthRouter, AuthFilter } from '@/auth';

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer');

// Views
const Dashboard = () => import('@/views/Dashboard');
const TokenizerOperations = () => import('@/tokenizer/operations/views/Operations');
const AccountProfile = () => import('@/account/views/Profile');
const AccountSettings = () => import('@/account/views/Settings');
const Page404 = () => import('@/views/pages/Page404');
const Page500 = () => import('@/views/pages/Page500');

Vue.use(Router);

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'tokenizer/operations',
          name: 'Token Operations',
          component: TokenizerOperations,
        },
        {
          path: 'account/profile',
          name: 'Account Profile',
          component: AccountProfile,
        },
        {
          path: 'account/settings',
          name: 'Account Settings',
          component: AccountSettings,
        },
      ],
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) {
          return c('router-view');
        },
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404,
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500,
        },
      ],
    },
    // Gives access to auth URI having login, password recovery, confirmation, etc
    AuthRouter,
  ],
});

router.beforeEach(AuthFilter);

export default router;
