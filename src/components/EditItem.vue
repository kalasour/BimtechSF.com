<template>
  <v-dialog v-if="userProfile.isAdmin" v-model="dialogEditItem" persistent max-width="1000px">
    <v-container grid-list-md>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <template v-for="n in steps">
            <v-stepper-step
              :key="`${n}-step`"
              :complete="e1 > n"
              :step="n"
              color="orange"
              :editable="!(selectedItem.id==null)"
            >{{ stepHeader[n-1] }}</v-stepper-step>

            <v-divider v-if="n !== steps" :key="n"></v-divider>
          </template>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
            <v-layout v-if="n==1" wrap justify-space-around>
              <v-flex xs12 sm6 md4>
                <v-text-field color="orange" v-model="selectedItem.code" label="Code" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field color="orange" v-model="selectedItem.name" label="Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-text-field
                  color="orange"
                  v-model="selectedItem.price"
                  label="Price"
                  type="number"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-switch color="orange" label="Disable" v-model="isOff"></v-switch>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-switch color="orange" label="Tax Active" v-model="selectedItem.TaxActive"></v-switch>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-switch
                  color="orange"
                  label="Discount Active"
                  v-model="selectedItem.DiscountActive"
                ></v-switch>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-text-field
                  color="orange"
                  v-model="selectedItem.DiscountPer"
                  label="Discount (%)"
                  type="number"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-text-field
                  color="orange"
                  v-model="selectedItem.DiscountAmount"
                  label="Discount (Amount)"
                  type="number"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  color="orange"
                  v-model="selectedItem.description"
                  label="Description"
                  required
                  auto-grow
                  hide-details
                  rows="2"
                ></v-textarea>
              </v-flex>
              <v-flex v-if="listCate!=[]" xs12 sm6 md6>
                <v-autocomplete
                  color="orange"
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
                  color="orange"
                  v-model="selectedItem.subCate"
                  :items="getSubCate"
                  item-text="name"
                  item-value="id"
                  label="Sub Categories"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-container v-if="n==2&&selectedItem.id" grid-list-sm fluid>
              <v-dialog width="400" v-model="newOption">
                <v-card>
                  <v-card-title>
                    <p class="title">New Option</p>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field color="orange" label="Option name" v-model="newOptionName"></v-text-field>
                    <p v-if="errNewOption!=''" class="red--text">{{errNewOption}}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-layout row wrap>
                      <v-spacer></v-spacer>
                      <v-btn @click="createOption" color="secondary">Create</v-btn>
                      <v-btn @click="newOption=false" flat>Cancel</v-btn>
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <div v-if="selectedItem.Options!=null">
                <div v-for="key in Object.keys(selectedItem.Options)" :key="key">
                  <p class="subheading mb-0">
                    {{key}} :
                    <v-icon
                      :style="{cursor:'pointer'}"
                      small
                      class="ml-3"
                      @click="()=>{
                    selectedItem.Options[key].push({})
         selectedItem.Options=Object.assign({},selectedItem.Options)
                    }"
                    >add</v-icon>
                    <v-icon
                      :style="{cursor:'pointer'}"
                      small
                      @click="()=>{
                    $confirm('Do you really want to delete this option?').then(res => {
        if (res) {
         delete selectedItem.Options[key]
         selectedItem.Options=Object.assign({},selectedItem.Options)
        }
      })
                    }"
                      class="ml-1"
                    >remove</v-icon>
                  </p>
                  <v-layout
                    class="ml-5"
                    v-for="(option,index) in selectedItem.Options[key]"
                    :key="index"
                    row
                    wrap
                    align-center
                  >
                    <v-flex class="mr-3" xs6>
                      <v-text-field color="orange" v-model="option.name" label="Name"></v-text-field>
                    </v-flex>
                    <span class="orange--text subheading">$</span>
                    <v-flex xs2>
                      <v-text-field
                        color="orange"
                        type="number"
                        v-model="option.price"
                        label="More price"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </div>
              </div>
              <v-flex xs12>
                <v-btn @click="newOption=true" color="secondary">Create option</v-btn>
              </v-flex>
            </v-container>
            <v-container v-if="n==3&&selectedItem.id" grid-list-sm fluid>
              <draggable v-model="imgs" class="layout row wrap">
                <v-flex d-flex xs3 v-for="(item,index) in imgs" :key="index">
                  <v-hover>
                    <v-img
                      slot-scope="{ hover }"
                      :src="item"
                      max-width="150"
                      max-height="150"
                      aspect-ratio="1"
                      class="grey lighten-2 ma-1"
                    >
                      <v-expand-transition>
                        <v-btn
                          fab
                          small
                          v-if="hover"
                          color="rgb(150, 150, 150, 0.5)"
                          @click="deletePicture(index)"
                          class="white--text"
                        >
                          <v-icon>clear</v-icon>
                        </v-btn>
                      </v-expand-transition>
                      <template v-slot:placeholder>
                        <v-layout fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </template>
                    </v-img>
                  </v-hover>
                </v-flex>
              </draggable>
              <v-flex xs12>
                <v-layout row wrap align-center class="my-2">
                  <v-flex xs2>
                    <upload-btn
                      color="secondary"
                      ref="button"
                      @file-update="fileHandle"
                      type="image"
                    ></upload-btn>
                  </v-flex>
                  <v-flex xs1>
                    <p class="ma-1 text-xs-center title grey--text justify-center">or</p>
                  </v-flex>
                  <v-flex xs9>
                    <v-layout row wrap>
                      <v-text-field class="pa-0 mx-2" v-model="url" label="Image url" hide-details></v-text-field>
                      <v-btn color="secondary" @click="AddHandle()">Add</v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-container>
            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-btn v-if="!selectedItem.id" color="orange white--text" @click="createItem()">Create</v-btn>
              <v-btn v-else color="orange white--text" @click="updateItem()">Continue</v-btn>

              <v-btn flat @click="close">Cancel</v-btn>
            </v-layout>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { URL } from "url";

