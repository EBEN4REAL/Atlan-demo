<template>
    <VirtualList
        :class="{ 'animate-pulse': isLoading }"
        :data="list"
        data-key="metadata"
        variable-height
    >
        <template #default="{ item }">
            <ListItem
                :item="item"
                :is-selected="
                    item.workflowtemplate.metadata.uid === selectedItemId
                "
                @click="handlePreview(item)"
            ></ListItem>
        </template>
        <template #footer>
            <div v-if="isLoading" class="flex items-center justify-center">
                <button
                    :disabled="isLoading"
                    class="
                        flex
                        items-center
                        justify-between
                        py-2
                        transition-all
                        duration-300
                        bg-white
                        rounded-full
                        text-primary
                    "
                    :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                    @click="$emit('loadMore')"
                >
                    <template v-if="!isLoading">
                        <p
                            class="
                                m-0
                                mr-1
                                overflow-hidden
                                text-sm
                                transition-all
                                duration-300
                                overflow-ellipsis
                                whitespace-nowrap
                            "
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown" />
                    </template>
                    <svg
                        v-else
                        class="w-5 h-5 text-primary animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </button>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import ListItem from './listItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    export default defineComponent({
        name: 'WorkflowList',
        components: {
            ListItem,
            VirtualList,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isLoading: {
                type: Boolean,
                required: true,
                default: () => false,
            },
            autoSelect: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            selectedItemId: {
                type: String,
                required: true,
                default: () => null,
            },
        },
        emits: ['preview', 'loadMore', 'update:autoSelect'],
        setup(props, { emit }) {
            const { list, autoSelect } = toRefs(props)

            let shouldReSelect = false
            function handlePreview(item: any) {
                emit('preview', item)
            }

            // select first asset automatically conditionally acc to  autoSelect prop

            // watch(
            //     list,
            //     () => {
            //         if (autoSelect.value) {
            //             if (list.value.length) handlePreview(list.value[0])
            //         } else emit('update:autoSelect', true)
            //     },
            //     { immediate: true }
            // )

            if (autoSelect.value) {
                watch(
                    () => list.value?.length || 0,
                    (len, lastLen) => {
                        if (len > 0 && (lastLen === 0 || lastLen > len))
                            shouldReSelect = true

                        if (shouldReSelect) {
                            handlePreview(list.value[0])
                            shouldReSelect = false
                        }
                    },
                    { immediate: true }
                )
            }

            return { handlePreview }
        },
    })
</script>
