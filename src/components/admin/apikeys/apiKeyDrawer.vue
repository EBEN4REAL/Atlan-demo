<!-- This component works in 3 modes/views: 1/ form to generate a key 2/ form to update/delete a key 3/ info for generated key; generatedAPIKey (3) is the first level of distinction bw these modes/views, if value exists for that we show the third screen; If not we check if the passed in key (props) that we take in this component as apiKeyDirty has an id or not; if it has id, we are in edit mode i.e. 2nd screen (form is prefilled) else new key generation mode (form is empty)-->
<template>
    <div class="flex flex-col justify-between h-full pt-5">
        <div>
            <div
                class="relative flex items-center justify-between px-4 pb-5 border-b "
            >
                <div
                    v-if="!generatedAPIKey.attributes"
                    class="text-lg font-bold"
                >
                    {{
                        apiKeyDirty.id ? apiKeyDirty.displayName : 'Add new key'
                    }}
                </div>
                <div v-else class="text-lg font-bold">
                    {{ generatedAPIKey.attributes.displayName }}
                </div>

                <div class="top-0 p-1 rounded cursor-pointer right-2">
                    <AtlanIcon icon="Cross" class="r" @click="handleClose" />
                </div>
            </div>
            <div v-if="!generatedAPIKey.attributes" class="px-4 py-3">
                <div class="mb-4">
                    <div class="mb-2 mr-2 text-gray-500">
                        Name <sup class="text-error">*</sup>
                    </div>
                    <a-input
                        v-model:value="apiKeyDirty.displayName"
                        :class="
                            nameEmptyOnSubmit && !apiKeyDirty.displayName.length
                                ? 'border border-error'
                                : ''
                        "
                    ></a-input>
                </div>
                <div class="mb-4">
                    <div class="mb-2 mr-2 text-gray-500">Description</div>
                    <a-input v-model:value="apiKeyDirty.description"></a-input>
                </div>
                <div class="mb-4">
                    <div class="mb-2 mr-2 text-gray-500">Personas</div>
                    <a-popover
                        v-model="addPersonaPopoverVisible"
                        :trigger="'click'"
                        placement="bottom"
                        overlay-class-name="persona-popover"
                    >
                        <PillGroup
                            v-model:data="apiKeyDirty.personas"
                            label-key="name"
                            :read-only="true"
                        >
                            <template #suffix>
                                <Pill
                                    class="group"
                                    @click="toggleAddPersonaPopover"
                                >
                                    <template #prefix>
                                        <div
                                            v-if="!apiKeyDirty.personas.length"
                                            class="flex items-center  text-primary group-hover:text-white"
                                        >
                                            <AtlanIcon
                                                icon="Add"
                                                class="h-4 mr-0.5"
                                            />
                                            Add personas
                                        </div>
                                        <div
                                            v-else
                                            class=" text-gray group-hover:text-white"
                                        >
                                            <AtlanIcon
                                                icon="Add"
                                                class="h-4 mr-0.5"
                                            />
                                        </div>
                                    </template>
                                </Pill>
                            </template>
                        </PillGroup>
                        <template #content>
                            <PersonaList
                                class="persona-list"
                                :selected-personas="apiKeyDirty.personas"
                            />
                        </template>
                    </a-popover>
                </div>
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center w-full h-full px-4 "
            >
                <component :is="SuccessIllustration" class="mb-5"></component>
                <div class="mb-5 text-xl font-bold">API key generated</div>
                <div
                    class="w-full h-24 p-4 mb-5 overflow-y-scroll bg-gray-100 border rounded "
                >
                    {{ generatedAPIKey.attributes.accessToken }}
                </div>
                <div class="flex items-center justify-between w-full mb-3">
                    <AtlanBtn
                        class="px-8 bg-transparent border-none text-primary"
                        size="sm"
                        color="secondary"
                        padding="compact"
                        @click="handleDownload"
                    >
                        <AtlanIcon icon="Download" class="ml-2"></AtlanIcon>
                        Download
                    </AtlanBtn>

                    <AtlanBtn
                        class="px-10"
                        size="sm"
                        color="primary"
                        padding="compact"
                        @click="handleCopy"
                    >
                        <div class="flex items-center">
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="mr-2"
                            ></AtlanIcon>
                            <div>Copy</div>
                        </div>
                    </AtlanBtn>
                </div>
            </div>
        </div>
        <div
            v-if="!generatedAPIKey.attributes"
            class="flex justify-between px-4 py-5 border-t"
        >
            <a-popover
                v-if="apiKeyDirty.id"
                trigger="click"
                placement="bottomLeft"
                :visible="isDeletePopoverVisible"
            >
                <AtlanBtn
                    color="secondary"
                    padding="compact"
                    size="sm"
                    class="px-0 bg-transparent border-none text-error"
                    @click="isDeletePopoverVisible = true"
                >
                    <AtlanIcon
                        icon="Delete"
                        class="shadow-none cursor-pointer"
                    />
                    <span>Delete</span>
                </AtlanBtn>
                <template #content>
                    <div class="mb-4 text-base font-bold">Delete API Key</div>
                    <div class="mb-3.5">
                        Are you sure you want to delete
                        <span class="font-bold">
                            {{ apiKeyDirty.displayName }}?</span
                        >
                    </div>
                    <div class="flex justify-end mb-2">
                        <AtlanBtn
                            color="secondary"
                            padding="compact"
                            size="sm"
                            class="mr-3 shadow-sm"
                            @click="isDeletePopoverVisible = false"
                        >
                            <span>Cancel</span></AtlanBtn
                        >
                        <AtlanBtn
                            class="mr-3 text-white bg-transparent border-none  bg-error"
                            size="lg"
                            padding="compact"
                            :is-loading="deleteAPIKeyLoading"
                            :disabled="deleteAPIKeyLoading"
                            @click="$emit('deleteAPIKey', apiKeyDirty.id)"
                        >
                            <AtlanIcon icon="Delete" />
                            <span v-if="deleteAPIKeyLoading">Deleting</span>
                            <span v-else>Delete</span>
                        </AtlanBtn>
                    </div>
                </template>
            </a-popover>

            <div class="flex justify-end w-full">
                <AtlanBtn
                    color="secondary"
                    padding="compact"
                    size="sm"
                    class="px-5 mr-3 border-none"
                    @click="$emit('closeDrawer')"
                >
                    <span>Cancel</span></AtlanBtn
                >
                <AtlanBtn
                    class="px-5"
                    size="sm"
                    color="primary"
                    padding="compact"
                    :is-loading="createUpdateLoading"
                    :disabled="createUpdateLoading"
                    @click="handleSave"
                    ><span v-if="createUpdateLoading">{{
                        apiKeyDirty.id ? 'Updating' : 'Saving'
                    }}</span>
                    <span v-else>{{ apiKeyDirty.id ? 'Update' : 'Save' }}</span>
                </AtlanBtn>
            </div>
        </div>
        <div v-else class="px-4 py-6">
            <div class="flex p-2 rounded-md bg-warning-light">
                <AtlanIcon icon="Info" class="h-6 mr-2" />
                <div>
                    Please copy or download this api key as it will be only
                    visible this one time
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useVModels } from '@vueuse/core'
import { message } from 'ant-design-vue'
import PillGroup from '@/UI/pill/pillGroup.vue'
import Pill from '@/UI/pill/pill.vue'
import PersonaList from '@/common/popover/persona/personaList.vue'
import AtlanBtn from '@/UI/button.vue'
// @ts-ignore
import { downloadFile } from '~/utils/library/download'
import { copyToClipboard } from '~/utils/clipboard'
import { formatDateTime } from '~/utils/date'

