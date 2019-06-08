<template>
  <v-dialog v-model="dialogRegister" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Register</span>
        <v-spacer></v-spacer>
        <v-btn class="pink--text" flat @click="openLogin()">login</v-btn>
      </v-card-title>
      <v-card-text>
        <form class="mx-4" @submit.prevent="submit">
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="30"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="lastname"
            :error-messages="lastnameErrors"
            :counter="30"
            label="Lastname"
            required
            @input="$v.lastname.$touch()"
            @blur="$v.lastname.$touch()"
          ></v-text-field>
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
          <v-text-field
            v-model="repassword"
            :error-messages="repasswordErrors"
            label="confirm password"
            required
            type="password"
            @input="$v.repassword.$touch()"
            @blur="$v.repassword.$touch()"
          ></v-text-field>

          <v-btn class="orange white--text" type="submit">Login</v-btn>
          <v-btn flat @click="clear">clear</v-btn>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="closeRegister()">Close</v-btn>
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
    repassword: ""
  }),
  components: {},
  watch: {
    // dialogRegister: function() {
    //   this.dialog = this.dialogRegister;
    // },
    // dialog: function() {
    //   if (!this.dialog) this.closeRegister();
    // }
  },
  computed: {
    ...mapState(["dialogRegister"]),
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
      return (
        this.emailErrors.length == 0 &&
        this.nameErrors.length == 0 &&
        this.lastnameErrors.length == 0 &&
        this.passwordErrors.length == 0 &&
        this.repasswordErrors.length == 0
      );
    }
  },
  methods: {
    ...mapMutations(["closeRegister", "Register", "openLogin"]),
    submit() {
      this.$v.$touch();
      if (this.noError) this.Register(this.name);
    },
    clear() {
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
