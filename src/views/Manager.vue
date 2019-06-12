<template>
  <div>{{isLogin}}</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  created(){
  },
  components: {},
  watch:{
    
  },
  computed: {
    ...mapState(["user", "isLogin", "userProfile","isLoading"])
  },
};
</script>
