<template>
    <div><b>Classification </b> was {{ data.displayValue }}</div>

    <div class="flex flex-wrap my-1">
        <Popover :classification="classification">
            <ClassificationPill
                :name="classification?.name"
                :displayName="classification?.displayName"
                :color="classification?.options?.color"
            ></ClassificationPill>
        </Popover>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        onMounted,
        ref,
        computed,
    } from 'vue'
    import Popover from '@/common/popover/classification.vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import ClassificationPill from '@/common/pills/classification.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    export default defineComponent({
        name: 'ClassificationActivity',

        components: { ClassificationPill, Popover },

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

            const classification = computed(() => {
                console.log(classificationList.value)
                return classificationList.value.find(
                    (item) => item.name === data.value.value.typeName
                )
            })

            return { classification }
        },
    })
</script>
