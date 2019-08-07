<template>
  <v-layout row wrap justify-center class="my-2">
    <v-flex md12 lg10>
      <v-card>
        <v-toolbar flat color="orange" dark>
          <v-toolbar-title>User Profile</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical>
          <v-tab>
            <v-icon left>person</v-icon>Information
          </v-tab>
          <v-tab>
            <v-icon left>lock</v-icon>Invoices
          </v-tab>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p class="mb-1">
                  <span class="grey--text">Name :</span>
                  {{User.displayName+' '+User.lastname}}
                </p>
                <p class="mb-1">
                  <span class="grey--text">E-mail :</span>
                  {{User.email}}
                </p>
                <div v-if="User.email">
                  <v-btn
                    dark
                    color="secondary"
                    @click="ChangeStateUser({id:$route.params.uid,state:!User.isAdmin})"
                    v-if="User.isAdmin"
                  >Disable admin</v-btn>
                  <v-btn
                    dark
                    @click="ChangeStateUser({id:$route.params.uid,state:!User.isAdmin})"
                    color="orange"
                    v-else
                  >Change to admin</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-layout row wrap justify-center>
                  <v-flex md12 xs12 lg10 v-for="(item,index) in Charges" :key="index">
                    <Invoice class="mt-2" :Item="item" />
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { firestore } from "../../firebase";
import { mapMutations } from "vuex";
import Vue from "vue";
export default {
  data() {
    return {
      User: {},
      Charges: []
    };
  },
  created() {
    this.fetchUser();
  },
  watch: {
    User: function() {
      this.fetchCharges();
    }
  },
  computed: {
    stripeId() {
      try {
        return this.User.Stripe.id;
      } catch {
        return "";
      }
    }
  },
  methods: {
    ...mapMutations(["ChangeStateUser"]),
    fetchCharges() {
      firestore
        .collection("Charges")
        .where("customer", "==", this.stripeId)
        .onSnapshot(snap => {
          snap.docs.forEach((item, index) => {
            Vue.set(this.Charges, index, item.data());
          });
        });
    },
    fetchUser() {
      firestore
        .collection("Users")
        .doc(this.$route.params.uid)
        .onSnapshot(snap => {
          this.User = Object.assign({}, snap.data());
        });
    }
  },
  components: {}
};
</script>
