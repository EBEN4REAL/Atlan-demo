<template>
    <ClassificationIconInner
        :color="color"
        :icon="icon"
        :class-names="classNames"
    />
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import ClassificationIconInner from '@/governance/classifications/classificationIcon.vue'

    export default defineComponent({
        name: 'ClassificationIcon',
        components: {
            ClassificationIconInner
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
            classNames: {
                type: String,
                default: '',
                required: false
            },
            entityGuid: {
                type: String,
                required: false,
                default: ''
            },
            linkedBy: {
                type: String,
                required: false,
                default: ''
            },
            mouseEnter: {
                type: Boolean,
                default: false,
                required: false
            }
        },
        setup(props, { emit }) {
            const classification = ref<ClassificationInterface>(props.classification)
            const entityGuid = ref(props.entityGuid)

            const isPropagated = computed(() => {
                if (!entityGuid.value || entityGuid.value.length === 0) {
                    return false
                }
                return entityGuid.value !== classification.value.entityGuid;
            })

            const icon = computed(() => {
                if (isPropagated.value) {
                    return "ClassificationPropagated"
                }
                if (props.linkedBy.includes('service-account-atlan')) {
                    return "ClassificationAtlan"
                }
                return "ClassificationShield"
            })
            const color = computed(() => classification.value?.options?.color?.toLowerCase())

            return {
                icon,
                color,
                isPropagated
            }
        }
    })
</script>

<style scoped>

</style>