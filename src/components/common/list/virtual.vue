<template>
    <!-- TODO: Maybe add before and after slots for convenience -->
    <VirtualList :data="items" :data-key="keyField">
        <template #default="{ item }">
            {{ item.guid }}
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import VirtualList from '~/lib/virtualList.vue'

    export default defineComponent({
        components: { VirtualList },
        props: {
            items: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            keyField: {
                type: String,
                required: false,
                default() {
                    return 'id'
                },
            },
        },
    })
</script>
