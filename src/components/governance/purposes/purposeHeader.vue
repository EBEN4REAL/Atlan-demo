<template>
    <div v-if="persona" class="flex flex-col px-5 bg-white">
        <CreationModal
            v-model:visible="isEditing"
            ok-text="Save"
            title="Edit Persona"
            @cancel="discardPersona"
            @ok="saveEditedPersona"
        >
            <div class="flex flex-col items-stretch pb-4 gap-y-1">
                <input
                    v-model="selectedPersonaDirty!.displayName"
                    placeholder="Untitled persona"
                    type="text"
                    data-test-id="modal-input"
                    class="text-lg font-bold text-gray-700 clean-input"
                    @keyup.esc="$event?.target?.blur()"
                />

                <textarea
                    v-model="selectedPersonaDirty!.description"
                    class="text-sm text-gray-500 clean-input"
                    maxlength="140"
                    rows="2"
                    data-test-id="modal-description"
                    placeholder="Add description..."
                    @keyup.esc="$event?.target?.blur()"
                />
            </div>
        </CreationModal>
        <div class="flex px-3 pt-6 mb-0 bg-white gap-x-2">
            <div style="width: 90%">
                <div class="flex items-center mb-0 text-sm text-gray-500">
                    <div class="mb-0 text-xl text-gray-700 truncate">
                        <span
                            class="flex-shrink mb-0 overflow-hidden text-base font-bold text-gray-700 capitalize truncate"
                            data-test-id="header-name"
                        >
                            {{ persona.displayName }}</span
                        >
                    </div>
                    <a-tooltip
                        tabindex="-1"
                        :title="persona.description"
                        v-if="persona.description"
                        placement="right"
                    >
                        <span
                            ><AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                        ></span>
                    </a-tooltip>
                </div>
                <div class="flex text-gray-500" v-if="persona.updatedBy">
                    last updated by {{ persona.updatedBy }},
                    <a-tooltip
                        class="ml-1"
                        :title="timeStamp(persona.updatedAt, true)"
                        placement="right"
                        >{{ timeStamp(persona.updatedAt) }}</a-tooltip
                    >
                </div>
            </div>

            <Dropdown class="ml-auto" :options="personaActions"></Dropdown>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs, h } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import CreationModal from '@/admin/common/addModal.vue'

    import { IPurpose } from '~/types/accessPolicies/purposes'
    import {
        isEditing,
        savePersona,
        discardPersona,
        selectedPersonaDirty,
        deletePersonaById,
    } from './composables/useEditPurpose'

    import Dropdown from '@/UI/dropdown.vue'
    import { reFetchList } from './composables/usePurposeList'
    import { formatDateTime } from '~/utils/date'
    import { useTimeAgo } from '@vueuse/core'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'Purpose Header',
        components: { Dropdown, CreationModal },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            const deletePurpose = () => {
                Modal.confirm({
                    title: `Delete purpose`,
                    class: 'delete-purpose-modal',
                    content: () => {
                        return h('div', [
                            'Are you sure you want to delete purpose',
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
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const msgId = Date.now()
                        try {
                            await deletePersonaById(persona.value.id!)
                            message.success({
                                content: 'Purpose deleted',
                                duration: 1.5,
                                key: msgId,
                            })
                            useAddEvent('governance', 'purpose', 'deleted')
                        } catch (error) {
                            message.error({
                                content: 'Failed to delete purpose',
                                duration: 1.5,
                                key: msgId,
                            })
                        }
                    },
                })
            }
            const personaActions = computed(() => [
                {
                    title: 'Edit',
                    icon: 'Edit',
                    handleClick: () => {
                        isEditing.value = true
                    },
                },
                {
                    title: 'Delete',
                    icon: 'Trash',
                    class: 'text-red-700',
                    handleClick: deletePurpose,
                },
            ])

            async function saveEditedPersona() {
                const messageKey = Date.now()
                message.loading({
                    content: 'Working on it...',
                    duration: 0,
                    key: messageKey,
                })

                try {
                    await savePersona({
                        ...persona.value,
                        displayName: selectedPersonaDirty.value?.displayName,
                        description: selectedPersonaDirty.value?.description,
                    })

                    message.success({
                        content: `${persona.value?.displayName} persona updated`,
                        duration: 1.5,
                        key: messageKey,
                    })

                    isEditing.value = false
                    reFetchList()
                } catch (error) {
                    message.error({
                        content: 'Failed to update persona',
                        duration: 1.5,
                        key: messageKey,
                    })
                }
            }

            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }
            return {
                personaActions,
                isEditing,
                saveEditedPersona,
                discardPersona,
                selectedPersonaDirty,
                timeStamp,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .clean-input {
        @apply block bg-transparent border-0 shadow-none outline-none;

        &:focus {
            @apply outline-none;
        }
    }
</style>
