<template>
    <div class="flex flex-col">
        <!-- !typeName && data.length
                    ? formattedClassifications
                    : localClassification -->
        <PillGroup
            v-if="
                localClassification?.length &&
                localClassification[0]?.displayName
            "
            :data="localClassification"
            label-key="displayName"
            popover-trigger="hover"
            read-only
        >
            <template #pillPrefix>
                <ClassificationIcon :color="classificationColor" />
            </template>
            <template #popover="{ item }">
                <ClassificationInfoCard :classification="item" class="w-32"
            /></template>
        </PillGroup>
        <span class="pt-1 pr-2 text-gray-500">Link Classification</span>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs, PropType } from 'vue'

    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import ClassificationInfoCard from '~/components/common/hovercards/classificationInfo.vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    export default defineComponent({
        props: {
            data: {
                type: Array as PropType<Record<string, any>[]>,
                default: () => [],
            },
            typeName: { type: String, default: () => '' },
        },
        components: { PillGroup, ClassificationInfoCard, ClassificationIcon },
        setup(props) {
            const { data, typeName } = toRefs(props)
            const { classificationList } = useTypedefData()

            const formattedClassifications = computed(() =>
                data.value.map((clsf) => ({
                    ...clsf,
                    typeName: clsf.name,
                }))
            )
            const localClassification = computed(() =>
                // Wrapped it in an array to use it with pillGroup
                [
                    classificationList.value.find(
                        (clsf) => clsf?.name === typeName.value
                    ),
                ]
            )
            return {
                formattedClassifications,
                localClassification,
            }
        },
    })
</script>
