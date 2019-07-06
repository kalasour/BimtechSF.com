<template>
  <div>
    <v-layout justify-space-around>
      <v-flex xs6>
        <v-card>
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
    name: { required, maxLength: maxLength(30) },
    lastname: { required, maxLength: maxLength(30) },
    email: { required, email },
    password: { required }
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      password: "",
      name: "",
      lastname: "",
      email: "",
      error: null,
      success: null
    };
  },
  components: {},
  computed: {
    ...mapState(["user", "userProfile"]),
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
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
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
        this.emailErrors.length == 0 &&
        this.nameErrors.length == 0 &&
        this.passwordErrors.length == 0 &&
        this.lastnameErrors.length == 0
      );
    }
  },
  methods: {
    ...mapMutations(["updatePersonal"]),
    getData() {
      this.password = "";
      this.name = this.user.displayName;
      this.email = this.user.email;
      this.lastname = this.userProfile.lastname;
    },
    submit() {
      this.$v.$touch();
      if (this.noError)
        var user = {
          name: this.name,
          lastname: this.lastname,
          email: this.email,
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
      this.updatePersonal(user);
    },
    clear() {
      this.$v.$reset();
      this.getData();
    }
  }
};
</script>
