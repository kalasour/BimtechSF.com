<template>
  <div>{{Charge}}</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { firestore } from "../firebase";
export default {
  components: {},
  data() {
    return {
      Ch: {}
    };
  },
  computed: {
    ...mapState(["Charges", "userProfile"]),
    Charge() {
      if (!this.userProfile.isAdmin)
        return this.Charges.find(ele => ele.id == this.$route.params.Id);
      else {
        firestore
          .collection("Charges")
          .where("id", "==", this.$route.params.Id)
          .onSnapshot(snap => {
            snap.docs.forEach(item => {
              this.Ch = Object.assign({}, item.data());
            });
          });
        return this.Ch;
      }
    }
  },
  methods: {
    ...mapMutations([])
  }
};
</script>
