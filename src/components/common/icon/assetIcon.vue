<template>
    <div
        style="border-radius: 2px"
        class="flex items-center flex-none mr-2 bg-white"
    >
        <div
            style="border-radius: 2px"
            class="border border-r-0 border-gray-300 rounded-tr-none rounded-br-none "
            :class="variant == 'lg' ? 'p-1' : 'p-0.5'"
        >
            <img
                :src="logoSrc"
                class="flex-none w-auto bg-white"
                :class="variant == 'lg' ? 'h-5 m-0.5' : 'h-3 m-0.5'"
            />
        </div>

        <span
            style="
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
            "
            :style="{
                backgroundColor: color,
                borderColor: color,
                lineHeight:
                    variant == 'lg' ? '28px !important' : '18px !important',
            }"
            class="px-1 font-bold tracking-wide text-white border"
            :class="variant == 'lg' ? 'text-xl pt-1' : 'text-sm pt-0.5'"
            >{{ text }}</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { colorMap, abbreviationMap } from './assetIconMap'
    export default defineComponent({
        name: 'AssetIcon',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            variant: {
                type: String,
                required: false,
            },
        },
        setup(prop) {
            const { asset } = toRefs(prop)
            const { logo } = useAssetInfo()
            const color = computed(
                () => colorMap[asset.value.attributes.integrationName]
            )
            const text = computed(
                () => abbreviationMap[asset.value.typeName] || 'AST'
            )
            const logoSrc = computed(() => logo(asset.value))
            return { color, logoSrc, text, asset }
        },
    })
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
