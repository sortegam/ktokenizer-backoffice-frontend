import _get from 'lodash/get';

const store = {
  namespaced: true,
  state: {
    user: {},
    userId: null,
    userVerification: [],
    userForgotPassword: '', // email or username which forgot password
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUserVerification(state, data) {
      state.userVerification = data;
    },
    setUserForgotPassword(state, username) {
      state.userForgotPassword = username;
    },
  },
  getters: {
    user: state => state.user,
    userEmail: state => _get(state.user, 'attributes.email'),
    jwtToken: state => _get(state.user, 'signInUserSession.idToken.jwtToken'),
  },
};

export default store;
