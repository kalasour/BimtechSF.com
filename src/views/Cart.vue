<template>
  <div>
    <v-card class="mx-5 mt-3">
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
          <template v-slot:items="props">
            <tr :active="props.selected">
              <td @click="props.selected = !props.selected">
                <v-checkbox :input-value="props.selected" color="orange" hide-details></v-checkbox>
              </td>
              <td>
                <v-layout class="my-2" row wrap>
                  <v-img
                    max-width="75"
                    max-height="75"
                    :src="props.item.imgs==null?'':props.item.imgs[0]"
                    aspect-ratio="1"
                  >
                    <template v-slot:placeholder>
                      <v-layout fill-height align-center justify-center ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </template>
                  </v-img>
                  <span class="mt-2 ml-2 text-truncate">{{ props.item.name }}</span>
                </v-layout>
              </td>
              <td class="text-xs-center subheading">{{ props.item.price }}</td>
              <td class="text-xs-center subheading">
                <v-layout row wrap>
                  <v-icon
                    :disabled="props.item.amount<=1"
                    :style="{cursor:'pointer'}"
                    @click="decreaseAmount(props.item.id)"
                  >remove</v-icon>
                  <v-text-field
                    :style="{width:'10px'}"
                    color="orange"
                    placeholder="0"
                    class="centered-input"
                    v-model="props.item.amount"
                    type="number"
                    @blur="updateCart"
                  ></v-text-field>
                  <v-icon :style="{cursor:'pointer'}" @click="increaseAmount(props.item.id)">add</v-icon>
                </v-layout>
              </td>
              <td
                class="text-xs-center subheading orange--text"
              >{{ props.item.amount * props.item.price}}</td>
              <td class="text-xs-center red--text">
                <v-icon :style="{cursor:'pointer'}">delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
export default {
  components: {},
  computed: {
    ...mapState(["userProfile", "Cart"]),
    getList() {
      try {
        return this.Cart
      } catch {
        return [];
      }
    }
  },
  methods: {
    ...mapMutations(["updateCart", "increaseAmount", "decreaseAmount"]),
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.getList;
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
