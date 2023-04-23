<template>
    <div v-html="mdParsed"></div>
</template>
<script lang="ts">
import MdParser from '@/plugins/mdparser';

export default {
    beforeMount() {
        const md = import(`@/docs/${this.$route.params.passageName}.md?raw`);
        md.then(content => {
            this.mdContent = content.default;
            this.mdParsed = new MdParser(this.mdContent).getHtml();
        });
    },
    mounted() {
        MdParser.initMaths();
    },
    data() {
        return {
            mdContent: "",
            mdParsed: ""
        }
    }
}
</script>
