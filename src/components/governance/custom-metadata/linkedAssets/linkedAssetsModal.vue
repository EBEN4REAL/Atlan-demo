<template>
    <a-modal v-model:visible="visible" :closable="false" :footer="null">
        <div class="p-6 space-y-5">
            <div class="">
                <div class="flex items-center gap-x-1">
                    <CustomMetadataAvatar
                        class="hover:bg-gray-100"
                        :metadata="metadata"
                    />
                    <span class="text-lg font-bold">
                        {{ metadata.displayName }}
                    </span>
                </div>

                <span class="text-xs text-gray-500">
                    {{ assetCount }} Assets linked to
                    {{ metadata.displayName }}
                </span>
            </div>
            <section>
                <div class="" v-for="asset in linkedAssets.entities">
                    <LinkedAssetItem :asset="asset" />
                   
                </div>
            </section>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
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
    const emit = defineEmits([])

    const { visible } = useVModels(props, emit)

      

   
</script>

<style scoped></style>
