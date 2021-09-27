<template>
    <div class="flex items-center flex-none">
        <div v-if="imageRequired" class="">
            <img
                :src="logoSrc"
                class="flex-none w-auto bg-white"
                :class="variant == 'lg' ? 'h-5' : 'h-3.5'"
            />
        </div>

        <span class="pl-1 tracking-wider text-gray-500 uppercase">{{
            text
        }}</span>
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
            const color = computed(() => (selected.value ? '#fff' : '#fff'))
            const text = computed(() => asset.value.typeName)
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
