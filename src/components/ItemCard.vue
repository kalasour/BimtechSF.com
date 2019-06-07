<template>
  <v-hover>
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2}`"
      class="mx-3 left my-3"
      width="300"
    >
      <v-img :aspect-ratio="16/9" :src="Item.imgs[0]">
        <v-expand-transition>
          <div
            v-if="hover&&Item.imgs[1]!=null"
            class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
            style="height: 100%;"
          >
            <v-img :aspect-ratio="16/9" :src="Item.imgs[1]"></v-img>
          </div>
        </v-expand-transition>
      </v-img>
      <v-card-text class="pt-4" style="position: relative;">
        <v-btn absolute color="orange" class="white--text" fab right top>
          <v-icon>add_shopping_cart</v-icon>
        </v-btn>
        <h4 class=" headline font-weight-light  mb-2">{{Item.name}}</h4>
        <div class="font-weight-light grey--text subheading mb-2">Description : {{Item.description}}</div>
        <h3 class="display-1 font-weight-light orange--text mb-2">{{Item.price}} $</h3>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  components: {},
  props: {
    Item: Object
  }
};
</script>
