<template>
    <div v-if="persona" class="flex flex-col px-5">
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
        <div class="flex mb-0 bg-white pt-7 gap-x-2">
            <div style="width: 90%">
                <div class="mb-0 text-xl text-gray-700 truncate">
                    <span class="truncate" data-test-id="header-name">
                        {{ persona.displayName }}</span
                    >
                </div>
                <div class="flex mb-0 text-sm text-gray-500">
                    <span class="truncate" data-test-id="header-description">
                        {{ persona.description }}</span
                    >
                </div>
                <div class="flex" v-if="persona.updatedBy">
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
import { IPersona } from '~/types/accessPolicies/personas'
import {
    isEditing,
    savePersona,
    discardPersona,
    selectedPersonaDirty,
    deletePersonaById,
} from './composables/useEditPersona'

import Dropdown from '@/UI/dropdown.vue'
import { reFetchList } from './composables/usePersonaList'
import { formatDateTime } from '~/utils/date'
import { useTimeAgo } from '@vueuse/core'

export default defineComponent({
    name: 'PersonaHeader',
    components: { Dropdown, CreationModal },
    props: {
        persona: {
            type: Object as PropType<IPersona>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const { persona } = toRefs(props)
        const deletePersona = () => {
            Modal.confirm({
                title: `Delete persona`,
                class: 'delete-persona-modal',
                content: () => {
                    return h('div', [
                        'Are you sure you want to delete persona',
                        h('span', [' ']),
                        h(
                            'span',
                            {
                                class: ['font-bold'],
                            },
                            [`${persona.value.displayName}`]
                        ),
                        h('span','?')
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
                            content: 'Persona deleted',
                            duration: 1.5,
                            key: msgId,
                        })
                    } catch (error) {
                        message.error({
                            content: 'Failed to delete persona',
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
                handleClick: deletePersona,
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
<style lang="less">
.delete-persona-modal {
    .ant-modal-confirm-body-wrapper {
        @apply p-5;
    }
}
</style>
<style lang="less" scoped>
.clean-input {
    @apply block bg-transparent border-0 shadow-none outline-none;

    &:focus {
        @apply outline-none;
    }
}
</style>
