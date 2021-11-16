<template>
    <div
        class="flex flex-col items-stretch flex-1 h-full mb-1"
        ref="glossaryBox"
    >
        <div
            class="flex items-center justify-between w-full px-4 py-3 border-b"
        >
            <GlossarySelect
                v-model="selectedGlossaryQf"
                @change="handleSelectGlossary"
            ></GlossarySelect>
            <a-dropdown :trigger="['click']" placement="bottomLeft">
                <a-button class="ml-3" size="small">
                    <div class="flex items-center">
                        <AtlanIcon
                            icon="Add"
                            class="transition duration-300 text-primary"
                        />
                    </div>
                </a-button>

                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1">
                            <AddGTCModal
                                entityType="AtlasGlossaryTerm"
                                :glossaryQualifiedName="selectedGlossaryQf"
                                @add="handleAddTerm"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon icon="Term" class="mr-1" />
                                        Term
                                    </div>
                                </template>
                            </AddGTCModal>
                        </a-menu-item>
                        <a-menu-item key="2">
                            <AddGTCModal
                                entityType="AtlasGlossaryCategory"
                                :glossaryQualifiedName="selectedGlossaryQf"
                                @add="handleAddCategory"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Category"
                                            class="mr-1"
                                        />
                                        Category
                                    </div>
                                </template>
                            </AddGTCModal>
                        </a-menu-item>
                        <a-menu-item key="3">
                            <AddGTCModal
                                entityType="AtlasGlossary"
                                @add="handleAddGlossary"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Glossary"
                                            class="mr-1"
                                        />
                                        Glossary
                                    </div>
                                </template>
                            </AddGTCModal>
                        </a-menu-item>
                        <a-menu-divider></a-menu-divider>
                        <a-menu-item key="4">
                            <div class="flex items-center">
                                <AtlanIcon icon="Glossary" class="mr-1" />
                                Bulk Upload
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>

        <div class="flex px-4 py-1 mb-2 border-b border-gray-200">
            <SearchAdvanced
                v-model="queryText"
                :connectorName="facets?.hierarchy?.connectorName"
                :autofocus="true"
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

        <div
            v-if="isLoading"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>
        <div
            v-else-if="
                list.length === 0 && baseTreeData.length == 0 && !isLoading
            "
            class="flex-grow"
        >
            <EmptyView
                empty-screen="EmptyDiscover"
                desc="We didnt find anything that matches your search criteria"
                button-text="Reset Filter"
                class="mb-10"
                @event="handleResetEvent"
            ></EmptyView>
        </div>

        <GlossaryTree
            ref="glossaryTree"
            v-else-if="!queryText"
            @select="handlePreview"
            :defaultGlossary="selectedGlossaryQf"
        ></GlossaryTree>

        <AssetList
            v-else
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
                    :selectedGuid="selectedGlossary.guid"
                    @preview="handlePreview"
                ></GlossaryItem>
            </template>
        </AssetList>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, Ref, computed } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetFilters from '@/common/assets/filters/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import GlossaryItem from '~/components/common/assets/list/glossaryAssetItem.vue'
    import AddGTCModal from './modal/addGtcModal.vue'
    import GlossaryTree from '@/common/tree/glossary/glossaryTree2.vue'

    // import GlossarySelect from '@/common/select/glossary.vue'

    import GlossarySelect from '@/common/popover/glossarySelect/index.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import AtlanIcon from '../common/icon/atlanIcon.vue'
    import useGlossaryStore from '~/store/glossary'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { glossaryFilters } from '~/constant/filters/discoveryFilters'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useRouter } from 'vue-router'

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
        },
        setup(props, { emit }) {
            const selectedGlossaryQf = ref('')
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
            const dependentKey = ref('DEFAULT_GLOSSARY_LIST')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...GlossaryAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const { initialFilters } = toRefs(props)
            const glossaryStore = useGlossaryStore()

            if (glossaryStore.activeFacet && glossaryStore.activeFacet !== {}) {
                facets.value = glossaryStore.activeFacet
                console.log(facets.value)
            }

            if (glossaryStore.preferences) {
                preference.value = glossaryStore.preferences
            }
            if (glossaryStore.activeFacetTab?.length > 0) {
                activeKey.value = glossaryStore.activeFacetTab
            } else {
                activeKey.value = ['glossary']
            }

            facets.value = {
                ...facets.value,
                ...initialFilters.value,
                typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
            }

            const glossaryBox = ref()

            const height = computed(() => {
                if (glossaryBox.value) {
                    return glossaryBox.value.clientHeight - 150
                }
                return 400
            })

            const handleSelectGlossary = (val) => {
                selectedGlossaryQf.value = val
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
                selectedGlossary,
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

            const router = useRouter()
            const handlePreview = (item) => {
                router.push(`/glossary/${item.guid}`)
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
                console.log(facets.value)
                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handleActiveKeyChange = () => {
                glossaryStore.setActivePanel(activeKey.value)
            }

            const glossaryTree = ref(null)
            const handleAddGlossary = (asset) => {
                if (glossaryTree.value) {
                    glossaryTree.value.addGlossary(asset)
                }
            }

            const handleAddTerm = (asset) => {
                if (glossaryTree.value) {
                    glossaryTree.value.addTerm(asset)
                }
            }
            const handleAddCategory = (asset) => {
                if (glossaryTree.value) {
                    glossaryTree.value.addCategory(asset)
                }
            }

            const glossaryURL = (asset) => ({
                path: `/glossary/${asset.guid}`,
            })

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

                height,
                glossaryBox,
                handleSelectedGlossary,
                handleAddGlossary,
                glossaryTree,
                glossaryURL,
                selectedGlossaryQf,
                handleSelectGlossary,
                handleAddTerm,
                handleAddCategory,
            }
        },
    })
</script>

<style lang="less">
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
        :global(.ant-popover-content) {
            @apply shadow-sm;
        }
    }
</style>
