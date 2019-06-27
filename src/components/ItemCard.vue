<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <v-container grid-list-md>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <template v-for="n in steps">
              <v-stepper-step
                :key="`${n}-step`"
                :complete="e1 > n"
                :step="n"
                :editable="!(selectedItem.id==null)"
              >{{ stepHeader[n-1] }}</v-stepper-step>

              <v-divider v-if="n !== steps" :key="n"></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
              <v-layout v-if="n==1" wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="selectedItem.code" label="Code" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="selectedItem.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field v-model="selectedItem.price" label="Price" type="number" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-switch label="Disable" v-model="isOff"></v-switch>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="selectedItem.description" label="Description" required></v-text-field>
                </v-flex>
                <v-flex v-if="listCate!=[]" xs12 sm6 md6>
                  <v-autocomplete
                    :items="listCate"
                    item-text="name"
                    item-value="id"
                    label="Categories"
                    multiple
                    v-model="selectedItem.cate"
                  ></v-autocomplete>
                </v-flex>
                <v-flex v-if="listCate!=[]" xs12 sm6 md6>
                  <v-autocomplete
                    v-model="selectedItem.subCate"
                    :items="getSubCate"
                    item-text="name"
                    item-value="id"
                    label="Sub Categories"
                    multiple
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
              <v-layout v-if="n==2" wrap>
                <v-flex xs12 sm6>
                  <upload-btn @file-update="fileHandle" type="image"></upload-btn>
                </v-flex>
              </v-layout>
              <v-btn v-if="!selectedItem.id" color="primary" @click="createItem()">Create</v-btn>
              <v-btn v-else color="primary" @click="updateItem()">Continue</v-btn>

              <v-btn flat @click="close">Cancel</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-dialog>
    <v-hover>
      <v-card
        v-if="Item!=null"
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`"
        class="mx-3 left my-3"
        width="300"
      >
        <v-img
          :aspect-ratio="16/9"
          :src="Item.imgs==null?'https://via.placeholder.com/350':Item.imgs[0]"
        >
          <v-expand-transition v-if="Item.imgs!=null">
            <div
              v-if="hover&&Item.imgs[1]!=null"
              class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
              style="height: 100%;"
            >
              <v-img :aspect-ratio="16/9" :src="Item.imgs[1]"></v-img>
            </div>
          </v-expand-transition>
          <v-btn
            v-if="userProfile.isAdmin"
            absolute
            color="grey darken-3"
            class="white--text mt-4"
            left
            top
            @click="deleteItem()"
          >
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn
            v-if="userProfile.isAdmin"
            absolute
            color="orange"
            class="white--text mt-4"
            right
            top
            @click="editItem()"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </v-img>
        <v-card-text class="pt-4" style="position: relative;">
          <v-btn
            absolute
            color="orange"
            class="white--text"
            style="z-index:0"
            fab
            right
            top
            @click="AddToCart(Item)"
          >
            <v-icon>add_shopping_cart</v-icon>
          </v-btn>
          <v-responsive :aspect-ratio="16/4">
            <h4 class="headline font-weight-light mb-2">{{Item.name}}</h4>
          </v-responsive>
          <div
            class="font-weight-light grey--text subheading mb-2"
          >Description : {{Item.description}}</div>
          <h3 class="display-1 font-weight-light orange--text mb-2">{{Item.price}} $</h3>
        </v-card-text>
      </v-card>
      <v-card
        :style="{ cursor: 'pointer'}"
        @click="addItem"
        :class="`elevation-${hover ? 12 : 2}`"
        v-else
        class="justify-center mx-3 left my-3"
        width="300"
        height="360"
      >
        <div class="mt-5">
          <v-img contain max-height="125" :src="require('./../assets/add.png')"></v-img>
        </div>
        <div class="mt-5">
          <p class="orange--text text-xs-center title">Add item</p>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { URL } from "url";
export default {
  data: () => ({
    isOff: false,
    stepHeader: ["Information", "Image"],
    dialog: false,
    e1: 1,
    steps: 2,
    selectedItem: {}
  }),
  components: {},
  computed: {
    ...mapState(["userProfile", "listCate"]),
    getSubCate() {
      var sc = this.listCate
        .map(item => {
          return item.children;
        })
        .filter(element => (element == null ? false : element.length != 0));
      return sc.length == 0 ? [] : sc.reduce((a, b) => a.concat(b));
    }
  },
  props: {
    Item: Object,
    ID: String
  },
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    }
  },
  methods: {
    ...mapMutations(["AddToCart", "UploadPicture", "CreateItem", "UpdateItem","DeleteItem"]),
    deleteItem() {
      this.$confirm("Do you really want to delete?").then(res => {
        if(res)this.DeleteItem(this.ID)
      });
    },
    addItem() {
      this.e1 = 1;
      this.dialog = true;
    },
    editItem() {
      this.isOff = !!this.Item.isDisabled;
      this.selectedItem = Object.assign({}, this.Item);
      this.selectedItem.id = this.ID;
      this.dialog = true;
    },
    createItem() {
      this.selectedItem.isDisabled = this.isOff;
      if (this.selectedItem.subCate == null && this.selectedItem.cate == null) {
        this.selectedItem.cate = [];
        this.selectedItem.subCate = [];
        this.selectedItem.tag = [];
      } else if (this.selectedItem.cate == null) {
        this.selectedItem.cate = [];
        this.selectedItem.tag = this.selectedItem.subCate;
      } else if (this.selectedItem.subCate == null) {
        this.selectedItem.subCate = [];
        this.selectedItem.tag = this.selectedItem.cate;
      } else {
        this.selectedItem.tag = this.selectedItem.cate.concat(
          this.selectedItem.subCate
        );
      }
      this.CreateItem({
        data: this.selectedItem,
        call: id => {
          this.selectedItem.id = id;
          this.e1 = 2;
        }
      });
    },
    updateItem() {
      this.selectedItem.isDisabled = this.isOff;
      if (this.selectedItem.subCate == null && this.selectedItem.cate == null) {
        this.selectedItem.cate = [];
        this.selectedItem.subCate = [];
        this.selectedItem.tag = [];
      } else if (this.selectedItem.cate == null) {
        this.selectedItem.cate = [];
        this.selectedItem.tag = this.selectedItem.subCate;
      } else if (this.selectedItem.subCate == null) {
        this.selectedItem.subCate = [];
        this.selectedItem.tag = this.selectedItem.cate;
      } else {
        this.selectedItem.tag = this.selectedItem.cate.concat(
          this.selectedItem.subCate
        );
      }
      this.UpdateItem({
        data: this.selectedItem,
        call: id => {
          this.selectedItem.id = id;
          this.e1 = 2;
        }
      });
    },
    close() {
      this.e1 = 1;
      this.dialog = false;
      if (this.selectedItem.id) this.selectedItem = {};
    },
    fileHandle(file) {
      // const fr = new FileReader ()
      console.log(file);
      // fr.readAsDataURL(file)
      // fr.addEventListener('load', () => {
      // 		console.log(fr.result)
      // 	})
      this.UploadPicture(file);
    },
    onInput(val) {
      this.steps = parseInt(val);
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    }
  }
};
</script>
