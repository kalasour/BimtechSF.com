<template>
  <div>
    <v-card class="mx-5 mt-3">
      <v-card-title class="pb-0">
        <p class="title mb-1">Your cart</p>
      </v-card-title>
      <v-divider inset class="mx-auto"></v-divider>
      <v-card-text>
        <v-data-table select-all hide-actions v-model="selected" :headers="headers" :items="getList">
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
              >{{ header.text }}</th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox :input-value="props.selected" color="orange" hide-details></v-checkbox>
              </td>
              <td>{{ props.item }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    {{selected}}
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["userProfile"]),
    getList() {
      try {
        return this.userProfile.Cart;
      } catch {
        return [];
      }
    }
  },
  methods: {
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
