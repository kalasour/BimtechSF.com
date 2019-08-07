<template>
  <v-card :style="{'border-radius':'0px'}" :to="'/Invoice/'+Item.id">
    <v-card-title class="pt-2 pb-0 mx-2">
      <v-layout row wrap>
        <v-flex xs6>
          <v-layout row wrap>
            <v-flex xs12>
              <p class="mb-0 text-truncate">
                <span style="display:inline" class="subheading mb-0 text-truncate">Order{{' '}}</span>
                <span class="orange--text mb-0 text-truncate">#{{Item.id}}</span>
              </p>
            </v-flex>
            <v-flex xs12>
              <span
                class="caption grey--text"
              >Order at : {{new Date(Item.created*1000).toLocaleString()}}</span>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-spacer></v-spacer>
        <span class="subheading green--text">{{Item.status}}</span>
      </v-layout>
    </v-card-title>

    <v-card-text class="pt-0">
      <v-layout row wrap v-for="(item,index) in Item.List" :key="index" justify-space-between>
        <v-flex xs12>
          <v-divider class="my-1"></v-divider>
        </v-flex>
        <v-flex xs2>
          <v-img
            max-width="75"
            max-height="75"
            :src="item.imgs==null?'':item.imgs[0]"
            :lazy-src="item.imgs==null?'':item.imgs[0]"
            aspect-ratio="1"
          >
            <template v-slot:placeholder>
              <v-layout fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </template>
          </v-img>
        </v-flex>
        <v-flex xs4>
          <div v-if="item.name!=null" class="mt-2 ml-2 text-truncate">
            <p class="mb-1 subheading text-truncate">{{ item.name }}</p>
            <div v-if="item.OpSelected.length!=0">
              <span
                class="grey--text text-capitalize"
                v-for="(it,ind) in item.OpSelected"
                :key="ind"
              >
                {{(Object.values(item.Options))[ind][it.id].name}}
                <span
                  v-if="item.OpSelected.length-1!=ind"
                >,</span>
              </span>
            </div>
            <v-layout row wrap class="my-1">
              <div
                v-if="item.DiscountActive&&item.DiscountPer!=''&&item.DiscountPer!=null&&item.DiscountPer>0"
                class="mr-1 orange white--text"
              >
                <span class="mx-2">- {{item.DiscountPer}} %</span>
              </div>
              <div
                v-if="item.DiscountActive&&item.DiscountAmount!=null&&item.DiscountAmount!=''&&item.DiscountAmount>0"
                class="mx-1 orange white--text"
              >
                <span class="mx-2">- {{item.DiscountAmount}} $</span>
              </div>
            </v-layout>
            <span v-if="item.TaxActive" class="caption red--text">*With tax!</span>
          </div>
        </v-flex>
        <v-flex xs1>
          <div v-if="item.amount!=null" class="text-truncate mt-2">
            <p class="mb-1 subheading">x{{ item.amount }}</p>
          </div>
        </v-flex>
        <v-flex xs1>
          <s
            v-if="nonDiscountPrice(item)!=Price(item)"
            class="grey--text caption"
          >${{ item.price==null?0:nonDiscountPrice(item) }}</s>
          <p class="orange--text subheading">${{ item.price==null?0:(Price(item)*item.amount) }}</p>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text>
      <v-divider class="my-2"></v-divider>
      <v-layout class="mx-2" row wrap>
        <v-spacer></v-spacer>
        <p class="mb-0 mr-2 title">Total :</p>
        <p class="mb-0 title">${{Item.Total}}</p>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    Item: Object
  },
  components: {},
  methods: {
    Price(Item) {
      return Item.DiscountActive
        ? this.nonDiscountPrice(Item) -
            (Item.DiscountAmount == "" || Item.DiscountAmount == null
              ? 0
              : Item.DiscountAmount) -
            (Item.DiscountPer == "" || Item.DiscountPer == null
              ? 0
              : (parseFloat(Item.DiscountPer) / 100) *
                this.nonDiscountPrice(Item))
        : this.nonDiscountPrice(Item);
    },
    nonDiscountPrice(Item) {
      return (
        parseFloat(Item.price) +
        parseFloat(
          Item.OpSelected.length == 0
            ? 0
            : Item.OpSelected.map(item => item.price).reduce(
                (sum, num) => parseFloat(sum) + parseFloat(num)
              )
        )
      ).toFixed(2);
    }
  }
};
</script>
