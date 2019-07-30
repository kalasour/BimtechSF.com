<template>
  <div>{{Charges.length}}</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  mounted() {
    this.FetchCharges();
  },
  methods: {
    ...mapMutations(["FetchCharges"])
  },
  computed: {
    ...mapState(["Charges"])
  }
};
</script>
