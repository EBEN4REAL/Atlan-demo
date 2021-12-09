<template>
    <div class="flex flex-col px-5 mt-2 space-y-3">
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
