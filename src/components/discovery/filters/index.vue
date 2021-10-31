<template>
    <div>
        <div
            class="flex items-center justify-between px-4 py-3 text-sm border-b  bg-gray-10"
        >
            <div class="font-medium text-gray-500">
                {{ totalAppliedFiltersCount }}
                {{ totalAppliedFiltersCount > 1 ? 'filters' : 'filter' }}
            </div>
        </div>
        <div class="h-full overflow-y-auto">
            <!-- <div class="px-3 pb-3 border-b">
                <Connector
                    v-model:connector="localfacets['connector']"
                    v-model:connection="localFacetMap['connection']"
                    @change="handleChange"
                ></Connector>
            </div> -->

            <a-collapse
                v-model:activeKey="activeKey"
                expand-icon-position="right"
                :bordered="false"
                class="relative bg-transparent"
                :class="$style.filter"
            >
                <a-collapse-panel
                    v-for="item in dynamicList"
                    :key="item.id"
                    class="relative group"
                    :show-arrow="false"
                    :class="isFiltered(item.id) ? 'bg-white text-primary' : ''"
                >
                    <template #header>
                        <div :key="dirtyTimestamp[item.id]" class="select-none">
                            <div class="flex flex-col flex-1">
                                <div
                                    class="flex items-center justify-between  hover:text-primary"
                                >
                                    <span
                                        class="text-xs uppercase  text-gray hover:text-primary title"
                                        style="letter-spacing: 0.07em"
                                    >
                                        <img
                                            v-if="item.image"
                                            :src="item.image"
                                            class="float-left w-auto h-4 mr-2"
                                        />

                                        {{ item.label }}</span
                                    >
                                    <span
                                        v-if="isFiltered(item.id)"
                                        class="ml-auto text-xs text-gray-500 opacity-0  hover:text-primary group-hover:opacity-100"
                                        @click.stop.prevent="
                                            handleClear(item.id)
                                        "
                                    >
                                        Clear
                                    </span>
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="ml-3 text-gray-500 transition-transform duration-300 transform  hover:text-primary title"
                                        :class="
                                            activeKey.includes(item.id)
                                                ? '-rotate-180'
                                                : 'rotate-0'
                                        "
                                    />
                                </div>
                                <!-- <div
                                v-if="!activeKey.includes(item.id)"
                                class="text-primary"
                            >
                                {{ getFiltersAppliedString(item.id) }}
                            </div> -->
                            </div>
                            <div
                                v-if="
                                    isFiltered(item.id) &&
                                    !activeKey.includes(item.id)
                                "
                            >
                                {{ getFilterValue(item.id) }}
                            </div>
                        </div>
                    </template>
                    <!-- 
                    <component
                        v-if="item.component === 'businessMetadata'"
                        :is="item.component"
                    ></component> -->

                    <component
                        :key="dirtyTimestampFacet[item.id]"
                        :is="item.component"
                        v-model="localFacetMap[item.id]"
                        @change="handleChange(item.id)"
                    ></component>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        ref,
        Ref,
        toRefs,
        watch,
    } from 'vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'

    import { discoveryFilters } from '~/constant/filters/discoveryFilters'
    // import RaisedTabSmall from '@/UI/raisedTabSmall.vue'
    // import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    // import { List as StatusList } from '~/constant/status'
    // import { List } from './filters'
    // import useFilterUtils from './useFilterUtils'
    // import { useClassificationStore } from '~/components/admin/classifications/_store'
    // import useFilterPayload from './useFilterPayload'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            // RaisedTabSmall,
            Certificate: defineAsyncComponent(
                () => import('@common/facet/certificate/index.vue')
            ),
            Connector: defineAsyncComponent(
                () => import('@common/treeselect/connector/index.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('@common/facet/owners/index.vue')
            ),
            Connection: defineAsyncComponent(
                () => import('@/common/facet/connection/index.vue')
            ),
            // Classifications: defineAsyncComponent(
            //     () => import('@common/facets/classifications.vue')
            // ),
            // Governance: defineAsyncComponent(
            //     () => import('@common/facets/governance.vue')
            // ),
            // Advanced: defineAsyncComponent(
            //     () => import('@common/facets/advanced/index.vue')
            // ),
            // businessMetadata: defineAsyncComponent(
            //     () => import('@common/facets/businessMetadata/index.vue')
            // ),
            // SavedFilter: defineAsyncComponent(
            //     () => import('./savedFilters/viewSavedFilters.vue')
            // ),
            // SaveFilterModal: defineAsyncComponent(
            //     () => import('./savedFilters/modal/saveFilterModal.vue')
            // ),
        },
        props: {
            filtersList: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localFacetMap = ref(modelValue.value)

            const totalAppliedFiltersCount = ref(0)
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref({})
            const dirtyTimestampFacet = ref({})

            const { list: cmList } = useCustomMetadataFacet()

            const dynamicList = computed(() => {
                if (props.filtersList?.length > 0) {
                    const arr = discoveryFilters.filter((el) =>
                        props.filtersList?.includes(el.id)
                    )
                    return [...arr]
                }
                return [...discoveryFilters, ...cmList.value]
            })

            const isFiltered = (id) => {
                if (localFacetMap?.value) {
                    if (localFacetMap?.value[id]) {
                        if (localFacetMap?.value[id].constructor === Object) {
                            if (
                                Object.keys(localFacetMap?.value[id]).length ===
                                0
                            ) {
                                return false
                            }
                        }
                    }
                }

                if (localFacetMap.value[id]) {
                    return true
                }
                return false
            }

            const handleChange = (id) => {
                modelValue.value = localFacetMap.value
                emit('change')

                totalAppliedFiltersCount.value = Object.keys(
                    localFacetMap.value
                ).length
                dirtyTimestamp.value[id] = `dirty_${Date.now().toString()}`
            }

            const handleClear = (id: string) => {
                // localFacetMap.value[id] = undefined
                // localFacetMap[id] = []
                dirtyTimestampFacet.value[id] = `dirty_${Date.now().toString()}`
                delete localFacetMap.value[id]
                handleChange()
            }

            const getFilterValue = (id: string) => {
                console.log(id)
                if (id === 'hierarchy') {
                    if (localFacetMap.value[id].connectorName) {
                        return localFacetMap.value[id].connectorName
                    }
                }
                return 'asdasd'
            }

            return {
                totalAppliedFiltersCount,
                activeKey,
                dirtyTimestamp,
                dynamicList,
                localFacetMap,
                handleChange,
                handleClear,
                isFiltered,
                dirtyTimestampFacet,
                getFilterValue,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-b border-gray-200 !important;
        }

        :global(.ant-collapse-item-active) {
            @apply bg-white;

            :global(.title) {
                @apply text-primary !important;
            }
        }

        :global(.ant-collapse-header) {
            @apply px-4 !important;
            @apply py-3 !important;

            &:hover {
                @apply bg-white;
                /* some rules */
            }
        }

        :global(.ant-collapse-item:last-child) {
            @apply border-gray-300;
        }

        :global(.ant-collapse-content-box) {
            @apply pb-3;
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
        }
    }
</style>
