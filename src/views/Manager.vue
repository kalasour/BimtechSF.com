<template>
  <div>
    <StockPage v-if="bottomNav==0" />
    <v-footer></v-footer>
    <v-bottom-nav fixed :active.sync="bottomNav" :color="color" :value="true"  dark shift>
      <v-btn dark @click="goto('/Manager/Stock')">
        <span>Stocks</span>
        <v-icon>table_chart</v-icon>
      </v-btn>

      <v-btn dark @click="goto('/Manager/User')">
        <span>Users</span>
        <v-icon>person</v-icon>
      </v-btn>

      <v-btn dark>
        <span>Book</span>
        <v-icon>book</v-icon>
      </v-btn>

      <v-btn dark>
        <span>Image</span>
        <v-icon>image</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script>
import StockPage from '../components/Stock'
import { mapState, mapMutations } from "vuex";
import Vue from 'vue'
export default {

  data() {
    return {
      bottomNav: 0
    };
  },
  created() {
    this.bottomNav = 0;
  },
  components: {
    StockPage
  },
  watch: {
    userProfile:function(){
      this.Authen()
    },
    "$route.params": function() {
      var state = this.$route.params.state;
      if (state == null || state == "Stock") {
        this.bottomNav = 0;
      }
      if (state == "User") {
        this.bottomNav = 1;
      }
    }
  },
  computed: {
    ...mapState(["user", "isLogin", "userProfile", "isLoading"]),
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
      }
    }
  },
  updated() {
    this.Authen();
  },
  methods: {
    goto(page) {
      this.$router.push({ path: page });
    },
    Authen() {
      if (!this.userProfile.isAdmin) {
        this.$router.push({ path: "/RestaurantSupply/DISPOSABLE" });
      }
    }
  }
};
</script>
