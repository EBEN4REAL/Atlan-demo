<template>
    <div class="flex flex-col space-y-3">
        <div class="px-2">
            <div class="flex items-center">
                <p class="mb-1 text-sm tracking-wide text-gray-500">
                    Unique ID (GUID)
                </p>

                <a-tooltip>
                    <template #title>
                        <span>Copy GUID</span>
                    </template>
                    <div
                        class="flex items-center justify-center border-none rounded cursor-pointer "
                        @click="copyAPI(selectedAsset?.guid)"
                    >
                        <span class="ml-2 -mt-1">
                            <AtlanIcon icon="CopyOutlined"
                        /></span>
                    </div>
                </a-tooltip>
            </div>
            <p class="mb-0 text-gray-700">{{ selectedAsset?.guid }}</p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">Last updated</p>
            <p class="mb-0 text-gray-700">
                {{ updatedAt(selectedAsset) }}
                ago,
                {{ modifiedBy(selectedAsset) }}
            </p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">Created</p>
            <p class="mb-0 text-gray-700">
                {{ createdAt(selectedAsset) }}
                ago,
                {{ createdBy(selectedAsset) }}
            </p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Popularity Score
            </p>
            <p class="mb-0 text-gray-700">
                {{ popularityScore(selectedAsset) }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
    import AtlanIcon from '@common/icon/atlanIcon.vue'

    export default defineComponent({
        components: { AtlanIcon },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const {
                createdAt,
                updatedAt,
                createdBy,
                modifiedBy,
                popularityScore,
            } = useAssetInfo()
            const copyAPI = (text: string) => {
                copyToClipboard(text)
                message.success({
                    content: 'GUID Copied!',
                })
            }
            return {
                copyAPI,
                createdAt,
                updatedAt,
                createdBy,
                modifiedBy,
                popularityScore,
            }
        },
    })
</script>

<style lang="less" module></style>
