<template>
    <div><b>Classification </b> was {{ data.displayValue }}</div>

    <div class="flex flex-wrap my-1">
        <Popover :classification="classification">
            <ClassificationPill
                :name="classification?.name"
                :display-name="classification?.displayName"
                :color="classification?.options?.color"
                :created-by="classification?.createdBy"
            ></ClassificationPill>
        </Popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import Popover from '@/common/popover/classification/index.vue'
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

            const classification = computed(() => ({
                ...classificationList.value.find(
                    (item) => item.name === data.value.value.typeName
                ),
                entityGuid: data.value.value?.entityGuid,
            }))

            return { classification }
        },
    })
</script>
