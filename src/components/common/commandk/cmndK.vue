<template>
    <div>
        <div class="flex items-center px-3 py-2 border-b">
            <div class="w-5 h-5 pb-1 mr-1" style="margin-bottom: 2px">
                <AtlanIcon
                    v-if="isLoading"
                    icon="Loader"
                    class="w-auto h-5 animate-spin"
                ></AtlanIcon>
                <atlan-icon v-else icon="Search" class="w-auto h-5" />
            </div>
            <a-input
                ref="inputBox"
                v-model:value="queryText"
                class="pl-1 pr-4 text-base text-gray-500 border-0 shadow-none outline-none focus:border-0 force-hide-focus-outline"
                :class="$style.modalStyles"
                :placeholder="placeholder"
                @change="handleSearchChange"
            >
            </a-input>
        </div>

        <div v-if="assetTypeAggregationList.length" class="w-full px-3">
            <AggregationTabs
                v-model="postFacets.typeName"
                class="mt-3"
                :list="assetTypeAggregationList"
                @change="handleAssetTypeChange"
                :shortcutEnabled="true"
            >
            </AggregationTabs>
        </div>
        <!-- body starts here -->
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
                class="flex items-center justify-around px-4 mb-6 h-80"
            >
                <AtlanIcon
                    icon="Loader"
                    class="w-auto h-10 animate-spin"
                ></AtlanIcon>
            </div>
            <div
                v-for="(item, index) in list"
                v-else
                :id="`${item.guid}-asset`"
                :key="item?.guid"
                :class="{ 'bg-blue-50': item?.guid === activeAsset?.guid }"
            >
                <router-link :to="getProfilePath(item)">
                    <div @click="$emit('closeModal')">
                        <AssetItem
                            :item="item"
                            :itemIndex="index"
                            class="px-2 cmd-k-asset-card"
                        />
                    </div>
                    <!-- <div
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
                    <AssetCard
                        v-else
                        :item="item"
                        Modal="$emit('closeModal')"
                    /> -->
                </router-link>
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
    import {
        useDebounceFn,
        onKeyStroke,
        useMagicKeys,
        whenever,
    } from '@vueuse/core'

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
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    export default defineComponent({
        name: 'CommandK',
        components: { AssetCard, GtcCard, AggregationTabs, AssetItem },
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

            const { getProfilePath } = useAssetInfo()

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

            const assetCategoryFilter = ref([])
            const {
                list,
                assetTypeAggregationList,
                quickChange,
                rotateAggregateTab,
            } = useDiscoverList({
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
            const placeholder = computed(() => {
                const found = assetTypeAggregationList.value.find(
                    (item) => item.id === postFacets.value.typeName
                )

                if (found) {
                    console.log(found)
                    return `Search ${found.label.toLowerCase()} assets`
                }
                return 'Search all assets'
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

            const keys = useMagicKeys()
            const { tab, shift_tab } = keys

            whenever(tab, () => {
                if (shift_tab.value) {
                    return
                }
                rotateAggregateTab(1, handleFocusOnInput)
                console.log('go next aggregate', assetTypeAggregationList.value)
            })

            whenever(shift_tab, () => {
                console.log('go previous aggregate')
                rotateAggregateTab(-1, handleFocusOnInput)
            })

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
                placeholder,
                getProfilePath,
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
    .cmd-k-asset-card {
        &.my-1 {
            margin: 0px !important;
        }
    }
</style>
