<template>
  <div>
    <v-layout row wrap justify-space-around class="mt-3 mx-5">
      <v-flex xs8>
        <v-card>
          <v-card-title class="pb-0">
            <p class="title mb-3">Your cart</p>
          </v-card-title>
          <v-divider inset class="mx-auto"></v-divider>
          <v-card-text>
            <v-data-table
              select-all
              hide-actions
              v-model="selected"
              :headers="headers"
              :items="getList"
              disable-initial-sort
              item-key="cartId"
            >
              <template v-slot:headers="props">
                <tr>
                  <th width="1%">
                    <v-checkbox
                      :input-value="props.all"
                      :indeterminate="props.indeterminate"
                      color="orange"
                      hide-details
                      @click.stop="toggleAll"
                    ></v-checkbox>
                  </th>
                  <th
                    :width="header.width"
                    :align="header.align"
                    v-for="header in props.headers"
                    :key="header.text"
                  >
                    <span class="subheading">{{ header.text }}</span>
                  </th>
                </tr>
              </template>
              <template v-slot:no-data>
                <v-layout row wrap justify-center>
                  <span class="text-xs-center">You cart is empty.</span>
                </v-layout>
              </template>
              <template v-slot:items="props">
                <tr :active="props.selected">
                  <td @click="props.selected = !props.selected">
                    <v-checkbox :input-value="props.selected" color="orange" hide-details></v-checkbox>
                  </td>
                  <td>
                    <v-card color="rgba(0, 0, 0, 0)" flat :to="'/Item/'+props.item.id">
                      <v-layout class="my-2" row wrap>
                        <v-flex xs3>
                          <v-img
                            max-width="75"
                            max-height="75"
                            :src="props.item.imgs==null?'':props.item.imgs[0]"
                            :lazy-src="props.item.imgs==null?'':props.item.imgs[0]"
                            aspect-ratio="1"
                          >
                            <template v-slot:placeholder>
                              <v-layout fill-height align-center justify-center ma-0>
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-layout>
                            </template>
                          </v-img>
                        </v-flex>
                        <v-flex xs9>
                          <div v-if="props.item.name!=null" class="mt-2 ml-2 text-truncate">
                            <p class="mb-1 subheading">{{ props.item.name }}</p>
                            <div v-if="props.item.OpSelected.length!=0">
                              <span
                                class="grey--text text-capitalize"
                                v-for="(item,index) in props.item.OpSelected"
                                :key="index"
                              >
                                {{(Object.values(props.item.Options))[index][item.id].name}}
                                <span
                                  v-if="props.item.OpSelected.length-1!=index"
                                >,</span>
                              </span>
                            </div>
                            <v-layout row wrap class="my-1">
                              <div
                                v-if="props.item.DiscountActive&&props.item.DiscountPer!=''&&props.item.DiscountPer!=null&&props.item.DiscountPer>0"
                                class="mr-1 orange white--text"
                              >
                                <span class="mx-2">- {{props.item.DiscountPer}} %</span>
                              </div>
                              <div
                                v-if="props.item.DiscountActive&&props.item.DiscountAmount!=null&&props.item.DiscountAmount!=''&&props.item.DiscountAmount>0"
                                class="mx-1 orange white--text"
                              >
                                <span class="mx-2">- {{props.item.DiscountAmount}} $</span>
                              </div>
                            </v-layout>
                            <span v-if="props.item.TaxActive" class="caption red--text">*With tax!</span>
                          </div>
                          <p v-else class="mt-2 ml-2 text-truncate orange--text">Loading...</p>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </td>
                  <td class="text-xs-center subheading">
                    <s
                      v-if="nonDiscountPrice(props.item)!=Price(props.item)"
                      class="grey--text caption"
                    >${{ props.item.price==null?0:nonDiscountPrice(props.item) }}</s>
                    <p>${{ props.item.price==null?0:Price(props.item) }}</p>
                  </td>
                  <td class="text-xs-center subheading">
                    <v-layout row wrap>
                      <v-icon
                        small
                        :disabled="props.item.amount<=1"
                        :style="{cursor:'pointer'}"
                        @click="decreaseAmount(props.item.cartId)"
                      >remove</v-icon>
                      <v-text-field
                        :style="{width:'10px'}"
                        color="orange"
                        class="centered-input"
                        v-model="props.item.amount"
                        @keypress="isNumber"
                        @blur="changeAmount($event,props.item.cartId,props.item)"
                      ></v-text-field>
                      <v-icon
                        small
                        :style="{cursor:'pointer'}"
                        @click="increaseAmount(props.item.cartId)"
                      >add</v-icon>
                    </v-layout>
                  </td>
                  <td
                    class="text-xs-center subheading orange--text"
                  >${{ (props.item.amount * (Price(props.item))).toFixed(2)}}</td>
                  <td class="text-xs-center red--text">
                    <v-icon :style="{cursor:'pointer'}" @click="onDelete(props.item.cartId)">delete</v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card :style="{position: 'fixed',width:'23%'}">
          <v-card-text class="pb-0">
            <p class="grey--text mb-1">Address</p>
            <v-layout row wrap>
              <v-flex xs2 class="text-xs-center">
                <v-icon>location_on</v-icon>
              </v-flex>
              <v-flex xs10>
                <v-select
                  v-model="address"
                  color="orange"
                  hide-details
                  class="pt-0 mt-0"
                  :items="userProfile.Address"
                >
                  <template v-slot:selection="{ item, index }">
                    <span class="caption">{{item.address}},{{item.city}}</span>
                  </template>
                  <template v-slot:item="{ item, index }">
                    <span class="caption">{{item.address}},{{item.city}}</span>
                  </template>
                </v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text class="pb-0">
            <p class="grey--text mb-1">Address</p>
            <v-layout row wrap>
              <v-flex xs2 class="text-xs-center">
                <v-icon>location_on</v-icon>
              </v-flex>
              <v-flex xs10>
                <p class="mb-0">{{address.firstname}} {{address.lastname}}</p>
                <p class="mb-0">{{address.address}} {{address.city}} {{address.company}}</p>
                <p>
                  {{address.state==null?'':address.state.name}}
                  <span
                    v-if="address.type!=null"
                  >({{address.type}})</span>
                  {{address.zip}}
                </p>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider class="mx-3"></v-divider>
          <v-card-title class="pb-3">
            <p class="title mb-1">Summary</p>
          </v-card-title>
          <v-card-text class="pt-0">
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Subtotal</p>
              <p class="mb-1">{{Subtotal}}</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Taxes</p>
              <p class="mb-1">{{Taxes}}</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Total</p>
              <p class="mb-1">{{Total}}</p>
            </v-layout>
            <v-btn block color="orange white--text">Place order</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    {{newSelected}}
  </div>
