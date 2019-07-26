<template>
  <v-app>
    <!-- :style="{background: '#FCCD8D'}" -->
    <!-- <v-img :src="require('./../src/assets/Logo.jpg')" aspect-ratio="1" /> -->
    <Loading />
    <Login />
    <Forgot />
    <Register />
    <EditItem />
    <v-snackbar v-model="snack" color="white" :top="true" :timeout="2000">
      <span :style="{color:'#454544'}">{{ snackbarmsg }}</span>
      <v-btn color="orange" flat @click="snack=false">Close</v-btn>
    </v-snackbar>
    <v-toolbar dark color="#454544" fixed app>
      <v-toolbar-title class="headline text-uppercase">
        <span>BIMTECHSF</span>
        <span class="font-weight-light">.COM</span>
      </v-toolbar-title>
      <v-btn to="/POS" flat>
        <span v-if="this.$route.path!=='/POS'" class="mx-2">P.O.S</span>
        <span v-else class="mx-2 orange--text">P.O.S</span>
      </v-btn>
      <div class="text-xs-center">
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on }">
            <v-btn to="/RestaurantSupply" flat v-on="on">
              <span
                v-if="$route.path.indexOf('/RestaurantSupply')!==-1"
                class="orange--text"
              >Restaurant supply</span>
              <span v-else>Restaurant supply</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-tile
              v-for="(item, index) in Categories"
              :key="index"
              :cate="item.data().name"
              :to="{name:'RestaurantSupply',params:{cate:item.data().name}}"
            >
              <v-list-tile-title>
                <span
                  v-if="$route.params.cate==item.data().name"
                  class="orange--text"
                >{{ item.data().name }}</span>
                <span v-else>{{ item.data().name }}</span>
                <v-icon class="right">keyboard_arrow_right</v-icon>
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      <v-spacer></v-spacer>
      <Profile />
    </v-toolbar>

    <v-content>
      <router-view v-if="Stock.length!=0"></router-view>
      <v-layout align-center justify-center v-else>
        <v-progress-circular :size="50" color="orange" indeterminate></v-progress-circular>
      </v-layout>
    </v-content>
    <v-footer v-if="$route.name!='Manager'" class="mt-5" light height="auto">
      <v-card class="flex" flat tile>
        <v-card-title class="white">
          <v-layout row wrap justify-space-around>
            <v-flex xs2>
              <strong>ABOUT OUR STORE</strong>
              <v-divider></v-divider>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </v-flex>
            <v-flex xs2>
              <strong>QUICK LINKS</strong>
              <v-divider></v-divider>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </v-flex>
            <v-flex xs2>
              <strong>GET IN TOUCH</strong>
              <v-divider></v-divider>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </v-flex>
            <v-flex xs2>
              <strong>CONNECT WITH US</strong>
              <v-divider></v-divider>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-divider class="mx-5"></v-divider>
        <v-card-actions class="darken-3 justify-center">
          &copy;2018 —
          <strong>Vuetify</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import Loading from "./components/Loading";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import Register from "./components/Register";
import EditItem from "./components/EditItem";
export default {
  name: "App",
  components: {
    Profile,
    Loading,
    Login,
    Register,
    Forgot,
    EditItem
  },
  mounted() {},
  created() {},
  computed: {
    ...mapState(["Stock", "isLoading", "Categories", "snackbar", "snackbarmsg"])
  },
  watch: {
    snack: function() {
      if (!this.snack) this.closeSnackbar();
    },
    snackbar: function() {
      this.snack = this.snackbar;
    }
  },
  data() {
    return { snack: false };
  },
  methods: {
    handleCate() {},
    ...mapMutations(["initialize", "closeSnackbar"])
  }
};
</script>
