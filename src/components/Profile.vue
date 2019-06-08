<template>
<div>
<div v-if="true">
    <v-btn flat @click="openRegister()">
        register
    </v-btn>
    <v-divider 
       vertical></v-divider>
    <v-btn flat @click="openLogin()">
        login
    </v-btn>
</div>
</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
  export default {
    components: {
    },
    methods:{
          ...mapMutations(["openLogin","openRegister"])
    }
  }
</script>
