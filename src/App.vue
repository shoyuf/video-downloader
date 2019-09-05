<template>
  <div id="app">
    <a-spin :spinning="loading" tip="加载中">
      <router-view />
    </a-spin>
    <a-switch v-model="loading">toggle</a-switch>
    <a-button @click="$router.go()">router-go</a-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false
    };
  }
};
</script>
<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
