<template>
  <v-layout justify-center>
    <v-flex xs10>
      <v-card class="my-5">
        <v-layout justify-space-between row wrap>
          <v-flex xs5>
            <!-- <v-carousel>
              <v-carousel-item v-for="(item,i) in Item.imgs" :key="i" :src="item"></v-carousel-item>
            </v-carousel>-->
          </v-flex>
          <v-flex xs6 class="mt-3 mr-5">
            <p class="title">{{Item.name}}</p>
            <div class="grey lighten-4">
              <v-layout row wrap align-center>
                <s
                  v-if="Item.DiscountActive"
                  class="grey--text title pl-3 mb-0"
                >${{nonDiscountPrice}}</s>
                <p class="orange--text display-1 pa-3 mb-0">${{Price}}</p>
                <div v-if="Item.DiscountActive" class="mx-1 orange white--text">
                  <span class="mx-2">- {{Item.DiscountPer}} %</span>
                </div>
                <div v-if="Item.DiscountActive" class="mx-1 orange white--text">
                  <span class="mx-2">- {{Item.DiscountAmount}} $</span>
                </div>
              </v-layout>
            </div>
            <div v-if="Item.Options!=null">
              <div v-for="(key,i) in Object.keys(Item.Options)" :key="i">
                <v-layout
                  v-if="Item.Options[key].length!=0"
                  class="ml-4 my-3"
                  row
                  wrap
                  align-content-center
                  align-center
                >
                  <v-flex xs1>
                    <p class="subheading grey--text mb-0">{{key}} :</p>
                  </v-flex>
                  <div v-for="(op,index) in Item.Options[key]" :key="index">
                    <v-btn
                      color="orange"
                      v-if="op.name==OpArray[i].name"
                      class="text-capitalize"
                      outline
                      @click="op.id=index;OpArray[i]=op;OpArray=Object.assign([],OpArray)"
                    >
                      <v-icon small>done</v-icon>
                      {{op.name}}
                    </v-btn>
                    <v-btn
                      v-else
                      @click="op.id=index;OpArray[i]=op;OpArray=Object.assign([],OpArray)"
                      color="grey"
                      class="text-capitalize"
                      outline
                    >
                      <span class="grey--text text--darken-3">{{op.name}}</span>
                    </v-btn>
                  </div>
                </v-layout>
              </div>
            </div>
            <v-layout class="ml-4 my-3" row wrap align-content-center align-center>
              <v-flex xs2>
                <p class="subheading grey--text mb-0">Amount :</p>
              </v-flex>
              <v-flex xs2>
                <v-layout row wrap>
                  <v-icon
                    small
                    :disabled="amount<=1"
                    :style="{cursor:'pointer'}"
                    @click="amount--"
                  >remove</v-icon>
                  <v-text-field
                    :style="{width:'10px'}"
                    color="orange"
                    class="centered-input"
                    v-model="amount"
                    @keypress="isNumber"
                  ></v-text-field>
                  <v-icon small :style="{cursor:'pointer'}" @click="amount++">add</v-icon>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout class="ml-4 my-3" row wrap align-content-center align-center>
              <v-flex xs2>
                <v-btn large color="orange white--text">
                  <v-icon class="mr-3">add_shopping_cart</v-icon>Add to cart
                </v-btn>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout class="my-3" row wrap align-content-start align-start>
              <v-flex>
                <v-textarea
                  color="orange"
                  v-model="Item.description"
                  auto-grow
                  readonly
                  label="Description :"
                  outline
                  class="mt-0"
                  hide-details
                  rows="2"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style>
.centered-input input {
  max-height: 32px;
  text-align: center;
}
</style>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  created() {
    if (this.Item.Options != null)
      Object.keys(this.Item.Options).forEach((key, index) => {
        if (this.Item.Options[key].length != 0) {
          this.Item.Options[key][0].id = index;
          this.OpArray.push(this.Item.Options[key][0]);
        } else this.OpArray.push({});
      });
  },
  data() {
    return {
      OpArray: [],
      amount: 1
    };
  },
  methods: {
    isNumber(event) {
      var ch = String.fromCharCode(event.which);
      if (!/[1-9]/.test(ch)) {
        event.preventDefault();
      }
    }
  },
  computed: {
    ...mapState(["Stock"]),
    Item() {
      return this.Stock.find(ele => ele.id == this.$route.params.id).data();
    },
    Price() {
      return (
        (this.Item.price +
          (this.OpArray.length == 0
            ? 0
            : this.OpArray.map(item => item.price).reduce(
                (sum, num) => parseFloat(sum) + parseFloat(num)
              ))) *
        this.amount
      );
    },
    nonDiscountPrice() {
      return (
        (this.Item.price +
          (this.OpArray.length == 0
            ? 0
            : this.OpArray.map(item => item.price).reduce(
                (sum, num) => parseFloat(sum) + parseFloat(num)
              ))) *
        this.amount
      );
    }
  }
};
</script>
