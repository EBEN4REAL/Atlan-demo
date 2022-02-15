<template>
    <div class="flex items-center">
        <!-- <AssetPopover :item="item"> -->
        <div class="flex w-full">
            <router-link :to="getProfilePath(item)" class="flex w-full">
                <div class="flex flex-1">
                    <a-typography-paragraph
                        class="mb-0 text-sm font-bold cursor-pointer text-primary hover:underline"
                        :ellipsis="{
                            rows: 1,
                            onEllipsis: true,
                        }"
                        :content="title(item)"
                    />
                    <CertificateBadge
                        v-if="certificateStatus(item)"
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-1 ml-1"
                    ></CertificateBadge>
                </div>
                <slot name="title-right"></slot>
            </router-link>
        </div>
        <!-- </AssetPopover> -->
    </div>
    <span v-if="showDescription && description(item)">{{
        description(item)
    }}</span>
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
            showDescription: {
                type: Boolean,
                default: false,
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
                description,
            } = useAssetInfo()

            return {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
                description,
            }
        },
    })
</script>
