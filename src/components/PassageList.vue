<template>
    <ul>
        <li v-for="item in items"><RouterLink :to="`/${routeName}/${item.fileName}`">{{ item.fileName }}</RouterLink></li>
    </ul>
</template>

<script lang="ts">
    import { RouterLink } from 'vue-router';
    export default {
        props: {
            routeName: {
                type: String,
                required: true
            }
        },
        beforeMount(){
            const json = import(`@/docs/config.json`);
            json.then(data=>{
                this.items = data.default[this.routeName as "discrete-maths"];
            });
        },
        data(): {items: PassageItem[]} {
            return {
                items: [],
            };
        }
    }
</script>