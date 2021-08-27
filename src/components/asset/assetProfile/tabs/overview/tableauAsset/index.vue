<template>
    <div class="pl-12 pr-5 mt-8">
        <!-- Readme widget -->
        <div class="pb-6">
            <Readme
                class="w-full border-0"
                :show-borders="false"
                :show-padding-x="false"
                :parent-asset-id="assetData"
            />
        </div>

        <!-- Overview Relations -->
        <div class="mb-16">
            <h2 class="mb-6 text-xl text-gray">Relations</h2>
            <overview-relations />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, computed } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import overviewRelations from '~/components/asset/assetProfile/tabs/overview/tableauAsset/overviewRelations.vue'

    export default defineComponent({
        components: { overviewRelations, Readme },
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            return { assetData }
        },
    })
</script>
