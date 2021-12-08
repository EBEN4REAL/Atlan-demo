<template>
    <!-- <div
        v-if="isLoadingCreator"
        class="absolute flex items-center justify-center w-full h-full"
    >
        <a-spin />
    </div> -->
    <div class="flex flex-col px-5 mt-2 space-y-3">
        <!-- <div>
            <div class="flex items-center">
                <p class="mb-1 text-sm tracking-wide text-gray-500">
                    Unique ID (GUID)
                </p>
                <a-tooltip v-if="creator?.id">
                    <template #title>
                        <span>Copy GUID</span>
                    </template>
                    <div
                        class="flex items-center justify-center border-none rounded cursor-pointer "
                        @click="copyAPI(creator?.id)"
                    >
                        <span class="ml-2 -mt-1">
                            <AtlanIcon icon="CopyOutlined"
                        /></span>
                    </div>
                </a-tooltip>
            </div>
            <p class="mb-0 text-gray-700">{{ creator?.id || '-' }}</p>
        </div> -->
        <div>
            <p class="mb-1 text-sm tracking-wide text-gray-500">Creator Name</p>
            <p class="mb-0 text-gray-700">
                <Tooltip :tooltip-text="creator?.name || '-'" :rows="2" />
            </p>
        </div>
        <div>
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Creator Email
            </p>
            <p class="mb-0 text-gray-700">
                <Tooltip :tooltip-text="creator?.email || '-'" :rows="2" />
            </p>
        </div>
        <!-- <div>
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Email Verified
            </p>
            <p class="mb-0 text-gray-700">
                <Tooltip
                    :tooltip-text="
                        creator?.emailVerified
                            ? 'true'
                            : !!creator?.emailVerified
                            ? 'false'
                            : '-'
                    "
                    :rows="2"
                />
            </p>
        </div> -->
        <!-- <div>
            <p class="mb-1 text-sm tracking-wide text-gray-500">Last updated</p>
            <p class="mb-0 text-gray-700">
                {{
                    creator?.last_updated
                        ? formatDateTime(creator?.last_updated)
                        : '-'
                }}
            </p>
        </div> -->
        <div>
            <p class="mb-1 text-sm tracking-wide text-gray-500">Created</p>
            <p class="mb-0 text-gray-700">
                {{
                    selectedWorkflow?.workflowtemplate?.metadata
                        ?.creationTimestamp
                        ? formatDateTime(
                              selectedWorkflow.workflowtemplate.metadata
                                  .creationTimestamp
                          )
                        : '-'
                }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, inject } from 'vue'
    import { message } from 'ant-design-vue'
    import AtlanIcon from '@common/icon/atlanIcon.vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { copyToClipboard } from '~/utils/clipboard'
    import { formatDateTime } from '~/utils/date'

    export default defineComponent({
        components: { AtlanIcon, Tooltip },
        props: {
            selectedWorkflow: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const creator = inject('creatorDetails')
            // const isLoadingCreator = inject('isLoadingCreator')

            const copyAPI = (text: string) => {
                copyToClipboard(text)
                message.success({
                    content: 'GUID Copied!',
                })
            }
            return {
                copyAPI,
                creator,
                formatDateTime,
                // isLoadingCreator,
            }
        },
    })
</script>

<style lang="less" module></style>
