<template>
    <AtlanIcon
        :icon="icon"
        :style="`color: ${getClassificationColorHex(color)};`"
        :class="classNames"
    ></AtlanIcon>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'

    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'
    import { capitalizeFirstLetter } from '~/utils/string'

    export default defineComponent({
        name: 'ClassificationIcon',
        props: {
            color: {
                type: String as PropType<'Blue' | 'Green' | 'Red' | 'Yellow'>,
                required: true,
                default: 'Blue',
            },
            icon: {
                type: String as PropType<'ShieldFilled' | 'Shield'>,
                required: false,
                default: 'Shield',
            },
            classNames: {
                type: String,
                required: false,
                default: ''
            }
        },
        setup(props, { emit }) {
            // const { color, icon } = toRefs(props)
            const color = computed(() => capitalizeFirstLetter(props.color))
            const icon = computed(() => props.icon)
            return {
                getClassificationColorHex,
                color,
                icon,
            }
        },
    })
</script>
