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
        <v-layout v-for="(key,index) in GetTag()" :key="index" class="px-3 py-0">
          <v-btn flat class="pa-0 ma-0" @click="SetSubKey(key)">
            <v-icon v-if="key==subKey" small class="pink--text">trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span
              v-if="key==subKey"
              class="body-1 px-2 pink--text"
            >{{(list.sub[key]==null)?'':((list.sub)[key].name)}}</span>
            <span v-else class="body-1 px-2">{{(list.sub[key]==null)?'':((list.sub)[key].name)}}</span>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 md10 >
        <ItemCard v-for="key in GetItem()" :key="key" :Item="list.list[key]"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ItemCard from "./../components/ItemCard";
export default {
  created() {},
  components: {
    ItemCard
  },
  computed: {
    ...mapState(["Stock"]),
    list: function() {
      return this.GetData();
    }
  },
  data() {
    return {
      isRoot: false,
      subKey: null
    };
  },
  watch: {},
  created() {},
  methods: {
    SetSubKey(key) {
      this.subKey = key;
    },
    GetData() {
      this.isRoot = this.$route.params.pathMatch == null;
      if (this.isRoot) {
        return this.Stock;
      } else return this.Stock[this.$route.params.pathMatch];
    },
    GetTag() {
      const temp = this.list == null ? {} : this.list.sub;
      return Object.keys(temp);
    },
    GetItem() {
      const temp = this.list == null ? {} : this.list.list;
      return Object.keys(temp).filter(element => {
        return element == this.subKey || this.subKey == null;
      });
    }
  }
};
</script>
