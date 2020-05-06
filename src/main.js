// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise';
import 'core-js/es6/string';
import 'core-js/es7/array';
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VeeValidate, { Validator } from 'vee-validate';
import Auth from '@aws-amplify/auth';
import AmplifyAuth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import App from './App';
import router from './router';
import store from './store';
import validatorDictionary from './validatorDictionary';

Vue.use(BootstrapVue);
// See the following link to know wy its needed the fieldsBadName attribute:
Vue.use(VeeValidate, { inject: true, fieldsBagName: 'veeFields', errorsBagName: 'veeErrors' });

// Localize and expand error messages for veeValidate
Validator.localize(validatorDictionary);

// #############################################################################
// ### Amplify Configuration
// #############################################################################
AmplifyAuth.configure({
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
  // REQUIRED - Amazon Cognito Region
  region: process.env.VUE_APP_AWS_COGNITO_REGION,
  // OPTIONAL - Amazon Cognito Federated Identity Pool Region
  // Required only if it's different from Amazon Cognito Region
  // identityPoolRegion: 'XX-XXXX-X',
  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: process.env.VUE_APP_AWS_COGNITO_APP_CLIENT_ID,
  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: true,
  // OPTIONAL - customized storage object
  // storage: new MyStorage(),
  // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
  authenticationFlowType: 'USER_PASSWORD_AUTH',
});
Logger.LOG_LEVEL = 'DEBUG'; // to show detailed logs from Amplify library
const logger = new Logger('main');

Auth.currentUserInfo()
  .then(user => logger.debug(user))
  .catch(err => logger.debug(err));
// #############################################################################
// ### End Amplify Configuration
// #############################################################################

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
  },
});
