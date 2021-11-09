<template>
    <!-- <ClassificationHeader
        v-if="selectedClassification"
        :classification="selectedClassification"
    />

    <ClassificationBody
        v-if="selectedClassification"
        :classification="selectedClassification"
    /> -->
    test {{ classificationId }} {{ selectedClassification }}
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    // import ClassificationHeader from '~/components/admin/classifications/classificationHeader.vue'
    // import { useClassificationStore } from '~/components/admin/classifications/_store'
    // import ClassificationBody from '~/components/admin/classifications/classificationBody.vue'
    // import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import useTypedefData from '~/composables/typedefs/useTypedefData'

    export default defineComponent({
        name: 'ClassificationProfile',
        components: {
            // ClassificationHeader,
            // ClassificationBody,
        },
        props: {
            classificationId: String,
        },
        setup(props) {
            const { classificationList } = useTypedefData()

            const selectedClassification = computed(() => classificationList.value.find((classification) => classification.name === props.classificationId))
      
            return {
                selectedClassification
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
