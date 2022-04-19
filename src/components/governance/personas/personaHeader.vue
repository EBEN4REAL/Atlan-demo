<template>
    <div v-if="persona" class="flex flex-col px-5 pb-2">
        <CreationModal
            v-model:visible="isEditing"
            ok-text="Save"
            title="Edit Persona"
            @cancel="handleCancel"
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

        <div class="flex mb-0 bg-white gap-x-2">
            <div style="width: 90%">
                <div class="flex items-center mb-0 text-sm text-gray-500">
                    <div class="mb-0 text-xl text-gray-700 truncate">
                        <span
                            :data-name="persona.displayName"
                            id="personaDisplayName"
                            class="flex-shrink mb-0 overflow-hidden text-base font-bold text-gray-700 capitalize truncate"
                            data-test-id="header-name"
                        >
                            {{ persona.displayName }}</span
                        >
                    </div>
                    <a-tooltip
                        v-if="persona.description"
                        tabindex="-1"
                        :title="persona.description"
                        placement="right"
                    >
                        <span
                            ><AtlanIcon
                                icon="Info"
                                class="ml-1 mb-0.5"
                            ></AtlanIcon
                        ></span>
                    </a-tooltip>
                </div>
                <div class="flex text-gray-500">
                    last updated by
                    {{ persona.updatedBy || persona.createdBy }},
                    <a-tooltip
                        class="ml-1"
                        :title="
                            timeStamp(
                                persona.updatedAt || persona.createdAt,
                                true
                            )
                        "
                        placement="right"
                        >{{
                            timeStamp(persona.updatedAt || persona.createdAt)
                        }}</a-tooltip
                    >
                </div>
            </div>
            <a-button-group class="flex items-center">
                <!-- Edit -->
                <a-popover
                    v-model:visible="visibleEnable"
                    :align="{ offset: [21, -10] }"
                    trigger="click"
                    placement="bottomRight"
                >
                    <template #content>
                        <div
                            @click="
                                () => {
                                    visibleEnable = false
                                    $emit('updateStatus', !persona.enabled)
                                }
                            "
                            :class="`flex p-2 py-2.5 text-sm font-bold ${
                                !persona.enabled
                                    ? 'text-success'
                                    : 'text-gray-700'
                            } cursor-pointer btn-status shadow-box  hover:bg-gray-100`"
                        >
                            <AtlanIcon
                                :icon="!persona.enabled ? 'Check' : 'NoAllow'"
                                class="mr-1"
                            />{{ !persona.enabled ? 'Enable' : 'Disable' }}
                            persona
                        </div>
                    </template>

                    <div
                        class="flex text-sm font-bold cursor-pointer btn-status hover:bg-gray-100 py-1.5 px-2.5 border-gray-300 border mr-3 rounded items-center"
                        :class="`${
                            persona.enabled ? 'text-success' : 'text-gray-700'
                        } `"
                    >
                        <AtlanIcon
                            :icon="persona.enabled ? 'Check' : 'NoAllow'"
                            class="mr-1.5"
                        />{{ persona.enabled ? 'Enabled' : 'Disabled' }}
                        <AtlanIcon
                            icon="ChevronDown"
                            class="ml-2 text-gray-500"
                        />
                    </div>
                </a-popover>
                <a-tooltip v-auth="map.UPDATE_PERSONA" placement="bottom">
                    <template #title>
                        <span>Edit Persona</span>
                    </template>
                    <AtlanButton
                        class="flex items-center justify-center h-8 px-5 border border-r-0 rounded rounded-r-none cursor-pointer customShadow"
                        color="secondary"
                        @click="isEditing = true"
                    >
                        <AtlanIcon icon="Edit"></AtlanIcon>
                    </AtlanButton>
                </a-tooltip>
                <!-- Delete  -->
                <a-tooltip v-auth="map.DELETE_PERSONA" placement="bottom">
                    <template #title>
                        <span>Delete Persona</span>
                    </template>
                    <AtlanButton
                        class="flex items-center justify-center h-8 px-5 border rounded rounded-l-none cursor-pointer customShadow text-error"
                        color="secondary"
                        @click="deletePersona"
                    >
                        <AtlanIcon icon="Delete"></AtlanIcon>
                    </AtlanButton>
                </a-tooltip>
            </a-button-group>
            <!-- <Dropdown class="ml-auto" :options="personaActions"></Dropdown> -->
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        h,
        watch,
        ref,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import { useTimeAgo, useVModels } from '@vueuse/core'
    import CreationModal from '@/admin/common/addModal.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        savePersona,
        discardPersona,
        selectedPersonaDirty,
        deletePersonaById,
    } from './composables/useEditPersona'
    import {
        selectedPersonaId,
        handleUpdateList,
    } from './composables/usePersonaList'
    import Dropdown from '@/UI/dropdown.vue'
    import { formatDateTime } from '~/utils/date'
    import map from '~/constant/accessControl/map'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'PersonaHeader',
        components: { Dropdown, CreationModal },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
            openEditModal: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['updateStatus'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            const visibleEnable = ref(false)
            // const { openEditModal } = toRefs(props)
            const { openEditModal } = useVModels(props, emit)
            const deletePersona = () => {
                Modal.confirm({
                    title: `Delete persona`,
                    class: 'delete-persona-modal',
                    content: () =>
                        h('div', [
                            'Are you sure you want to delete persona',
                            h('span', [' ']),
                            h(
                                'span',
                                {
                                    class: ['font-bold', 'persona-name'],
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
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const msgId = Date.now()
                        try {
                            const title = persona.value.name
                            await deletePersonaById(persona.value.id)
                            message.success({
                                content: 'Persona deleted',
                                duration: 1.5,
                                key: msgId,
                            })
                            selectedPersonaId.value = ''
                            useAddEvent('governance', 'persona', 'deleted', {
                                title,
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
                    duration: 1.5,
                    key: messageKey,
                })

                try {
                    const body = {
                        ...JSON.parse(JSON.stringify(persona.value)),
                        displayName: selectedPersonaDirty.value?.displayName,
                        description: selectedPersonaDirty.value?.description,
                    }
                    const personaRaw = JSON.parse(JSON.stringify(body))
                    delete body.metadataPolicies
                    delete body.dataPolicies
                    delete body.glossaryPolicies
                    await savePersona(body)
                    handleUpdateList(personaRaw)

                    message.success({
                        content: `${persona.value?.displayName} persona updated`,
                        duration: 1.5,
                        key: messageKey,
                    })

                    isEditing.value = false

                    openEditModal.value = false
                } catch (error) {
                    message.error({
                        content: 'Failed to update persona',
                        duration: 1.5,
                        key: messageKey,
                    })
                    isEditing.value = false
                    openEditModal.value = false
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
            const handleCancel = () => {
                discardPersona()
                openEditModal.value = false
            }

            watch(openEditModal, () => {
                if (openEditModal.value) isEditing.value = true
            })

            return {
                personaActions,
                isEditing,
                saveEditedPersona,
                discardPersona,
                selectedPersonaDirty,
                timeStamp,
                map,
                deletePersona,
                handleCancel,
                visibleEnable,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .shadow-box {
        min-width: 145px;
        box-shadow: 0px 9px 32px 0px #0000001f;
    }
    .btn-status {
        height: fit-content !important;
    }
    .clean-input {
        @apply block bg-transparent border-0 shadow-none outline-none;

        &:focus {
            @apply outline-none;
        }
    }
</style>
