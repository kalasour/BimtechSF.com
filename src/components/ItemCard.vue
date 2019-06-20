<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Create item</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Code" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field label="Price" type="number" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md1>
                <v-switch label="Active" :v-model="!isOff"></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Description" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Categories" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Sub Categories" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <upload-btn @file-update="fileHandle" type="image"></upload-btn>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="red darken-1" flat @click="dialog = false">Reset</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-hover>
      <v-card
        v-if="Item!=null"
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`"
        class="mx-3 left my-3"
        width="300"
      >
        <v-img :aspect-ratio="16/9" :src="Item.imgs[0]">
          <v-expand-transition>
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
            color="orange"
            class="white--text mt-4"
            right
            top
            @click="AddToCart(Item)"
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
          <h4 class="headline font-weight-light mb-2">{{Item.name}}</h4>
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
          <p class="orange--text text-md-center title">Add item</p>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data: () => ({
    isOff: false,
    dialog: false
  }),
  components: {},
  computed: {
    ...mapState(["userProfile"])
  },
  props: {
    Item: Object
  },
  methods: {
    ...mapMutations(["AddToCart", "UploadPicture"]),
    addItem() {
      this.dialog = true;
    },
    fileHandle(file) {
      this.UploadPicture(file);
    }
  }
};
</script>
