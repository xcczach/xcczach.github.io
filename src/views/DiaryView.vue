<template>
    <div>
        随笔
    </div>
    <PassageList route-name="diaries"></PassageList>
</template>

<script lang="ts">
import PassageList from '@/components/PassageList.vue';
export default {
    components: {
        PassageList
    }
}
</script>