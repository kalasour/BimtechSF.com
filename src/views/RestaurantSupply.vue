<template>
  <div>
    <div v-for="(item,index) in listCate" class="mb-5 mx-5" :key="index">
      <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet :color="colors[i]" height="100%">
            <v-layout align-center fill-height justify-center>
              <v-btn large :to="'RestaurantSupply/'+item.name" class="display-3">{{ item.name }}</v-btn>
            </v-layout>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["listCate"])
  },
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4"
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"]
    };
  }
};
</script>
