<template>
    <!--  <div v-html="displayQuery" class="break-words"></div> -->
    <SQLFormatter
        :text="rawQuery(selectedAsset)"
        background="bg-primary-light"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import SQLFormatter from '@common/sql/snippet.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: { SQLFormatter },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { rawQuery } = useAssetInfo()

            return {
                rawQuery,
            }
        },
    })
</script>
