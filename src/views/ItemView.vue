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
              <p class="orange--text headline pa-3">${{Price}}</p>
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
                      @click="OpArray[i]=op;OpArray=Object.assign([],OpArray)"
                    >
                      <v-icon small>done</v-icon>
                      {{op.name}}
                    </v-btn>
                    <v-btn
                      v-else
                      @click="OpArray[i]=op;OpArray=Object.assign([],OpArray)"
                      color="grey"
                      class="text-capitalize"
                      outline
                    >
                      <span class="grey--text text--darken-3">{{op.name}}</span>
                    </v-btn>
                  </div>
                </v-layout>
              </div>
              <v-layout class="ml-4 my-3" row wrap align-content-center align-center>
                <p class="subheading grey--text mb-0">Amount :</p>
              </v-layout>
            </div>
            {{OpArray}}
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  created() {
    if (this.Item.Options != null)
      Object.keys(this.Item.Options).forEach(key => {
        if (this.Item.Options[key].length != 0)
          this.OpArray.push(this.Item.Options[key][0]);
        else this.OpArray.push({});
      });
  },
  data() {
    return {
      OpArray: []
    };
  },
  computed: {
    ...mapState(["Stock"]),
    Item() {
      return this.Stock.find(ele => ele.id == this.$route.params.id).data();
    },
    Price() {
      return (
        this.Item.price +
        (this.OpArray.length == 0
          ? 0
          : this.OpArray.map(item => item.price).reduce(
              (sum, num) => parseFloat(sum) + parseFloat(num)
            ))
      );
    }
  }
};
</script>
