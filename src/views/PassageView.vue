<template>
    <div>{{ $route.params.passageName }}</div>
</template>
<script lang="ts">
    export default {
        beforeMount() {
            const md = import(`@/docs/${this.$route.params.passageName}.md?raw`);
            console.log(md);
        },

    }
</script>
