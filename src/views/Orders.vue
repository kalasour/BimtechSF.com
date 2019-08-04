<template>
  <div>
    <v-layout row wrap justify-center class="my-3">
      <v-flex md12 xs12 lg10>
        <div class="pa-3 orange">
        <p class="title mb-1 white--text">Your orders</p>
        </div>
      </v-flex>
      <v-flex md12 xs12 lg10 v-for="(item,index) in Charges" :key="index">
        <Invoice class="mt-2" :Item="item" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  mounted() {},
  methods: {
    ...mapMutations(["FetchCharges"])
  },
  computed: {
    ...mapState(["Charges"])
  }
};
</script>
