<template>
  <div :style="theme.form">
    <div>Are you sure?</div>
    <div :style="theme.actionRow">
        <button :style="theme.action" v-on:click="signOut">Sign Out</button>
    </div>
    <div :style="theme.error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Auth from '@aws-amplify/auth';
import { JS, ConsoleLogger as Logger } from '@aws-amplify/core';

const logger = new Logger('SignOutComp');

export default {
  name: 'SignOut',
  data () {
    return {
      error: '',
    }
  },
  methods: {
    signOut: function(event) {
        Auth.signOut()
            .then(() => {
                logger.debug('sign out success');
                this.$router.push('/auth/signIn');
            })
            .catch(err => this.setError(err))
    },
    setError: function(err) {
        this.error = err.message || err;
    }
  }
}
</script>
