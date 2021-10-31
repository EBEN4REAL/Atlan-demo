<template>
    <CreationModal
        v-model:visible="modalVisible"
        title="New Persona"
        @cancel="() => (modalVisible = false)"
        @ok="handleCreation"
    >
        <div class="flex flex-col items-stretch pb-4 gap-y-1">
            <input
                ref="titleBar"
                v-model="title"
                placeholder="Untitled persona"
                type="text"
                class="text-lg font-bold text-gray-700 clean-input"
                @keyup.esc="$event?.target?.blur()"
            />

            <textarea
                v-model="description"
                class="text-sm text-gray-500 clean-input"
                maxlength="140"
                rows="2"
                placeholder="Add description..."
                @keyup.esc="$event?.target?.blur()"
            />
        </div>
    </CreationModal>
</template>

<script lang="ts">
    import { message } from 'ant-design-vue'
    import { computed, defineComponent, Ref, ref, toRefs } from 'vue'
    import { whenever } from '@vueuse/core'
    import CreationModal from '@/admin/common/addModal.vue'
    import { Persona } from '~/services/service/persona'
    import {
        reFetchList,
        selectedPersonaId,
    } from './composables/usePersonaList'
    import { IPersona } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'AddPersona',
        components: {
            CreationModal,
        },
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const titleBar: Ref<null | HTMLInputElement> = ref(null)
            const title = ref('')
            const description = ref('')

            const { visible } = toRefs(props)
            const modalVisible = computed({
                get: () => visible.value,
                set: (val) => emit('update:visible', val),
            })

            function toggleModal() {
                modalVisible.value = !modalVisible.value
            }

            async function handleCreation() {
                try {
                    const newPersona: IPersona = await Persona.Create({
                        description: description.value,
                        name: title.value,
                        displayName: title.value,
                        metadataPolicies: [],
                        users: [],
                        groups: [],
                        personaType: 'persona',
                        datapolicies: [],
                    })
                    message.success(`${title.value} persona Created`)
                    reFetchList()
                    selectedPersonaId.value = newPersona.id!
                    modalVisible.value = false
                } catch (error) {
                    message.error('Failed to create persona')
                }
            }

            whenever(titleBar, () => {
                titleBar.value?.focus()
            })

            return {
                toggleModal,
                modalVisible,
                handleCreation,
                title,
                description,
                titleBar,
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
