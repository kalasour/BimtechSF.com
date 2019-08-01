<template>
  <div>
    <v-layout row wrap justify-center class="my-3">
      <v-flex md12 xs12 lg10>
        <v-card :style="{'border-radius':'10px'}">
          <v-card-title>
            <p class="title mb-0">Your orders</p>
          </v-card-title>
        </v-card>
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
  mounted() {
    
  },
  methods: {
    ...mapMutations(["FetchCharges"])
  },
  computed: {
    ...mapState(["Charges"])
  }
};
</script>
