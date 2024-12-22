<template>
  <User />
  <button class="logout" @click="clearLocalStorage">Logout</button>
</template>

<script>
import User from "@/components/User.vue";

export default {
  components: {
    User,
  },
  methods: {
    clearLocalStorage() {
      localStorage.clear();
      location.reload();
    }
  }
}
</script>

<style scoped lang="scss">
.logout {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  background-color: #c3c3c3;
}
</style>