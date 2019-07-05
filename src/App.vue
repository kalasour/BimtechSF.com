<template>
  <v-app>
    <!-- <v-img :src="require('./../src/assets/Logo.jpg')" aspect-ratio="1" /> -->
    <Loading/>
    <Login/>
    <Register/>
    <v-toolbar fixed app>
      <v-toolbar-title class="headline text-uppercase">
        <span>BIMTECHSF</span>
        <span class="font-weight-light">.COM</span>
      </v-toolbar-title>
      <v-btn @click="goto('/POS')" flat>
        <span v-if="this.$route.path!=='/POS'" class="mx-2">P.O.S</span>
        <span v-else class="mx-2 pink--text">P.O.S</span>
      </v-btn>
      <div class="text-xs-center">
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on }">
            <v-btn @click="goto('/RestaurantSupply')" flat v-on="on">
              <span
                v-if="$route.path.indexOf('/RestaurantSupply')!==-1"
                class="pink--text"
              >Restaurant supply</span>
              <span v-else>Restaurant supply</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-tile
              v-for="(item, index) in Categories"
              :key="index"
              @click="goto('/RestaurantSupply/'+item.data().name)"
            >
              <v-list-tile-title>
                <span
                  v-if="$route.path.indexOf('/RestaurantSupply/'+item.data().name)!==-1"
                  class="pink--text"
                >{{ item.data().name }}</span>
                <span v-else>{{ item.data().name }}</span>
                <v-icon class="right">keyboard_arrow_right</v-icon>
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      <v-spacer></v-spacer>
      <Profile/>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Loading from "./components/Loading";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
export default {
  name: "App",
  components: {
    Profile,
    Loading,
    Login,
    Register
  },
  created() {
  },
  computed: {
    ...mapState(["Stock", "isLoading", "Categories"])
  },
  data() {
    return {};
  },
  methods: {
    goto(page) {
      this.$router.push({ path: page });
    },
    handleCate() {},
    ...mapMutations(["initialize"])
  }
};
</script>
