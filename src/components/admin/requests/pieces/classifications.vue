<template>
    <PillGroup
        :data="formattedClassifications"
        label-key="name"
        popover-trigger="hover"
        read-only
    >
        <template #popover="{ item }">
            <ClassificationInfoCard :classification="item"
        /></template>
    </PillGroup>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'

    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'

    export default defineComponent({
        props: {
            data: { type: Array, required: true, default: () => [] },
        },
        components: { PillGroup, ClassificationInfoCard },
        setup(props) {
            const { data } = toRefs(props)
            const formattedClassifications = computed(() =>
                data.value.map((clsf) => ({
                    ...clsf,
                    typeName: clsf.name,
                }))
            )

            return { formattedClassifications }
        },
    })
</script>
