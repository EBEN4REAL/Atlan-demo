<template>
    <div class="flex items-center flex-none">
        <span
            :style="{
                borderRadius: '2px',
                fontSize: '9px',
                lineHeight: '14px',
                backgroundColor: color,
                borderColor: color,
            }"
            class="px-1 pt-0.5 text-white font-bold"
            >{{ text }}</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { colorMap, abbreviationMap } from './assetIconMap'
    export default defineComponent({
        name: 'AssetChip',
        props: {
            typeName: {
                type: String as PropType<keyof typeof abbreviationMap>,
                required: true,
            },
            integrationName: {
                type: String as PropType<keyof typeof colorMap>,
                required: true,
            },
            variant: {
                type: String as PropType<'sm' | 'md' | 'lg'>,
                required: false,
            },
        },
        setup(prop) {
            const { typeName, integrationName } = toRefs(prop)
            const color = computed(() => colorMap[integrationName.value])
            const text = computed(
                () => abbreviationMap[typeName.value] || 'AST'
            )
            const variantStyles = {
                sm: {},
            }
            return { color, text }
        },
    })
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
