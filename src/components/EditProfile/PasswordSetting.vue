<template>
  <div>
    <v-layout justify-space-around>
      <v-flex xs6>
        <v-card :style="{'border-radius':'10px'}">
          <v-card-text>
            <form class="mx-4" @submit.prevent="submit">
              <v-text-field
                v-model="newpassword"
                :error-messages="newpasswordErrors"
                label="Enter a new password"
                required
                type="password"
                @input="$v.newpassword.$touch()"
                @blur="$v.newpassword.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="renewpassword"
                :error-messages="renewpasswordErrors"
                label="Type it again"
                required
                type="password"
                @input="$v.renewpassword.$touch()"
                @blur="$v.renewpassword.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Old Password"
                required
                type="password"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
              <div v-if="error!=null" class="text-md-center">
                <span class="red--text">{{error}}</span>
                <br />
              </div>
              <div v-if="success!=null" class="text-md-center">
                <span class="green--text">{{success}}</span>
                <br />
              </div>
              <v-btn class="orange white--text" type="submit">Save</v-btn>
              <v-btn flat @click="clear">reset</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    password: { required },
    newpassword: { required },
    renewpassword: { required }
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      newpassword: "",
      renewpassword: "",
      password: "",
      error: null,
      success: null
    };
  },
  components: {},
  computed: {
    ...mapState(["user", "userProfile"]),
    newpasswordErrors() {
      const errors = [];
      if (!this.$v.newpassword.$dirty) return errors;
      !this.$v.newpassword.required && errors.push("new password is required.");
      return errors;
    },
    renewpasswordErrors() {
      const errors = [];
      if (!this.$v.renewpassword.$dirty) return errors;
      !this.$v.renewpassword.required &&
        errors.push("please confirm your password.");
      !(this.newpassword == this.renewpassword) &&
        errors.push("password is not match.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("password is required.");
      return errors;
    },
    noError() {
      return (
        this.passwordErrors.length == 0 &&
        this.newpasswordErrors.length == 0 &&
        this.renewpasswordErrors.length == 0
      );
    }
  },
  methods: {
    ...mapMutations(["updatePassword"]),
    getData() {
      this.password = "";
      this.newpassword = "";
      this.renewpassword = "";
    },
    submit() {
      this.$v.$touch();
      if (this.noError) {
        var user = {
          newpassword: this.newpassword,
          password: this.password
        };
        this.error = "";
        this.success = "";
        user.res = e => {
          this.error = e;
          this.success = "";
        };
        user.success = () => {
          this.success = "Update success!";
          this.clear();
        };
        this.updatePassword(user);
      }
    },
    clear() {
      this.$v.$reset();
      this.getData();
    }
  }
};
</script>
