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
                <b-alert show variant="info">We have sent an email to your account and you will find the reset code.</b-alert>
                <b-form name="loginForm" @submit.prevent="handleSubmit">
                  <h1>Reset Password</h1>
                  <b-alert show variant="warning" v-if="error">{{ error }}</b-alert>
                  <p class="text-muted">Enter your new password</p>
                  <b-input-group class="mb-3" v-if="!userForgotPassword">
                    <b-input-group-prepend><b-input-group-text><i class="icon-envelope"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="text"
                      name="email"
                      class="form-control"
                      autofocus
                      placeholder="Email"
                      :state="!errors.has('email') ? null : false"
                      v-model.trim="email"
                      v-validate="'required|email'"
                    />
                    <b-form-invalid-feedback v-show="errors.has('email')">
                      {{ errors.first('email') }}
                    </b-form-invalid-feedback>
                  </b-input-group>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-key"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="text"
                      name="resetCode"
                      class="form-control"
                      autofocus
                      placeholder="Reset code"
                      :state="!errors.has('resetCode') ? null : false"
                      v-model.trim="resetCode"
                      v-validate="'required'"
                    />
                    <b-form-invalid-feedback v-show="errors.has('resetCode')">
                      {{ errors.first('resetCode') }}
                    </b-form-invalid-feedback>
                  </b-input-group>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="password"
                      name="password"
                      ref="password"
                      class="form-control"
                      placeholder="New password"
                      :state="!errors.has('password') ? null : false"
                      v-model.trim="password"
                      v-validate="'required'"
                    />
                    <b-form-invalid-feedback v-show="errors.has('password')">
                      {{ errors.first('password') }}
                    </b-form-invalid-feedback>
                  </b-input-group>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input
                      type="password"
                      name="repeatPassword"
                      class="form-control"
                      placeholder="Repeat new password"
                      :state="!errors.has('repeatPassword') ? null : false"
                      v-model.trim="repeatPassword"
                      v-validate="'confirmed:password|required'"
                    />
                    <b-form-invalid-feedback v-show="errors.has('repeatPassword')">
                      {{ errors.first('repeatPassword') }}
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
                        Reset
                      </b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0" v-on:click="signIn">Sign In</b-button>
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
import { mapGetters } from 'vuex';

export default {
  name: 'ResetPassword',
  data () {
    return {
      password: '',
      repeatPassword: '',
      error: '',
      resetCode: '',
      email: '',
    };
  },
  computed: {
    isFormValid () {
      return !Object.keys(this.veeFields).some(key => this.veeFields[key].invalid);
    },
    ...mapGetters({
      userForgotPassword: 'auth/userForgotPassword',
    }),
  },
  methods: {
    handleSubmit: async function() {
      if (!this.isFormValid) return;
      let username = this.userForgotPassword ? this.userForgotPassword : this.email;
      try {
        await Auth.forgotPasswordSubmit(username, this.resetCode, this.password);
        this.$router.push('/auth/signIn?passwordWasReset=1');
      } catch(e) {
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
