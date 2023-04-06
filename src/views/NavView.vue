<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ElMenuItem, ElSubMenu, ElMenuItemGroup } from 'element-plus';
</script>

<template>
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
</template>

<style scoped>
a {
    display: inline-block;
    height: 100%;
    width: 100%;
    color: black;
    text-decoration: none;
}
</style>