<template>
    <div class="p-3 bg-white rounded">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
                <div class="px-2 py-1 rounded bg-primary-light text-primary">
                    <AtlanIcon icon="Overview"></AtlanIcon>
                </div>
                <div class="ml-2 font-bold">Summary</div>
            </div>
            <div>
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
        <div class="flex mb-5">
            <div class="mr-3 info-widget">
                <div class="mb-1 text-gray-500">Created By</div>
                <div>
                    <PopOverUser
                        :item="purpose.createdBy"
                        class="flex items-center"
                    >
                        <Avatar
                            :image-url="imageUrl(purpose.createdBy)"
                            :allow-upload="false"
                            :avatar-name="purpose.createdBy"
                            :avatar-size="16"
                            :avatar-shape="'circle'"
                            class="mr-1"
                        />
                        <div>{{ purpose.createdBy }}</div>
                    </PopOverUser>
                </div>
            </div>
            <div class="mr-3 info-widget">
                <div class="mb-1 text-gray-500">Created</div>
                <a-tooltip
                    class="cursor-default"
                    :title="timeStamp(purpose.createdAt, true)"
                    placement="bottom"
                    >{{ timeStamp(purpose.createdAt) }}</a-tooltip
                >
            </div>
            <div class="mr-3 info-widget" data-test-id="tab-policies">
                <div class="mb-1 text-gray-500">Policies</div>
                <div
                    v-if="
                        purpose.dataPolicies?.length === 0 &&
                        purpose.metadataPolicies?.length === 0
                    "
                    class="cursor-pointer text-primary"
                    @click="$emit('setActiveTab', 'policies')"
                >
                    <AtlanIcon icon="Add" class="mb-0.5 mr-1"></AtlanIcon>
                    Add policies
                </div>
                <div
                    v-else
                    class="cursor-pointer text-primary"
                    @click="$emit('setActiveTab', 'policies')"
                >
                    <div>
                        {{ purpose.metadataPolicies?.length ?? 0 }}
                        Metadata, {{ purpose.dataPolicies?.length ?? 0 }} Data
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <div class="mb-1 text-gray-500">Description</div>
            <div>
                <div data-test-id="header-description">
                    {{ purpose.description || '-' }}
                </div>
            </div>
        </div>
        <slot name="classifications"></slot>
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
<style lang="less">
    .disable-purpose-modal {
        .ant-modal-confirm-body-wrapper {
            @apply p-5;
        }
    }
</style>
<style lang="less" scoped>
    .btn-checked {
        background: #00a680;
    }
    .info-widget {
        width: calc(25% - 0.4rem);
    }
</style>
