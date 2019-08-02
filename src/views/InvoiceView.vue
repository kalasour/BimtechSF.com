<template>
<v-app>
    <v-layout xs6 column wrap>
        <v-card style="border-radius: 25px;" class="ma-2" v-for="(item,i) in Charge.List" :key=i>
            <v-container fluid>
                <v-flex v-for="(img,j) in item" :key=j>
                    <v-img max-width="150" max-height="150" class="size" :src="img"></v-img>
                </v-flex>
                <v-card-title>
                    <div style="font-size: 20px"> {{ item.name }}</div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-title>
                    <div class="grey--text" style="font-size: 15px">Option: </div>
                    <div v-for="(option,k) in item.OpSelected" :key=k>
                        {{ option.name }},
                    </div>
                    <v-spacer></v-spacer>
                    <p class="grey--text">x</p>
                    <div class="text-uppercase" style="font-size: 20px;">{{ item.amount }}</div>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-title>
                    <div class="text-uppercase" style="font-size: 20px;">{{ item.amount }} Piece</div>
                    <v-spacer></v-spacer>
                    <div class="grey--text" style="fontsize: 30">
                        Amount to be paid: </div>
                    <v-icon color="orange">attach_money</v-icon>
                    <div class="text-uppercase orange--text" style="font-size: 20px;">{{ item.price }}</div>
                </v-card-title>
                <v-card-title>
                  <h2 class="grey--text">status:</h2>
                  <div class="text-uppercase green--text" style="font-size: 20px">
                    {{ Charge.status }}
                  </div>
                </v-card-title>
            </v-container>
        </v-card>
    </v-layout>
</v-app>
</template>

<style>
.size {
    max-width: 200px;
}
</style>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
export default {
    components: {},
    computed: {
        ...mapState(["Charges"]),
        Charge() {
            return this.Charges.find(ele => ele.id == this.$route.params.Id);
        }
    },
    methods: {
        ...mapMutations([])
    }
};
</script>
