<template>
    <VMdPreview :text="mdContent"></VMdPreview>
</template>
<script lang="ts">
    import VMdPreview from '@/plugins/vmd_preview';
    export default {
        beforeMount() {
            const md = import(`@/docs/${this.$route.params.passageName}.md?raw`);
            md.then(content=>{
                this.mdContent = content.default;
            })
        },
        data() {
            return {
                mdContent: ""
            }
        },
        components: {
            VMdPreview
        }
    }
</script>
