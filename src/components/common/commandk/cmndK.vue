<template>
    <div>
        <div class="flex items-center px-5 py-4 border-b">
            <svg
                v-if="isLoading"
                class="w-5 h-5 mr-1.5 text-primary animate-spin"
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
            <atlan-icon v-else icon="Search" class="w-auto h-5 mr-1.5" />
            <!-- TODO: Uncomment when bringing category filter in  -->
            <!-- <AssetCategoryFilter
                        v-if="assetCategoryFilter.length"
                        v-model:checked="assetCategoryFilter"
                        @change="handleCategoryChange"
                    >
                        <template #trigger>
                            <a-button
                                class="flex items-center justify-between w-32 h-full px-2 py-1 ml-1 mr-2 border-none group bg-primary-light hover:bg-primary hover:text-white"
                                ><span class="capitalize truncate">{{
                                    assetCategoryFilter?.length > 0
                                        ? getFiltersAppliedString
                                        : 'All'
                                }}</span>
                                <div class="flex items-center space-x-2">
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="w-8 h-4 ml-3"
                                    />
                                    <AtlanIcon
                                        @click="assetCategoryFilter = []"
                                        icon="Cancel"
                                        class="hidden h-3 group-hover:block"
                                    />
                                </div>
                            </a-button>
                        </template>
                    </AssetCategoryFilter> -->

            <a-input
                ref="inputBox"
                v-model:value="queryText"
                class="pl-1 pr-4 text-base text-gray-500 border-0 shadow-none outline-none focus:border-0 force-hide-focus-outline"
                :class="$style.modalStyles"
                :placeholder="dynamicSearchPlaceholder"
                @change="handleSearchChange"
            >
                <template #addonAfter>
                    <div class="flex items-center space-x-4 text-gray-500">
                        <div v-if="queryText.length">
                            <span
                                class="text-xs text-gray-500 cursor-pointer"
                                @click="
                                    () => {
                                        queryText = ''
                                        isLoading = false
                                        handleFocusOnInput()
                                    }
                                "
                                >CLEAR</span
                            >
                            <span class="mb-1">|</span>
                        </div>
                    </div>
                </template>
            </a-input>
            <atlan-icon
                icon="Cancel"
                class="w-auto h-5 mr-1 text-gray-500 cursor-pointer"
                @click="$emit('closeModal')"
            />
        </div>

        <div v-if="assetTypeAggregationList.length" class="w-full px-4">
            <AggregationTabs
                v-model="postFacets.typeName"
                class="mt-3"
                :list="assetTypeAggregationList"
                @change="handleAssetTypeChange"
            >
            </AggregationTabs>
        </div>
        <!-- body starts here -->
        <div v-if="!assetCategoryFilter.length" class="flex flex-col">
            <!-- TODO: Uncomment when bringing category filter in  -->
            <!-- <div class="flex items-center px-4 pb-4 space-x-2">
                    <template v-for="cat in assetCategoryList" :key="cat.id">
                        <div
                            @click="handleCategoryChipClicked(cat)"
                            class="flex items-center px-3 py-1 capitalize border rounded cursor-pointer hover:bg-primary hover:text-white group"
                        >
                            <atlan-icon
                                :icon="cat?.icon"
                                class="h-4 mr-2 group-hover:text-white"
                            />
                            {{ cat.label }}
                        </div>
                    </template>
                </div> -->
        </div>
        <div class="relative flex flex-col pt-2 overflow-y-auto max-h-80">
            <div
                v-if="!list?.length && queryText.length"
                class="flex flex-col items-center justify-center pt-12 pb-20"
            >
                <atlan-icon icon="NoResultsFound" class="w-auto h-40" />
                <span class="flex items-center">
                    No results found for
                    <span class="font-bold"> "{{ queryText }}"</span>
                </span>
            </div>
            <div
                v-else-if="!list.length && !queryText.length"
                class="flex flex-col px-4 mb-6"
            >
                <!-- <span class="mb-2 text-xs text-gray-500">Recently Viewed</span> -->
                <span class="text-xs text-gray-500 mb-"
                    >You haven’t searched for anything just yet ...</span
                >
            </div>
            <div
                :id="`${item.guid}-asset`"
                v-for="item in list"
                v-else
                :key="item?.guid"
                :class="{ 'bg-blue-50': item?.guid === activeAsset?.guid }"
            >
                <div
                    v-if="
                        [
                            'AtlasGlossary',
                            'AtlasGlossaryTerm',
                            'AtlasGlossaryCategory',
                        ].includes(item?.typeName)
                    "
                    @click="$emit('closeModal')"
                >
                    <GtcCard :item="item" class="px-5" />
                </div>
                <AssetCard v-else :item="item" Modal="$emit('closeModal')" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        computed,
        toRefs,
        Ref,
        nextTick,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { useDebounceFn, onKeyStroke } from '@vueuse/core'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import AssetCard from '@/common/commandk/assetCard.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    // import AssetCategoryFilter from '@/common/facets/assetCategory.vue'
    import GtcCard from '@/common/commandk/gtcCard.vue'
    import { assetCategoryList } from '~/constant/assetCategory'

    export default defineComponent({
        name: 'CommandK',
        components: { AssetCard, GtcCard, AggregationTabs },
        props: {
            isCmndKVisible: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['closeModal'],
        setup(props) {
            // data
            // command k behaviour
            const { isCmndKVisible } = toRefs(props)
            const isVisible = computed(() => isCmndKVisible.value)
            const isLoading = ref(false)

            // asset listing
            const queryText = ref('')
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({})
            const inputBox: Ref<null | HTMLInputElement> = ref(null)
            const dependentKey: Ref<undefined | String> =
                ref('DEFAULT_ASSET_LIST') // 'DEFAULT_CMD_KEY'
            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })
            const router = useRouter()

            const defaultAttributes = ref([
                'anchor',
                'name',
                'displayName',
                'description',
                'displayDescription',
                'userDescription',
                'certificateStatus',
                'certificateUpdatedAt',
                'certificateUpdatedBy',
                'certificateStatusMessage',
                'connectorName',
                'connectionName',
                'connectionQualifiedName',
                'ownerUsers',
                'ownerGroups',
                'allowQuery',
                'allowQueryPreview',
                'parentQualifiedName',
                'collectionQualifiedName',
                'parent',
                'rowCount',
                'columnCount',
                'sizeBytes',
                'schemaName',
                'tableName',
                'viewName',
                'databaseName',
                'dataType',
                'definition',
                'isPrimary',
                'order',
                'isPartition',
                'isSort',
                'isIndexed',
                'isForeign',
                'isDist',
            ])
            const relationAttributes = ref([
                'name',
                'description',
                'shortDescription',
            ])

            const dynamicSearchPlaceholder = ref(
                'Search for tables, columns, terms and more...'
            )

            const assetCategoryFilter = ref([])
            const { list, assetTypeAggregationList, quickChange } =
                useDiscoverList({
                    isCache: true,
                    dependentKey,
                    queryText,
                    facets,
                    postFacets,
                    aggregations,
                    limit,
                    offset,
                    attributes: defaultAttributes,
                    relationAttributes,
                })

            const activeAssetIndex = ref(0)
            const activeAsset = computed(
                () => list.value[activeAssetIndex.value]
            )

            const handleSearchChange = useDebounceFn(() => {
                isLoading.value = true
                offset.value = 0
                quickChange()
                // handleFocusOnInput()
            }, 100)

            // TODO: Uncomment when bringing category filters
            // function handleCategoryChange() {
            //     offset.value = 0
            //     quickChange()
            // }
            // const getFiltersAppliedString = computed(() =>
            //     assetCategoryFilter.value.join(', ')
            // )
            // const handleCategoryChipClicked = (cat) => {
            //     assetCategoryFilter.value.push(cat.id)
            //     handleCategoryChange()
            // }
            const handleFocusOnInput = async () => {
                await nextTick()
                inputBox.value?.focus()
            }
            handleFocusOnInput()

            // TODO This is a manual isLoading hack, not sure why one from composable not working
            watch(
                list,
                async () => {
                    if (list.value && list.value.length) {
                        activeAssetIndex.value = 0
                        await nextTick()
                        document
                            .getElementById(`${list.value[0].guid}-asset`)
                            ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'end',
                            })
                    }
                    isLoading.value = false
                },
                { deep: true }
            )

            const handleAssetTypeChange = () => {
                isLoading.value = true
                offset.value = 0
                quickChange()
                // discoveryStore.setActivePostFacet(postFacets.value)
            }

            onKeyStroke(['ArrowDown', 'ArrowUp', 'Enter'], (e) => {
                const { key } = e
                const asset = list.value[activeAssetIndex.value]
                e.preventDefault()
                if (key === 'ArrowUp') {
                    if (activeAssetIndex.value > 0) {
                        activeAssetIndex.value--
                        document
                            .getElementById(`${asset.guid}-asset`)
                            ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'end',
                            })
                    }
                } else if (key === 'ArrowDown') {
                    if (activeAssetIndex.value < list.value.length - 1) {
                        activeAssetIndex.value++
                        document
                            .getElementById(`${asset.guid}-asset`)
                            ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            })
                    }
                } else if (key === 'Enter') router.push(`/assets/${asset.guid}`)
            })

            return {
                isVisible,
                list,
                handleSearchChange,
                queryText,
                dynamicSearchPlaceholder,
                assetCategoryFilter,
                inputBox,
                assetCategoryList,
                facets,
                isLoading,
                assetTypeAggregationList,
                handleAssetTypeChange,
                handleFocusOnInput,
                postFacets,
                activeAsset,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0  !important;
        }
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.ant-input-group-addon) {
            @apply shadow-none outline-none px-0 border-0 bg-transparent !important;
        }
        :global(.focus-visible) {
            @apply shadow-none outline-none px-0 border-0 border-transparent !important;
        }
        :global(.ant-modal-header) {
            @apply border-b-2 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>

<style lang="less">
    .force-hide-focus-outline {
        border-radius: 0px;
        &:focus {
            border: none !important;
        }
        .ant-input:focus {
            border: none !important;
        }
    }
</style>
