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
                    class="text-lg font-bold text-gray-700 clean-input"
                    @keyup.esc="$event?.target?.blur()"
                />

                <textarea
                    v-model="selectedPersonaDirty!.description"
                    class="text-sm text-gray-500 clean-input"
                    maxlength="140"
                    rows="2"
                    placeholder="Add description..."
                    @keyup.esc="$event?.target?.blur()"
                />
            </div>
        </CreationModal>
        <div class="flex mb-2 gap-x-2">
            <div style="width: 90%">
                <div class="mb-1 text-xl font-bold truncate text-gray">
                    {{ persona.displayName }}
                </div>
                <div class="flex mb-0 text-sm text-gray-500">
                    <span class="truncate">{{ persona.description }}</span>
                </div>
            </div>
            <Dropdown class="ml-auto" :options="personaActions"></Dropdown>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs, ref } from 'vue'
    import { message } from 'ant-design-vue'

    import CreationModal from '@/admin/common/addModal.vue'

    import { IPersona } from '~/types/accessPolicies/purposes'
    import {
        isEditing,
        savePersona,
        discardPersona,
        selectedPersonaDirty,
        deletePersonaById,
    } from './composables/useEditPurpose'

    import Dropdown from '@/UI/dropdown.vue'
    import { reFetchList } from './composables/usePurposeList'

    export default defineComponent({
        name: 'PurposeHeader',
        components: { Dropdown, CreationModal },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { persona } = toRefs(props)
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
                    handleClick: async () => {
                        const msgId = Date.now()
                        message.loading({
                            content: `Deleting ${persona.value.displayName}`,
                            duration: 0,
                            key: msgId,
                        })
                        try {
                            await deletePersonaById(persona.value.id!)
                            message.success({
                                content: 'Purpose deleted',
                                duration: 1.5,
                                key: msgId,
                            })
                        } catch (error) {
                            message.error({
                                content: 'Failed to delete purpose',
                                duration: 1.5,
                                key: msgId,
                            })
                        }
                    },
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

            return {
                personaActions,
                isEditing,
                saveEditedPersona,
                discardPersona,
                selectedPersonaDirty,
            }
        },
    })
</script>

<style lang="less" scoped>
    .clean-input {
        @apply block bg-transparent border-0 shadow-none outline-none;

        &:focus {
            @apply outline-none;
        }
    }
</style>