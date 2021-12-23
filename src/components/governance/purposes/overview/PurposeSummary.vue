<template>
    <div class="p-6 bg-white border border-gray-200 rounded">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <div class="font-semibold">Details</div>
            </div>
            <div class="hidden">
                <a-switch
                    class="ml-auto"
                    data-test-id="toggle-switch"
                    style="width: 40px !important"
                    :class="purpose.enabled ? 'btn-checked' : 'btn-unchecked'"
                    v-model:checked="purpose.enabled"
                    :loading="enableDisableLoading"
                    @change="handleEnableDisablePurpose"
                />
                <span class="ml-2 text-sm text-gray">Enable Purpose</span>
            </div>
        </div>
        <div class="flex flex-col gap-y-2">
            <div class="">
                <div class="mb-0 text-gray-500">Name</div>
                {{ purpose.displayName }}
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Description</div>
                <span v-if="purpose.description">{{
                    purpose.description
                }}</span>
                <span v-else class="text-gray-500"
                    >No description available</span
                >
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Created by</div>
                <div>
                    {{ purpose.createdBy }}
                </div>
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Created at</div>
                <a-tooltip
                    class="cursor-default"
                    :title="timeStamp(purpose.createdAt, true)"
                    placement="left"
                    >{{ timeStamp(purpose.createdAt) }}</a-tooltip
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, h } from 'vue'
    import { enablePurpose } from '../composables/useEditPurpose'
    import Avatar from '~/components/common/avatar/index.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { formatDateTime } from '~/utils/date'
    import { useTimeAgo } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    export default defineComponent({
        components: { Avatar, PopOverUser },
        name: 'PurposeSummary',
        props: {
            purpose: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        emits: ['setActiveTab'],
        setup(props) {
            const { purpose } = toRefs(props)
            const enableDisableLoading = ref(false)
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }
            const enableDisablePurpose = async (val) => {
                const messageKey = Date.now()
                enableDisableLoading.value = true
                message.loading({
                    content: `${val ? 'Enabling' : 'Disabling'} purpose ${
                        purpose.value.displayName
                    }`,
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await enablePurpose(purpose.value.id, val)
                    message.success({
                        content: `${val ? 'Enabled' : 'Disabled'} purpose ${
                            purpose.value.displayName
                        }`,
                        duration: 1.5,
                        key: messageKey,
                    })
                    enableDisableLoading.value = false
                } catch (e) {
                    message.error({
                        content: `Failed to ${
                            val ? 'enable' : 'disable'
                        } purpose ${purpose.value.displayName}`,
                        duration: 1.5,
                        key,
                    })
                    enableDisableLoading.value = false
                }
            }

            const handleEnableDisablePurpose = (val) => {
                if (val) enableDisablePurpose(val)
                else
                    Modal.confirm({
                        title: 'Disable purpose',
                        class: 'disable-purpose-modal',
                        content: () => {
                            return h('div', [
                                'Are you sure you want to disable purpose',
                                h('span', [' ']),
                                h(
                                    'span',
                                    {
                                        class: ['font-bold'],
                                    },
                                    [`${purpose.value.displayName}`]
                                ),
                                h('span', '?'),
                            ])
                        },
                        okType: 'danger',
                        autoFocusButton: null,
                        okButtonProps: {
                            type: 'primary',
                        },
                        okText: 'Disable',
                        cancelText: 'Cancel',
                        async onOk() {
                            enableDisablePurpose(val)
                        },
                    })
            }
            return {
                imageUrl,
                timeStamp,
                handleEnableDisablePurpose,
                enableDisableLoading,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .btn-checked {
        background: #00a680;
    }
    .info-widget {
        width: calc(25% - 0.4rem);
    }
</style>
