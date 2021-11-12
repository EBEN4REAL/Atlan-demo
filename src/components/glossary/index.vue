<template>
    <div
        class="flex flex-col w-full h-full bg-gray-100 border-r border-gray-100"
    >
        <div class="w-full px-3 py-2 border-b border-gray-200">Glossary</div>
        <div class="flex flex-col w-full h-full" ref="glossaryBox">
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
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import Search from '@/common/input/searchAdvanced.vue'
    import GlossaryTree from '@/glossary/tree/glossaryTree2.vue'
    import GlossaryList from '~/components/glossary/list/index.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        GlossaryRelationAttributes,
        InternalAttributes,
    } from '~/constant/projection'
    import { debouncedWatch } from '@vueuse/core'
    import { useDebounceFn } from '@vueuse/core'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        components: {
            GlossaryList,
            Search,
            GlossaryTree,
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
            const aggregations = ref(['typeName'])
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
                assetTypeAggregationList,
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
                assetTypeAggregationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                fetch,
                quickChange,
                handleSearchChange,
                handleSelect,
            }
        },
    })
</script>
