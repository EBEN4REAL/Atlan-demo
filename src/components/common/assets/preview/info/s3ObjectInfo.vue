<template>
    <div class="flex flex-col w-full px-5 gap-y-4">
        <div class="flex flex-col text-sm">
            <div class="flex items-center mb-1 text-gray-500">
                <span>Object Key</span>
                <a-tooltip title="Copy">
                    <div
                        @click="
                            handleCopyValue(s3ObjectKey(asset), 'Object Key')
                        "
                    >
                        <AtlanIcon
                            icon="CopyOutlined"
                            class="w-auto ml-1 cursor-pointer mb-0.5"
                        /></div
                ></a-tooltip>
            </div>
            <span class="text-gray-700">{{ s3ObjectKey(asset) }}</span>
        </div>
        <div class="flex flex-wrap items-center text-sm gap-y-4 gap-x-8">
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Size</span>

                <span class="text-gray-700">{{ s3ObjectSize(asset) }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Storage Class</span>

                <span class="text-gray-700">{{
                    s3ObjectStorageClass(asset)
                }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Version Id</span>

                <span class="text-gray-700">{{
                    s3ObjectVersionId(asset)
                }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Content Type</span>

                <span class="text-gray-700">{{
                    s3ObjectContentType(asset)
                }}</span>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Content Disposition</span>

                <span class="text-gray-700">{{
                    s3ObjectContentDisposition(asset)
                }}</span>
            </div>

            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Last Modified Time</span>

                <span class="text-gray-700">{{
                    s3ObjectLastModifiedTime(asset)
                }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Composables
    import { message } from 'ant-design-vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { copyToClipboard } from '~/utils/clipboard'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const {
                s3ObjectLastModifiedTime,
                s3ObjectSize,
                s3ObjectStorageClass,
                s3ObjectKey,
                s3ObjectContentType,
                s3ObjectContentDisposition,
                s3ObjectVersionId,
            } = useAssetInfo()

            const handleCopyValue = async (value, type) => {
                await copyToClipboard(value)
                message.success(`${type} copied!`)
            }

            return {
                s3ObjectLastModifiedTime,
                s3ObjectSize,
                s3ObjectStorageClass,
                s3ObjectKey,
                s3ObjectContentType,
                s3ObjectContentDisposition,
                s3ObjectVersionId,
                handleCopyValue,
            }
        },
    })
</script>
