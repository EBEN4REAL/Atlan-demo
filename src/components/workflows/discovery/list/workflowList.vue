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
                :is-selected="item.metadata.uid === selectedItemId"
                @click="handlePreview(item)"
            />
        </template>
        <template #footer>
            <div
                v-if="isLoadMore || isLoading"
                class="flex items-center justify-center"
            >
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                    :class="isLoading ? 'px-2 w-9' : ''"
                    @click="$emit('loadMore')"
                >
                    <template v-if="!isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown" />
                    </template>
                    <AtlanLoader v-else class="h-10" />
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
                default: () => [],
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
            isLoadMore: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['preview', 'loadMore', 'update:autoSelect'],
        setup(props, { emit }) {
            const { list, autoSelect } = toRefs(props)
            const selectedItemId = ref('')
            let shouldReSelect = false
            function handlePreview(item: any) {
                selectedItemId.value = item.metadata.uid
                emit('preview', item)
            }

            // select first asset automatically conditionally acc to  autoSelect prop

            watch(
                list,
                () => {
                    if (autoSelect.value) {
                        if (list.value.length) handlePreview(list.value[0])
                    } else emit('update:autoSelect', true)
                },
                { immediate: true }
            )

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

            return { handlePreview, selectedItemId }
        },
    })
</script>
