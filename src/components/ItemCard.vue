<template>
  <div>
    <v-hover>
      <v-card
        v-if="Item!=null"
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`"
        width="100%"
        height="350"
        :to="'/Item/'+ID"
      >
        <v-img :src="Item.imgs==null?'https://via.placeholder.com/350':Item.imgs[0]" height="220">
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
            :style="{top:'0%',left:'0%'}"
            class="white--text"
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
            :style="{top:'0%',right:'0%'}"
            class="white--text"
            right
            top
            @click.stop.prevent="editItem({...Item,id:ID})"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-layout :style="{position: 'absolute',bottom:'2%',right:'2%'}" row wrap>
            <div
              v-if="Item.DiscountActive&&Item.DiscountPer!=''&&Item.DiscountPer!=null&&Item.DiscountPer>0"
              class="mx-1 orange white--text text-xs-center"
            >
              <span class="mx-2 caption">- {{Item.DiscountPer}} %</span>
            </div>
            <div
              v-if="Item.DiscountActive&&Item.DiscountAmount!=null&&Item.DiscountAmount!=''&&Item.DiscountAmount>0"
              class="mx-1 orange white--text text-xs-center"
            >
              <span class="mx-2 caption">- {{Item.DiscountAmount}} $</span>
            </div>
          </v-layout>
        </v-img>
        <v-card-text class="pt-4 pb-0" style="position: relative;">
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
          </v-btn>-->
          <!-- <v-responsive :aspect-ratio="16/4"> -->
          <h4 class="headline font-weight-light mb-2 text-truncate">{{Item.name}}</h4>
          <!-- </v-responsive> -->
          <div class="font-weight-light grey--text subheading mb-2">
            <p class="text-truncate mb-0">Description : {{Item.description}}</p>
          </div>
        </v-card-text>
        <v-card-actions class="py-0 mx-2">
          <v-layout row wrap align-center>
            <s v-if="Item.DiscountActive" class="grey--text display-1 mr-1">${{nonDiscountPrice}}</s>
            <p class="display-1 font-weight-light orange--text mb-0">{{Price}} $</p>
          </v-layout>
        </v-card-actions>
      </v-card>
      <v-card
        :style="{ cursor: 'pointer'}"
        @click="addItem"
        :class="`elevation-${hover ? 12 : 2}`"
        v-else
        width="100%"
        height="350"
      >
        <div class="mt-2 pt-5">
          <v-img contain max-height="125" :src="require('./../assets/add.png')"></v-img>
        </div>
        <div class="pt-5">
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
    ...mapState(["userProfile"]),
    Price() {
      return this.Item.DiscountActive
        ? (
            this.nonDiscountPrice -
            (this.Item.DiscountAmount == "" || this.Item.DiscountAmount == null
              ? 0
              : this.Item.DiscountAmount) -
            (this.Item.DiscountPer == "" || this.Item.DiscountPer == null
              ? 0
              : (parseFloat(this.Item.DiscountPer) / 100) *
                this.nonDiscountPrice)
          ).toFixed(2)
        : this.nonDiscountPrice;
    },
    nonDiscountPrice() {
      return parseFloat(this.Item.price).toFixed(2);
    }
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
