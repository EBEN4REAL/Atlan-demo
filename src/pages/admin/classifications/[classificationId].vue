<template>
    <div>
        <ClassificationHeader
            :classification="selectedClassification"
            v-if="selectedClassification"
        />
        <ClassificationBody :classification="selectedClassification" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import ConnectionTree from '@/connection/tree/index.vue'
    import Loading from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import CreateClassificationTree from '@common/tree/classification/index.vue'
    import ClassificationHeader from '~/components/admin/classifications/classificationHeader.vue'
    import AssetListWrapper from '~/components/asset/assetListWrapper.vue'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import ClassificationBody from '~/components/admin/classifications/classificationBody.vue'
    import { classification } from '../classifications.vue'

    export default defineComponent({
        name: 'ClassificationProfileWrapper',
        components: {
            ConnectionTree,
            Loading,
            ErrorView,
            CreateClassificationTree,
            ClassificationHeader,
            AssetListWrapper,
            ClassificationBody,
        },
        props: {
            classificationId: String,
        },
        setup(props, context) {
            const store = useClassificationStore()
            const classifications = computed(() => store.classifications)
            const selectedClassification: any = computed(() => {
                if (!props.classificationId) {
                    return {}
                }
                if (classifications.value.length === 0) {
                    return {}
                }
                return classifications.value.find(
                    (classification: classification) =>
                        (classification.name || '') ===
                        decodeURI(props.classificationId as string)
                )
            })

            return {
                selectedClassification,
            }
        },
    })
</script>
<style lang="less" scoped>
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
        @apply hidden;
    }
    // Aesterik in right side
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
        display: inline-block;
        margin-left: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }
</style>
<route lang="yaml">
  meta:
  layout: default
  requiresAuth: true
  </route>
