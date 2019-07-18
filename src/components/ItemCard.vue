<template>
  <div>
    <v-hover>
      <v-card
        v-if="Item!=null"
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`"
        class="mx-3 left my-3"
        width="300"
        height="350"
        :to="'/Item/'+ID"
      >
        <v-img
          :aspect-ratio="16/9"
          :src="Item.imgs==null?'https://via.placeholder.com/350':Item.imgs[0]"
        >
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="orange"></v-progress-circular>
            </v-layout>
          </template>
          <v-expand-transition v-if="Item.imgs!=null">
            <div
              v-if="hover&&Item.imgs[1]!=null"
              class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
              style="height: 100%;"
            >
              <v-img :aspect-ratio="16/9" :src="Item.imgs[1]">
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="orange"></v-progress-circular>
                  </v-layout>
                </template>
              </v-img>
            </div>
          </v-expand-transition>
          <v-btn
            v-if="userProfile.isAdmin"
            absolute
            color="grey darken-3"
            class="white--text mt-4"
            left
            top
            @click.stop.prevent="deleteItem()"
          >
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn
            v-if="userProfile.isAdmin"
            absolute
            color="orange"
            class="white--text mt-4"
            right
            top
            @click.stop.prevent="editItem({...Item,id:ID})"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </v-img>
        <v-card-text class="pt-4" style="position: relative;">
          <!-- <v-btn
            absolute
            color="orange"
            class="white--text"
            style="z-index:0"
            fab
            right
            top
            @click.stop.prevent="AddToCart(ID)"
          >
            <v-icon>add_shopping_cart</v-icon>
          </v-btn> -->
          <!-- <v-responsive :aspect-ratio="16/4"> -->
          <h4 class="headline font-weight-light mb-2 text-truncate">{{Item.name}}</h4>
          <!-- </v-responsive> -->
          <div class="font-weight-light grey--text subheading mb-2">
            Description :
            <p class="text-truncate mb-0">{{Item.description}}</p>
          </div>
          <h3 class="display-1 font-weight-light orange--text mb-2">{{Item.price}} $</h3>
        </v-card-text>
      </v-card>
      <v-card
        :style="{ cursor: 'pointer'}"
        @click="addItem"
        :class="`elevation-${hover ? 12 : 2}`"
        v-else
        class="justify-center mx-3 left my-3"
        width="300"
        height="350"
      >
        <div class="mt-5">
          <v-img contain max-height="125" :src="require('./../assets/add.png')"></v-img>
        </div>
        <div class="mt-5">
          <p class="orange--text text-xs-center title">Add item</p>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data: () => ({}),
  components: {},
  computed: {
    ...mapState(["userProfile"])
  },
  props: {
    Item: Object,
    ID: String
  },
  watch: {},
  methods: {
    ...mapMutations(["AddToCart", "DeleteItem", "editItem"]),

    deleteItem() {
      this.$confirm("Do you really want to delete?").then(res => {
        if (res) this.DeleteItem(this.ID);
      });
    },

    addItem() {
      this.editItem({});
    }
  }
};
</script>
