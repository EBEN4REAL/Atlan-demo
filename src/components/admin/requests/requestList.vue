<template>
    <VirtualList v-if="list.length" :data="list" data-key="id">
        <template #default="{ item, index }">
            <div class="h-8 rounded-sm">{{ index }} {{ item.id }}</div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import VirtualList from '~/lib/virtualList.vue'

    export default defineComponent({
        name: 'RequestList',
        components: { VirtualList },
        props: {
            list: {
                type: Array,
                default: () => [],
            },
        },
    })
</script>

<style></style>
