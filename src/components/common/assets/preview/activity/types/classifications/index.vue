<template>
    <div><b>Classification </b>{{ data.displayValue }}</div>
    <div class="flex my-3">
        <ClassificationPill
            :name="classificationValue?.name"
            :displayName="classificationValue?.displayName"
        ></ClassificationPill>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, onMounted, ref } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import ClassificationPill from '@/common/pills/classification.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    export default defineComponent({
        name: 'ClassificationActivity',

        components: { ClassificationPill },

        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup(props) {
            const { data } = toRefs(props)
            const { classificationList } = useTypedefData()
            const classificationValue = ref({})

            onMounted(() => {
                classificationList.value.map((classification) => {
                    if (classification.name === data.value.value) {
                        classificationValue.value = classification
                    }
                })
            })

            return { classificationValue }
        },
    })
</script>
