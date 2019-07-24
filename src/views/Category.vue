<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md2>
        <div>
          <v-icon>format_list_bulleted</v-icon>
          <span class="title px-2">Categories</span>
        </div>
        <v-divider class="my-2 mx-3"></v-divider>
        <v-layout class="px-2 py-0">
          <v-btn
            flat
            class="pa-0 ma-0"
            :to="{name:'RestaurantSupply',params:{cate:$route.params.cate}}"
          >
            <v-icon v-if="null==subKey" class="orange--text" small>trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span v-if="null==subKey" class="orange--text body-1 px-2">{{$route.params.cate}}</span>
            <span v-else class="body-1 px-2">{{$route.params.cate}}</span>
          </v-btn>
        </v-layout>
        <v-layout v-for="(item,index) in subcate" :key="index" class="px-3 py-0">
          <v-btn
            flat
            class="pa-0 ma-0"
            :to="{name:'RestaurantSupplySubcate',params:{cate:$route.params.cate,subcate:item.name}}"
          >
            <v-icon v-if="item.id==subKey" small class="orange--text">trip_origin</v-icon>
            <v-icon v-else small>trip_origin</v-icon>
            <span v-if="item.id==subKey" class="body-1 px-2 orange--text">{{item.name}}</span>
            <span v-else class="body-1 px-2">{{item.name}}</span>
          </v-btn>
        </v-layout>
        <v-divider class="my-2 mx-3"></v-divider>
        <v-layout row wrap>
          <v-card :style="{'border-radius':'10px'}" class="mx-3 my-2 py-2">
            <v-flex xs12 class="text-xs-center">
              <span class="title px-2">Price range</span>
            </v-flex>
            <v-flex class="mx-3" xs12>
              <v-layout row wrap align-center align-content-center justify-center>
                <v-flex xs12 class="mx-3">
                  <v-text-field
                    color="orange"
                    class="centered-input"
                    flat
                    v-model="TpriceStart"
                    placeholder="lowest"
                    @keypress="isNumber"
                    clearable
                    hide-details
                    solo
                  >
                    <template v-slot:prepend-inner>$</template>
                  </v-text-field>
                </v-flex>
                <v-flex xs11>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex class="mx-3" xs12>
                  <v-text-field
                    flat
                    color="orange"
                    clearable
                    hide-details
                    placeholder="highest"
                    class="centered-input"
                    v-model="TpriceEnd"
                    solo
                    @keypress="isNumber"
                  >
                    <template v-slot:prepend-inner>$</template>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-btn
                block
                @click="priceStart=TpriceStart;priceEnd=TpriceEnd;"
                color="orange white--text"
              >filter</v-btn>
            </v-flex>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 md10>
        <v-layout row wrap>
          <v-flex xs12 sm6 md3>
            <v-text-field
              color="orange"
              hide-details
              prepend-icon="search"
              label="Search"
              v-model="tempSearch"
              @keydown.enter="Search=tempSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md1>
            <v-select
              color="orange"
              :items="[30,60,300]"
              v-model="itemPerpage"
              label="Item per page"
            ></v-select>
          </v-flex>
        </v-layout>
        <ItemCard v-for="item in list" :key="item.id" :ID="item.id" :Item="item.data()" />
      </v-flex>
    </v-layout>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        color="orange"
        :length="parseInt(AllList.length/itemPerpage>parseInt(AllList.length/itemPerpage)?AllList.length/itemPerpage+1:AllList.length/itemPerpage)"
        circle
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  created() {
    this.GetTag();
    this.Search = "";
    if (this.$route.params.page != null)
      this.page = parseInt(this.$route.params.page);
    else this.page = 1;
  },
  computed: {
    ...mapState(["Stock", "listCate"]),
    subKey() {
      if (this.$route.params.subcate == null) return null;
      if (this.subcate.length != 0)
        return this.subcate.find(ele => ele.name == this.$route.params.subcate)
          .id;
    },

    list: function() {
      return this.AllList.slice(
        (this.page - 1) * this.itemPerpage,
        this.page * this.itemPerpage
      );
    },
    AllList: function() {
      return this.GetData()
        .filter(
          ele =>
            ele
              .data()
              .name.toLowerCase()
              .search(this.Search.toLowerCase()) != -1
        )
        .filter(
          ele =>
            (this.priceStart == "" ||
              this.priceStart == null ||
              parseFloat(ele.data().price) >= parseFloat(this.priceStart)) &&
            (this.priceEnd == "" ||
              this.priceEnd == null ||
              parseFloat(ele.data().price) <= parseFloat(this.priceEnd))
        )
        .sort((item1, item2) =>
          item1.data().name.localeCompare(item2.data().name)
        );
    },
    GetDocFromPath() {
      return this.listCate.find(ele => ele.name == this.$route.params.cate);
    }
  },
  data() {
    return {
      priceStart: "",
      priceEnd: "",
      TpriceStart: "",
      TpriceEnd: "",
      subcate: [],
      Search: "",
      itemPerpage: 30,
      page: 1,
      tempSearch: ""
    };
  },
  watch: {
    "$route.params.pathMatch": function() {
      this.subKey = null;
      this.Search = "";
      this.GetTag();
      this.page = 1;
    },
    "GetDocFromPath.children": function() {
      this.Search = "";
      this.GetTag();
      this.page = 1;
    },
    subKey: function() {
      this.page = 1;
    },
    page: function() {
      window.scrollTo(0, 0);
    }
  },
  methods: {
    ...mapMutations(["setLoading"]),
    isNumber(event) {
      var ch = String.fromCharCode(event.which);
      if (!/[0-9]/.test(ch)) {
        event.preventDefault();
      }
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
