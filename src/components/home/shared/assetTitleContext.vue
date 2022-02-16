<template>
    <div class="flex items-center">
        <!-- <AssetPopover :item="item"> -->
        <div class="flex w-full">
            <div class="flex w-full">
                <div class="flex items-center flex-1">
                    <AtlanIcon
                        :icon="getConnectorImage(item)"
                        class="h-4 mr-1 mb-0.5"
                    ></AtlanIcon>
                    <router-link
                        :to="getProfilePath(item)"
                        @click="stopPropagation"
                    >
                        <a-typography-paragraph
                            class="mb-0 text-sm font-bold cursor-pointer text-primary hover:underline"
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
                    ></CertificateBadge>
                    <a-tooltip placement="right"
                        ><template #title>Limited Access</template>
                        <AtlanIcon
                            v-if="isScrubbed(item)"
                            icon="Lock"
                            class="h-4 mb-1 ml-2 text-gray-500"
                        ></AtlanIcon
                    ></a-tooltip>
                </div>
                <slot name="title-right"></slot>
            </div>
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
                isScrubbed,
                getConnectorImage,
            } = useAssetInfo()

            const stopPropagation = (e: Event) => {
                e.stopPropagation()
            }

            return {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
                description,
                stopPropagation,
                isScrubbed,
                getConnectorImage,
            }
        },
    })
</script>
