<template>
  <div v-if="userProfile.isAdmin">
    <StockPage v-if="bottomNav==0" />
    <UserPage v-if="bottomNav==1" />
    <v-footer ></v-footer>
    <v-bottom-nav fixed :active.sync="bottomNav" :color="color" :value="true" dark shift>
      <v-btn dark to="/Manager/Stock">
        <span>Stocks</span>
        <v-icon>table_chart</v-icon>
      </v-btn>

      <v-btn dark to="/Manager/User">
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
import StockPage from "../components/Manager/Stock";
import UserPage from "../components/Manager/Users";
import { mapState, mapMutations } from "vuex";
import Vue from "vue";
export default {
  data() {
    return {
      bottomNav: 0
    };
  },
  created() {
    var state = this.$route.params.state;
    if (state == null || state == "Stock") {
      this.bottomNav = 0;
    }
    if (state == "User") {
      this.bottomNav = 1;
    }
  },
  components: {
    StockPage,
    UserPage
  },
  watch: {
    // userProfile:function(){
    //   this.Authen()
    // },
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
    // this.Authen();
  },
  methods: {
    ...mapMutations(["setLoading"])
  }
};
</script>
