<!-- This component works in 3 modes/views: 1/ form to generate a key 2/ form to update/delete a key 3/ info for generated key; generatedAPIKey (3) is the first level of distinction bw these modes/views, if value exists for that we show the third screen; If not we check if the passed in key (props) that we take in this component as apiKeyDirty has an id or not; if it has id, we are in edit mode i.e. 2nd screen (form is prefilled) else new key generation mode (form is empty)-->
<template>
    <div class="flex flex-col justify-between h-full pt-5">
        <div>
            <div
                class="
                    relative
                    flex
                    items-center
                    justify-between
                    px-4
                    pb-5
                    border-b
                "
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
                                            class="
                                                flex
                                                items-center
                                                text-primary
                                                group-hover:text-white
                                            "
                                        >
                                            <AtlanIcon
                                                icon="Add"
                                                class="h-4 mr-0.5"
                                            />
                                            Add personas
                                        </div>
                                        <div
                                            v-else
                                            class="
                                                text-gray
                                                group-hover:text-white
                                            "
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
                <div class="mb-4" v-if="!apiKeyDirty.id">
                    <div class="mb-2 mr-2 text-gray-500">Expiry</div>
                    <a-dropdown :trigger="['click']">
                        <a-button
                            class="rounded focus:ring-2 focus:border-primary"
                            style="min-width: 168px"
                        >
                            <div class="flex items-center">
                                <div class="flex flex-1">
                                    {{
                                        validityOptions.find(
                                            (v) => v.value === validity
                                        )
                                            ? validityOptions.find(
                                                  (v) => v.value === validity
                                              ).label
                                            : 'Custom'
                                    }}
                                </div>
                                <div class="ml-4 text-gray-700">
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="h-4 -mt-0.5 -ml-0.5"
                                    />
                                </div>
                            </div>
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item key="0" class="hover:bg-white">
                                    <a-radio-group
                                        v-model:value="validity"
                                        class="w-full"
                                    >
                                        <div
                                            class="
                                                flex flex-col
                                                w-full
                                                px-1
                                                text-sm text-gray-700
                                                hover:text-primary
                                            "
                                        >
                                            <template
                                                v-for="item in validityOptions"
                                                :key="item.label"
                                            >
                                                <div class="w-full px-0 py-1">
                                                    <a-radio
                                                        :value="item.value"
                                                        @click="
                                                            showDatePicker = false
                                                        "
                                                    >
                                                        <div>
                                                            {{ item.label }}
                                                        </div>
                                                    </a-radio>
                                                </div>
                                            </template>
                                            <div
                                                @click.stop="() => {}"
                                                class="
                                                    flex flex-col
                                                    items-center
                                                    py-2
                                                    pb-0.5
                                                    border-t border-300
                                                    hover:text-primary
                                                "
                                            >
                                                <div
                                                    class="
                                                        flex
                                                        items-center
                                                        justify-start
                                                        w-full
                                                        mb-2
                                                    "
                                                >
                                                    <a-radio
                                                        @click="
                                                            showDatePicker = true
                                                        "
                                                        :value="'custom'"
                                                        >Custom</a-radio
                                                    >
                                                </div>
                                                <div
                                                    :class="
                                                        showDatePicker
                                                            ? ''
                                                            : 'hidden'
                                                    "
                                                >
                                                    <a-date-picker
                                                        v-model:value="
                                                            validityDate
                                                        "
                                                        format="YYYY-MM-DD"
                                                        :allowClear="true"
                                                        :disabled-date="
                                                            disabledDate
                                                        "
                                                    ></a-date-picker>
                                                </div>
                                            </div>
                                        </div>
                                    </a-radio-group>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
                <div v-else>
                    <div class="mb-2 mr-2 text-gray-500">Expiry</div>
                    <div>{{ apiKeyExpiryDate }}</div>
                </div>
            </div>
            <div
                v-else
                class="
                    flex flex-col
                    items-center
                    justify-center
                    w-full
                    h-full
                    px-4
                "
            >
                <component :is="SuccessIllustration" class="mb-5"></component>
                <div class="mb-5 text-xl font-bold">API key generated</div>
                <div
                    class="
                        w-full
                        h-24
                        p-4
                        mb-5
                        overflow-y-scroll
                        bg-gray-100
                        border
                        rounded
                    "
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
                            class="
                                mr-3
                                text-white
                                bg-transparent
                                border-none
                                bg-error
                            "
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
import dayjs, { Dayjs } from 'dayjs'
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

