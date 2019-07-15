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
            <v-container v-if="n==2&&selectedItem.id" grid-list-sm fluid>
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
                    <upload-btn ref="button" @file-update="fileHandle" type="image"></upload-btn>
                  </v-flex>
                  <v-flex xs1>
                    <p class="ma-1 text-xs-center title grey--text justify-center">or</p>
                  </v-flex>
                  <v-flex xs9>
                    <v-layout row wrap>
                      <v-text-field class="pa-0 mx-2" v-model="url" label="Image url" hide-details></v-text-field>
                      <v-btn @click="AddHandle()">Add</v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-container>

            <v-btn v-if="!selectedItem.id" color="primary" @click="createItem()">Create</v-btn>
            <v-btn v-else color="primary" @click="updateItem()">Continue</v-btn>

            <v-btn flat @click="close">Cancel</v-btn>
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
      stepHeader: ["Information", "Image"],
      e1: 1,
      steps: 2,
      imgs: [],
      deleteList: [],
      url: ""
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
          if (this.e1 > 2) {
            this.close()
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
