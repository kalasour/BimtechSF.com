<template>
  <div>
    <v-dialog width="550" v-model="dialog">
      <v-card>
        <v-card-title class="pb-0">
          <p class="title">{{index==-1?'Create':'Edit'}}</p>
        </v-card-title>
        <v-card-text class="mt-0 pt-0">
          <v-form class="mt-0 pt-0" @submit.prevent="submit" v-model="valid">
            <v-container class="pt-0">
              <v-layout column>
                <v-flex xs12 md12>
                  <v-text-field
                    v-model="selected.firstname"
                    hide-details
                    :rules="nameRules"
                    label="First name"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md12>
                  <v-text-field
                    v-model="selected.lastname"
                    hide-details
                    :rules="nameRules"
                    label="Last name"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field v-model="selected.company" hide-details label="Company" required></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <v-textarea
                    v-model="selected.address"
                    :rules="nameRules"
                    label="Address"
                    required
                    auto-grow
                    hide-details
                    rows="2"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    hide-details
                    v-model="selected.city"
                    :rules="nameRules"
                    label="City"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-combobox
                    hide-details
                    v-model="selected.state"
                    :items="state"
                    label="State"
                    item-text="name"
                    item-value="name"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    hide-details
                    v-model="selected.zip"
                    label="Zip / Postal Code"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    hide-details
                    v-model="selected.phone"
                    type="number"
                    label="Phone Number"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-layout row justify-end>
              <v-btn color="pink" class="white--text" type="submit">SUBMIT</v-btn>
              <v-btn color="secondary" flat @click="close">CLOSE</v-btn>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title class="mx-3">
        <p class="headline">Address</p>
        <v-spacer></v-spacer>
        <v-btn color="pink" class="white--text" @click="dialog=true">
          <v-icon dark class="mr-1">add</v-icon>Create
        </v-btn>
      </v-card-title>
      <v-divider inset class="mx-auto"></v-divider>
      <v-card-text>

        {{userProfile.Address}}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import State from "../../assets/state";
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      valid: false,
      state: State,
      nameRules: [v => !!v || "required"],
      dialog: false,
      selected: {},
      index: -1
    };
  },
  computed:{
    ...mapState(['userProfile'])
  },
  methods: {
    ...mapMutations(["updateAddress"]),
    submit() {
      var payload = {};
      payload.index = this.index;
      payload.data = this.selected;
      this.updateAddress(payload);
    },
    close() {
      this.dialog = false;
      this.index = -1;
      this.selected = {};
    }
  }
};
</script>
