<template>
  <div>
    <v-dialog persistent width="550" v-model="dialog">
      <v-card>
        <v-card-title class="pb-0">
          <p class="title">{{index==-1?'Create':'Edit'}}</p>
        </v-card-title>
        <v-card-text class="mt-0 pt-0">
          <v-form class="mt-0 pt-0" @submit.prevent="submit">
            <v-container class="pt-0">
              <v-layout column>
                <v-flex xs12 md12>
                  <v-text-field
                    v-model="selected.firstname"
                    label="First name"
                    hide-details
                    :error-messages="nameErrors"
                    @input="$v.selected.firstname.$touch()"
                    @blur="$v.selected.firstname.$touch()"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md12>
                  <v-text-field
                    v-model="selected.lastname"
                    hide-details
                    :error-messages="lastnameErrors"
                    label="Last name"
                    @input="$v.selected.lastname.$touch()"
                    @blur="$v.selected.lastname.$touch()"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field v-model="selected.company" hide-details label="Company"></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <v-textarea
                    v-model="selected.address"
                    label="Address"
                    :error-messages="addressErrors"
                    required
                    @input="$v.selected.address.$touch()"
                    @blur="$v.selected.address.$touch()"
                    auto-grow
                    hide-details
                    rows="2"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    hide-details
                    v-model="selected.city"
                    label="City"
                    :error-messages="cityErrors"
                    required
                    @input="$v.selected.city.$touch()"
                    @blur="$v.selected.city.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-combobox
                    hide-details
                    v-model="selected.state"
                    :items="state"
                    label="State"
                    :error-messages="stateErrors"
                    required
                    @input="$v.selected.state.$touch()"
                    @blur="$v.selected.state.$touch()"
                    item-text="name"
                    item-value="name"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    hide-details
                    v-model="selected.zip"
                    label="Zip / Postal Code"
                    :error-messages="zipErrors"
                    required
                    @input="$v.selected.zip.$touch()"
                    @blur="$v.selected.zip.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    hide-details
                    v-model="selected.phone"
                    type="number"
                    label="Phone Number"
                    :error-messages="phoneErrors"
                    required
                    @input="$v.selected.phone.$touch()"
                    @blur="$v.selected.phone.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-radio-group
                  v-model="selected.type"
                  label="Type Of Address"
                  row
                  :mandatory="false"
                >
                  <v-radio label="Residential" value="Residential"></v-radio>
                  <v-radio label="Business" value="Business"></v-radio>
                </v-radio-group>
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
        <v-btn color="pink" class="white--text" @click="open(-1)">
          <v-icon dark class="mr-1">add</v-icon>Create
        </v-btn>
      </v-card-title>

      <v-card-text class="py-0" v-for="(item,index) in userProfile.Address" :key="index">
        <v-divider inset class="mx-auto"></v-divider>
        <v-layout class="py-3 mx-0" row>
          <v-flex xs10>
            <v-layout row wrap align-center>
              <v-flex class="px-4" xs2>
                <p class="grey--text text-xs-right mb-0">Name</p>
              </v-flex>
              <v-flex xs10>
                <v-layout row>
                  <p class="mb-0 subheading">{{item.firstname+' '+item.lastname}}</p>
                  <v-spacer></v-spacer>
                  <div
                    v-if="index===(userProfile.defaultAddress==null?0:userProfile.defaultAddress)"
                    class="text-xs-center"
                  >
                    <v-chip small color="pink" text-color="white">Default address</v-chip>
                  </div>
                </v-layout>
              </v-flex>
              <v-flex class="px-4" xs2>
                <p class="grey--text text-xs-right mb-0">Phone</p>
              </v-flex>
              <v-flex xs10>
                <p class="mb-0">{{item.phone}}</p>
              </v-flex>
              <v-flex class="px-4" xs2>
                <p class="grey--text text-xs-right mb-0">Address</p>
              </v-flex>
              <v-flex xs10>
                <p class="mb-0">{{item.address+' '+item.company+' '+item.city}}</p>
                <p class="mb-0">{{item.state.name}}</p>
                <p class="mb-0">{{item.zip}}</p>
              </v-flex>
              <v-flex v-if="item.type" class="px-4" xs2>
                <p class="grey--text text-xs-right mb-0">Type</p>
              </v-flex>
              <v-flex v-if="item.type" xs10>
                <p class="mb-0 caption">{{item.type}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs2 justify-center>
            <v-layout row wrap justify-space-around>
              <p
                :style="{ cursor: 'pointer','text-decoration': 'underline'}"
                @click="open(index)"
                class="text-xs-center"
              >Edit</p>
              <p
                :style="{ cursor: 'pointer','text-decoration': 'underline'}"
                class="text-xs-center red--text"
                @click="Delete(index)"
              >Delete</p>
            </v-layout>
            <v-flex class="text-xs-center" xs12>
              <v-btn
                :disabled="index==(userProfile.defaultAddress==null?0:userProfile.defaultAddress)"
                small
                @click="setDefaultAddress(index)"
              >Set as default</v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import State from "../../assets/state";
import { mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    selected: {
      firstname: { required },
      lastname: { required },
      address: { required },
      city: { required },
      state: { required },
      zip: { required },
      phone: { required }
    }
  },
  components: {},
  data() {
    return {
      state: State,
      dialog: false,
      selected: {},
      index: -1
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    nameErrors() {
      const errors = [];
      if (!this.$v.selected.firstname.$dirty) return errors;
      !this.$v.selected.firstname.required && errors.push("Name is required.");
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      if (!this.$v.selected.lastname.$dirty) return errors;
      !this.$v.selected.lastname.required &&
        errors.push("Lastname is required.");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.selected.address.$dirty) return errors;
      !this.$v.selected.address.required && errors.push("Address is required.");
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.selected.city.$dirty) return errors;
      !this.$v.selected.city.required && errors.push("City is required.");
      return errors;
    },
    stateErrors() {
      const errors = [];
      if (!this.$v.selected.state.$dirty) return errors;
      !this.$v.selected.state.required && errors.push("State is required.");
      return errors;
    },
    zipErrors() {
      const errors = [];
      if (!this.$v.selected.zip.$dirty) return errors;
      !this.$v.selected.zip.required && errors.push("Zip is required.");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.selected.phone.$dirty) return errors;
      !this.$v.selected.phone.required &&
        errors.push("Phone number is required.");
      return errors;
    },
    noError() {
      return (
        this.lastnameErrors.length == 0 &&
        this.nameErrors.length == 0 &&
        this.addressErrors.length == 0 &&
        this.cityErrors.length == 0 &&
        this.stateErrors.length == 0 &&
        this.zipErrors.length == 0 &&
        this.phoneErrors.length == 0
      );
    }
  },
  methods: {
    ...mapMutations(["updateAddress", "setDefaultAddress", "deleteAddress"]),

    submit() {
      this.$v.$touch();
      if (this.noError) {
        var payload = {};
        payload.index = this.index;
        payload.data = this.selected;
        payload.res = () => {
          this.close();
        };
        this.updateAddress(payload);
      }
    },
    open(index) {
      this.index = index;
      if (index != -1)
        this.selected = Object.assign({}, this.userProfile.Address[index]);
      this.dialog = true;
    },
    Delete(index) {
      this.$confirm("Do you really want to delete?").then(res => {
        if (res) this.deleteAddress(index);
      });
    },
    close() {
      this.dialog = false;
      this.index = -1;
      this.selected = {};
      this.$v.$reset();
    }
  }
};
</script>
