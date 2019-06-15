<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md2>
        <div>
          <v-icon>format_list_bulleted</v-icon>
          <span class="title px-2">Categories</span>
        </div>
        <v-divider></v-divider>
        <v-layout class="px-2 py-0">
          <v-btn flat class="pa-0 ma-0" @click="SetSubKey(null)">
            <v-icon v-if="null==subKey" class="pink--text" small>trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span v-if="null==subKey" class="pink--text body-1 px-2">{{$route.params.pathMatch}}</span>
            <span v-else class="body-1 px-2">{{$route.params.pathMatch}}</span>
          </v-btn>
        </v-layout>
        <v-layout v-for="(item,index) in subcate" :key="index" class="px-3 py-0">
          <v-btn flat class="pa-0 ma-0" @click="SetSubKey(item.id)">
            <v-icon v-if="item.id==subKey" small class="pink--text">trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span v-if="item.id==subKey" class="body-1 px-2 pink--text">{{item.name}}</span>
            <span v-else class="body-1 px-2">{{item.name}}</span>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 md10>
        <ItemCard v-for="item in list" :key="item.id" :Item="item.data()"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  created() {},
  computed: {
    ...mapState(["Stock", "Categories"]),
    list: function() {
      return this.GetData();
    }
  },
  data() {
    return {
      subKey: null,
      subcate: []
    };
  },
  watch: {},
  methods: {
    ...mapMutations(["setLoading"]),
    SetSubKey(key) {
      this.subKey = key;
    },
    GetKeyFromPath() {
      this.GetTag();
      return this.Categories.map(item => {
        if (this.$route.params.pathMatch == item.data().name) return item.id;
      }).filter(element => element != null)[0];
    },
    GetDocFromPath() {
      return this.Categories.map(item => {
        if (this.$route.params.pathMatch == item.data().name) return item;
      }).filter(element => element != null)[0];
    },
    GetData() {
      return this.Stock.filter(element => {
        var el = element.data();
        return (
          el.tag.indexOf(this.GetKeyFromPath()) != -1 &&
          (this.subKey == null || el.tag.indexOf(this.subKey) != -1) &&
          el.isOff != true
        );
      });
    },
    async GetTag() {
      this.setLoading(true);
      if (this.GetDocFromPath() != null)
        await this.GetDocFromPath()
          .ref.collection("sub")
          .onSnapshot(async querySnapshot => {
            this.subcate = [];
            await querySnapshot.forEach(doc => {
              // console.log(doc.data().name);
              this.subcate.push({ name: doc.data().name, id: doc.id });
            });
            this.setLoading(false);
          });
      // console.log(data)
    }
  }
};
</script>
