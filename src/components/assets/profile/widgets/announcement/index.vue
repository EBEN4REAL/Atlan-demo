<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="flex justify-between p-4 border rounded"
        :class="
            announcementType(selectedAsset)?.toLowerCase() === 'information'
                ? 'information-bg information-border'
                : announcementType(selectedAsset)?.toLowerCase() === 'issue'
                ? 'issue-bg issue-border'
                : announcementType(selectedAsset)?.toLowerCase() === 'warning'
                ? 'warning-bg warning-border'
                : ''
        "
    >
        <div class="flex">
            <div>
                <!-- <component
                    :is="announcementObject?.icon"
                    class="w-auto h-4 mt-1 mr-4"
                /> -->
            </div>
            <div>
                <div class="mb-1 text-lg font-bold text-gray-700">
                    {{ announcementTitle(selectedAsset) }}
                </div>
                <div class="w-11/12 mb-2 text-gray-500">
                    {{ announcementDescription(selectedAsset) }}
                </div>
                <div class="flex items-center justify-between text-gray-500">
                    <div class="flex text-sm">
                        <div class="ml-1">
                            by {{ announcementUpdatedBy(selectedAsset) }}
                        </div>
                    </div>
                    {{ announcementUpdatedAt(selectedAsset) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'Announcement',
        components: {},

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const {
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
            } = useAssetInfo()

            return {
                selectedAsset,
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
            }
        },
    })
</script>

<style lang="less" scoped>
    .information-bg {
        @apply bg-primary-light;
    }
    .issue-bg {
        background-color: rgba(249, 220, 210, 1);
    }
    .warning-bg {
        background-color: rgba(255, 239, 208, 1);
    }
    .information-border {
        background-color: #f5faff;
        border-color: #5277d7;
        // @apply border-primary;
    }
    .issue-border {
        border-color: rgba(207, 89, 46, 1);
    }
    .warning-border {
        border-color: rgba(255, 177, 25, 1);
    }
</style>
