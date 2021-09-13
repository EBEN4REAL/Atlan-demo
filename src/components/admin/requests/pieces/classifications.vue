<template>
    <PillGroup
        :data="
            !typeName && data.length
                ? formattedClassifications
                : localClassification
        "
        label-key="name"
        popover-trigger="hover"
        read-only
    >
        <template #pillPrefix>
            <AtlanIcon icon="Shield"></AtlanIcon>
        </template>
        <template #popover="{ item }">
            <ClassificationInfoCard :classification="item" class="w-32"
        /></template>
    </PillGroup>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs, PropType } from 'vue'

    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'
    import { useClassificationStore } from '~/components/admin/classifications/_store'

    export default defineComponent({
        props: {
            data: {
                type: Array as PropType<Record<string, any>[]>,
                default: () => [],
            },
            typeName: { type: String, default: () => '' },
        },
        components: { PillGroup, ClassificationInfoCard },
        setup(props) {
            const { data, typeName } = toRefs(props)
            const classificationsStore = useClassificationStore()

            const formattedClassifications = computed(() =>
                data.value.map((clsf) => ({
                    ...clsf,
                    typeName: clsf.name,
                }))
            )

            const localClassification = computed(() =>
                // Wrapped it in an array to use it with pillGroup
                [
                    classificationsStore.classifications.find(
                        (clsf) => clsf.name === typeName.value
                    ),
                ]
            )
            return { formattedClassifications, localClassification }
        },
    })
</script>
