import * as Components from './components';
import store from '@/store';
import AuthView from './views/AuthView';

import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';

const logger = new Logger('AuthRouter');

const AuthRouter = {
  path: '/auth',
  name: 'auth',
  component: AuthView,
  children: [
    {
      path: 'signIn',
      name: 'auth_SignIn',
      component: Components.SignIn,
    },
    {
      path: 'signOut',
      name: 'auth_SignOut',
      component: Components.SignOut,
    },
    {
      path: 'forgotPassword',
      name: 'auth_ForgotPassword',
      component: Components.ForgotPassword,
    },
    {
      path: 'resetPassword',
      name: 'auth_ResetPassword',
      component: Components.ResetPassword,
    },
    {
      path: 'requireNewPassword',
      name: 'auth_RequireNewPassword',
      component: Components.RequireNewPassword,
    },
  ],
};

const AuthFilter = (to, from, next) => {
  if (to.name === 'auth_RequireNewPassword') {
    next();
    return;
  }
  Auth.currentAuthenticatedUser()
    .then(user => {
      logger.debug('...has user', user);
      store.commit('auth/setUser', user);
      Auth.currentCredentials()
        .then(credentials => {
          store.commit('auth/setUserId', credentials.identityId);
        })
        .catch(err => logger.debug('get current credentials err', err));
      next();
    })
    .catch(err => {
      logger.debug('...no user', err);
      store.commit('auth/setUser', null);
      if (!to.name.startsWith('auth')) {
        next('/auth/signIn');
      } else {
        next();
      }
    });
};

export default AuthRouter;
export { AuthFilter };
