<template>
    <div class="grid grid-cols-3 gap-3">
        <PersonaUsersGroups
            :key="persona.id"
            v-model:persona="persona"
            class="col-span-2 border border-gray-200"
            :cancel-token-for-groups="cancelTokenForGroups"
            :cancel-token-for-users="cancelTokenForUsers"
        />
        <DetailsWidget
            :item="persona"
            class="border border-gray-200"
            @editDetails="$emit('editDetails')"
        >
        </DetailsWidget>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, h, watch } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    import axios from 'axios'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { setActiveTab } from '../composables/usePersonaTabs'
    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'
    import { formatDateTime } from '~/utils/date'
    import DetailsWidget from '@/common/widgets/detailsWidget.vue'
    import PersonaUsersGroups from '@/governance/personas/users/personaUsersGroups.vue'
    import {
        enablePersona,
        isEditing,
        savePersona,
        discardPersona,
        selectedPersonaDirty,
        deletePersonaById,
    } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaMeta',
        components: {
            PopOverUser,
            UserPill,
            DetailsWidget,
            PersonaUsersGroups,
        },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup(props) {
            const { persona } = toRefs(props)
            const cancelTokenForUsers = ref()
            const cancelTokenForGroups = ref()
            const enableDisableLoading = ref(false)
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

            // cancel request to fetch users and groups if persona changes too fast
            watch(
                () => persona.value.id,
                () => {
                    if (cancelTokenForUsers.value)
                        cancelTokenForUsers.value.cancel('cancelled')
                    if (cancelTokenForGroups.value)
                        cancelTokenForGroups.value.cancel('cancelled')
                    cancelTokenForUsers.value = axios.CancelToken.source()
                    cancelTokenForGroups.value = axios.CancelToken.source()
                },
                {
                    immediate: true,
                }
            )
            return {
                addStatus,
                updateStatus,
                removeStatus,
                handleAddResource,
                handleUpdateResource,
                handleRemoveResource,
                setActiveTab,
                timeStamp,
                handleEnableDisablePersona,
                enableDisableLoading,
                cancelTokenForGroups,
                cancelTokenForUsers,
            }
        },
    })
</script>

<style lang="less" scoped>
    .details-section {
        @apply flex items-center gap-x-2 py-4;
        @apply text-gray-500;
        @apply cursor-pointer;
    }
    .user-group-pill {
        @apply rounded-full bg-primary-light text-primary text-sm px-2 py-1;
    }
    .data-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .btn-checked {
        background: #00a680;
    }
    .vertical-center {
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>
