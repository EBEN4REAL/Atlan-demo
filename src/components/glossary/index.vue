<template>
    <div
        class="flex flex-col items-stretch flex-1 h-full mb-1"
        :class="{ [$style.checkableTree]: checkable }"
        ref="glossaryBox"
    >
        <div
            v-if="!checkable"
            class="flex items-center justify-between w-full px-4 py-3 border-b"
        >
            <GlossarySelect
                v-model="selectedGlossaryQf"
                @change="handleSelectGlossary"
            ></GlossarySelect>
            <div class="flex">
                <AddGTCModal
                    :key="selectedGlossaryQf"
                    :entityType="defaultEntityType"
                    @add="handleAddGTC"
                    :glossaryQualifiedName="selectedGlossaryQf"
                    :glossaryName="selectedGlosaryName"
                >
                    <template #trigger>
                        <a-button class="ml-3" size="small">
                            <AtlanIcon
                                icon="Add"
                                class="transition duration-300 text-primary"
                            />
                        </a-button>
                    </template>
                </AddGTCModal>

                <div v-if="selectedGlossaryQf?.length" class="ml-2">
                    <GlossaryActions
                        :entity="selectedGlossary"
                    ></GlossaryActions>
                </div>
            </div>
        </div>

        <div class="flex px-4 my-2">
            <SearchAdvanced
                v-model="queryText"
                :connectorName="facets?.hierarchy?.connectorName"
                :autofocus="true"
                ref="searchBar"
                :allowClear="true"
                @change="handleSearchChange"
                placeholder="Search terms & categories..."
            >
                <template #filter>
                    <a-popover
                        class="sm:block md:hidden"
                        placement="bottom"
                        :trigger="['click']"
                        :overlay-class-name="$style.filterPopover"
                    >
                        <template #content>
                            <AssetFilters
                                :key="dirtyTimestamp"
                                v-model="facets"
                                v-model:activeKey="activeKey"
                                :filter-list="discoveryFilters"
                                :type-name="postFacets.typeName"
                                @change="handleFilterChange"
                                @change-active-key="handleActiveKeyChange"
                            ></AssetFilters
                        ></template>
                        <AtlanIcon icon="FilterFunnel" class="mr-1"></AtlanIcon>
                    </a-popover>
                </template>
            </SearchAdvanced>
            <a-tooltip>
                <template #title>Collapse all </template>
                <atlan-icon
                    v-if="!queryText"
                    icon="TreeCollapseAll"
                    class="h-4 mt-2 ml-2 cursor-pointer outline-none"
                    @click="handleCollapse"
                >
                </atlan-icon>
            </a-tooltip>
        </div>

        <div class="w-full px-4" v-if="queryText">
            <AggregationTabs
                v-model="postFacets.glossary"
                class="mt-3"
                :list="glossaryAggreationList"
                icon="Glossary"
                @change="handleAssetTypeChange"
            >
            </AggregationTabs>
        </div>
        <GlossaryTree
            v-if="!queryText"
            ref="glossaryTree"
            :height="height"
            @select="handlePreview"
            :defaultGlossary="checkable ? '' : selectedGlossaryQf"
            :checkable="checkable"
            v-model:checked-guids="checkedGuids"
            @check="onCheck"
        ></GlossaryTree>

        <div
            v-if="isLoading && queryText"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>
        <div
            v-else-if="list.length == 0 && !isLoading && queryText"
            class="flex-grow"
        >
            <div
                v-if="checkable"
                class="flex flex-col items-center justify-center h-full my-2"
            >
                <div class="flex flex-col items-center">
                    <span class="text-gray-500">No terms found</span>
                </div>
            </div>
            <EmptyView
                v-else
                empty-screen="EmptyDiscover"
                desc="We didnt find anything that matches your search criteria"
                button-text="Clear search"
                class="mb-10"
                @event="handleResetEvent"
            ></EmptyView>
        </div>

        <AssetList
            v-else-if="queryText"
            ref="assetlistRef"
            :list="list"
            :selectedAsset="selectedGlossary"
            :preference="preference"
            :isLoadMore="isLoadMore"
            :isLoading="isValidating"
            @loadMore="handleLoadMore"
        >
            <template v-slot:default="{ item }">
                <GlossaryItem
                    :item="item"
                    :selectedGuid="selectedGlossary?.guid"
                    :checkable="checkable"
                    :checked="checkedGuids?.includes(item.guid)"
                    @preview="handlePreview"
                    @check="onSearchItemCheck"
                ></GlossaryItem>
            </template>
        </AssetList>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        Ref,
        computed,
        provide,
        PropType,
        watch,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { useVModels } from '@vueuse/core'

    import EmptyView from '@common/empty/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetFilters from '@/common/assets/filters/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import GlossaryItem from '~/components/common/assets/list/glossaryAssetItem.vue'
    import AddGTCModal from './modal/addGtcModal.vue'
    import GlossaryTree from '@/common/tree/glossary/glossaryTree.vue'

    import GlossarySelect from '@/common/popover/glossarySelect/index.vue'

    import GlossaryActions from '@/glossary/actions/glossary.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import AtlanIcon from '../common/icon/atlanIcon.vue'
    import useGlossaryStore from '~/store/glossary'

    import { glossaryFilters } from '~/constant/filters/discoveryFilters'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            AssetList,
            AggregationTabs,
            AssetFilters,
            SearchAdvanced,
            PreferenceSelector,
            EmptyView,
            AtlanIcon,
            AddGTCModal,
            GlossarySelect,
            GlossaryItem,
            GlossaryTree,
            GlossaryActions,
        },
        props: {
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
            initialFilters: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            checkable: {
                type: Boolean,
                required: false,
                default: false,
            },
            checkedGuids: {
                type: Object as PropType<string[]>,
                required: false,
            },
        },
        emits: ['check', 'update:checkedGuids', 'searchItemCheck'],
        setup(props, { emit }) {
            const glossaryStore = useGlossaryStore()
            const { checkedGuids } = useVModels(props, emit)
            const router = useRouter()
            const { getGlossaryByQF } = useGlossaryData()
            const searchBar = ref(null)
            const selectedGlossaryQf = ref(
                glossaryStore.activeGlossaryQualifiedName
            )
            const selectedGlossary = computed(() =>
                glossaryStore.getGlossaryByQualifiedName(
                    selectedGlossaryQf.value
                )
            )
            const selectedGlosaryName = computed(
                () => selectedGlossary?.value?.attributes?.name
            )

            // List Options
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const preference = ref({
                sort: 'default',
                display: [],
            })
            const aggregations = ref(['glossary'])
            const postFacets = ref({
                glossary: '__all',
            })
            const dependentKey = ref('DEFAULT_GLOSSARY_ITEMS_LIST')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...GlossaryAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const { initialFilters } = toRefs(props)

            facets.value = {
                ...facets.value,
                ...initialFilters.value,
                typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                glossary: selectedGlossaryQf,
            }

            // Virtual List Height
            const glossaryBox = ref()
            const height = computed(() => {
                if (glossaryBox.value) {
                    return glossaryBox.value.clientHeight - 150
                }
                return 400
            })

            const defaultEntityType = computed(() => {
                if (selectedGlossaryQf.value) {
                    return 'AtlasGlossaryTerm'
                }
                return 'AtlasGlossary'
            })

            const handleSelectGlossary = (val) => {
                if (val !== '') {
                    router.push(`/glossary/${getGlossaryByQF(val)?.guid}`)
                    glossaryStore.setSelectedGTC(getGlossaryByQF(val))
                }
                selectedGlossaryQf.value = val
                glossaryStore.setActiveGlossaryQualifiedName(val)
            }

            const {
                list,
                isLoading,
                glossaryAggreationList,
                isLoadMore,
                isValidating,
                fetch,
                quickChange,
                handleSelectedGlossary,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const { getAnchorQualifiedName } = useAssetInfo()

            const handlePreview = (item) => {
                if (!props.checkable) router.push(`/glossary/${item.guid}`)
                handleSelectedGlossary(item)
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleFilterChange = () => {
                offset.value = 0
                quickChange()
                glossaryStore.setActiveFacet(facets.value)
                if (searchBar.value) {
                    searchBar.value?.clearInput()
                }
            }

            const handleAssetTypeChange = () => {
                offset.value = 0
                quickChange()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleChangePreference = () => {
                quickChange()
                glossaryStore.setPreferences(preference.value)
            }
            const handleDisplayChange = () => {
                glossaryStore.setPreferences(preference.value)
            }
            const handleResetEvent = () => {
                facets.value = {
                    typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                }
                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handleActiveKeyChange = () => {
                glossaryStore.setActivePanel(activeKey.value)
            }

            const glossaryTree = ref(null)
            const handleAddGTC = (asset) => {
                if (asset) {
                    if (asset.typeName === 'AtlasGlossary') {
                        glossaryStore.addGlossary(asset)
                        handleSelectGlossary(asset?.attributes?.qualifiedName)
                        if (glossaryTree.value) {
                            glossaryTree.value.addGlossary(asset)
                        }
                    }
                    if (asset.typeName === 'AtlasGlossaryTerm') {
                        console.log('added term')
                        if (glossaryTree.value) {
                            glossaryTree.value.addGlossary(asset)
                        }
                    }
                    if (asset.typeName === 'AtlasGlossaryCategory') {
                        console.log('added cat')
                        if (glossaryTree.value) {
                            glossaryTree.value.addGlossary(asset)
                        }
                    }
                }
            }
            const reInitTree = () => {
                glossaryTree.value?.reInitTree()
            }
            const updateTreeNode = (asset) => {
                glossaryTree.value?.updateTreeNode(asset)
            }

            const handleCollapse = () => {
                glossaryTree.value.collapseTree()
            }
            const handleAddTerm = (asset) => {
                handleSelectGlossary(getAnchorQualifiedName(asset))
                if (glossaryTree.value) {
                    glossaryTree.value.addTerm(asset)
                }
            }
            const handleAddCategory = (asset) => {
                handleSelectGlossary(getAnchorQualifiedName(asset))
                if (glossaryTree.value) {
                    glossaryTree.value.addCategory(asset)
                }
            }
            const glossaryURL = (asset) => ({
                path: `/glossary/${asset.guid}`,
            })
            const onCheck = (checkedNodes, { checkedKeys, checked }) => {
                emit('check', checkedNodes, { checkedKeys, checked })
            }
            const onSearchItemCheck = (checkedNode, checked) => {
                if (!checkedGuids.value.includes(checkedNode.guid)) {
                    checkedGuids.value.push(checkedNode.guid)
                }
                emit('searchItemCheck', checkedNode, checked)
            }
            provide('selectedGlossaryQf', selectedGlossaryQf)
            provide('handleSelectGlossary', handleSelectGlossary)
            return {
                handleFilterChange,
                isLoading,
                queryText,
                glossaryAggreationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                handleLoadMore,
                handleAssetTypeChange,
                handlePreview,
                fetch,
                handleSearchChange,
                isValidating,
                preference,
                handleChangePreference,
                handleResetEvent,
                dirtyTimestamp,
                handleDisplayChange,
                handleActiveKeyChange,
                activeKey,
                glossaryFilters,
                selectedGlossary,
                selectedGlosaryName,
                height,
                glossaryBox,
                handleSelectedGlossary,
                handleAddGTC,
                glossaryTree,
                glossaryURL,
                selectedGlossaryQf,
                handleSelectGlossary,
                handleAddTerm,
                handleAddCategory,
                defaultEntityType,
                handleCollapse,
                onCheck,
                reInitTree,
                checkedGuids,
                updateTreeNode,
                searchBar,
                onSearchItemCheck,
            }
        },
    })
</script>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
    }
    .checkableTree {
        max-height: 364px;
        :global(.ant-tree-checkbox) {
            @apply my-auto mr-2 mt-3;
            position: absolute;
            right: 1.5rem;
            z-index: 99;
        }
    }
</style>
