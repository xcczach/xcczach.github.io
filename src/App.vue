<script setup lang="ts">
import NavView from './views/NavView.vue';
import { RouterView } from 'vue-router'
import { ElContainer, ElMain, ElHeader, ElAside, ElMenu } from 'element-plus';
</script>

<template>
  <ElContainer>
    <ElHeader id="header-nav">
      <ElMenu mode="horizontal">
        <NavView></NavView>
      </ElMenu>
    </ElHeader>
    <ElContainer>
      <ElAside id="aside-nav" width="200px" style="background-color: white;">
        <ElMenu><NavView></NavView></ElMenu>
      </ElAside>
      <ElMain style="background-color: aliceblue;">
        <RouterView />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped>
.el-container {
  height: 100%;
}

@media screen and (max-width: 750px) {
  #aside-nav {
    display: none;
  }
}
@media screen and (min-width: 750px) {
  #header-nav {
    display: none;
  }
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>