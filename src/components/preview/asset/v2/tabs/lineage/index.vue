<template>
    <!-- <LoadingView
        v-if="Object.keys(filteredLineageList).length === 0 || loading"
        class="mt-2"
    ></LoadingView> -->
    <div
        v-if="loading"
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting lineage data</span>
    </div>
    <a-collapse
        v-else
        v-model="activeKey"
        :bordered="false"
        :accordion="true"
        :class="$style.filter"
        class="bg-transparent"
        @change="updateActiveKey"
    >
        <template #expandIcon="{ isActive }">
            <fa
                v-if="!isActive"
                icon="fas chevron-right"
                class="text-primary"
            />
            <fa v-else icon="fas chevron-down" class="text-primary" />
        </template>
        <a-collapse-panel
            v-for="stream in streams"
            :key="stream.key"
            class="mb-4 bg-transparent"
        >
            <template #header>
                <div class="flex items-center justify-between w-full">
                    <div class="font-semibold">
                        {{ stream.name }} ({{
                            lineageList[stream.key]?.length || 0
                        }})
                    </div>
                </div>
                <router-link
                    @click="$event.stopPropagation()"
                    :to="`/assets/${id || guid}/lineage`"
                    class="flex w-32 underline"
                    >Graph view
                    <fa icon="fal external-link-alt" class="w-3 h-3 ml-1"></fa
                ></router-link>
            </template>

            <Stream
                :direction="stream.key"
                :lineage-list="filteredLineageList[stream.key]"
            />
        </a-collapse-panel>
    </a-collapse>
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
    import LoadingView from '@common/loaders/section.vue'
    import Stream from './stream/index.vue'
    // Composables
    import useLineage from '~/composables/lineage/useLineage'
    import * as useLineageCompute from '~/composables/lineage/useLineageCompute'
    import useLineageFilters from '~/composables/lineage/useLineageFilters'
    // Types
    import { assetInterface } from '~/types/assets/asset.interface'
    import { generateUUID } from '~/utils/generator'

    export default defineComponent({
        components: { Stream, LoadingView },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset }: ToRefs = toRefs(props)
            const activeKey: Ref<string> = ref('upstream')
            const guid = computed(() => selectedAsset.value.guid)
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

            const updateActiveKey = (key) => {
                if (key) activeKey.value = key
            }

            const updateDepth = (val: number) => {
                depth.value = val
            }
            const searchQuery = (val: string) => {
                query.value = val
            }
            const updateFilters = (val: Ref<string[]>) => {
                filters.value = val
            }
            const filtersLength = computed(() => filters.value.length)

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
                    filter()
                })
            }

            const filter = () => {
                const { data, l } = useLineageFilters(
                    lineageList,
                    filters,
                    query,
                    activeKey
                )
                filteredLineageList.value = data
                assetTypesLengthMap.value[activeKey.value] = l
                loading.value = false
            }

            provide('activeKey', activeKey)
            provide('updateDepth', updateDepth)
            provide('updateFilters', updateFilters)
            provide('searchQuery', searchQuery)
            provide('assetTypesLengthMap', assetTypesLengthMap)

            watch(depth, () => fetch())
            watch(guid, () => fetch())
            watch(id, () => fetch())
            watch(query, () => filter())
            watch(activeKey, () => filter())
            watch(filtersLength, () => filter())

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
                activeKey,
                streams,
                updateActiveKey,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-tabs .ant-tabs-right-content) {
        @apply pr-0 !important;
    }
</style>
<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            padding-left: 18px !important;
            padding-right: 0px !important;
            @apply flex items-center !important;
        }
        :global(.ant-collapse-arrow) {
            left: 0px !important;
            font-size: 0.85rem !important;
            @apply text-primary !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px;
        }
    }
</style>
