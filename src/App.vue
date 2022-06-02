<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  created () {
    this.$store.dispatch('getUserInfoActions')
  }
}
</script>

<style scoped>
#app {
  height: 100%;
}
</style>
