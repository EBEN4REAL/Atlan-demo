<template>
    <div v-if="persona" class="flex flex-col px-5 pb-2 bg-white">
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
        <div class="flex px-3 mb-0 bg-white gap-x-2">
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
                        v-if="persona.description"
                        tabindex="-1"
                        :title="persona.description"
                        placement="right"
                    >
                        <span
                            ><AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                        ></span>
                    </a-tooltip>
                </div>
                <div v-if="persona.updatedBy" class="flex text-gray-500">
                    last updated by {{ persona.updatedBy }},
                    <a-tooltip
                        class="ml-1"
                        :title="timeStamp(persona.updatedAt, true)"
                        placement="right"
                        >{{ timeStamp(persona.updatedAt) }}</a-tooltip
                    >
                </div>
            </div>
            <a-button-group>
                <!-- Edit -->
                <a-popover
                    v-model:visible="visibleEnable"
                    :align="{ offset: [persona.enabled ? 22 : 15, -10] }"
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
                            purpose
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
                <a-tooltip v-auth="map.UPDATE_PURPOSE" placement="bottom">
                    <template #title>
                        <span>Edit Purpose</span>
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
                <a-tooltip v-auth="map.DELETE_PURPOSE" placement="bottom">
                    <template #title>
                        <span>Delete Purpose</span>
                    </template>
                    <AtlanButton
                        class="flex items-center justify-center h-8 px-5 border rounded rounded-l-none cursor-pointer customShadow text-error"
                        color="secondary"
                        @click="deletePurpose"
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

    import { IPurpose } from '~/types/accessPolicies/purposes'
    import {
        isEditing,
        savePersona,
        discardPersona,
        selectedPersonaDirty,
        deletePersonaById,
    } from './composables/useEditPurpose'
    import Dropdown from '@/UI/dropdown.vue'
    import {
        handleUpdateList,
        selectedPurposeId,
    } from './composables/usePurposeList'
    import { formatDateTime } from '~/utils/date'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import map from '~/constant/accessControl/map'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'PurposeHeader',
        components: { Dropdown, CreationModal, AtlanButton },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
            openEditModal: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            const { openEditModal } = useVModels(props, emit)
            const visibleEnable = ref(false)
            const deletePurpose = () => {
                Modal.confirm({
                    title: `Delete purpose`,
                    class: 'delete-purpose-modal',
                    content: () =>
                        h('div', [
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
                                content: 'Purpose deleted',
                                duration: 1.5,
                                key: msgId,
                            })
                            useAddEvent('governance', 'purpose', 'deleted', {
                                title,
                            })
                            selectedPurposeId.value = ''
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
                    const body = {
                        ...JSON.parse(JSON.stringify(persona.value)),
                        displayName: selectedPersonaDirty.value?.displayName,
                        description: selectedPersonaDirty.value?.description,
                    }
                    // const purposeRaw = JSON.parse(JSON.stringify(body))
                    await savePersona(body)

                    message.success({
                        content: `${persona.value?.displayName} purpose updated`,
                        duration: 1.5,
                        key: messageKey,
                    })

                    isEditing.value = false
                    handleUpdateList(body)
                    openEditModal.value = false
                } catch (error) {
                    message.error({
                        content: 'Failed to update purpose',
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
                handleCancel,
                map,
                deletePurpose,
                visibleEnable,
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
