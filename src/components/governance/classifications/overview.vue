<template>
<div>
    <div class="flex py-6 px-4 text-gray-500 text-sm space-x-4">
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
                    <div><span class="font-bold">12</span> Datasets</div>
                    <div><span class="font-bold">12</span> Fields</div>
                    <div><span class="font-bold">121</span> Terms</div>
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
            watch(selectedClassification, (classification) => {
                timeAgo.value = classification.updateTime
            })
            
            const openAssetsTab = () => {
                emit('openAssetsTab')
            }

            return {
                selectedClassification,
                lastUpdatedAt,
                createdOn,
                openAssetsTab
            }
        },
    })
</script>

<style lang="less">

</style>
