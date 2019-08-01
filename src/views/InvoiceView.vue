<template>
  <div>{{Charge}}</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["Charges"]),
    Charge() {
      return this.Charges.find(ele => ele.id == this.$route.params.Id);
    }
  },
  methods: {
    ...mapMutations([])
  }
};
</script>
