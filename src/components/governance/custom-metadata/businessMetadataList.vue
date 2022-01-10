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
                    class="mr-2"
                    :metadata="item"
                    size="16px"
                />
                <p
                    class="w-full pr-1 m-0 overflow-hidden text-sm leading-none"
                    :class="
                        isSelected
                            ? 'text-primary font-semibold'
                            : 'text-gray hover:text-primary hover:font-semibold'
                    "
                >
                    <Truncate :tooltipText="item.displayName" />
                </p>
                <a-tooltip
                    v-if="item.description"
                    tabindex="-1"
                    :title="item.description"
                    placement="right"
                >
                    <span
                        ><AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                    ></span>
                </a-tooltip>
            </div>
        </template>
    </ExplorerList>
</template>
<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import CustomMetadataAvatar from './CustomMetadataAvatar.vue'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: { ExplorerList, CustomMetadataAvatar, Truncate },
        props: {
            finalList: { type: Object, required: true },
            selectedBm: { type: [Object, null], required: true },
        },
        emits: ['update:selected', 'clickMetaData'],
        setup(props, { emit }) {
            // * Methods
            const selectBm = (id: string) => {
                emit('update:selected', id)
                emit('clickMetaData', id)
            }

            return {
                selectBm,
            }
        },
    })
</script>
