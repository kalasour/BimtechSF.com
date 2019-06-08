<template>
  <v-dialog v-model="isLoading" persistent width="300">
    <v-card color="dark" dark>
      <v-card-text>
        Loading...
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["isLoading"])
  }
};
</script>
