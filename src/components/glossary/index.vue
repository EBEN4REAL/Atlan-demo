<template>
    <div
        ref="glossaryBox"
        class="flex flex-col items-stretch flex-1 h-full mb-1"
        :class="{ [$style.checkableTree]: checkable }"
    >
        <div
            v-if="!checkable"
            class="flex items-center justify-between w-full px-4 py-3 mb-2 border-b"
        >
            <GlossarySelect
                v-model="selectedGlossaryQf"
                @change="handleSelectGlossary"
            ></GlossarySelect>
            <div class="flex">
                <CreateGtcBtn
                    v-if="role?.toLowerCase() !== 'guest'"
                    :selected-glossary-qf="selectedGlossaryQf"
                    :term-add-permission="true"
                    :category-add-permission="true"
                    @add="handleAddGTC"
                />
                <div v-if="selectedGlossaryQf?.length" class="ml-2">
                    <GlossaryActions
                        :entity-delete-permission="entityDeletePermission"
                        :entity="selectedGlossary"
                    ></GlossaryActions>
                </div>
            </div>
        </div>

        <div class="flex px-4">
            <SearchAdvanced
                ref="searchBar"
                v-model="queryText"
                :connector-name="facets?.hierarchy?.connectorName"
                :autofocus="true"
                :allow-clear="true"
                :placeholder="
                    checkable
                        ? 'Search terms...'
                        : 'Search terms & categories...'
                "
                @change="handleSearchChange"
            >
                <template #filter>
                    <a-tooltip v-if="!queryText">
                        <template #title>Collapse all </template>
                        <!-- <a-button :disabled="!showCollapseAll" class="p-0 m-0 border-0 outline-none "> -->
                        <atlan-icon
                            icon="TreeCollapseAll"
                            class="h-4 ml-0 outline-none cursor-pointer"
                            :class="{
                                'cursor-not-allowed opacity-80':
                                    !showCollapseAll,
                            }"
                            @click="handleCollapse"
                        >
                        </atlan-icon>
                        <!-- </a-button> -->
                    </a-tooltip>
                </template>
            </SearchAdvanced>
        </div>

        <div v-if="queryText" class="w-full px-4">
            <AggregationTabs
                v-model="postFacets.glossary"
                class="mt-3"
                :list="glossaryAggreationList"
                icon="Glossary"
                @change="handleAssetTypeChange"
            >
            </AggregationTabs>
        </div>
        <div
            v-if="!queryText"
            class="flex flex-col items-stretch flex-1 h-full mt-2 overflow-x-hidden overflow-y-auto glossaryTreeWrapper scrollable-container"
            :class="$style.treeStyles"
        >
            <GlossaryTree
                ref="glossaryTree"
                :termAddPermission="termAddPermission"
                @select="handlePreview"
                :defaultGlossary="checkable ? '' : selectedGlossaryQf"
                :checkable="checkable"
                v-model:checked-guids="checkedGuids"
                :disabled-guids="disabledGuids"
                @check="onCheck"
            ></GlossaryTree>
        </div>
        <div
            v-if="isLoading && queryText"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
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
        <div v-else-if="queryText" :class="$style.searchResults">
            <AssetList
                ref="assetlistRef"
                :list="list"
                :selectedAsset="selectedGlossary"
                :preference="preference"
                :isLoadMore="isLoadMore"
                :isLoading="isValidating"
                @loadMore="handleLoadMore"
                class="mt-3"
            >
                <template v-slot:default="{ item }">
                    <GlossaryItem
                        :item="item"
                        :selectedGuid="selectedGlossary?.guid"
                        :checkable="checkable"
                        :checked="checkedGuids?.includes(item.guid)"
                        @preview="handlePreview"
                        @check="onSearchItemCheck"
                        :isCheckboxDisabled="disabledGuids?.includes(item.guid)"
                    ></GlossaryItem>
                </template>
            </AssetList>
        </div>
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
        onMounted,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { useVModels, useDebounceFn } from '@vueuse/core'

    import EmptyView from '@common/empty/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

    import AssetFilters from '@/common/assets/filters/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import GlossaryItem from '~/components/common/assets/list/glossaryAssetItem.vue'
    import GlossaryTree from '@/common/tree/glossary/glossaryTree.vue'

    import GlossarySelect from '@/common/popover/glossarySelect/index.vue'
    import CreateGtcBtn from '@/glossary/actions/createGtcBtn.vue'
    import GlossaryActions from '@/glossary/actions/glossary.vue'
    import useGTCPermissions, {
        fetchGlossaryPermission,
    } from '~/composables/glossary/useGTCPermissions'
    import whoami from '~/composables/user/whoami'

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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'GlossaryExplorer',
        components: {
            AssetList,
            AggregationTabs,
            AssetFilters,
            SearchAdvanced,

            EmptyView,
            AtlanIcon,
            GlossarySelect,
            GlossaryItem,
            GlossaryTree,
            GlossaryActions,
            CreateGtcBtn,
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
            disabledGuids: {
                type: Object as PropType<string[]>,
                required: false,
            },
        },
        emits: ['check', 'update:checkedGuids', 'searchItemCheck'],
        setup(props, { emit }) {
            const { role } = whoami()

            const glossaryStore = useGlossaryStore()
            const { checkedGuids } = useVModels(props, emit)
            const router = useRouter()
            const { getGlossaryByQF } = useGlossaryData()
            const searchBar = ref(null)
            const glossaryTree = ref(null)
            const showCollapseAll = computed(
                () => glossaryTree.value?.expandedKeys?.length > 0
            )
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
                typeNames: props.checkable
                    ? ['AtlasGlossaryTerm']
                    : ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                glossary: props.checkable ? '' : selectedGlossaryQf, // no concept of selected glossaries in term filter and widget
            }

            // Virtual List Height
            const glossaryBox = ref()
            const height = computed(() => {
                if (props.checkable) return glossaryTree?.value?.clientHeight
                if (glossaryBox.value) {
                    return glossaryBox.value.clientHeight - 150
                }
                return 400
            })

            const {
                list,
                isLoading,
                glossaryAggreationList,
                isLoadMore,
                isValidating,
                fetch,
                quickChange,
                handleSelectedGlossary,
                cancelRequest,
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
                suppressLogs: true,
            })

            const { getAnchorQualifiedName } = useAssetInfo()
            const changeSelectedGlossary = (val) => {
                selectedGlossaryQf.value = val
            }

            // handles selected glossary change
            const handleSelectGlossary = (val) => {
                // change profile to selected glossary
                if (val !== '') {
                    router.push(`/glossary/${getGlossaryByQF(val)?.guid}`)
                    glossaryStore.setSelectedGTC(getGlossaryByQF(val))
                }
                changeSelectedGlossary(val)
                glossaryStore.setActiveGlossaryQualifiedName(val)

                // serach list to show results for selectedGlossary
                if (queryText.value?.length) {
                    facets.value.glossary = selectedGlossaryQf
                    quickChange()
                }
            }
            // for sidebar
            const handlePreview = (item) => {
                if (!props.checkable) {
                    router.push(`/glossary/${item.guid}`)
                    handleSelectedGlossary(item)
                }
                sendSearchClickeEvent()
            }

            // analytics only to be sent for glossary page and not for filters
            const sendSearchAnalyticsEvent = useDebounceFn(() => {
                if (window.location.pathname.includes('/glossary')) {
                    console.log('glossary tree search')
                    useAddEvent('gtc', 'tree', 'searched')
                }
            }, 600)

            const sendSearchClickeEvent = () => {
                if (window.location.pathname.includes('/glossary')) {
                    console.log('glossary tree result clicked')
                    useAddEvent('gtc', 'tree', 'search_result_clicked')
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
                sendSearchAnalyticsEvent()
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

            const handleAddGTC = (asset, entity) => {
                if (asset) {
                    console.log(
                        asset?.typeName,
                        asset?.attributes?.anchor?.guid,
                        'add'
                    )
                    glossaryStore.updateAssetCount(
                        asset?.typeName,
                        asset?.attributes?.anchor?.guid,
                        'add'
                    )
                    if (asset.typeName === 'AtlasGlossary') {
                        glossaryStore.addGlossary(asset)
                        handleSelectGlossary(asset?.attributes?.qualifiedName)
                    }
                    if (glossaryTree.value) {
                        console.log(asset, entity)
                        if (entity?.value?.guid || entity?.guid) {
                            console.log(entity.value)
                            glossaryTree.value.addGTCNode(asset, entity)
                        } else glossaryTree.value.addGlossary(asset)
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
                console.log('bruh log', glossaryTree.value)
            }
            const handleAddTerm = (asset) => {
                console.log(asset?.typeName, asset?.attriutes?.anchor, 'add')
                glossaryStore.updateAssetCount(
                    asset?.typeName,
                    asset?.attriutes?.anchor,
                    'add'
                )

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
            const onCheck = (checkedNodes) => {
                emit('check', checkedNodes)
            }
            const onSearchItemCheck = (checkedNode, checked) => {
                if (checkedNode.typeName === 'AtlasGlossaryTerm') {
                    if (!checkedGuids.value.includes(checkedNode.guid)) {
                        checkedGuids.value.push(checkedNode.guid)
                    }
                    emit('searchItemCheck', checkedNode, checked)
                }
            }
            const checkDuplicateCategoryNames = (
                categoryGuid: string,
                name: string
            ) => {
                return glossaryTree.value?.checkDuplicateCategoryNames(
                    categoryGuid,
                    name
                )
            }
            provide('selectedGlossaryQf', selectedGlossaryQf)
            provide('handleSelectGlossary', handleSelectGlossary)
            provide('checkDuplicateCategoryNames', checkDuplicateCategoryNames)
            // dont fetch flat list on mount
            onMounted(() => {
                cancelRequest()
            })

            // * permissions being checked against the parent glossary not against individual node
            const {
                termAddPermission,
                categoryAddPermission,
                createPermission,
                entityDeletePermission,
                fetch: fetchEvaluation,
            } = fetchGlossaryPermission(selectedGlossary, false)

            if (selectedGlossaryQf.value?.length) fetchEvaluation()

            const createButtonVisibility = computed(() => {
                // ? if in All Glossary Context, disable for non-admin users
                if (
                    !selectedGlossaryQf.value?.length &&
                    role.value?.toLowerCase() !== 'admin'
                )
                    return false

                // ? if glossary is selected & non of the create permission exists , disable it
                if (
                    selectedGlossaryQf.value?.length &&
                    !termAddPermission.value &&
                    !categoryAddPermission.value &&
                    role.value?.toLowerCase() !== 'admin'
                )
                    return false

                return true
            })

            return {
                createButtonVisibility,
                role,
                entityDeletePermission,
                termAddPermission,
                categoryAddPermission,
                checkDuplicateCategoryNames,
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
                handleCollapse,
                onCheck,
                reInitTree,
                checkedGuids,
                updateTreeNode,
                searchBar,
                onSearchItemCheck,
                showCollapseAll,
                map,
                changeSelectedGlossary,
            }
        },
    })
</script>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
    }
    .searchResults {
        @apply overflow-y-auto bg-white;
    }

    .checkableTree {
        max-height: 300px;
        min-height: 300px;

        :global(.glossaryTreeWrapper) {
            @apply overflow-y-auto;
            max-height: 300px;
        }

        :global(.ant-tree-checkbox) {
            @apply my-auto mr-1 mt-2;
            position: absolute;
            right: 0.75rem;
            z-index: 99;
        }
    }
    .treeStyles {
        max-height: calc(100vh - 5rem) !important;
    }
</style>
