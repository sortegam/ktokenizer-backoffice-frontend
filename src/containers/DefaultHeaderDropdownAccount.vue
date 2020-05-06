<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <Gravatar class="img-avatar" :email="userEmail" default-img="mm" />
    </template>\
    <template slot="dropdown">
      <b-dropdown-header
        tag="div"
        class="text-center">
        <strong>Settings</strong>
      </b-dropdown-header>
      <b-dropdown-item><i class="fa fa-user" /> Profile</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-wrench" /> Settings</b-dropdown-item>
      <b-dropdown-item @click="signOut"><i class="fa fa-lock" /> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue';
import Gravatar from 'vue-gravatar';
import { mapGetters } from 'vuex';
import Auth from '@aws-amplify/auth';

export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    Gravatar,
    AppHeaderDropdown
  },
  computed: {
    ...mapGetters({
      userEmail: 'auth/userEmail',
    }),
  },
  data: () => {
    return { itemsCount: 42 };
  },
  methods: {
    signOut: async function() {
      await Auth.signOut();
      this.$router.push('/');
    },
  },
};
</script>
