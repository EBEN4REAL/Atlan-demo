<template>
    <ExplorerList
        :list="finalList"
        :selected="selectedBm?.guid"
        @update:selected="selectBm"
        dataKey="guid"
    >
        <template #default="{ item, isSelected }">
            <p
                class="m-0 overflow-hidden text-sm overflow-ellipsis"
                :class="isSelected ? 'text-primary font-bold' : 'text-gray'"
            >
                <!-- // TODO {{ isUpdateBmSameAsCurrentBm(item) ? updatedBm.displayName  : item.displayName }} -->
                {{
                    isUpdateBmSameAsCurrentBm(item)
                        ? updatedBm.options && updatedBm.options.displayName
                        : item.options.displayName || item.name
                }}
                <sup
                    v-if="
                        isUpdateBmSameAsCurrentBm(item) ||
                        (item && item.guid === 'new')
                    "
                >
                    *
                </sup>
            </p>
            <span class="text-xs text-gray"
                >{{
                    isUpdateBmSameAsCurrentBm(item)
                        ? updatedBm.attributeDefs.length || 0
                        : item.attributeDefs.length || 0
                }}
                attribute(s)</span
            >
        </template>
    </ExplorerList>
</template>
<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import ExplorerList from '../common/explorerlist.vue'

    export default defineComponent({
        props: ['finalList', 'selectedBm', 'updatedBm'],
        components: { ExplorerList },
        setup(props, context) {
            const { finalList, selectedBm, updatedBm } = toRefs(props)

            const isUpdateBmSameAsCurrentBm = (item: { guid: string }) =>
                item.guid === updatedBm.value?.guid

            // * Methods
            const selectBm = (id: string) => {
                const item = finalList.value.find((bm) => bm.guid === id)
                context.emit('selectBm', item)
            }

            return {
                finalList,
                selectedBm,
                updatedBm,
                isUpdateBmSameAsCurrentBm,
                selectBm,
            }
        },
    })
</script>
