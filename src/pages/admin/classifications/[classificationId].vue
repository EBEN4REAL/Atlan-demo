<template>
    <div>
        <ClassificationHeader
            v-if="selectedClassification"
            :classification="selectedClassification"
        />

        <ClassificationBody
            v-if="selectedClassification"
            :classification="selectedClassification"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import ClassificationHeader from '~/components/admin/classifications/classificationHeader.vue'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import ClassificationBody from '~/components/admin/classifications/classificationBody.vue'
    import { classificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationProfileWrapper',
        components: {
            ClassificationHeader,
            ClassificationBody,
        },
        props: {
            classificationId: String,
        },
        setup(props) {
            const store = useClassificationStore()
            const classifications = computed(() => store.classifications)

            const selectedClassification = computed(
                (): classificationInterface | undefined => {
                    if (!props.classificationId) {
                        return undefined
                    }
                    if (classifications.value.length === 0) {
                        return undefined
                    }
                    return classifications.value.find(
                        (classification) =>
                            (classification.name || '') ===
                            decodeURI(props.classificationId as string)
                    )
                }
            )

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
