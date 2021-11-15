<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col h-full bg-gray-100 border-r border-gray-300  md:block facets"
        >
            <GlossaryFilters v-model="facets"></GlossaryFilters>
        </div>
        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <div class="flex px-6 py-1 border-b border-gray-200">
                    <SearchAdvanced
                        v-model="queryText"
                        :autofocus="true"
                        :allowClear="true"
                        placeholder="Search terms"
                    >
                        <template #postFilter>
                            <PreferenceSelector v-model="preference" />
                        </template>
                    </SearchAdvanced>
                </div>
                <div class="w-full px-4">
                    <AggregationTabs
                        v-model="postFacets.typeName"
                        class="mt-3"
                        :list="glossaryAggreationList"
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
                    v-else-if="list.length === 0 && !isLoading"
                    class="flex-grow"
                >
                    <EmptyView></EmptyView>
                </div>

                <GlossaryList v-else :list="list" :preference="preference" />
            </div>
        </div>

        <!-- <div class="flex flex-col w-full h-full" ref="glossaryBox">
            <div class="px-3 pt-3 pb-1">
                <Search
                    placeholder="Search Terms & Categories"
                    :autofocus="true"
                    v-model="queryText"
                    size="minimal"
                    @change="handleSearchChange"
                >
                </Search>
            </div>

            <GlossaryList
                :list="list"
                class="pb-3"
                v-if="queryText"
            ></GlossaryList>

            <GlossaryTree
                :list="baseTreeData"
                :height="height"
                @select="handleSelect"
                v-else
            ></GlossaryTree>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import GlossaryFilters from '@/glossary/filters/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import GlossaryTree from '@/glossary/tree/glossaryTree2.vue'
    import GlossaryList from '~/components/glossary/list/index.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import PreferenceSelector from '@/assets/preference/index.vue'
    import {
        AssetAttributes,
        GlossaryRelationAttributes,
        InternalAttributes,
    } from '~/constant/projection'
    import { debouncedWatch } from '@vueuse/core'
    import { useDebounceFn } from '@vueuse/core'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useRouter } from 'vue-router'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

    export default defineComponent({
        components: {
            GlossaryList,

            GlossaryTree,
            SearchAdvanced,
            PreferenceSelector,
            GlossaryFilters,
            AggregationTabs,
        },
        props: {
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
            glossaryQualifiedName: {
                type: String,
                required: false,
            },
        },
        setup(props, { emit }) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
            })
            const preference = ref({
                sort: 'default',
                display: [],
            })
            const aggregations = ref(['glossary'])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_TERMS')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
            ])
            const relationAttributes = ref([...GlossaryRelationAttributes])

            const {
                list,
                isLoading,
                glossaryAggreationList,
                isLoadMore,
                fetch,
                quickChange,
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

            console.log('fetching')

            debouncedWatch(
                () => props.glossaryQualifiedName,
                (prev, current) => {
                    if (prev) {
                        facets.value.glossary = props.glossaryQualifiedName

                        quickChange()
                    }
                },
                { debounce: 100 }
            )

            const handleSearchChange = useDebounceFn(() => {
                console.log('change', queryText.value)
                quickChange()
                // tracking.send(events.EVENT_ASSET_SEARCH, {
                //     trigger: 'discover',
                // })
            }, 150)

            const { initTree, handleSelectedGlossary } = useGlossaryData()
            const baseTreeData = ref(initTree())

            const glossaryBox = ref()

            const height = computed(() => {
                if (glossaryBox.value) {
                    return glossaryBox.value.clientHeight - 90
                }
                return 400
            })

            const glossaryURL = (asset) => {
                return {
                    path: `/glossary/${asset.guid}`,
                }
            }

            const router = useRouter()

            const handleSelect = (item) => {
                handleSelectedGlossary(item)
                router.push(glossaryURL(item))
            }

            return {
                baseTreeData,
                glossaryBox,
                height,
                isLoading,
                queryText,
                glossaryAggreationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                fetch,
                quickChange,
                handleSearchChange,
                handleSelect,
                preference,
            }
        },
    })
</script>
