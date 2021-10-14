<template>
    <div class="flex flex-col px-5" v-if="persona">
        <div class="flex items-center mb-2 gap-x-2">
            <AtlanIcon icon="User" class="text-primary" />
            <span class="text-sm tracking-wide text-gray-500 uppercase"
                >Persona</span
            >
            <Dropdown class="ml-auto" :options="personaActions"></Dropdown>
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
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import Dropdown from '@/UI/dropdown.vue'

    export default defineComponent({
        name: 'PersonaHeader',
        components: { Dropdown },
        emits: ['update:isEditMode'],
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: false,
            },
            isEditMode: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        setup(props, { emit }) {
            const personaActions = computed(() => [
                {
                    title: 'Edit',
                    icon: 'Edit',
                    handleClick: () => {
                        emit('update:isEditMode', true)
                    },
                },
                {
                    title: 'Delete',
                    icon: 'Trash',
                    class: 'text-red-700',
                    handleClick: () => {},
                },
            ])
            return {
                personaActions,
            }
        },
    })
</script>
