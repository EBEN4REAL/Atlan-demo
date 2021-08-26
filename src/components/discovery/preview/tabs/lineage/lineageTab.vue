<template>
    <div
        v-if="loading"
        class="
            flex
            items-center
            justify-center
            px-5
            py-4
            mt-4
            text-sm
            leading-none
        "
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting lineage data</span>
    </div>
    <div v-else>
        <div class="flex items-center justify-between px-5 my-3 gap-x-2">
            <SearchAndFilter
                class="flex-grow"
                :value="query"
                placeholder="Search assets"
                @change="searchQuery"
                :autofocus="true"
            >
                <template #filter> <Preferences /> </template>
            </SearchAndFilter>
            <router-link
                :to="`/assets/${id || guid}/lineage`"
                class="w-24 text-xs underline"
                @click="$event.stopPropagation()"
                >Graph view
                <fa icon="fal external-link-alt" class="w-3 h-3 ml-1"></fa
            ></router-link>
        </div>
        <a-collapse
            v-model:activeKey="activeKeys"
            :bordered="false"
            :class="$style.filter"
            expand-icon-position="right"
            class="bg-transparent"
        >
            <template #expandIcon="{ isActive }">
                <div class="">
                    <fa
                        icon="fas chevron-down"
                        class="ml-1 transition-transform transform"
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>
            <a-collapse-panel
                v-for="stream in streams"
                :key="stream.key"
                class="bg-transparent"
            >
                <template #header>
                    <div
                        class="
                            flex
                            items-center
                            text-sm
                            font-bold
                            select-none
                            header
                        "
                    >
                        {{ stream.name }}

                        <span class="chip">{{
                            lineageList[stream.key]?.length || 0
                        }}</span>
                    </div>
                </template>

                <AssetList
                    v-if="
                        filteredLineageList[stream.key] &&
                        filteredLineageList[stream.key].length > 0
                    "
                    :lineage-list="filteredLineageList[stream.key]"
                />
                <div v-else>
                    <img
                        :src="emptyScreen"
                        alt="Empty"
                        class="w-3/5 m-auto mt-4"
                    />
                    <div class="mt-4 text-sm text-center text-gray">
                        No assets found in {{ stream.name }}
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        Ref,
        toRefs,
        ToRefs,
        watch,
        provide,
        onMounted,
        computed,
        PropType,
    } from 'vue'
    import { useRoute } from 'vue-router'

    // Components
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import AssetList from './assetList.vue'
    import Preferences from './preferences.vue'

    // Composables
    import useLineage from '~/composables/lineage/useLineage'
    import * as useLineageCompute from '~/composables/lineage/useLineageCompute'
    import useLineageFilters from '~/composables/lineage/useLineageFilters'
    // Types
    import { assetInterface } from '~/types/assets/asset.interface'
    // Assets
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'LineagePreviewTab',
        components: { AssetList, Preferences, SearchAndFilter },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            /** DATA */
            const { selectedAsset }: ToRefs = toRefs(props)
            const activeKeys = ref([])
            const loading = ref(true)
            const lineage: Ref<{}> = ref({})
            const lineageList = ref({})
            const filteredLineageList = ref({})
            const assetTypesLengthMap = ref({})
            const depth = ref(1)
            const query = ref('')
            const filters = ref(['Table', 'View', 'Column', 'Bi Dashboard'])
            const streams = [
                {
                    key: 'upstream',
                    name: 'Upstream',
                },
                {
                    key: 'downstream',
                    name: 'Downstream',
                },
            ]

            /** COMPUTED */
            const route = useRoute()
            const id = computed(() => route?.params?.id || '')
            const guid = computed(() => selectedAsset.value.guid)
            const filtersLength = computed(() => filters.value.length)

            /** METHODS */
            const filter = () => {
                const { data, l } = useLineageFilters(
                    lineageList,
                    filters,
                    query
                )
                filteredLineageList.value = data
                assetTypesLengthMap.value = l
                loading.value = false
            }
            const searchQuery = (e) => {
                query.value = e.target.value
            }
            const updateDepth = (val: number) => {
                depth.value = val
            }
            const updateFilters = (val: Ref<string[]>) => {
                filters.value = val
            }
            const fetch = () => {
                loading.value = true
                const currGuid = id.value || guid.value
                const { data } = useLineage(currGuid, depth.value, 'BOTH')
                watch(data, () => {
                    lineage.value = data.value as object
                    lineageList.value = useLineageCompute.computeGraphRelations(
                        lineage,
                        'widget'
                    )
                    streams.forEach((i) => {
                        if (lineageList.value[i.key])
                            activeKeys.value.push(i.key)
                    })

                    filter()
                })
            }

            /** PROVIDERS */
            provide('updateDepth', updateDepth)
            provide('updateFilters', updateFilters)
            provide('searchQuery', searchQuery)
            provide('assetTypesLengthMap', assetTypesLengthMap)

            /** WATCHERS */
            watch(depth, () => fetch())
            watch(guid, () => fetch())
            watch(id, () => fetch())
            watch(query, () => filter())
            watch(filtersLength, () => filter())

            /** LIFECYCLE */
            onMounted(fetch)

            return {
                id,
                loading,
                guid,
                query,
                lineage,
                lineageList,
                filteredLineageList,
                assetTypesLengthMap,
                activeKeys,
                streams,
                emptyScreen,
                searchQuery,
            }
        },
    })
</script>

<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mr-1 ml-3 rounded tracking-wide text-xs font-bold text-primary bg-primary-light;
    }
    :global(.ant-tabs .ant-tabs-right-content) {
        @apply pr-0 !important;
    }
</style>
<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-b;
            @apply border-gray-300;
        }

        :global(.ant-collapse-header) {
            @apply px-5 !important;
            @apply py-4 !important;
        }

        :global(.ant-collapse-arrow) {
            font-size: 0.85rem !important;
            right: 20px !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            @apply pb-4 !important;
        }
    }
</style>
