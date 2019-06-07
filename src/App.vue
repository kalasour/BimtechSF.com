<template>
  <v-app>
    <!-- <v-img :src="require('./../src/assets/Logo.jpg')" aspect-ratio="1" /> -->
    <v-toolbar absolute app>
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
              v-for="(item, index) in Object.keys(Stock)"
              :key="index"
              @click="goto('/RestaurantSupply/'+item)"
            >
              <v-list-tile-title>
                <span
                  v-if="$route.path.indexOf('/RestaurantSupply/'+item)!==-1"
                  class="pink--text"
                >{{ item }}</span>
                <span v-else>{{ item }}</span>
                <v-icon class="right">keyboard_arrow_right</v-icon>
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      <v-spacer></v-spacer>
      <v-btn flat href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "App",
  components: {},
  created() {
    this.initialize();
  },
  computed: {
    ...mapState(["Stock"])
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
