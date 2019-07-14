<template>
  <div>
    <v-layout row wrap justify-space-around class="mt-3 mx-5">
      <v-flex xs8>
        <v-card>
          <v-card-title class="pb-0">
            <p class="title mb-1">Your cart</p>
          </v-card-title>
          <v-divider inset class="mx-auto"></v-divider>
          <v-card-text>
            <v-data-table
              select-all
              hide-actions
              v-model="selected"
              :headers="headers"
              :items="getList"
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
                        <p class="mt-2 ml-2 text-truncate">{{ props.item.name }}</p>
                      </v-flex>
                    </v-layout>
                  </td>
                  <td class="text-xs-center subheading">${{ props.item.price }}</td>
                  <td class="text-xs-center subheading">
                    <v-layout row wrap>
                      <v-icon
                        small
                        :disabled="props.item.amount<=1"
                        :style="{cursor:'pointer'}"
                        @click="decreaseAmount(props.item.id)"
                      >remove</v-icon>
                      <v-text-field
                        :style="{width:'10px'}"
                        color="orange"
                        class="centered-input"
                        v-model="props.item.amount"
                        @keypress="isNumber"
                        @blur="changeAmount($event,props.item.id,props.item)"
                      ></v-text-field>
                      <v-icon
                        small
                        :style="{cursor:'pointer'}"
                        @click="increaseAmount(props.item.id)"
                      >add</v-icon>
                    </v-layout>
                  </td>
                  <td
                    class="text-xs-center subheading orange--text"
                  >${{ props.item.amount * props.item.price}}</td>
                  <td class="text-xs-center red--text">
                    <v-icon :style="{cursor:'pointer'}" @click="onDelete(props.item.id)">delete</v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card>
          <v-card-text class="pb-0">
            <p class="grey--text mb-1">Address</p>
            <v-layout row wrap>
              <v-flex xs2 class="text-xs-center">
                <v-icon>location_on</v-icon>
              </v-flex>
              <v-flex xs10>
                <p>เชียงใหม่/ Chiang Mai,เมืองเชียงใหม่/ Mueang Chiang Mai,50200</p>
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
              <p class="mb-1">12</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Taxes</p>
              <p class="mb-1">12</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Discounted</p>
              <p class="mb-1">12</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Total</p>
              <p class="mb-1">12</p>
            </v-layout>
            <v-btn block color="orange white--text">Place order</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    {{selected}}
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
    ...mapState(["userProfile", "Cart"]),
    getList() {
      try {
        return this.Cart;
      } catch {
        return [];
      }
    }
  },
  methods: {
    ...mapMutations([
      "updateCartAmount",
      "increaseAmount",
      "decreaseAmount",
      "deleteCart"
    ]),
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
      if (!/[1-9]/.test(ch)) {
        event.preventDefault();
      }
    },
    changeAmount(event, id, item) {
      if (event.target.value <= 0 || event.target.value == "") item.amount = 1;
      var payload = { value: event.target.value, id: id };
      this.updateCartAmount(payload);
    }
  },
  data() {
    return {
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
        { text: "Subtotal", sortable: false },
        { text: "Actions", sortable: false }
      ]
    };
  }
};
</script>
