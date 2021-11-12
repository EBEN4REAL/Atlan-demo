<template>
    <ExplorerList
        :list="finalList"
        :selected="selectedBm?.guid"
        data-key="guid"
        :item-class="{ normal: 'bg-blue-50', hovered: 'hover:bg-blue-50' }"
        @update:selected="selectBm"
    >
        <template #default="{ item, isSelected }">
            <div class="flex justify-between">
                <p
                    class="pr-2 m-0 overflow-hidden text-sm truncate"
                    :class="isSelected ? 'text-primary' : 'text-gray'"
                >
                    {{ item.displayName || item.name }}
                    <sup v-if="item && item.guid === 'new'"> * </sup>
                </p>
                <span class="flex-none text-xs text-gray-500 flex-inital"
                    >{{ item.attributeDefs.length || 0 }}
                    {{
                        item.attributeDefs.length > 1
                            ? 'properties'
                            : 'property'
                    }}</span
                >
            </div>
        </template>
    </ExplorerList>
</template>
<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import ExplorerList from '@/admin/common/explorerList.vue'

    export default defineComponent({
        components: { ExplorerList },
        props: {
            finalList: { type: Object, required: true },
            selectedBm: { type: Object, required: true },
        },
        emits: ['selectBm'],
        setup(props, context) {
            const { finalList, selectedBm } = toRefs(props)

            // * Methods
            const selectBm = (id: string) => {
                const item = finalList.value.find((bm) => bm.guid === id)
                context.emit('selectBm', item)
            }

            return {
                selectBm,
            }
        },
    })
</script>
