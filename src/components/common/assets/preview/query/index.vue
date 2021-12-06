<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <Assets :selectedGuid="selectedGuid" ref="assetList"></Assets>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
        computed,
        PropType,
        inject,
    } from 'vue'

    import Assets from './list/index.vue'

    export default defineComponent({
        name: 'LineagePreviewTab',
        components: {
            Assets,
        },

        setup(props) {
            /** DATA */

            const selectedAsset = inject('selectedAsset')

            /** COMPUTED */
            const selectedGuid = computed(() => selectedAsset.value.guid)

            /** LIFECYCLE */
            return {
                selectedGuid,
            }
        },
    })
</script>
