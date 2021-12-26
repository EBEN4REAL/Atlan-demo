<template>
    <div>
        <div
            class="flex flex-col p-4 overflow-y-scroll bg-white rounded-md"
            style="height: 600px"
        >
            <div class="flex items-center sticky-top">
                <AtlanIcon icon="AssetIcon" class="h-8" />
                <div class="mx-2">
                    <span class="mb-1 text-base font-bold">Assets</span>
                </div>
            </div>
            <AssetsWrapper
                :initial-filters="filterConfig"
                :show-filters="false"
                :static-use="true"
                page="classifications"
                class="bg-white"
                :enable-sidebar-drawer="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        PropType,
        toRefs,
        watch,
    } from 'vue'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import AssetsWrapper from '@/assets/index.vue'

    export default defineComponent({
        name: 'ClassificationOverviewTab',
        components: {
            AssetsWrapper,
        },
        emits: ['openAssetsTab'],
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { classification: selectedClassification } = toRefs(props)

            const limit = ref(0)
            const offset = ref(0)
            const dependentKey = ref('DEFAULT_ASSET_LIST')
            const facets = ref({
                __traitNames: {
                    classifications: [selectedClassification.value.name],
                },
            })
            const preference = ref({
                sort: 'default',
                display: [],
            })
            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })

            const { list, isLoading, assetTypeAggregationList, quickChange } =
                useDiscoverList({
                    isCache: true,
                    dependentKey,
                    facets,
                    postFacets,
                    aggregations,
                    preference,
                    limit,
                    offset,
                })

            const filterConfig = computed(() => ({
                __traitNames: {
                    classifications: [selectedClassification.value.name],
                },
            }))

            watch(selectedClassification, (classification) => {
                timeAgo.value = classification.updateTime
                facets.value.__traitNames.classifications = [
                    classification.name,
                ]
                quickChange()
            })

            return {
                selectedClassification,
                assetTypeAggregationList,
                isLoading,
                filterConfig,
            }
        },
    })
</script>

<style lang="less"></style>
