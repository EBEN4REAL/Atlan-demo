<template>
    <div
        style="border-radius: 2px"
        class="flex items-center flex-none mr-2 bg-white"
    >
        <div
            style="border-radius: 2px"
            class="
                p-0.5
                border border-r-0 border-gray-300
                rounded-tr-none rounded-br-none
            "
        >
            <img :src="logoSrc" class="flex-none w-auto h-4 bg-white" />
        </div>

        <span
            style="
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
            "
            :style="{ backgroundColor: color, borderColor: color }"
            class="px-1 text-sm font-bold leading-5 tracking-wide text-white border "
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
