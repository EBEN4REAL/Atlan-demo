<template>
    <div class="flex flex-col text-sm cursor-pointer">
        <span class="mb-1 text-sm text-gray-500">Glossary</span>
        <router-link
            :to="getAnchorProfile(asset)"
            class="font-bold text-primary hover:underline"
            >{{ getAnchorName(asset) }}</router-link
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { getAnchorProfile, getAnchorName } = useAssetInfo()
            return {
                getAnchorProfile,
                getAnchorName,
            }
        },
    })
</script>
