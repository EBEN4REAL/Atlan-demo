<template>
    <div
        :style="{ borderRadius: variant == 'lg' ? '4px' : '2px' }"
        class="flex items-center flex-none bg-white"
    >
        <span
            :style="{
                backgroundColor: color,
                borderColor: color,
                lineHeight:
                    variant == 'lg' ? '28px !important' : '18px !important',
                borderTopRightRadius: variant == 'lg' ? '4px' : '2px',
                borderBottomRightRadius: variant == 'lg' ? '4px' : '2px',
            }"
            class="flex items-center justify-center px-1 font-bold tracking-wide text-white border  min-width"
            :class="variant == 'lg' ? 'text-xl pt-1' : 'text-sm pt-0.5'"
            >{{ text }}</span
        >
    </div>
</template>

<script lang="ts">
    type variant = 'lg' | 'xs'
    import { defineComponent, PropType, computed } from 'vue'
    import { colorMap, abbreviationMap } from '@common/icon/assetIconMap'
    export default defineComponent({
        name: 'AssetIcon',
        props: {
            typeName: {
                type: String as PropType<string>,
                required: true,
            },
            variant: {
                type: String as PropType<variant>,
                required: false,
            },
            imageRequired: {
                type: Boolean as PropType<boolean>,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const color = computed(() => colorMap['tableau'])
            const text = computed(() => {
                return abbreviationMap[props.typeName] || 'AST'
            })
            return { color, text }
        },
    })
</script>

<style lang="less" scoped>
    .test {
        height: 100%;
        width: 100%;
    }
    .min-width {
        min-width: 36px;
    }
</style>