const DEFAULT_VALIDITY_IN_YEARS = 13 // 13 years; same as BE
const DEFAULT_VALIDITY_IN_SECONDS =
    DEFAULT_VALIDITY_IN_YEARS * 365 * 24 * 60 * 60

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
        const nameEmptyOnSubmit = ref(false)
        const addPersonaPopoverVisible = ref(false)
        const isDeletePopoverVisible = ref(false)
        const { generatedAPIKey } = useVModels(props, emit)
        const validityDate = ref(dayjs())
        const showDeletePopover = () => {
            isDeletePopoverVisible.value = true
        }
        const showDatePicker = ref(false)
        const validity = ref('')
        const validityOptions = ref([
            {
                label: 'Never',
                value: 'never',
            },
            {
                label: '1 Week',
                value: 'one-week',
            },
            {
                label: '1 Month',
                value: 'one-month',
            },
        ])
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
            //calculate validity seconds from validityDate in case of custom
            if (validity.value === 'never') {
                const validityUnixEpoch =
                    dayjs().unix() + DEFAULT_VALIDITY_IN_SECONDS
                // getting dayjs obj from the calculated unix epoch to pass in datepicker
                validityDate.value = dayjs.unix(validityUnixEpoch)
            } else if (validity.value === 'one-week') {
                validityDate.value = dayjs().add(1, 'week')
            } else if (validity.value === 'one-month') {
                validityDate.value = dayjs().add(1, 'month')
            }
            // if custom, make no changes to validity date
            const modifiedDate = validityDate.value.endOf('day')
            const validityInSeconds = modifiedDate.diff(dayjs(), 's')
            if (props?.apiKey?.id)
                emit('updateAPIKey', {
                    ...apiKeyDirty.value,
                    validitySeconds: validityInSeconds,
                    personas: (apiKeyDirty?.value?.personas ?? []).map(
                        (p) => p.id
                    ),
                })
            else
                emit('createAPIKey', {
                    ...apiKeyDirty.value,
                    validitySeconds: validityInSeconds,
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
                if (
                    props?.apiKey?.rawKey?.attributes?.createdAt &&
                    props?.apiKey?.validitySeconds
                ) {
                    // adding validity in seconds to created timestamp unix epoch to find the date till which the api key is valid
                    const validityUnixEpoch =
                        dayjs(
                            props?.apiKey?.rawKey?.attributes?.createdAt
                        ).unix() + parseInt(props.apiKey.validitySeconds)
                    // getting dayjs obj from the calculated unix epoch to pass in datepicker
                    validityDate.value = dayjs.unix(validityUnixEpoch)

                    // if (
                    //     validityDate.value.diff(
                    //         dayjs(props?.apiKey?.rawKey?.attributes?.createdAt),
                    //         'week'
                    //     ) === 1
                    // ) {
                    //     validity.value = 'one-week'
                    // } else if (
                    //     validityDate.value.diff(
                    //         dayjs(props?.apiKey?.rawKey?.attributes?.createdAt),
                    //         'month'
                    //     ) === 1
                    // ) {
                    //     validity.value = 'one-month'
                    // } else if (
                    //     parseInt(props.apiKey.validitySeconds) <
                    //     DEFAULT_VALIDITY_IN_SECONDS
                    // ) {
                    //     validity.value = 'custom'
                    //     showDatePicker.value = true
                    // } else validity.value = 'never'
                } else {
                    const validityUnixEpoch =
                        dayjs().unix() + DEFAULT_VALIDITY_IN_SECONDS
                    // getting dayjs obj from the calculated unix epoch to pass in datepicker
                    validityDate.value = dayjs.unix(validityUnixEpoch)
                    validity.value = 'never'
                }
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
        const disabledDate = (current: Dayjs) => {
            // Cannot select days before today and after 13 years from today
            const validityUnixEpoch =
                dayjs().unix() + DEFAULT_VALIDITY_IN_SECONDS
            return (
                dayjs(current) < dayjs().startOf('day') ||
                dayjs(current) > dayjs.unix(validityUnixEpoch).endOf('day')
            )
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
            validityDate,
            disabledDate,
            dayjs,
            validityOptions,
            validity,
            showDatePicker,
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