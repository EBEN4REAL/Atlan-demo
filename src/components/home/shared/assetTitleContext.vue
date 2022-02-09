<template>
    <div class="flex items-center justify-between">
        <AssetPopover :item="item">
            <router-link :to="getProfilePath(item)" style="max-width: 93%">
                <a-typography-paragraph
                    class="mb-0 font-bold cursor-pointer text-md text-primary hover:underline"
                    :ellipsis="{
                        rows: 1,
                        onEllipsis: true,
                    }"
                    :content="title(item)"
                />
            </router-link>
        </AssetPopover>
        <CertificateBadge
            v-if="certificateStatus(item)"
            :status="certificateStatus(item)"
            :username="certificateUpdatedBy(item)"
            :timestamp="certificateUpdatedAt(item)"
            class="mb-1 ml-1"
        ></CertificateBadge>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetPopover from '@/common/popover/assets/index.vue'

    export default defineComponent({
        name: 'RecentAnnouncements',
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
        },
        setup() {
            const {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
            } = useAssetInfo()

            return {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
            }
        },
    })
</script>
