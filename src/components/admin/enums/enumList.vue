<template>
    <ExplorerList
        :list="list"
        :selected="selected"
        @update:selected="select"
        dataKey="guid"
    >
        <template #default="{ item, isSelected }">
            <p
                class="m-0 text-sm font-bold truncate"
                :class="isSelected ? 'text-primary' : 'text-gray'"
            >
                {{ item.name }}
            </p>
            <span class="m-0 text-sm truncate text-gray">
                {{ item.elementDefs.length }} elements(s)
            </span>
        </template>
    </ExplorerList>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import ExplorerList from '@/admin/common/explorerlist.vue'

    export default defineComponent({
        name: 'EnumList',
        components: { ExplorerList },
        props: {
            list: Array,
            selected: String,
        },
        emits: ['update:selected'],
        setup(props, context) {
            function select(id: string) {
                context.emit('update:selected', id)
            }

            function updateTime(time: string) {
                return useTimeAgo(time).value
            }

            return {
                updateTime,
                select,
            }
        },
    })
</script>
