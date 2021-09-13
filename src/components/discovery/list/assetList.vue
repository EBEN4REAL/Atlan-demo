<template>
    <VirtualList :data="list" data-key="guid" :variable-height="false">
        <template #default="{ item }">
            <ListItem
                :item="item"
                :is-selected="item.guid === selectedAssetId"
                :score="score[item.guid]"
                :projection="projection"
                @click="handlePreview(item)"
            ></ListItem>
        </template>
        <template #footer>
            <div
                v-if="isLoadMore || isLoading"
                class="flex items-center justify-center"
            >
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full  text-primary"
                    :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                    @click="$emit('loadMore')"
                >
                    <template v-if="!isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
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
    <!-- <ListItem
        :v-for="item in list"
        :key="item[keyField]"
        :item="item"
        :score="score[item.guid]"
        :projection="projection"
        @click="handlePreview(item)"
    ></ListItem> -->
    <!-- TODO: Add loading state -->
</template>

<script lang="ts">
    import { defineComponent, SetupContext, ref, toRefs, watch } from 'vue'
    import ListItem from './listItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    export default defineComponent({
        name: 'AssetList',
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
            score: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isLoading: {
                type: Boolean,
                required: true,
                default() {
                    return false
                },
            },
            isLoadMore: {
                type: Boolean,
                required: true,
                default() {
                    return false
                },
            },
            automaticSelectFirstAsset: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['preview', 'loadMore'],
        setup(props, ctx: SetupContext) {
            const { list, automaticSelectFirstAsset } = toRefs(props)
            const selectedAssetId = ref('')
            function handlePreview(item: any) {
                selectedAssetId.value = item.guid
                ctx.emit('preview', item)
            }

            // select first asset automatically conditionally acc to  automaticSelectFirstAsset prop

            if (automaticSelectFirstAsset.value) {
                watch(
                    list,
                    () => {
                        if (list.value.length > 0) {
                            // for selecting in the list - blue bg
                            selectedAssetId.value = list.value[0].guid
                            // for previewing the first asset
                            handlePreview(list.value[0])
                        }
                    },
                    { immediate: true }
                )
            }

            return { handlePreview, selectedAssetId, list }
        },
    })
</script>