export default {
  components: {},
  data() {
    return {
      isOff: false,
      stepHeader: ["Information", "Option", "Image"],
      e1: 1,
      steps: 3,
      imgs: [],
      deleteList: [],
      url: "",
      newOption: false,
      newOptionName: "",
      errNewOption: ""
    };
  },
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
    dialogEditItem: function() {
      if (this.dialogEditItem) {
        this.deleteList = [];
        this.imgs = Object.assign([], this.selectedItem.imgs);
        this.isOff = !!this.selectedItem.isDisabled;
        this.selectedItem.Options = Object.assign(
          {},
          this.selectedItem.Options
        );
        this.selectedItem.TaxActive = !!this.selectedItem.TaxActive;
        this.selectedItem.DiscountActive = !!this.selectedItem.DiscountActive;
      }
    }
  },
  computed: {
    ...mapState(["dialogEditItem", "userProfile", "selectedItem", "listCate"]),
    getSubCate() {
      var sc = this.listCate
        .map(item => {
          return item.children;
        })
        .filter(element => (element == null ? false : element.length != 0));
      return sc.length == 0 ? [] : sc.reduce((a, b) => a.concat(b));
    }
  },
  methods: {
    ...mapMutations([
      "closeDialogEditItem",
      "openSnackbar",
      "UploadPictureItem",
      "DeletePictureItem",
      "CreateItem",
      "UpdateItem"
    ]),
    createOption() {
      if (this.selectedItem.Options == null) this.selectedItem.Options = {};
      if (this.selectedItem.Options[this.newOptionName] == null) {
        this.selectedItem.Options[this.newOptionName] = [];
        this.newOption = false;
        this.newOptionName = "";
        this.errNewOption = "";
      } else {
        this.errNewOption = "Duplicate name";
      }
    },
    close() {
      this.e1 = 1;
      this.closeDialogEditItem();
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
      this.deleteList.map(url => {
        this.DeletePictureItem(url);
      });
      this.selectedItem.imgs = this.imgs;
      this.UpdateItem({
        data: this.selectedItem,
        call: id => {
          this.selectedItem.id = id;
          this.e1++;
          if (this.e1 > this.steps) {
            this.close();
          }
        }
      });
    },
    AddHandle() {
      if (this.url == "") {
        this.openSnackbar("please insert url");
        return;
      }
      this.imgs.push(this.url);
      this.url = "";
    },
    deletePicture(index) {
      this.$confirm("Do you really want to delete?").then(res => {
        if (res) {
          this.deleteList.push(this.imgs[index]);
          this.imgs.splice(index, 1);
        }
      });
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
      this.selectedItem.imgs = this.imgs;
      this.CreateItem({
        data: this.selectedItem,
        call: id => {
          this.selectedItem.id = id;
          this.e1++;
          if (this.e1 > 2) {
            this.e1 = 1;
            this.dialog = false;
          }
        }
      });
    },
    fileHandle(file) {
      // const fr = new FileReader ()
      // fr.readAsDataURL(file)
      // fr.addEventListener('load', () => {
      // 		console.log(fr.result)
      // 	})
      if (file != null) {
        this.UploadPictureItem({
          file: file,
          id: this.selectedItem.id,
          call: url => {
            this.imgs.push(url);
          }
        });
        this.$refs.button[0].clear();
      }
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
