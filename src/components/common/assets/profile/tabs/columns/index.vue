<template>
    <div class="flex flex-col p-6 gap-y-4 max-profile-width">
        <ColumnWidget />
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent } from 'vue'
    import { storeToRefs } from 'pinia'

    import ColumnWidget from './columnsWidget.vue'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        components: {
            ColumnWidget,
        },
        setup() {
            const discoveryStore = useAssetStore()
            const { selectedAsset } = storeToRefs(discoveryStore)

            return {
                selectedAsset,
            }
        },
    })
</script>
