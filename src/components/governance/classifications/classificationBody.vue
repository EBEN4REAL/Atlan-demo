<template>
    <div class="overflow-y-scroll wrapper-height">
        <PurposesWidget
            class="m-5"
            style="height: 384px"
            :classification="selectedClassification"
        />
        <AssetWidget
            class="m-5"
            style="height: 366px"
            :classification="selectedClassification"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
    import AssetWidget from '@/governance/classifications/classificationAssetWidget.vue'
    import PurposesWidget from '@/governance/classifications/classificationPurposeWidget.vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            AssetWidget,
            PurposesWidget,
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
