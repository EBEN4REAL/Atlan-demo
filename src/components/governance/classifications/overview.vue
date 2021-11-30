<template>
<div>
    <div class="flex py-6 px-4 text-gray-500 text-sm space-x-4 items-center">
        <div class="flex items-center">
            Created By
            <UserPill
                :username="selectedClassification.createdBy"
                :allowDelete="false"
                :enableHover="false"
                class="h-6 mx-1"
            ></UserPill>
            on <span class="text-gray-700 ml-1">{{ createdOn }}</span>
        </div>
        <span>&bull;</span>
        <div class="flex items-center">
            Last Updated <span class="text-gray-700 mx-1"> {{ lastUpdatedAt }}</span> By 
            <UserPill
                :username="selectedClassification.updatedBy"
                :allowDelete="false"
                :enableHover="false"
                class="h-6 mx-1"
            ></UserPill>
        </div>
    </div>
    <div class="flex py-2">
        <div class="flex w-80 border rounded cursor-pointer mx-2 p-4" @click="openAssetsTab">
            <AtlanIcon icon="AssetIcon" class="h-11" />
            <div class="mx-2">
                <span class="text-sm font-bold mb-1">Assets</span>
                <div class="flex space-x-2 text-xs text-gray-500">
                    <div><span class="font-bold">{{ datasetCount }}</span> Datasets</div>
                    <div><span class="font-bold">{{ fieldCount }}</span> Fields</div>
                    <div><span class="font-bold">{{ termCount }}</span> Terms</div>                 
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs, watch } from 'vue'
    import dayjs from 'dayjs'
    import { useTimeAgo } from '@vueuse/core'

    import UserPill from '@/common/pills/user.vue'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationOverviewTab',
        components: {
            UserPill
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
            const timeAgo = ref(selectedClassification.value.updateTime)
            const lastUpdatedAt = useTimeAgo(timeAgo)
            const createdOn = computed(() => dayjs(new Date(selectedClassification.value.createTime)).format('Do MMMM YYYY'))

            
            const openAssetsTab = () => {
                emit('openAssetsTab')
            }

            const limit = ref(0)
            const offset = ref(0)
            const dependentKey = ref('DEFAULT_ASSET_LIST')
            const facets = ref({
                __traitNames: {
                    classifications: [selectedClassification.value.name]
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

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                quickChange,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
            })

            const datasetCount = computed(() => {
                let count = 0;
                assetTypeAggregationList.value.forEach((item) => {
                    if(['Database', 'Schema', 'Schema', 'Table', 'TablePartition', 'MaterialisedView'].find((label) => label === item.label)) {
                        count += item.count;
                    }
                })
                return count
            })

            const fieldCount = computed(() => {
                let count = 0;
                assetTypeAggregationList.value.forEach((item) => {
                    if(['Column'].find((label) => label === item.label)) {
                        count += item.count;
                    }
                })
                return count
            })

            const termCount = computed(() => {
                let count = 0;
                assetTypeAggregationList.value.forEach((item) => {
                    if(['AtlasGlossaryTerm'].find((label) => label === item.label)) {
                        count += item.count;
                    }
                })
                return count
            })
            watch(selectedClassification, (classification) => {
                timeAgo.value = classification.updateTime
                facets.value.__traitNames.classifications = [classification.name]
                quickChange()
            })

            return {
                selectedClassification,
                lastUpdatedAt,
                createdOn,
                openAssetsTab,
                assetTypeAggregationList,
                isLoading,

                datasetCount,
                fieldCount,
                termCount
            }
        },
    })
</script>

<style lang="less">

</style>
