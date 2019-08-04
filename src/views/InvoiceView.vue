<template>
  <v-app>
    <v-layout row wrap justify-center>
      <v-flex xs12 lg10 md12>
        <v-layout xs12 column wrap>
          <v-card class="grey lighten-3 mt-3" :style="{'border-radius':'10px'}">
            <v-card-title>
              <p class="title mb-0">Order(s) tracking</p>
            </v-card-title>
          </v-card>
          <v-card
            style="border-radius: 10px;"
            class="ma-2"
            v-for="(item,i) in Charge.List"
            :key="i"
          >
            <v-container fluid>
              <v-flex>
                <v-img max-width="150" max-height="150" class="size" :src="item.imgs[0]"></v-img>
              </v-flex>
              <v-card-title>
                <div style="font-size: 20px" class="title">{{ item.name }}</div>
                <p class="mb-0 mx-2 subheading grey--text">x</p>
                <div class="text-uppercase" style="font-size: 20px;">{{ item.amount }}</div>
                <v-spacer></v-spacer>
                <template>
                  <v-btn @click.stop="toggleNo = !toggleNo" flat>
                    More informations
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-btn>
                </template>
              </v-card-title>
              <v-flex>
                <v-card-title v-if="(item.OpSelected).length !== 0">
                  <div class="grey--text" style="font-size: 15px">Option : {{' '}}</div>
                  <div v-if="item.OpSelected.length!=0" class="mx-2">
                    <span
                      class="text-capitalize"
                      v-for="(it,ind) in item.OpSelected"
                      :key="ind"
                    >
                      {{(Object.values(item.Options))[ind][it.id].name}}
                      <span
                        v-if="item.OpSelected.length-1!=ind"
                      >,</span>
                    </span>
                  </div>
                </v-card-title>
              </v-flex>
              <v-divider></v-divider>

              <v-container v-if="toggleNo">
                <v-card-text transition="slide-y-transition">
                  <v-icon color="red">location_on</v-icon>
                  <div
                    style="font-size: 15px; display: inline "
                    class="black--text mb-1"
                  >Delivering address</div>
                  <v-layout row wrap>
                    <v-flex xs10>
                      <p class="mb-0">{{Charge.Address.firstname}} {{Charge.Address.lastname}}</p>
                      <p>Tel.{{Charge.Address.phone}}</p>
                      <p
                        class="mb-0 grey--text"
                      >{{Charge.Address.address}} {{Charge.Address.city}} {{Charge.Address.company}}</p>
                      <p class="grey--text">
                        {{Charge.Address.state==null? '' : Charge.Address.state.name}}
                        <span
                          v-if="Charge.Address.type!=null"
                        >({{Charge.Address.type}})</span>
                        {{Charge.Address.zip}}
                      </p>
                    </v-flex>
                  </v-layout>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-title>
                  <div class="grey--text" style="font-size: 20px;">{{ item.amount }} Piece(s)</div>
                  <v-spacer></v-spacer>
                  <div class="grey--text" style="fontsize: 30">Amount to be paid:</div>
                  <v-icon color="orange">attach_money</v-icon>
                  <div class="text-uppercase orange--text" style="font-size: 20px;">{{ item.price }}</div>
                </v-card-title>
                <v-card-title>
                  <h2 class="grey--text">status:</h2>
                  <div
                    class="text-uppercase green--text"
                    style="font-size: 20px"
                  >{{ Charge.status }}</div>
                </v-card-title>
              </v-container>
            </v-container>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<style>
.size {
  max-width: 200px;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import { firestore } from "../firebase";
export default {
  components: {},
  data() {
    return {
      Ch: {},
      toggleNo: false
    };
  },
  computed: {
    ...mapState(["Charges", "userProfile"]),
    Charge() {
      if (!this.userProfile.isAdmin)
        return this.Charges.find(ele => ele.id == this.$route.params.Id);
      else {
        firestore
          .collection("Charges")
          .where("id", "==", this.$route.params.Id)
          .onSnapshot(snap => {
            snap.docs.forEach(item => {
              this.Ch = Object.assign({}, item.data());
            });
          });
        return this.Ch;
      }
    }
  }
};
</script>
