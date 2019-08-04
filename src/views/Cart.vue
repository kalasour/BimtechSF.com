<template>
  <div>
    <v-dialog width="1200" v-model="addressManageDialog">
      <v-card>
        <AddressSetting />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addressManageDialog=false" flat color="secondary">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="900" v-model="addressDialog">
      <v-card>
        <v-card-title class="pb-3">
          <span class="title">Your address</span>
          <v-spacer></v-spacer>
          <v-btn @click="addressManageDialog=true" flat>
            <v-icon class="mr-2" color="orange orange--text">add_location</v-icon>Manage Address
          </v-btn>
          <v-icon @click="addressDialog=false" class="red--text" :style="{cursor:'pointer'}">clear</v-icon>
        </v-card-title>
        <v-card-text class="py-0">
          <v-layout justify-space-around align-center align-content-center row wrap>
            <span v-if="!userProfile.Address">Empty</span>
            <v-flex
              v-else
              xs11
              :class="(index==addressIndex?'orange':'black')+'--text ma-2 py-2 px-3'"
              v-for="(item,index) in userProfile.Address"
              @click="addressIndex=index;"
              :style="{cursor:'pointer',border:'1px solid '+(index==addressIndex?'orange':'grey')}"
              :key="index"
            >
              <div class="my-auto py-auto">
                <span>
                  <v-icon small class="mr-2" color="orange" v-if="index==addressIndex">check_box</v-icon>
                  <v-icon small class="mr-2" v-else>check_box_outline_blank</v-icon>
                </span>
                <span>{{item.firstname}} {{item.lastname}} {{item.phone}} {{item.address}} {{item.city}} {{item.company}}</span>
                <span>
                  {{item.state==null?'':item.state.name}}
                  <span
                    v-if="item.type!=null"
                  >({{item.type}})</span>
                  {{item.zip}}
                </span>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="orange white--text" @click="addressDialog=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="1200" v-model="paymentManageDialog">
      <v-card>
        <PaymentSetting />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="paymentManageDialog=false" flat color="secondary">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="600" v-model="paymentDialog">
      <v-card>
        <v-card-title class="pb-3">
          <span class="title">Your Payment Method</span>
          <v-spacer></v-spacer>
          <v-btn @click="paymentManageDialog=true" flat>
            <v-icon class="mr-2" color="orange orange--text">credit_card</v-icon>Manage Payment Method
          </v-btn>
          <v-icon @click="paymentDialog=false" class="red--text" :style="{cursor:'pointer'}">clear</v-icon>
        </v-card-title>
        <v-card-text class="py-0">
          <v-layout justify-space-around align-center align-content-center row wrap>
            <span v-if="!userProfile.Stripe.sources.data">Empty</span>
            <v-flex
              v-else
              xs11
              :class="(index==paymentIndex?'orange':'black')+'--text ma-2 py-2 px-3'"
              v-for="(item,index) in userProfile.Stripe.sources.data"
              @click="paymentIndex=index;"
              :style="{cursor:'pointer',border:'1px solid '+(index==paymentIndex?'orange':'grey')}"
              :key="index"
            >
              <div class="my-auto py-auto">
                <v-layout row wrap>
                  <v-flex xs1>
                    <span>
                      <v-icon small color="orange" v-if="index==paymentIndex">check_box</v-icon>
                      <v-icon small v-else>check_box_outline_blank</v-icon>
                    </span>
                  </v-flex>
                  <v-flex xs1 class="text-xs-center">
                    <v-img
                      :src="require('payment-icons/min/flat/'+item.brand.toLowerCase()+'.svg')"
                    ></v-img>
                  </v-flex>
                  <v-flex xs10 class="pl-3">
                    <p>{{item.brand}} **** **** **** {{item.last4}}</p>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="orange white--text" @click="paymentDialog=false">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="300" v-model="updateDialog">
      <v-card>
        <v-card-title class="pb-0">
          <p class="title">Has changed</p>
          <v-spacer></v-spacer>
          <v-icon @click="updateDialog=false" class="red--text" :style="{cursor:'pointer'}">clear</v-icon>
        </v-card-title>
        <v-card-text class="pt-0">
          <div
            class="black--text text-capitalize"
            v-for="(item,index) in updateTemp.OpSelected"
            :key="index"
          >
            <span
              v-if="item.price!=updateTemp.newOp[index][item.id].price||item.name!=(updateTemp.newOp)[index][item.id].name"
            >
              {{item.name}} (${{item.price}}) ->
              {{(updateTemp.newOp)[index][item.id].name}}
              (${{(updateTemp.newOp)[index][item.id].price}})
              <span
                v-if="updateTemp.OpSelected.length-1!=index"
              ></span>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout
      row
      wrap
      justify-space-around
      class="mt-3"
      :class="{'mx-0': $vuetify.breakpoint.xsAndUp, 'mx-5': $vuetify.breakpoint.lgAndUp}"
    >
      <v-flex xs12 lg8>
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
                                <span v-else>
                                  <u
                                    v-if="isChanged(props.item)"
                                    @click.prevent.stop="updateHandle(props.item)"
                                    class="red--text"
                                  >Updated!</u>
                                </span>
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
      <v-flex xs10 lg3>
        <v-card v-if="$vuetify.breakpoint.lgAndUp" :style="{position: 'fixed',width:'23%'}">
          <v-card-text @click="addressDialog=true" :style="{cursor:'pointer'}" class="pb-0">
            <v-layout row wrap>
              <p class="grey--text mb-1">Address</p>
              <v-spacer></v-spacer>
              <p class="orange--text mb-1">
                <v-icon small class="orange--text mr-1">edit</v-icon>Edit
              </p>
            </v-layout>
            <v-layout v-if="Object.values(address).length!=0" row wrap>
              <v-flex xs2 class="text-xs-center">
                <v-icon>location_on</v-icon>
              </v-flex>
              <v-flex xs10>
                <p class="mb-0">{{address.firstname}} {{address.lastname}} {{address.phone}}</p>
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
          <v-card-text @click="paymentDialog=true" :style="{cursor:'pointer'}" class="pb-0 pt-1">
            <v-layout row wrap>
              <p class="grey--text mb-1">Payment</p>
              <v-spacer></v-spacer>
              <p class="orange--text mb-1">
                <v-icon small class="orange--text mr-1">edit</v-icon>Edit
              </p>
            </v-layout>
            <v-layout v-if="Object.values(card).length!=0" row wrap>
              <v-flex xs2 class="text-xs-center">
                <v-img :src="require('payment-icons/min/flat/'+card.brand.toLowerCase()+'.svg')"></v-img>
              </v-flex>
              <v-flex xs10 class="pl-3">
                <p>{{card.brand}} **** **** **** {{card.last4}}</p>
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
              <p class="mb-1">${{Subtotal}}</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Taxes ({{SettingStock.TaxRate}}%)</p>
              <p class="mb-1">${{Taxes}}</p>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <p class="mb-1">Total</p>
              <p class="mb-1 orange--text title">${{Total}}</p>
            </v-layout>
            <v-btn block @click="placeOrder" color="orange white--text">Place order</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card
      :style="{position:'sticky',bottom:'0%',left:'0%',width:'100%'}"
      v-if="$vuetify.breakpoint.xs"
      class="mt-3"
    >
      <v-card-text @click="addressDialog=true" :style="{cursor:'pointer'}" class="pb-0">
        <p class="grey--text mb-1">Address</p>
        <v-layout row wrap>
          <v-flex xs2 class="text-xs-center">
            <v-icon>location_on</v-icon>
          </v-flex>
          <v-flex xs10>
            <p class="mb-0">{{address.firstname}} {{address.lastname}} {{address.phone}}</p>
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
          <p class="mb-1">${{Subtotal}}</p>
        </v-layout>
        <v-layout row wrap justify-space-between>
          <p class="mb-1">Taxes ({{SettingStock.TaxRate}}%)</p>
          <p class="mb-1">${{Taxes}}</p>
        </v-layout>
        <v-layout row wrap justify-space-between>
          <p class="mb-1">Total</p>
          <p class="mb-1 orange--text title">${{Total}}</p>
        </v-layout>
        <v-btn block color="orange white--text">Place order</v-btn>
      </v-card-text>
    </v-card>
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
import AddressSetting from "./../components/EditProfile/AddressSetting";
import PaymentSetting from "./../components/EditProfile/PaymentSetting";
export default {
  components: { AddressSetting, PaymentSetting },
  computed: {
    ...mapState(["userProfile", "Cart", "SettingStock"]),
    getList() {
      try {
        return this.Cart;
      } catch {
        return [];
      }
    },
    address() {
      try {
        return Object.assign({}, this.userProfile.Address[this.addressIndex]);
      } catch {
        return {};
      }
    },
    card() {
      try {
        return Object.assign(
          {},
          this.userProfile.Stripe.sources.data[this.paymentIndex]
        );
      } catch {
        return {};
      }
    },
    newSelected() {
      return this.selected
        .map(item => {
          return this.Cart.find(ele => ele.cartId == item.cartId);
        })
        .filter(function(el) {
          return el != null;
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
      "deleteCart",
      "openSnackbar",
      "PlaceOrder"
    ]),
    placeOrder() {
      if (
        this.address == {} ||
        this.address == null ||
        Object.values(this.address).length == 0
      ) {
        this.openSnackbar("Please enter your address.");
        return;
      }
      if (
        this.card == {} ||
        this.card == null ||
        Object.values(this.card).length == 0
      ) {
        this.openSnackbar("Please enter your payment method.");
        return;
      }
      if (this.selected.length == 0) {
        this.openSnackbar("Please select item.");
        return;
      }
      var invoiceObject = {};
      invoiceObject.List = Object.assign([], this.selected);
      invoiceObject.Source = Object.assign({}, this.card);
      invoiceObject.Address = Object.assign({}, this.address);
      invoiceObject.SubTotal = this.Subtotal;
      invoiceObject.Taxes = this.Taxes;
      invoiceObject.Total = this.Total;
      this.PlaceOrder(invoiceObject);
    },
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
    },
    isChanged(Item) {
      var val = false;
      Item.OpSelected.forEach((item, index) => {
        if (
          Object.values(Item.Options)[index][item.id].name != item.name ||
          Object.values(Item.Options)[index][item.id].price != item.price
        ) {
          val = true;
        }
      });

      return val;
    },
    updateHandle(item) {
      this.updateTemp = item;
      this.updateTemp.newOp = Object.values(this.updateTemp.Options);
      this.updateDialog = true;
    }
  },
  mounted() {
    this.addressIndex =
      this.userProfile.defaultAddress == null
        ? 0
        : this.userProfile.defaultAddress;
  },
  data() {
    return {
      updateDialog: false,
      addressDialog: false,
      addressManageDialog: false,
      addressIndex: -1,
      paymentDialog: false,
      paymentManageDialog: false,
      paymentIndex: 0,
      selected: [],
      updateTemp: {},
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
