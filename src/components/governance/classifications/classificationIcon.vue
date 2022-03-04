<template>
    <AtlanIcon
        v-if="hasMouseEntered"
        :icon="icon"
        :style="`stroke: ${getClassificationColorHex(
            fill
        )} !important; color: ${getClassificationColorHex(
            color.toLowerCase()
        )} !important`"
        :class="classNames"
    ></AtlanIcon>
    <AtlanIcon
        v-else
        :icon="icon"
        :style="`stroke: ${getClassificationColorHex(
            color.toLowerCase()
        )} !important;`"
        :class="classNames"
    ></AtlanIcon>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        computed,
        watch,
        toRefs,
    } from 'vue'

    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'ClassificationIcon',
        components: {
            AtlanIcon,
        },
        props: {
            color: {
                type: String as PropType<'green' | 'red' | 'yellow' | 'white'>,
                required: true,
                default: 'green',
            },
            icon: {
                type: String as PropType<
                    | 'ClassificationShield'
                    | 'ClassificationPropagated'
                    | 'ClassificationAtlan'
                    | 'ClassificationAtlanHollow'
                >,
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
                required: false,
            },
        },
        setup(props, { emit }) {
            const fill = ref('white')
            const hasMouseEntered = computed(() => props.mouseEnter)

            return {
                getClassificationColorHex,
                fill,
                hasMouseEntered,
            }
        },
    })
</script>
<style></style>
