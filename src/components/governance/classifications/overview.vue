<template>
{{selectedClassification}}
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
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


            return {
                selectedClassification,
            }
        },
    })
</script>

<style lang="less">

</style>
