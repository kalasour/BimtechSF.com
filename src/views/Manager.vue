<template>
  <div>
    {{userProfile}}
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
    };
  },
  created() {},
  components: {},
  watch: {},
  computed: {
    ...mapState(["user", "isLogin", "userProfile", "isLoading"])
  },
  updated() {
    console.log("updated and authen");
    this.Authen();
  },
  methods: {
    Authen() {
      if (!this.userProfile.isAdmin) {
        this.$router.push({ path: "/RestaurantSupply/DISPOSABLE" });
      }
    }
  }
};
</script>
