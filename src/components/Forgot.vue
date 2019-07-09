<template>
  <v-dialog v-model="dialogForgot" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Reset password</span>
        <v-spacer></v-spacer>
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

          <div v-if="error!=null" class="text-md-center">
            <span class="red--text">{{error}}</span>
            <br />
          </div>
          <v-btn class="orange white--text" type="submit">Submit</v-btn>
          <v-btn flat @click="clear">clear</v-btn>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="closeForgot()">Close</v-btn>
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
    email: { required, email }
  },

  data: () => ({
    // dialog: false,
    email: "",
    error: null
  }),
  components: {},
  computed: {
    ...mapState(["dialogForgot"]),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    noError() {
      return this.emailErrors.length == 0;
    }
  },
  methods: {
    ...mapMutations(["closeForgot", "Forgot"]),
    submit() {
      this.$v.$touch();
      if (this.noError) {
        var user = {
          email: this.email
        };
        this.error = "";
        user.res = e => {
          this.error = e;
        };
        this.Forgot(user);
      }
    },
    clear() {
      this.error = "";
      this.$v.$reset();
      this.email = "";
    }
  }
};
</script>
