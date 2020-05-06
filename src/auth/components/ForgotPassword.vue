<template>
<div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="text-center">
        <b-col md="12">
          <img class="logo" src="img/brand/logo.png" width="175" height="30" alt="KTokenizer">
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col md="5">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form name="forgotPasswordForm" @submit.prevent="handleSubmit">
                  <h1>Forgot Password</h1>
                  <b-alert show variant="warning" v-if="error">{{ error }}</b-alert>
                  <p class="text-muted">Enter your email account. If you don't remember the email you registered please contact us.</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-envelope"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="email"
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
                  <b-row>
                    <b-col cols="6">
                      <b-button
                        type="submit"
                        variant="primary"
                        class="px-4"
                        :disabled="!isFormValid"
                      >
                        Reset password
                      </b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button type="button" variant="link" class="px-0" @click="signIn">Sign In</b-button>
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

<script>
import Auth from '@aws-amplify/auth';
import store from '@/store';

export default {
  name: 'ForgotPassword',
  data () {
    return {
      email: '',
      error: '',
    };
  },
  computed: {
    isFormValid () {
      return !Object.keys(this.veeFields).some(key => this.veeFields[key].invalid);
    }
  },
  methods: {
    handleSubmit: async function() {
      this.error = '';
      try {
        const result = await Auth.forgotPassword(this.email);
        if (result) {
          store.commit('auth/setUserForgotPassword', this.email);
          this.$router.push('/auth/resetPassword');
        }
      }
      catch (e) {
        this.setError(e);
      }
    },
    signIn: function() {
      this.$router.push('/auth/signIn');
    },
    setError: function(err) {
      this.error = err.message || err;
    }
  }
};
</script>
