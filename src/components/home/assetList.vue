<template>
    <div class="asset-list">
        <template v-if="isLoading || list.length > 0">
            <div v-if="isLoading" class="flex items-center justify-center">
                <svg
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
            </div>
            <VirtualList
                v-else
                :class="{ 'animate-pulse': isLoading }"
                :data="list"
                data-key="guid"
                variable-height
            >
                <template #default="{ item }">
                    <ListItem
                        class="mx-1"
                        :item="item"
                        :is-selected="
                            item.guid === '-1'
                                ? item.displayText === selectedAssetId
                                : item.guid === selectedAssetId
                        "
                        :preference="[]"
                        @preview="handleCardClicked"
                    ></ListItem>
                </template>
            </VirtualList>
        </template>
        <template v-else>
            <div class="flex flex-col items-center justify-center h-full">
                <div class="flex flex-col items-center">
                    <AtlanIcon
                        :icon="icon"
                        class="w-auto mb-4"
                        style="height: 177px"
                    />
                    <span class="text-gray-500">{{ emptyText }}</span>
                </div>
            </div>
        </template>
    </div>
    <slot name="listFooter"></slot>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType } from 'vue'
    import ListItem from '@common/assets/list/assetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useAssetListing } from '~/composables/home/useHomeDSL'
    // import redirect from '@/glossary/utils/redirectToProfile'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'AssetList',
        components: {
            VirtualList,
            ListItem,
        },
        props: {
            typeNames: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            username: {
                type: String,
                required: false,
                default: () => '',
            },
            icon: {
                type: String,
                required: false,
                default: () => '',
            },
            emptyText: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        setup(props) {
            const { typeNames, username } = toRefs(props)
            const selectedAssetId = ref('')

            const router = useRouter()
            /*             const redirectToProfile = redirect(router)
             */
            const { list, isLoading } = useAssetListing(
                typeNames.value,
                username.value
            )

            function handlePreview(item: any) {
                if (item.guid === '-1') {
                    selectedAssetId.value = item.displayText
                } else {
                    selectedAssetId.value = item.guid
                    if (
                        item.typeName === 'AtlasGlossaryTerm' ||
                        item.typeName === 'AtlasGlossaryCategory'
                    ) {
                        /*                         redirectToProfile(item?.typeName, item?.guid)
                         */
                    } else if (item.typeName === 'Query') {
                        router.push(`/insights?id=${item?.guid}`)
                    } else if (item.typeName === 'Column') {
                        const tableGuid = item?.attributes?.table?.guid
                        router.push(
                            `/assets/${tableGuid}/overview?column=${item?.guid}`
                        )
                    } else {
                        router.push(`/assets/${item?.guid}/overview`)
                    }
                }
            }

            const handleCardClicked = (item: any) => {
                /*  // add event
                const idx = list.value.findIndex((el) => el.guid === item.guid)
                useAddEvent('discovery', 'asset_card', 'clicked', {
                    click_index: idx,
                }) */
                handlePreview(item)
            }

            return {
                selectedAssetId,
                list,
                handleCardClicked,
                isLoading,
            }
        },
    })
</script>

<style lang="less" scoped>
    .asset-list {
        height: 500px;
        overflow-y: auto;
    }
</style>
