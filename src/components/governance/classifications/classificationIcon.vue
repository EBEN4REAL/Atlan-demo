<template>
    <AtlanIcon
        v-if='hasMouseEntered'
        :icon="icon"
        :style="`stroke: ${getClassificationColorHex(fill)} !important; color: ${getClassificationColorHex(stroke)} !important`"
        :class="classNames"
    ></AtlanIcon>
    <AtlanIcon
        v-else
        :icon="icon"
        :style="`stroke: ${getClassificationColorHex(stroke)} !important;`"
        :class="classNames"
    ></AtlanIcon>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed, watch } from 'vue'

    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'ClassificationIcon',
        components: {
            AtlanIcon
        },
        props: {
            color: {
                type: String as PropType<'green' | 'red' | 'yellow' | 'white' | 'blue'>,
                required: true,
                default: 'blue',
            },
            icon: {
                type: String as PropType<'ClassificationShield' | 'ClassificationPropagated' | 'ClassificationAtlan' | 'ClassificationAtlanHollow'>,
                required: false,
                default: 'ClassificationShield',
            },
            classNames: {
                type: String,
                required: false,
                default: '',
            },
            mouseEnter: {
                type: Boolean,
                default: false,
                required: false
            },
        },
        setup(props, { emit }) {
            // const { color, icon } = toRefs(props)
            const stroke = ref(props.color.toLowerCase())
            const fill = ref('white')
            const icon = computed(() => props.icon)
            const originalColour = ref(props.color.toLowerCase())
            const hasMouseEntered = computed(() => props.mouseEnter)

            return {
                getClassificationColorHex,
                icon,
                originalColour,
                stroke,
                fill,
                hasMouseEntered
            }
        },
    })
</script>
<style></style>
