<template>
  <div>
    <div v-if="!isLogin">
      <v-btn flat @click="openRegister()">register</v-btn>
      <v-btn flat @click="openLogin()">login</v-btn>
    </div>
    <div v-else>
      <v-btn flat v-if="userProfile.isAdmin" @click="$router.push({path:'/Manager'})">
        <v-icon>perm_data_setting</v-icon>Manager
      </v-btn>
      <v-btn flat @click="$router.push({path:'/Cart'})">
        <v-badge color="orange" overlap right>
          <template v-slot:badge>
            <span>{{numItem}}</span>
          </template>
          <v-icon large>shopping_cart</v-icon>
        </v-badge>
      </v-btn>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on }">
          <v-btn flat v-on="on">
            <v-icon>person</v-icon>
            {{user.displayName}}
            <v-icon class="ml-2">expand_more</v-icon>
          </v-btn>
        </template>
        <v-list dark>
          <v-list-tile @click="$router.push({path:'/Profile'})">
            <v-list-tile-title>My account</v-list-tile-title>
            <v-icon class="ml-3">menu</v-icon>
          </v-list-tile>
          <v-list-tile @click="Logout()">
            <v-list-tile-title>Logout</v-list-tile-title>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { auth } from "../firebase";

export default {
  data: () => ({}),
  components: {},
  computed: {
    ...mapState(["user", "isLogin", "userProfile"]),
    numItem() {
      try {
        return this.userProfile.Cart.length;
      } catch {
        return 0;
      }
    }
  },
  methods: {
    ...mapMutations(["openLogin", "openRegister", "Logout"])
  }
};
</script>
