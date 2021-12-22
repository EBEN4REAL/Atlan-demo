<template>
    <div class="p-6 bg-white rounded">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <div class="font-semibold">Details</div>
            </div>
            <div class="hidden">
                <a-switch
                    v-model:checked="persona.enabled"
                    class="ml-auto"
                    data-test-id="toggle-switch"
                    style="width: 40px !important"
                    :class="persona.enabled ? 'btn-checked' : 'btn-unchecked'"
                    :loading="enableDisableLoading"
                    @change="handleEnableDisablePersona"
                />
                <span class="ml-2 text-sm text-gray">Enable Persona</span>
            </div>
        </div>
        <div class="flex flex-col gap-y-2">
            <div class="">
                <div class="mb-0 text-gray-500">Name</div>
                {{ persona.displayName }}
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Description</div>
                <span v-if="persona.description">{{
                    persona.description
                }}</span>
                <span v-else class="text-gray-500"
                    >No description available</span
                >
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Created by</div>
                <div>
                    {{ persona.createdBy }}
                </div>
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Created at</div>
                <a-tooltip
                    class="cursor-default"
                    :title="timeStamp(persona.createdAt, true)"
                    placement="left"
                    >{{ timeStamp(persona.createdAt) }}</a-tooltip
                >
            </div>
        </div>
        <!-- <div>
            <div class="mb-1 text-gray-500">Description</div>
            <div>
                <div data-test-id="header-description">
                    {{ persona.description || '-' }}
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, h } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    import { enablePersona } from '../composables/useEditPersona'
    import Avatar from '~/components/common/avatar/index.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { formatDateTime } from '~/utils/date'

    export default defineComponent({
        name: 'PersonaSummary',
        components: { Avatar, PopOverUser },
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
                    persona.value.enabled = val
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
                persona.value.enabled = !val
                if (!persona.value.enabled) enableDisablePersona(val)
                else
                    Modal.confirm({
                        title: 'Disable persona',
                        class: 'disable-persona-modal',
                        content: () =>
                            h('div', [
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
                            ]),
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
<style lang="less"></style>
<style lang="less" scoped>
    .btn-checked {
        background: #00a680;
    }
    .info-widget {
        width: calc(25% - 0.4rem);
    }
</style>
