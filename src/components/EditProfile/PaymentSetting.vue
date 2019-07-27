<template>
  <div>
    <v-card :style="{'border-radius':'10px'}">
      <v-card-title>
        <p class="title">Payment</p>
        <v-spacer></v-spacer>
        <v-btn color="orange" class="white--text">
          <v-icon dark class="mr-1">add</v-icon>Create
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-divider inset class="mx-auto"></v-divider>
        <div class="error red center-align white--text">{{stripeValidationError}}</div>
        <section class="row payment-form">
          <h5 class="#e0e0e0 grey lighten-4">
            Payment Method
            <span class="right">$25</span>
          </h5>

          <div class="error red center-align white-text"></div>

          <div class="col s12 card-element">
            <label>Card Number</label>
            <div id="card-number-element" class="input-value"></div>
          </div>

          <div class="col s6 card-element">
            <label>Expiry Date</label>
            <div id="card-expiry-element"></div>
          </div>

          <div class="col s6 card-element">
            <label>CVC</label>
            <div id="card-cvc-element"></div>
          </div>

          <div class="col s12 place-order-button-block">
            <v-btn class="orange white--text" @click="Enter">Add card</v-btn>
            <v-btn class="orange white--text" @click="Change">test</v-btn>
          </div>
        </section>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Card, createToken } from "vue-stripe-elements-plus";
import { publishKey, secretKey } from "../../stripe";
import { mapMutations } from "vuex";
const stripe = Stripe(publishKey);
export default {
  data() {
    return {
      complete: false,
      publishKey: publishKey,
      cardNumberElement: null,
      cardExpiryElement: null,
      cardCVCElement: null,
      stripeValidationError: null
    };
  },
  mounted() {
    this.createAndMountFormElement();
  },
  methods: {
    ...mapMutations(["CreateCard"]),
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
        }
      });
    },
    createAndMountFormElement() {
      var elements = stripe.elements();
      this.cardNumberElement = elements.create("cardNumber");
      this.cardNumberElement.on("change", this.setValidationError);
      this.cardNumberElement.mount("#card-number-element");
      this.cardExpiryElement = elements.create("cardExpiry");
      this.cardExpiryElement.on("change", this.setValidationError);
      this.cardExpiryElement.mount("#card-expiry-element");
      this.cardCVCElement = elements.create("cardCvc");
      this.cardCVCElement.on("change", this.setValidationError);
      this.cardCVCElement.mount("#card-cvc-element");
    }
  }
};
</script>
<style>
.stripe-card {
  width: 400px;
  border-bottom: 1px solid grey;
}
.stripe-card.complete {
  border-bottom-color: green;
}
</style>