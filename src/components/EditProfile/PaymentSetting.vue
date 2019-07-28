<template>
  <div>
    <v-dialog v-model="createDialog" width="600">
      <v-card>
        <v-card-title class="pb-0">
          <p class="title">Add card</p>
        </v-card-title>
        <v-card-text class="pt-0">
          <v-layout row wrap justify-center>
            <v-flex lg10>
              <span class="caption grey--text">Credit or debit card</span>
              <div id="card-number-element" class="input-value"></div>
              <div class="center-align red--text">{{stripeValidationError}}</div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small class="orange white--text" @click="Enter">
            <v-icon dark class="mr-1">add</v-icon>Add
          </v-btn>
          <v-btn small flat color="secondary" @click="createDialog=false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card :style="{'border-radius':'10px'}">
      <v-card-title class="pb-0">
        <p class="title">Payment</p>
        <v-spacer></v-spacer>
        <v-btn color="orange" @click="createDialog=true" class="white--text">
          <v-icon dark class="mr-1">add</v-icon>Add card
        </v-btn>
      </v-card-title>
      <v-card-text v-for="(item,index) in Cards" :key="index">
        <v-divider inset class="mx-auto"></v-divider>
        <v-layout class="py-3 mx-0" row wrap>
          <v-flex xs8>
            <v-layout row wrap align-center>
              <v-flex class="px-4" xs2>
                <v-img :src="require('payment-icons/min/flat/'+item.brand.toLowerCase()+'.svg')"></v-img>
              </v-flex>
              <v-flex xs5>
                <p class="mb-0 subheading">{{item.brand}}</p>
              </v-flex>
              <v-flex xs5>
                <p class="mb-0 subheading">**** **** **** {{item.last4}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4 justify-center>
            <v-layout row wrap justify-end align-center align-content-center>
              <div v-if="item.id===(userProfile.Stripe.default_source)" class="text-xs-center mx-2">
                <v-chip class="my-0" small color="orange" text-color="white">Default</v-chip>
              </div>
              <p
                :style="{ cursor: 'pointer','text-decoration': 'underline'}"
                class="mx-2 text-xs-center red--text mb-0"
                @click="deleteCard(item)"
              >Delete</p>
              <v-btn
                class="mx-2"
                :disabled="item.id===(userProfile.Stripe.default_source)"
                small
                @click="ChangeDefaultCard(item)"
              >Set as default</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Card, createToken } from "vue-stripe-elements-plus";
import { publishKey, secretKey } from "../../stripe";
import { mapMutations, mapState } from "vuex";
const stripe = Stripe(publishKey);
export default {
  computed: {
    ...mapState(["userProfile"]),
    Cards() {
      try {
        return this.userProfile.Stripe.sources.data;
      } catch {
        return [];
      }
    }
  },
  data() {
    return {
      complete: false,
      publishKey: publishKey,
      cardNumberElement: null,
      stripeValidationError: null,
      createDialog: false
    };
  },
  mounted() {
    this.createAndMountFormElement();
  },
  methods: {
    ...mapMutations(["CreateCard", "ChangeDefaultCard", "DeleteCard"]),
    deleteCard(item) {
      this.$confirm("Do you really want to delete?").then(res => {
        if (res) this.DeleteCard(item);
      });
    },
    setValidationError(event) {
      this.stripeValidationError = event.error ? event.error.message : "";
    },
    Change() {
      this.CreateCard({ data: "test" });
    },
    Enter() {
      stripe.createToken(this.cardNumberElement).then(result => {
        if (result.error) {
          this.stripeValidationError = result.error.message;
        } else {
          this.CreateCard(result.token);
          this.createDialog = false;
        }
      });
    },
    createAndMountFormElement() {
      var style = {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };
      var elements = stripe.elements();
      this.cardNumberElement = elements.create("card", { style: style });
      this.cardNumberElement.on("change", this.setValidationError);
      this.cardNumberElement.mount("#card-number-element");
    }
  }
};
</script>
<style>
.StripeElement {
  border-bottom: 1px solid grey;
  border-bottom-color: grey;
  box-sizing: border-box;

  height: 40px;
  padding: 10px 12px;

  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}
.StripeElement--focus {
  border-bottom-color: orange;
}
.StripeElement--invalid {
  border-bottom-color: #fa755a;
}
</style>