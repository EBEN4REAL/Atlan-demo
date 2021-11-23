<template>
    <div class="flex items-center">
        <PillGroup
            v-if="classification?.length && classification[0]?.displayName"
            :data="classification"
            label-key="displayName"
            popover-trigger="hover"
            read-only
        >
            <template #pillPrefix>
                <AtlanIcon icon="Shield" class="text-pink-500"></AtlanIcon>
            </template>
            <template #popover="{ item }">
                <ClassificationInfoCard :classification="item" class="w-32"
            /></template>
        </PillGroup>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import ClassificationInfoCard from '~/components/common/hovercards/classificationInfo.vue'

    export default defineComponent({
        components: { PillGroup, ClassificationInfoCard },
        props: {
            data: {
                type: Object as PropType<Record<string, any>>,
                default: () => {},
            },
            typeName: { type: String, default: () => '' },
        },
        setup(props) {
            const { data, typeName } = toRefs(props)
            const { classificationList } = useTypedefData()
            const classification = computed(() => [
                typeName.value
                    ? classificationList.value.find(
                          (clsf) => clsf.name === typeName.value
                      )
                    : {
                          ...data.value,
                          typeName: data.value.name,
                      },
            ])

            return { classification }
        },
    })
</script>
