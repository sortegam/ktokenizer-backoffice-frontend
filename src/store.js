import Vue from 'vue';
import Vuex from 'vuex';
import authStore from '@/auth/auth.store';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth: authStore,
  },
});

export default store;
