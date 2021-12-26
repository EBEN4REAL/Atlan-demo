<template>
    <div class="overflow-y-scroll wrapper-height">
        <ClassificationOverview
            class="p-5"
            :classification="selectedClassification"
        />
        <ClassificationOverview
            class="p-5"
            :classification="selectedClassification"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
    import ClassificationOverview from '@/governance/classifications/overview.vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            ClassificationOverview,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const { classification: selectedClassification } = toRefs(props)

            return {
                selectedClassification,
            }
        },
    })
</script>

<style lang="less" scoped>
    .wrapper-height {
        height: calc(100vh - 4rem);
        overflow: auto;
    }
</style>
