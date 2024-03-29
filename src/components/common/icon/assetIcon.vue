<template>
    <div class="flex items-center flex-none">
        <div v-if="imageRequired">
            <img
                :src="logoSrc"
                class="flex-none w-auto"
                :class="variant == 'lg' ? 'h-5' : 'h-3.5 mb-0.5'"
            />
        </div>

        <span
            v-if="textRequired"
            class="pl-1 tracking-wider text-gray-500 uppercase"
            >{{ text }}</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    type variant = 'lg' | 'sm'

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
                default: '',
            },
            imageRequired: {
                type: Boolean,
                required: false,
                default: true,
            },
            textRequired: {
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
            const text = computed(() => asset.value?.typeName)
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
