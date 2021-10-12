<template>
    <div class="flex items-center justify-between">
        <div class="flex w-full">
            <!-- back button -->
            <div class="self-end mt-4 mr-2">
                <a-button
                    class="
                        px-1
                        border-transparent
                        shadow-none
                        hover:border-gray-300
                        py-0.5
                    "
                    @click="$router.back()"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-5 h-5 text-gray-500 transform rotate-180"
                    />
                </a-button>
            </div>
            <div class="flex flex-col w-full">
                <div class="flex items-center w-full gap-x-2">
                    <!-- workflow tyoe -->
                    WORKFLOW
                </div>

                <div class="flex items-center">
                    <Tooltip
                        :tooltip-text="assetData?.name"
                        classes="mb-0 text-gray-700 font-semibold text-lg"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Tooltip from '@common/ellipsis/index.vue'
    // Vue
    import { defineComponent, computed, inject } from 'vue'
    // Components
    import AtlanBtn from '~/components/UI/button.vue'

    export default defineComponent({
        components: {
            AtlanBtn,
            Tooltip,
        },

        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('selectedAsset')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            // useAssetInfo

            return {
                assetData,
            }
        },
    })
</script>
