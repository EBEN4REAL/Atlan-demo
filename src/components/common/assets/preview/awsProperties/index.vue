<template>
    <div class="flex flex-col w-full h-full pb-4">
        <div class="flex items-center justify-between px-5 py-4">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500"
                    >AWS Properties</span
                >
            </span>
        </div>
        <div class="flex flex-col px-5 pt-0 overflow-auto gap-y-5">
            <div class="flex flex-col text-sm">
                <div class="flex items-center mb-1 text-gray-500">
                    <span>ARN</span>
                    <a-tooltip title="Copy">
                        <div @click="handleCopyValue(awsArn(asset), 'ARN')">
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>
                <span class="text-gray-700">{{ awsArn(asset) }}</span>
            </div>

            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Partition</span>

                <span class="text-gray-700">{{ awsPartition(asset) }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Service</span>

                <span class="text-gray-700">{{ awsService(asset) }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Region</span>

                <span class="text-gray-700">{{ awsRegion(asset) }}</span>
            </div>

            <div class="flex flex-col text-sm">
                <div class="flex items-center mb-1 text-gray-500">
                    <span>Account Id</span>
                    <a-tooltip title="Copy">
                        <div
                            @click="
                                handleCopyValue(
                                    awsAccountId(asset),
                                    'Account Id'
                                )
                            "
                        >
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>
                <span class="text-gray-700">{{ awsAccountId(asset) }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <div class="flex items-center mb-1 text-gray-500">
                    <span>Resource Id</span>
                    <a-tooltip title="Copy">
                        <div
                            @click="
                                handleCopyValue(
                                    awsResourceId(asset),
                                    'Resource Id'
                                )
                            "
                        >
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>
                <span class="text-gray-700">{{ awsResourceId(asset) }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Owner Name</span>

                <span class="text-gray-700">{{ awsOwnerName(asset) }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Owner Id</span>

                <span class="text-gray-700">{{ awsOwnerId(asset) }}</span>
            </div>
            <div
                v-if="awsTags(asset) && awsTags(asset).length > 0"
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500">Tags</span>

                <DetailsContainer :array="awsTags(asset)" class="rounded-lg" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, watch, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    import DetailsContainer from '@common/assets/misc/detailsOverflowContainer.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { copyToClipboard } from '~/utils/clipboard'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'AWSProperties',
        components: {
            PreviewTabsIcon,
            DetailsContainer,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const {
                awsArn,
                awsPartition,
                awsService,
                awsRegion,
                awsAccountId,
                awsResourceId,
                awsOwnerName,
                awsOwnerId,
                awsTags,
            } = useAssetInfo()

            const handleCopyValue = async (value, type) => {
                await copyToClipboard(value)
                message.success(`${type} copied!`)
            }

            const { selectedAsset } = toRefs(props)

            const guid = ref()
            const s3Attributes = ref([
                'awsArn',
                'awsPartition',
                'awsService',
                'awsRegion',
                'awsAccountId',
                'awsResourceId',
                'awsOwnerName',
                'awsOwnerId',
                'awsTags',
            ])

            const { asset, mutate, isReady, isLoading } = useAssetAttributes({
                id: guid,
                attributes: s3Attributes,
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    guid.value = selectedAsset.value?.guid
                    mutate()
                },
                {
                    immediate: true,
                }
            )

            return {
                handleCopyValue,
                awsArn,
                awsPartition,
                awsService,
                awsRegion,
                awsAccountId,
                awsResourceId,
                awsOwnerName,
                awsOwnerId,
                awsTags,
                isReady,
                isLoading,
                asset,
            }
        },
    })
</script>
