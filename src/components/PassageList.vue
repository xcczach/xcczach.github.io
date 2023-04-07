<template>
    <ul>
        <li v-for="item in items">
            <RouterLink :to="`/${routeName}/${item.fileName}`">{{ item.fileName }}</RouterLink>
            <span class="passage-tag" v-for="tag in item.tags">{{ tag }}</span>
            <span class="passage-date">{{ `${item.date[0]}.${item.date[1]}.${item.date[2]}` }}</span>
        </li>
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

<style scoped>
    ul {
        list-style-type: none;
    }
    a {
        font-weight: bold;
        text-decoration: none;
        color: black;
    }
    a:hover {
        color: greenyellow;
    }
    .passage-tag {
        display: inline-block;
        margin-left: 0.2rem;
        margin-right: 0.2rem;
        background-color: chocolate;
        color:  white;
    }
    .passage-date {
        display: inline-block;
        font-style: italic;
    }
</style>