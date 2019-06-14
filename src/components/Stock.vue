<template>
  <v-container fluid grid-list-md>
    <v-dialog v-model="editCateDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{!edit?'Create':'Edit'}} category</span>
        </v-card-title>
        <v-card-text>
          {{editing}}
          <v-layout wrap>
            <v-text-field label="category name" v-model="edtingField"></v-text-field>
            <v-btn color="blue darken-1" v-if="edit" flat @click="appEditCate">Apply</v-btn>
            <v-btn color="blue darken-1" v-else flat @click="appCreateCate">Apply</v-btn>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeCate">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex xs12 sm6 md3>
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
              @click="setTagKey((item.id))"
              class="body-1 pr-2"
            >{{item.name}}</span>
            <v-icon class="px-1" small @click="editCate(item)">edit</v-icon>
            <v-icon v-if="!leaf" class="pa-0" small @click="createCate(item)">note_add</v-icon>
          </template>
        </v-treeview>
        <div class="text-md-center">
          <v-icon class="px-1 text-md-center" large @click="createCate(null)">create_new_folder</v-icon>
        </div>
      </v-flex>
      <v-flex xs12 sm6 md9>{{tagKey}}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      tagKey: null,
      editCateDialog: false,
      editing: null,
      edit: false,
      edtingField: ""
    };
  },
  computed: {
    ...mapState(["listCate"])
  },
  watch: {
    "listCate.children": function() {
      console.log("child change");
    }
  },
  components: {},
  methods: {
    ...mapMutations(["EditCate", "CreateCate"]),
    setTagKey(key) {
      this.tagKey = key;
    },
    test(t) {
      console.log(t);
    },
    appCreateCate() {
      if (this.editing == null) this.editing = {};
      this.editing.new = this.edtingField;
      this.CreateCate(this.editing)
      this.closeCate();
    },
    appEditCate() {
      if (this.editing == null) this.editing = {};
      this.editing.new = this.edtingField;
      this.EditCate(this.editing)
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
    editCate(item) {
      this.edit = true;
      this.editing = item;
      this.edtingField = item.name;
      this.editCateDialog = true;
    }
  }
};
</script>
