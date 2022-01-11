<template>
    <AtlanIcon
        :icon="icon"
        :style="`color: ${color};`"
    />
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'
    import AtlanIcon from './atlanIcon.vue'

    export default defineComponent({
        name: 'ClassificationIcon',
        components: {
            AtlanIcon
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            }
        },
        setup(props, { emit }) {
            const classification = ref<ClassificationInterface>(props.classification)

            const icon = computed(() => {
                if (classification.value.propagate) {
                    return "ClassificationPropagated"
                }
                return "ClassificationShield"
            })

            const color = computed(() => getClassificationColorHex(classification.value.options?.color))
            console.log(color.value)
            return {
                icon,
                color
            }
        }
    })
</script>

<style scoped>

</style>