<template>
    <div class="flex flex-col justify-start classification-request">
        <!-- !typeName && data.length
                    ? formattedClassifications
                    : localClassification -->
        <Popover
            v-if="
                localClassification?.length &&
                localClassification[0]?.displayName
            "
            :classification="localClassification[0]"
            label-key="displayName"
            popover-trigger="hover"
            read-only
            :is-plain="true"
        >
            <!-- <template #pillPrefix>
                <ClassificationIcon :color="classificationColor" />
            </template>
            <template #popover="{ item }">
                <ClassificationInfoCard :classification="item" class="w-32" />
            </template> -->

            <ClassificationPill
                :name="localClassification[0].name"
                :display-name="localClassification[0]?.displayName"
                :allow-delete="false"
                :color="localClassification[0].options?.color"
                :no-hover="true"
                :created-by="localClassification[0]?.createdBy"
                class="pr-3 classification-pill"
            />
        </Popover>
        <span class="pt-1 pr-2 text-gray-500">Link Classification</span>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs, PropType } from 'vue'
    import Popover from '@/common/popover/classification/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import ClassificationInfoCard from '~/components/common/hovercards/classificationInfo.vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'
    import ClassificationPill from '@/common/pills/classification.vue'

    export default defineComponent({
        props: {
            data: {
                type: Array as PropType<Record<string, any>[]>,
                default: () => [],
            },
            typeName: { type: String, default: () => '' },
        },
        components: {
            PillGroup,
            ClassificationInfoCard,
            ClassificationIcon,
            Popover,
            ClassificationPill,
        },
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
<style lang="less">
    .classification-request {
        button {
            padding-left: 0px !important;
        }
    }
    .classification-pill {
        width: fit-content!important
        // padding-left: 0px !important;
        // background: transparent !important;
        // border: none !important;
        // &:hover {
        //     background: transparent !important;
        //     @apply text-gray-700 !important;
        // }
    }
</style>
