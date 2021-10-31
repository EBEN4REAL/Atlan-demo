<template>
    <div v-if="persona" class="flex flex-col px-5">
        <CreationModal
            v-model:visible="isEditing"
            ok-text="Save"
            title="Edit Persona"
            @cancel="() => (isEditing = false)"
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
        <div class="flex items-center mb-2 gap-x-2">
            <AtlanIcon icon="User" class="text-primary" />
            <span class="text-sm tracking-wide text-gray-500 uppercase"
                >Persona</span
            >
            <div class="flex-1" />
            <template v-if="isEditing">
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click="discardPersona"
                    >Discard</AtlanBtn
                >
                <AtlanBtn
                    size="sm"
                    color="primary"
                    padding="compact"
                    @click="saveEditedPersona"
                    >Save</AtlanBtn
                >
            </template>
            <Dropdown :options="personaActions"></Dropdown>
        </div>
        <span class="mb-1 text-xl truncate text-gray">{{
            persona.displayName
        }}</span>

        <div class="flex mb-0 text-sm text-gray-500">
            <span class="truncate">{{ persona.description }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs, ref } from 'vue'
    import { message } from 'ant-design-vue'

    import AtlanBtn from '@/UI/button.vue'
    import CreationModal from '@/admin/common/addModal.vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        savePersona,
        discardPersona,
        selectedPersonaDirty,
    } from './composables/useEditPersona'

    import Dropdown from '@/UI/dropdown.vue'
    import { reFetchList } from './composables/usePersonaList'

    export default defineComponent({
        name: 'PersonaHeader',
        components: { Dropdown, AtlanBtn, CreationModal },
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
                    handleClick: () => {},
                },
            ])

            async function saveEditedPersona() {
                try {
                    await savePersona({
                        ...persona.value,
                        displayName: selectedPersonaDirty.value?.displayName,
                        description: selectedPersonaDirty.value?.description,
                    })
                    message.success(
                        `${persona.value?.displayName} persona updated`
                    )
                    isEditing.value = false
                    reFetchList()
                } catch (error) {
                    message.error('Failed to update persona')
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
