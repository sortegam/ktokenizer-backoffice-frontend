<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="text-center">
        <b-col md="12">
          <img class="logo" src="" width="175" height="30" alt="KTokenizer">
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col md="5">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form name="loginForm" @submit.prevent="handleSubmit">
                  <h1>Login</h1>
                  <b-alert show variant="warning" v-if="error">{{ error }}</b-alert>
                  <b-alert show variant="info" v-if="info">{{ info }}</b-alert>
                  <p class="text-muted">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-envelope"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="text"
                      name="email"
                      class="form-control"
                      autofocus
                      placeholder="Email"
                      autocomplete="email"
                      :state="!errors.has('email') ? null : false"
                      v-model.trim="email"
                      v-validate="'required|email'"
                    />
                    <b-form-invalid-feedback id="emailFeedback" v-show="errors.has('email')">
                      {{ errors.first('email') }}
                    </b-form-invalid-feedback>
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="password"
                      name="password"
                      class="form-control"
                      placeholder="Password"
                      autocomplete="current-password"
                      :state="!errors.has('password') ? null : false"
                      v-model.trim="password"
                      v-validate="'required'"
                    />
                    <b-form-invalid-feedback id="passwordFeedback" v-show="errors.has('password')">
                      {{ errors.first('password') }}
                    </b-form-invalid-feedback>
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button
                        variant="primary"
                        class="px-4"
                        type="submit"
                        :disabled="!isFormValid"
                      >
                        Login
                      </b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button type="button" variant="link" class="px-0" v-on:click="forgotPassword">Forgot password?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<style>
.logo {
  margin-bottom: 20px;
}
</style>

<script>
import Auth from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import store from '@/store';

const logger = new Logger('SignInComp');

export default {
  name: 'SignIn',
  data () {
    return {
      email: '',
      password: '',
      user: null,
      // For MFA purposes
      // confirmView: false,
      // code: '',
      error: '',
      info: '',
    };
  },
  mounted() {
    if (this.$route.query.passwordWasReset === '1') {
      this.info = 'Your password has been reset successfuly! Now it\'s time to Sign In.';
    }
  },
  computed: {
    isFormValid () {
      return !Object.keys(this.veeFields).some(key => this.veeFields[key].invalid);
    },
  },
  methods: {
    handleSubmit: function() {
      if (!this.isFormValid) {
        return;
      }
      Auth.signIn(this.email, this.password)
        .then(user => {
          // Detect if challenge
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              store.commit('auth/setUser', user);
              this.$router.push('/auth/requireNewPassword');
              return;
          } else {
            logger.debug('sign in success', user);
            store.commit('auth/setUser', user);
            this.$router.push('/');
          }
        })
        // .then(user => {
        //   that.user = user
        //   if (user.challengeName === 'SMS_MFA') {
        //     that.confirmView = true
        //     return;
        //   }
        //   this.checkUser()
        // })
        .catch(err => {
          this.setError(err);
          console.warn(err);
        });

    },
    // checkUser: function() {
    //   const user = this.user;
    //   if (!user) { return }

    //   This piece of code is to verify a contact (disabled at the moment)
    //   Auth.verifiedContact(user)
    //     .then(data => {
    //       logger.debug('verify result', data);
    //       store.commit('auth/setUserVerification', data);
    //       if (!JS.isEmpty(data.verified)) {
    //         this.$router.push('/');
    //       } else {
    //         this.$router.push('/auth/verifyContact');
    //       }
    //     });
    // },
    // confirm: function() {
    //   Auth.confirmSignIn(this.user, this.code)
    //     .then(() => {
    //       this.$router.push('/');
    //     })
    //     .catch(err => this.setError(err));
    // },
    forgotPassword: function() {
        this.$router.push('/auth/forgotPassword');
    },
    // signUp: function() {
    //     this.$router.push('/auth/signUp');
    // },
    setError: function(err) {
        this.error = err.message || err;
    },
  }
};
</script>
