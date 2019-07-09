<template>
  <v-dialog v-model="dialogLogin" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Login</span>
        <v-spacer></v-spacer>
        <v-btn class="pink--text" flat @click="openRegister()">Register</v-btn>
      </v-card-title>
      <v-card-text>
        <form class="mx-4" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :error-messages="passwordErrors"
            label="Password"
            required
            type="password"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
          ></v-text-field>
          <p class="primary--text" :style="{ cursor: 'pointer','text-decoration': 'underline'}" @click="openForgot">Forgot your password?</p>
          <div v-if="error!=null" class="text-md-center">
            <span class="red--text">{{error}}</span>
            <br>
          </div>
          <v-btn class="orange white--text" type="submit">Login</v-btn>
          <v-btn flat @click="clear">clear</v-btn>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="closeLogin()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(30) },
    lastname: { required, maxLength: maxLength(30) },
    email: { required, email },
    password: { required },
    repassword: { required }
  },

  data: () => ({
    // dialog: false,
    name: "",
    lastname: "",
    email: "",
    password: "",
    repassword: "",
    error: null
  }),
  components: {},
  watch: {
    // dialogLogin: function() {
    //   this.dialog = this.dialogLogin;
    // },
    // dialog: function() {
    //   if (!this.dialog) this.closeLogin();
    // }
  },
  computed: {
    ...mapState(["dialogLogin"]),
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 30 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      if (!this.$v.lastname.$dirty) return errors;
      !this.$v.lastname.maxLength &&
        errors.push("Lastname must be at most 30 characters long");
      !this.$v.lastname.required && errors.push("Lastname is required.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("password is required.");
      return errors;
    },
    repasswordErrors() {
      const errors = [];
      if (!this.$v.repassword.$dirty) return errors;
      !(this.password == this.repassword) &&
        errors.push("ERROR: password and confirmation password do not match.");
      !this.$v.repassword.required && errors.push("password is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    noError() {
      return this.emailErrors.length == 0 && this.passwordErrors.length == 0;
    }
  },
  methods: {
    ...mapMutations(["closeLogin", "Login", "openRegister","openForgot"]),
    submit() {
      this.$v.$touch();
      if (this.noError) {
        var user = {
          email: this.email,
          password: this.password
        };
        this.error = "";
        user.res = e => {
          this.error = e;
        };
        this.Login(user);
      }
    },
    clear() {
      this.error = "";
      this.$v.$reset();
      this.name = "";
      this.lastname = "";
      this.email = "";
      this.password = "";
      this.repassword = "";
    }
  }
};
</script>
