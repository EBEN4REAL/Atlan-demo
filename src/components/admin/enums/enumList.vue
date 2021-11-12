<template>
    <ExplorerList
        :list="list"
        :selected="selected"
        data-key="guid"
        :item-class="{ normal: 'bg-blue-50', hovered: 'hover:bg-blue-50' }"
        @update:selected="select"
    >
        <template #default="{ item, isSelected }">
            <div class="flex justify-between">
                <p
                    class="pr-2 m-0 overflow-hidden text-sm truncate"
                    :class="isSelected ? 'text-primary' : 'text-gray'"
                >
                    {{ item.name }}
                </p>
                <span class="flex-none text-xs text-gray-500 flex-inital">
                    {{ item.elementDefs.length || 0 }}
                    {{ item.elementDefs.length > 1 ? 'elements' : 'element' }}
                </span>
            </div>
        </template>
    </ExplorerList>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import ExplorerList from '@/admin/common/explorerList.vue'

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
