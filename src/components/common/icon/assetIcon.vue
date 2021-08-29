<template>
    <div class="flex items-center flex-none mr-2 bg-white rounded">
        <div
            v-if="imageRequired"
            class="border border-r-0 rounded-tl rounded-bl"
            :style="{
                padding: variant == 'lg' ? '5px' : '3px',
                borderColor: color,
            }"
        >
            <img
                :src="logoSrc"
                class="flex-none w-auto bg-white"
                :class="variant == 'lg' ? 'h-5' : 'h-3.5'"
            />
        </div>

        <span
            :style="{
                backgroundColor: color,
                borderColor: color,
                lineHeight:
                    variant == 'lg' ? '26px !important' : '18px !important',
            }"
            class="px-1 tracking-wide border rounded-tr rounded-br text-gray"
            :class="variant == 'lg' ? 'text-base pt-1' : 'text-sm pt-0.5'"
            >{{ text }}</span
        >
    </div>
</template>

<script lang="ts">
    type variant = 'lg' | 'sm'
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { abbreviationMap } from './assetIconMap'
    export default defineComponent({
        name: 'AssetIcon',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            variant: {
                type: String as PropType<variant>,
                required: false,
            },
            imageRequired: {
                type: Boolean,
                required: false,
                default: true,
            },
            selected: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(prop) {
            const { asset, selected } = toRefs(prop)
            const { logo } = useAssetInfo()
            const color = computed(() =>
                selected.value ? '#E6E6EB' : '#F3F3F3'
            )
            const text = computed(
                () => abbreviationMap[asset.value.typeName] || 'AST'
            )
            const logoSrc = computed(() => logo(asset.value))
            return { color, logoSrc, text }
        },
    })
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
