<template>
    <VirtualList v-if="list.length" :data="list" data-key="id">
        <template #default="{ item, index }">
            <div class="flex items-center justify-between mb-2">
                <div class="h-8 rounded-sm">{{ index }} {{ item.id }}</div>
                <span>{{ item.status }}</span>
                <AtlanButton color="light" @click="$emit('approve', item.id)"
                    >Approve</AtlanButton
                >
                <AtlanButton color="secondary" @click="$emit('reject', item.id)"
                    >Reject</AtlanButton
                >
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'RequestList',
        components: { VirtualList, AtlanButton },
        emits: ['approve', 'reject'],
        props: {
            list: {
                type: Array,
                default: () => [],
            },
        },
    })
</script>

<style></style>
