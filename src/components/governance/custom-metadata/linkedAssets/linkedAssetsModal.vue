<template>
    <a-modal v-model:visible="visible" :footer="null" :width="700">
        <template #closeIcon></template>
        <div
            class="flex flex-col py-6 space-y-3 overflow-hidden linkedAssetModal"
        >
            <div class="px-6">
                <div class="flex items-center gap-x-2">
                    <CustomMetadataAvatar
                        class="overflow-hidden rounded cm-avatar hover:bg-gray-100"
                        :metadata="metadata"
                    />
                    <span class="text-lg font-bold">
                        {{ metadata.displayName }}
                    </span>
                </div>

                <span class="text-xs text-gray-500">
                    {{ linkedAssets.length }} Assets linked to
                    {{ metadata.displayName }}
                </span>
            </div>
            <section class="px-6 space-y-2.5 overflow-y-auto">
                <div
                    v-for="asset in linkedAssets"
                    :key="asset.guid"
                    class="border-b pb-2.5 last:border-0"
                >
                    <LinkedAssetItem
                        :asset="asset"
                        :metadata="metadata"
                        @success="(assetID) => emit('metadataRemove', assetID)"
                    />
                </div>
            </section>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, toRefs } from 'vue'
    import CustomMetadataAvatar from '@/governance/custom-metadata/CustomMetadataAvatar.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import LinkedAssetItem from '@/governance/custom-metadata/linkedAssets/linkedAssetItem.vue'

    const props = defineProps({
        visible: {
            type: Boolean,
            required: true,
        },
        linkedAssets: {
            type: Object,
            required: true,
        },
        assetCount: {
            type: Number,
            required: true,
        },
        metadata: {
            type: Object,
            required: true,
        },
    })
    const emit = defineEmits(['metadataRemove'])

    const { visible } = useVModels(props, emit)
    const { linkedAssets } = toRefs(props)
</script>

<style scoped>
    .linkedAssetModal {
        max-height: calc(100vh - 13rem);
    }

    .cm-avatar {
        @apply cursor-default !important;
    }
</style>
