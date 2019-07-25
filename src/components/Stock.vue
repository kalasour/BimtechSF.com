<template>
  <v-container fluid grid-list-md>
    <v-dialog v-model="settingDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Setting</span>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs3>
              <v-text-field color="orange" label="Tax rate(%)" type="number" v-model="taxRate"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="orange white--text"
            @click="ApplySettingStock({TaxRate:taxRate});settingDialog=false"
          >Apply</v-btn>
          <v-btn color="secondary" flat @click="settingDialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editCateDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{!edit?'Create':'Edit'}} category</span>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-text-field color="orange" label="category name" v-model="edtingField"></v-text-field>
            <v-btn color="orange" v-if="edit" flat @click="appEditCate">Apply</v-btn>
            <v-btn color="orange" v-else flat @click="appCreateCate">Apply</v-btn>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click="closeCate">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm6 md3 lg3>
        <p
          :style="{ cursor: 'pointer'}"
          @click="setTagKey(null)"
          class="title pa-0 text-md-center"
        >All</p>
        <v-divider></v-divider>
        <v-treeview :items="listCate" :open="listCate.map(item=>item.id)">
          <template v-slot:prepend="{ item,open }">
            <v-icon v-if="item.children">{{ !open ? 'folder_open' : 'folder' }}</v-icon>
          </template>
          <template v-slot:label="{ item,open,leaf }">
            <span
              :style="{ cursor: 'pointer'}"
              @click="setTagKey((item))"
              class="body-1 pr-2"
            >{{item.name}}</span>
            <v-icon class="px-1" small @click="editCate(item)">edit</v-icon>
            <v-icon v-if="!leaf" class="pa-0" small @click="createCate(item)">note_add</v-icon>
            <v-icon class="pa-0" small @click="deleteCate(item)">delete</v-icon>
          </template>
        </v-treeview>
        <div class="text-md-center">
          <v-icon class="px-1 text-md-center" large @click="createCate(null)">create_new_folder</v-icon>
        </div>
      </v-flex>
      <v-flex xs12 sm6 md9 lg8>
        <v-layout row wrap align-end align-content-end>
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
              hide-details
              color="orange"
              :items="[30,60,300]"
              v-model="itemPerpage"
              label="Item per page"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md1>
            <v-icon :style="{cursor:'pointer'}" @click="settingDialog=true" large>settings</v-icon>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs10 md4 lg4>
            <ItemCard :Item="null" />
          </v-flex>
          <v-flex xs10 md4 lg4 v-for="item in list" :key="item.id">
            <ItemCard class="mx-2 my-2" :ID="item.id" :Item="item.data()" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout justify-center>
        <v-pagination
          v-model="page"
          color="orange"
          class="mb-3"
          :length="parseInt(AllList.length/itemPerpage>parseInt(AllList.length/itemPerpage)?AllList.length/itemPerpage+1:AllList.length/itemPerpage)"
          circle
        ></v-pagination>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      settingDialog: false,
      tagKey: null,
      editCateDialog: false,
      editing: null,
      edit: false,
      edtingField: "",
      Search: "",
      itemPerpage: 30,
      page: 1,
      taxRate: 0,
      tempSearch: ""
    };
  },
  computed: {
    ...mapState(["listCate", "Stock", "SettingStock"]),
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
        .sort((item1, item2) =>
          item1.data().name.localeCompare(item2.data().name)
        );
    }
  },
  watch: {
    "listCate.children": function() {
      console.log("child change");
    },
    page: function() {
      window.scrollTo(0, 0);
    },
    settingDialog: function() {
      if (this.settingDialog) {
        this.taxRate = this.SettingStock.TaxRate;
      }
    }
  },
  components: {},
  methods: {
    ...mapMutations([
      "EditCate",
      "CreateCate",
      "DeleteCate",
      "ApplySettingStock"
    ]),
    GetData() {
      return this.Stock.filter(element => {
        var el = element.data();
        return this.tagKey == null || el.tag.indexOf(this.tagKey.id) != -1;
      });
    },
    setTagKey(key) {
      this.page = 1;
      this.tagKey = key;
    },
    appCreateCate() {
      if (this.editing == null) this.editing = {};
      this.editing.new = this.edtingField;
      this.CreateCate(this.editing);
      this.closeCate();
    },
    appEditCate() {
      if (this.editing == null) this.editing = {};
      this.editing.new = this.edtingField;
      this.EditCate(this.editing);
      this.closeCate();
    },
    createCate(item) {
      this.editing = item;
      this.editCateDialog = true;
      this.edtingField = "";
    },
    closeCate() {
      this.editCateDialog = false;
      this.editing = null;
      this.edit = null;
      this.edtingField = "";
    },
    deleteCate(item) {
      this.$confirm("Do you really want to delete?").then(res => {
        if (res) this.DeleteCate(item);
      });
    },
    editCate(item) {
      this.edit = true;
      this.editing = item;
      this.edtingField = item.name;
      this.editCateDialog = true;
    }
  }
};
</script>
