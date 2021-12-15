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
                    :class="persona.enabled ? 'btn-checked' : 'btn-unchecked'"
                    v-model:checked="persona.enabled"
                    :loading="enableDisableLoading"
                    @change="handleEnableDisablePersona"
                />
                <span class="ml-2 text-sm text-gray">Enable Persona</span>
            </div>
        </div>
        <div class="flex mb-5">
            <div class="mr-3 info-widget">
                <div class="mb-1 text-gray-500">Created By</div>
                <div>
                    <PopOverUser
                        :item="persona.createdBy"
                        class="flex items-center"
                    >
                        <Avatar
                            :image-url="imageUrl(persona.createdBy)"
                            :allow-upload="false"
                            :avatar-name="persona.createdBy"
                            :avatar-size="16"
                            :avatar-shape="'circle'"
                            class="mr-1"
                        />
                        <div>{{ persona.createdBy }}</div>
                    </PopOverUser>
                </div>
            </div>
            <div class="mr-3 info-widget">
                <div class="mb-1 text-gray-500">Created</div>
                <a-tooltip
                    :title="timeStamp(persona.createdAt, true)"
                    placement="bottom"
                    >{{ timeStamp(persona.createdAt) }}</a-tooltip
                >
            </div>
            <div class="mr-3 info-widget" data-test-id="tab-policies">
                <div class="mb-1 text-gray-500">Policies</div>
                <div
                    v-if="
                        persona.dataPolicies?.length === 0 &&
                        persona.metadataPolicies?.length === 0
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
                        {{ persona.metadataPolicies?.length ?? 0 }}
                        Metadata, {{ persona.dataPolicies?.length ?? 0 }} Data
                    </div>
                </div>
            </div>
            <div class="mr-3 info-widget" data-test-id="tab-users">
                <div class="mb-1 text-gray-500">Users and Groups</div>
                <div
                    class="cursor-pointer text-primary"
                    @click="$emit('setActiveTab', 'users')"
                    v-if="
                        persona.users?.length === 0 &&
                        persona.groups?.length === 0
                    "
                >
                    <AtlanIcon icon="Add" class="mb-0.5 mr-1"></AtlanIcon>
                    Add users and groups
                </div>
                <div
                    v-else
                    class="cursor-pointer text-primary"
                    @click="$emit('setActiveTab', 'users')"
                >
                    <div>
                        {{ persona.users?.length ?? 0 }}
                        Users, {{ persona.groups?.length ?? 0 }} Groups
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="mb-1 text-gray-500">Description</div>
            <div>
                <div data-test-id="header-description">
                    {{ persona.description || '-' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, h } from 'vue'
    import { enablePersona } from '../composables/useEditPersona'
    import Avatar from '~/components/common/avatar/index.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { formatDateTime } from '~/utils/date'
    import { useTimeAgo } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    export default defineComponent({
        components: { Avatar, PopOverUser },
        name: 'PersonaSummary',
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['setActiveTab'],
        setup(props) {
            const { persona } = toRefs(props)
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
            const enableDisablePersona = async (val) => {
                const messageKey = Date.now()
                enableDisableLoading.value = true
                message.loading({
                    content: `${val ? 'Enabling' : 'Disabling'} persona ${
                        persona.value.displayName
                    }`,
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await enablePersona(persona.value.id, val)
                    message.success({
                        content: `${val ? 'Enabled' : 'Disabled'} persona ${
                            persona.value.displayName
                        }`,
                        duration: 1.5,
                        key: messageKey,
                    })
                    enableDisableLoading.value = false
                } catch (e) {
                    message.error({
                        content: `Failed to ${
                            val ? 'enable' : 'disable'
                        } persona ${persona.value.displayName}`,
                        duration: 1.5,
                        key,
                    })
                    enableDisableLoading.value = false
                }
            }

            const handleEnableDisablePersona = (val) => {
                if (val) enableDisablePersona(val)
                else
                    Modal.confirm({
                        title: 'Disable persona',
                        class: 'disable-persona-modal',
                        content: () => {
                            return h('div', [
                                'Are you sure you want to disable persona',
                                h('span', [' ']),
                                h(
                                    'span',
                                    {
                                        class: ['font-bold'],
                                    },
                                    [`${persona.value.displayName}`]
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
                            enableDisablePersona(val)
                        },
                    })
            }
            return {
                imageUrl,
                timeStamp,
                handleEnableDisablePersona,
                enableDisableLoading,
            }
        },
    })
</script>
<style lang="less">
    .disable-persona-modal {
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
