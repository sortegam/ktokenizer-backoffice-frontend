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
                <b-alert show class="text-center" variant="info" v-if="isPasswordChanged">
                  The password has been created!
                  <br />
                  <br />
                  <b-button
                    @click="goIn"
                    variant="primary"
                    class="px-4"
                    type="button"
                  >
                    Continue to Dashboard
                  </b-button>
                </b-alert>
                <b-form name="requireNewPasswordForm" @submit.prevent="handleSubmit" v-if="!isPasswordChanged">
                  <h1>New password</h1>
                  <b-alert show variant="warning" v-if="error">{{ error }}</b-alert>
                  <p class="text-muted">For security purposes you need to generate a new password</p>
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
import _isEmpty from 'lodash/isEmpty';

export default {
  name: 'RequireNewPassword',
  data () {
    return {
      password: '',
      repeatPassword: '',
      error: '',
      isPasswordChanged: false,
    }
  },
  computed: {
    isFormValid () {
      return !Object.keys(this.fields).some(key => this.fields[key].invalid)
    },
    ...mapGetters({
      user: 'auth/user'
    }),
  },
  methods: {
    handleSubmit: function() {
      const that = this;
      if (_isEmpty(that.user)) {
        this.setError('There is a problem in our system. Please try later. If the problem persists contact us.').
        return;
      }
      const { requiredAttributes } = that.user.challengeParam;
      Auth.completeNewPassword(that.user, this.password, requiredAttributes)
        .then(() => {
          that.isPasswordChanged = true;
        })
        .catch(err => that.setError(err));
      // if (!this.isFormValid) return;
      // let username = this.userForgotPassword ? this.userForgotPassword : this.email;
      // try {
      //   const result = await Auth.forgotPasswordSubmit(username, this.resetCode, this.password);
      //   this.$router.push('/auth/signIn?passwordWasReset=1');
      // } catch(e) {
      //   this.setError(e);
      // }
    },
    signIn: function() {
      this.$router.push('/auth/signIn');
    },
    goIn: function() {
      this.$router.push('/');
    },
    setError: function(err) {
        this.error = err.message || err;
    }
  }
};
</script>
