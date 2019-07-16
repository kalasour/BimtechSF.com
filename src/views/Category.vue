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
            <v-icon v-if="null==subKey" class="orange--text" small>trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span v-if="null==subKey" class="orange--text body-1 px-2">{{$route.params.pathMatch}}</span>
            <span v-else class="body-1 px-2">{{$route.params.pathMatch}}</span>
          </v-btn>
        </v-layout>
        <v-layout v-for="(item,index) in subcate" :key="index" class="px-3 py-0">
          <v-btn flat class="pa-0 ma-0" @click="SetSubKey(item.id)">
            <v-icon v-if="item.id==subKey" small class="orange--text">trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span v-if="item.id==subKey" class="body-1 px-2 orange--text">{{item.name}}</span>
            <span v-else class="body-1 px-2">{{item.name}}</span>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 md10>
        <v-flex xs12 sm6 md3>
          <v-text-field
            color="orange"
            hide-details
            prepend-icon="search"
            label="Search"
            v-model="Search"
          ></v-text-field>
        </v-flex>
        <ItemCard v-for="item in list" :key="item.id" :ID="item.id" :Item="item.data()" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  created() {
    this.GetTag();
    this.Search = "";
  },
  computed: {
    ...mapState(["Stock", "listCate"]),
    list: function() {
      return this.GetData().filter(
        ele =>
          ele
            .data()
            .name.toLowerCase()
            .search(this.Search.toLowerCase()) != -1
      ).sort((item1,item2)=> item1.data().name.localeCompare(item2.data().name));
    },
    GetDocFromPath() {
      return this.listCate.find(
        ele => ele.name == this.$route.params.pathMatch
      );
    }
  },
  data() {
    return {
      subKey: null,
      subcate: [],
      Search: ""
    };
  },
  watch: {
    "$route.params.pathMatch": function() {
      this.subKey = null;
      this.Search = "";
      this.GetTag();
    },
    "GetDocFromPath.children": function() {
      this.Search = "";
      this.GetTag();
    }
  },
  methods: {
    ...mapMutations(["setLoading"]),
    SetSubKey(key) {
      this.subKey = key;
    },

    GetData() {
      return this.Stock.filter(element => {
        var el = element.data();
        return (
          el.tag.indexOf(
            this.GetDocFromPath == null ? "" : this.GetDocFromPath.id
          ) != -1 &&
          (this.subKey == null || el.tag.indexOf(this.subKey) != -1) &&
          el.isDisabled != true
        );
      });
    },
    async GetTag() {
      // this.setLoading(true);
      if (this.GetDocFromPath != null)
        if (this.GetDocFromPath.children != null) {
          this.subcate = [];
          this.GetDocFromPath.children.map(item => {
            this.subcate.push(item);
          });
        }
      //   await this.GetDocFromPath()
      //     .ref.collection("sub")
      //     .onSnapshot(async querySnapshot => {
      //       this.subcate = [];
      //       await querySnapshot.forEach(doc => {
      //         // console.log(doc.data().name);
      //         this.subcate.push({ name: doc.data().name, id: doc.id });
      //       });
      //       this.setLoading(false);
      //     });
      // console.log(data)
    }
  }
};
</script>
