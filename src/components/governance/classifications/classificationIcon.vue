<template>
    <AtlanIcon
        :icon="icon"
        :style="`stroke: ${getClassificationColorHex(stroke)};`"
        :class="classNames"
    ></AtlanIcon>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed } from 'vue'

    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'

    export default defineComponent({
        name: 'ClassificationIcon',
        props: {
            color: {
                type: String as PropType<'green' | 'red' | 'yellow' | 'white' | 'blue'>,
                required: true,
                default: 'green',
            },
            icon: {
                type: String as PropType<'ClassificationShield' | 'ClassificationPropagated' | 'ClassificationAtlan'>,
                required: false,
                default: 'ClassificationShield',
            },
            classNames: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props, { emit }) {
            // const { color, icon } = toRefs(props)
            const stroke = ref(props.color.toLowerCase())
            const fill = ref('white')
            const icon = computed(() => props.icon)
            const originalColour = ref(props.color.toLowerCase())
            return {
                getClassificationColorHex,
                icon,
                originalColour,
                stroke,
                fill
            }
        },
    })
</script>
<style></style>
