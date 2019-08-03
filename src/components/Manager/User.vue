<template>
<v-app>
    <v-container>
        <v-layout column>
            <v-card>
              <div class="title">{{User.email}}</div>
            </v-card>
        </v-layout>
    </v-container>
</v-app>
</template>

<script>
import {
    firestore
} from "../../firebase";
import Vue from "vue";
export default {
    data() {
        return {
            User: {}
        };
    },
    created() {
        this.fetchUser();
    },
    methods: {
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
