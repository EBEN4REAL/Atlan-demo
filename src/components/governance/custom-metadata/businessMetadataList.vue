<template>
    <ExplorerList
        :list="finalList"
        :selected="selectedBm?.guid"
        data-key="guid"
        :item-class="{ normal: 'bg-blue-50', hovered: 'hover:bg-blue-50' }"
        @update:selected="selectBm"
    >
        <template #default="{ item, isSelected }">
            <div class="flex items-center">
                <CustomMetadataAvatar
                    class="mr-1"
                    :metadata="item"
                    size="16px"
                />
                <p
                    class="pr-2 m-0 overflow-hidden text-sm leading-none truncate "
                    :class="isSelected ? 'text-primary' : 'text-gray'"
                >
                    {{ item.displayName || item.name }}
                </p>
            </div>
        </template>
    </ExplorerList>
</template>
<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import CustomMetadataAvatar from './CustomMetadataAvatar.vue'

    export default defineComponent({
        components: { ExplorerList, CustomMetadataAvatar },
        props: {
            finalList: { type: Object, required: true },
            selectedBm: { type: [Object, null], required: true },
        },
        emits: ['update:selected'],
        setup(props, { emit }) {
            // * Methods
            const selectBm = (id: string) => emit('update:selected', id)

            return {
                selectBm,
            }
        },
    })
</script>