import SuccessIllustration from '~/assets/images/illustrations/check-success.svg'

export default defineComponent({
    name: 'APIKeyDrawer',
    components: { PillGroup, PersonaList, Pill, AtlanBtn },
    props: {
        apiKey: {
            type: Object,
            default: () => {},
        },
        createUpdateLoading: {
            type: Boolean,
            default: false,
        },
        deleteAPIKeyLoading: {
            type: Boolean,
            default: false,
        },
        generatedAPIKey: {
            type: Object,
            default: {},
        },
    },
    emits: ['updateAPIKey', 'createAPIKey', 'closeDrawer'],
    setup(props, { emit }) {
        const apiKeyDirty = ref({})
        // const apiKeyDirtyPersonas = ref([])

        const nameEmptyOnSubmit = ref(false)
        const addPersonaPopoverVisible = ref(false)
        const isDeletePopoverVisible = ref(false)
        const { generatedAPIKey } = useVModels(props, emit)

        const showDeletePopover = () => {
            isDeletePopoverVisible.value = true
        }
        watch(
            () => props.deleteAPIKeyLoading,
            (newVal, prevVal) => {
                if (newVal === false && prevVal === true) {
                    isDeletePopoverVisible.value = false
                }
            }
        )
        const handleSave = () => {
            if (!apiKeyDirty.value.displayName) {
                nameEmptyOnSubmit.value = true
                return
            }
            if (props?.apiKey?.id)
                emit('updateAPIKey', {
                    ...apiKeyDirty.value,
                    personas: (apiKeyDirty?.value?.personas ?? []).map(
                        (p) => p.id
                    ),
                })
            else
                emit('createAPIKey', {
                    ...apiKeyDirty.value,
                    personas: (apiKeyDirty?.value?.personas ?? []).map(
                        (p) => p.id
                    ),
                })
        }
        watch(
            () => props?.apiKey,
            () => {
                const personas = (props?.apiKey?.personas || []).map(
                    (persona) => ({ id: persona.id, name: persona.persona })
                )
                apiKeyDirty.value = { ...props.apiKey, personas }
            },
            { immediate: true, deep: true }
        )

        const toggleAddPersonaPopover = () => {
            addPersonaPopoverVisible.value = !addPersonaPopoverVisible.value
        }
        const handleDownload = () => {
            if (generatedAPIKey.value.attributes.accessToken) {
                const createDate = formatDateTime(
                    generatedAPIKey.value?.attributes?.createdAt || '',
                    {
                        month: 'short',
                        day: 'numeric',
                    },
                    'en-GB'
                )
                console.log(createDate)
                const data = generatedAPIKey.value.attributes.accessToken
                const filename = `${generatedAPIKey.value.attributes.displayName}_${createDate}_atlan api key.txt`
                const type = 'text/plain'
                downloadFile(data, filename, type)
            }
        }
        const handleCopy = () => {
            if (generatedAPIKey.value.attributes.accessToken) {
                copyToClipboard(generatedAPIKey.value.attributes.accessToken)
                message.success('API Key Copied')
            }
        }
        const handleClose = () => {
            if (generatedAPIKey && generatedAPIKey.value)
                generatedAPIKey.value = {}
            emit('closeDrawer')
        }
        return {
            apiKeyDirty,
            handleSave,
            addPersonaPopoverVisible,
            toggleAddPersonaPopover,
            nameEmptyOnSubmit,
            handleDownload,
            handleCopy,
            handleClose,
            SuccessIllustration,
            showDeletePopover,
            isDeletePopoverVisible,
        }
    },
})
</script>
<style lang="less" scoped>
.persona-list {
    width: 256px;
    height: 300px;
}
</style>