<template>
<div>
    <div class="flex py-6 px-4 text-gray-500 text-sm space-x-4">
        <div>Created By <span class="text-gray-700">{{selectedClassification.createdBy}}</span> on <span class="text-gray-700">{{ createdOn }}</span></div>
        <span>&bull;</span>
        <div>Last Updated <span class="text-gray-700">{{ lastUpdatedAt }}</span> By <span class="text-gray-700">{{selectedClassification.updatedBy}}</span></div>
    </div>
</div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
    import dayjs from 'dayjs'
    import { useTimeAgo } from '@vueuse/core'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationOverviewTab',
        components: {
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const { classification: selectedClassification } = toRefs(props)
            
            const lastUpdatedAt = useTimeAgo(selectedClassification.value.updateTime)
            const createdOn = computed(() => dayjs(new Date(selectedClassification.value.createTime)).format('Do MMMM YYYY'))
            return {
                selectedClassification,
                lastUpdatedAt,
                createdOn
            }
        },
    })
</script>

<style lang="less">

</style>
