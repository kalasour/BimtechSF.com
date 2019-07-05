<template>
  <div>{{'ssd'}}</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  watch: {
  },

  data() {
    return {
    };
  },
  computed:{
      ...mapState(["user","userProfile"])
  },
  methods: {
   
  }
};
</script>
