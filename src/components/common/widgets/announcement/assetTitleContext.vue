<template>
    <div class="flex items-center">
        <AtlanIcon icon="snowflake" class="h-4 mb-0.5 mr-1" />

        <router-link :to="getProfilePath(item)" style="max-width: 85%">
            <a-typography-paragraph
                class="mb-0 text-xs text-gray-500 cursor-pointer hover:underline tracking-tight"
                :ellipsis="{
                    rows: 1,
                    onEllipsis: true,
                }"
                :content="title(item)"
            />
        </router-link>

        <CertificateBadge
            v-if="certificateStatus(item)"
            :status="certificateStatus(item)"
            :username="certificateUpdatedBy(item)"
            :timestamp="certificateUpdatedAt(item)"
            class="mb-1 ml-1"
            size="small"
        ></CertificateBadge>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetPopover from '@/common/popover/assets/index.vue'

    export default defineComponent({
        name: 'AssetTitleCtx',
        components: {
            CertificateBadge,
            AssetPopover,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            size: {
                type: String,
                required: false,
                default: 'default',
            },
        },
        setup() {
            const {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
                assetType,
            } = useAssetInfo()

            return {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
                assetType,
            }
        },
    })
</script>
