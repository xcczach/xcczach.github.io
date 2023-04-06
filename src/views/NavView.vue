<script setup lang="ts">
import { ElMenuItem, ElSubMenu, ElMenuItemGroup } from 'element-plus';
</script>

<template>
    <ElMenuItem index="/">
        欢迎ヾ(•ω•`)o
    </ElMenuItem>
    <ElSubMenu index="/notes">
        <template #title>
            <span>笔记</span>
        </template>
        <ElMenuItemGroup title="数学">
            <ElMenuItem index="/discrete-maths">
                离散数学
            </ElMenuItem>
            <ElMenuItem index="/probability-and-statistics">
                概率统计
            </ElMenuItem>
        </ElMenuItemGroup>
    </ElSubMenu>
</template>

<style scoped>
</style>