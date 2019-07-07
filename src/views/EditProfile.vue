<template>
  <v-layout justify-center>
    <v-flex xs10>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md2>
            <div>
              <p class="title px-1 py-0 text-truncate">{{user.displayName+' '+userProfile.lastname}}</p>
            </div>
            <v-divider></v-divider>
            <v-layout v-for="(item,index) in menu" :key="index" class="px-3 py-0">
              <div :style="{ cursor: 'pointer'}" @click="handleMenu(item.text)">
                <v-hover>
                  <template slot-scope="{ hover }">
                    <span
                      v-if="index==currentIndex||hover"
                      class="body-2 px-2 pink--text"
                    >{{item.text}}</span>
                    <span v-else class="px-2">{{item.text}}</span>
                  </template>
                </v-hover>
              </div>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6 md10>
            <PersonalInformation v-if="currentIndex==0"></PersonalInformation>
            <PaymentSetting v-if="currentIndex==1"></PaymentSetting>
            <AddressSetting v-if="currentIndex==2"></AddressSetting>
            <PasswordSetting v-if="currentIndex==3"></PasswordSetting>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import PersonalInformation from "../components/EditProfile/PersonalInformation";
import AddressSetting from "../components/EditProfile/AddressSetting";
import PasswordSetting from "../components/EditProfile/PasswordSetting";
import PaymentSetting from "../components/EditProfile/PaymentSetting";
export default {
  components: {
    PersonalInformation,
    AddressSetting,
    PasswordSetting,
    PaymentSetting
  },
  watch: {},

  data() {
    return {
      currentIndex: 0,
      menu: [
        { text: "Personal Information" },
        { text: "Payment Setting" },
        { text: "Address Setting" },
        { text: "Password Setting" }
      ]
    };
  },
  created() {
    this.calIndex();
  },
  computed: {
    ...mapState(["user", "userProfile"])
  },
  watch: {
    "$route.params": function() {
      this.calIndex();
    }
  },
  methods: {
    handleMenu(item) {
      this.$router.push("/Profile/" + item);
    },
    calIndex() {
      this.currentIndex =
        this.$route.params.state == null
          ? 0
          : this.menu.findIndex(ele => ele.text == this.$route.params.state);
    }
  }
};
</script>
