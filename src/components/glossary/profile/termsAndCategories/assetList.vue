<template>
    <VirtualList :data="list" data-key="guid" :variable-height="false">
        <template #default="{ item }">
            <GtcEntityCard
                :class="{
                    'hover:bg-gray-100': true,
                    'bg-primary-light hover:bg-primary-light':
                        selectedEntity?.guid === item.guid,
                }"
                :bulk-select-mode="
                    bulkSelectedAssets && bulkSelectedAssets.length
                        ? true
                        : false
                "
                :is-checked="
                    bulkSelectedAssets.findIndex(
                        (listItem) => listItem.guid === item.guid
                    ) > -1
                "
                :entity="item"
                :projection="projection"
                @listItem:check="(e, item) => updateBulkSelectedAssets(item)"
                @gtcCardClicked="handleGtcCardClicked"
            />
        </template>
        <template #footer v-if="list?.length < approximateCount">
            <div class="flex items-center justify-center">
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 rounded-full  bg-primary-light text-primary"
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
    import {
        defineComponent,
        SetupContext,
        ref,
        toRefs,
        watch,
        PropType,
    } from 'vue'
    import GtcEntityCard from './gtcEntityCard.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import { Category, Term } from '~/types/glossary/glossary.interface'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useBulkUpdateStore from '~/store/bulkUpdate'

    export default defineComponent({
        name: 'AssetList',
        components: {
            GtcEntityCard,
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
                required: false,
                default() {
                    return false
                },
            },
            selectedEntity: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return undefined
                },
            },
            approximateCount: {
                type: Number,
                required: false,
                default: 20
            }
        },
        emits: ['loadMore', 'gtcCardClicked', 'bulkSelectChange'],
        setup(props, ctx: SetupContext) {
            // data
            const bulkSelectedAssets = ref([])
            const store = useBulkUpdateStore()

            // methods
            const updateBulkSelectedAssets = (listItem) => {
                const itemIndex = bulkSelectedAssets?.value?.findIndex(
                    (item) => item?.guid === listItem?.guid
                )
                if (itemIndex >= 0)
                    bulkSelectedAssets.value.splice(itemIndex, 1)
                else bulkSelectedAssets.value.push(listItem)
                store.setBulkMode(!!bulkSelectedAssets.value.length)
                store.setBulkSelectedAssets(bulkSelectedAssets.value)
            }

            const handleGtcCardClicked = (entity: Category | Term) => {
                ctx.emit('gtcCardClicked', entity)
            }
            watch(store, () => {
                if (!store.bulkSelectedAssets?.length || !store.isBulkMode)
                    bulkSelectedAssets.value = []
            })

            return {
                handleGtcCardClicked,
                bulkSelectedAssets,
                updateBulkSelectedAssets,
            }
        },
    })
</script>