</template>
<style>
.centered-input input {
  max-height: 32px;
  text-align: center;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import vue from "vue";
export default {
  components: {},
  computed: {
    ...mapState(["userProfile", "Cart", "SettingStock"]),
    getList() {
      try {
        return this.Cart;
      } catch {
        return [];
      }
    },
    newSelected() {
      return this.selected.map(item => {
        return this.Cart.find(ele => ele.cartId == item.cartId);
      });
    },
    Subtotal() {
      return this.newSelected.length == 0
        ? 0
        : this.newSelected
            .map(item => parseFloat(item.amount) * parseFloat(this.Price(item)))
            .reduce((sum, num) => sum + num)
            .toFixed(2);
    },
    Taxes() {
      return this.newSelected.length == 0
        ? 0
        : this.newSelected
            .map(item =>
              !item.TaxActive
                ? 0
                : (parseFloat(this.SettingStock.TaxRate) / 100) *
                  parseFloat(item.amount) *
                  parseFloat(this.Price(item))
            )
            .reduce((sum, num) => sum + num)
            .toFixed(2);
    },
    Total() {
      return (parseFloat(this.Subtotal) + parseFloat(this.Taxes)).toFixed(2);
    }
  },
  methods: {
    ...mapMutations([
      "updateCartAmount",
      "increaseAmount",
      "decreaseAmount",
      "deleteCart"
    ]),
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
    },
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.getList;
    },
    onDelete(id) {
      this.$confirm("Do you really want to delete?").then(res => {
        if (res) this.deleteCart(id);
      });
    },
    isNumber(event) {
      var ch = String.fromCharCode(event.which);
      if (!/[0-9]/.test(ch)) {
        event.preventDefault();
      }
    },
    changeAmount(event, id, item) {
      if (event.target.value <= 0 || event.target.value == "") item.amount = 1;
      var payload = { value: event.target.value, id: id };
      this.updateCartAmount(payload);
    }
  },
  mounted() {
    this.address = Object.assign(
      {},
      this.userProfile.Address[this.userProfile.defaultAddress]
    );
  },
  data() {
    return {
      address: {},
      selected: [],
      headers: [
        {
          text: "Item Description",
          align: "left",
          sortable: false,
          value: "name",
          width: "50%"
        },
        { text: "Unit price", value: "price" },
        { text: "Amount", value: "fat" },
        { text: "Line total", sortable: false },
        { text: "Actions", sortable: false }
      ]
    };
  }
};
</script>
