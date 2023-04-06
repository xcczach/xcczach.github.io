<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ElContainer, ElMain, ElAside, ElMenu, ElMenuItem, ElSubMenu, ElMenuItemGroup } from 'element-plus';
</script>

<template>
  <ElContainer>
    <ElAside width="200px" style="background-color: antiquewhite;">
      <ElMenu>
        <ElMenuItem>
          <RouterLink to="/home">
            欢迎ヾ(•ω•`)o
          </RouterLink>
        </ElMenuItem>
        <ElSubMenu index="1">
          <template #title>
            <span>笔记</span>
          </template>
          <ElMenuItemGroup title="数学">
            <ElMenuItem>
              离散数学
            </ElMenuItem>
          </ElMenuItemGroup>
        </ElSubMenu>
      </ElMenu>
    </ElAside>
    <ElMain style="background-color: aliceblue;">
      <RouterView />
    </ElMain>
  </ElContainer>
</template>

<style scoped>
.el-container {
  height: 100%;
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