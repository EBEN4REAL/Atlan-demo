<template>
    <div class="flex flex-col w-full h-full">
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

        <GlossaryList :list="list" class="pb-3"></GlossaryList>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watch, Ref } from 'vue'
    import Search from '@/common/input/searchAdvanced.vue'
    import GlossaryList from '@/glossary/discoverlist/list.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        GlossaryRelationAttributes,
        InternalAttributes,
    } from '~/constant/projection'
    import { debouncedWatch } from '@vueuse/core'
    import { useDebounceFn } from '@vueuse/core'

    export default defineComponent({
        components: {
            GlossaryList,
            Search,
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
            } = useDiscoverList(
                true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                limit,
                offset,
                defaultAttributes,
                relationAttributes
            )

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

            return {
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
            }
        },
    })
</script>

<style scoped>
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .tab {
        @apply bg-white text-sm !important;
        border: 1px solid #e6e6eb;
        border-radius: 24px !important;
        border: 1px solid #e6e6eb !important;

        padding: 3px 8px !important;
        box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

        transition: all 0.8s ease-out;
    }
</style>
