<template>
  <v-container>
    <div v-for="(item,index) in Users" :key="index">
      <v-card class="my-3" :to="'User/'+item.id">
        <v-card-title>{{item.data().email}}</v-card-title>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { firestore } from "../../firebase";
import Vue from "vue";
export default {
  data() {
    return {
      Users: []
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      firestore.collection("Users").onSnapshot(docs => {
        this.Users = new Array(docs.docs.length);
        docs.docs.forEach((item, index) => {
          Vue.set(this.Users, index, item);
        });
      });
    }
  },
  components: {}
};
</script>
