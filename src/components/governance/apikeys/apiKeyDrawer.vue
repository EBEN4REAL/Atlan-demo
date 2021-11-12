<template>
    <div class="flex flex-col justify-between h-full pt-5">
        <div>
            <div
                class="relative flex items-center justify-between px-4 pb-5 border-b "
            >
                <div
                    class="text-lg font-bold"
                    v-if="!generatedAPIKey.attributes"
                >
                    {{
                        apiKeyDirty.id ? apiKeyDirty.displayName : 'Add new key'
                    }}
                </div>
                <div class="text-lg font-bold" v-else>
                    {{ generatedAPIKey.attributes.displayName }}
                </div>

                <div
                    class="top-0 p-1 border border-gray-300 rounded cursor-pointer  right-2"
                >
                    <AtlanIcon
                        icon="Cross"
                        class="r"
                        @click="$emit('closeDrawer')"
                    />
                </div>
            </div>
            <div class="px-4 py-3" v-if="!generatedAPIKey.attributes">
                <div class="mb-4">
                    <div class="mb-2 mr-2 text-gray-500">
                        Name <sup class="text-error">*</sup>
                    </div>
                    <a-input
                        v-model:value="apiKeyDirty.displayName"
                        :placeholder="'Name the api key'"
                        :class="
                            nameEmptyOnSubmit && !apiKeyDirty.displayName.length
                                ? 'border border-error'
                                : ''
                        "
                    ></a-input>
                </div>
                <div class="mb-4">
                    <div class="mb-2 mr-2 text-gray-500">Description</div>
                    <a-input
                        v-model:value="apiKeyDirty.description"
                        :placeholder="'Add description'"
                    ></a-input>
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
                                :selected-personas="apiKeyDirty.personas || []"
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
                        class="px-10 bg-transparent border-none text-primary"
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
                        <AtlanIcon icon="CopyOutlined" class="ml-2"></AtlanIcon>
                        Copy
                    </AtlanBtn>
                </div>
            </div>
        </div>
        <div
            class="flex justify-end px-4 py-5 border-t"
            v-if="!generatedAPIKey.attributes"
        >
            <!-- <AtlanBtn
                    class="mr-3 bg-transparent border-none text-error"
                    size="lg"
                    padding="compact"
                >
                    <AtlanIcon icon="Delete" /> <span>Delete</span></AtlanBtn
                > -->
            <div class="flex">
                <AtlanBtn
                    color="secondary"
                    padding="compact"
                    size="sm"
                    class="px-5 mr-3 shadow-sm"
                    @click="$emit('closeDrawer')"
                >
                    <span>Cancel</span></AtlanBtn
                >
                <AtlanBtn
                    class="px-5"
                    size="sm"
                    color="primary"
                    padding="compact"
                    @click="handleSave"
                    :is-loading="createAPIKeyLoading"
                    ><span v-if="createAPIKeyLoading">Saving</span>
                    <span v-else>Save</span></AtlanBtn
                >
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
import { defineComponent, toRefs, ref, watch } from 'vue'
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
        createAPIKeyLoading: {
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
        const nameEmptyOnSubmit = ref(false)
        const addPersonaPopoverVisible = ref(false)

        const { generatedAPIKey } = useVModels(props, emit)

        const handleSave = () => {
            if (!apiKeyDirty.value.displayName) {
                nameEmptyOnSubmit.value = true
                return
            }
            if (props?.apiKey?.id) emit('updateAPIKey', apiKeyDirty)
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
                    (persona) => ({ id: persona, name: 'ex' })
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
        const handleDone = () => {
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
            handleDone,
            generatedAPIKey,
            SuccessIllustration,
        }
    },
})
</script>
<style lang="less">
.persona-popover {
    .ant-popover-inner-content {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
</style>
<style lang="less" scoped>
.persona-list {
    width: 256px;
    height: 300px;
}
</style>