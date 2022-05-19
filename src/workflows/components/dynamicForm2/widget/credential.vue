<template>
    <div
        class="flex flex-col items-center justify-center flex-grow"
        style="height: 100px"
        v-if="isLoading"
    >
        <AtlanLoader icon="Loader" class="h-10 mx-auto mt-1" />
        Loading Credential Configuration
    </div>
    <div
        v-else-if="!isLoading && error"
        class="flex items-center justify-center flex-grow"
    >
        <ErrorView :error="error"></ErrorView>
    </div>
    <div v-else-if="isCredential && credential" class="flex flex-col gap-y-2">
        <div>
            <p class="text-base font-bold capitalize text-new-gray-800">
                {{ connector(credential) }} Credential
            </p>
            <div class="text-gray-500">
                last updated {{ updatedAt(credential, true) }} ago
                <template
                    v-if="
                        updatedBy(credential)?.startsWith(
                            'service-account-apikey-'
                        )
                    "
                >
                    using <AtlanIcon icon="Key" class="h-3" /> API key
                </template>
                <template v-else>
                    by
                    <UserWrapper :username="updatedBy(credential)" />
                </template>
            </div>
            <a-divider class="mt-3 mb-2" />
        </div>

        <div class="flex text-gray-500" v-if="isEditVisible">
            <AtlanIcon
                icon="Lock2"
                class="h-5 mr-1 text-yellow-500"
            ></AtlanIcon>
            Sensitive details are not displayed for security reasons. Any
            changes to these fields will be override existing data.
        </div>
        <div class="flex items-center my-2" v-if="testMessage">
            <div class="flex items-center">
                <AtlanIcon :icon="testIcon" class="h-5 mr-1"></AtlanIcon>
                <span :class="testClass">{{ testMessage }}</span>
            </div>
        </div>
        <div v-if="isEditVisible" class="mt-2">
            <FormItem
                :configMap="configMap"
                :baseKey="property.id"
                :isEdit="isCredential"
            ></FormItem>
        </div>

        <div
            v-else
            class="grid grid-cols-3 text-sm font-medium xl:grid-cols-2 gap-y-4"
        >
            <div class="space-y-1.5 col-span-2 xl:col-span-1">
                <p class="text-new-gray-600">Host</p>
                <p class="select-all text-new-gray-800">
                    {{ host(credential) }}
                </p>
            </div>

            <div class="space-y-1.5">
                <p class="text-new-gray-600">Port</p>
                <p class="text-new-gray-800">
                    {{ port(credential) }}
                </p>
            </div>

            <div class="space-y-1.5 col-span-2 xl:col-span-1">
                <p class="text-new-gray-600">Reference</p>
                <p class="select-all text-new-gray-800">
                    {{ credential.id }}
                </p>
            </div>

            <div class="space-y-1.5">
                <p class="text-new-gray-600">Auth Type</p>
                <p class="capitalize text-new-gray-800">
                    <AtlanIcon
                        icon="Lock2"
                        class="mb-0.5 text-yellow-400"
                    ></AtlanIcon>
                    {{ authType(credential) }}
                </p>
            </div>
        </div>
        <!-- <a-divider class="mt-3 mb-1" /> -->
        <div class="flex mt-4 gap-x-3">
            <AtlanButton2
                color="secondary"
                :label="isEditVisible ? 'Cancel' : 'Edit Credentials'"
                @click="toggleEdit"
            />

            <a-button
                v-if="!isEditVisible"
                :loading="isLoadingTestByID"
                class="text-white bg-success border-success"
                @click="handleTestAuthentication(false)"
            >
                Test Authentication
            </a-button>

            <AtlanButton2
                v-if="isEditVisible"
                label="Test & Update"
                :loading="isLoadingTest || isLoadingUpdate"
                :disabled="!isDirty"
                @click="handleUpdate"
            />
        </div>
    </div>

    <template v-else-if="configMap && !isCredential">
        <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
        <div class="flex">
            <a-button
                :loading="isLoadingTest"
                @click="handleTestAuthentication(false)"
                class="text-white bg-success border-success"
                >Test Authentication</a-button
            >
            <div class="flex items-center ml-2" v-if="testMessage">
                <AtlanIcon :icon="testIcon" class="mr-1"></AtlanIcon>
                <span :class="testClass">{{ testMessage }}</span>
            </div>
        </div>
    </template>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        reactive,
        watch,
        defineAsyncComponent,
        ref,
        inject,
        provide,
        onMounted,
        onBeforeMount,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { until, useVModels } from '@vueuse/core'
    import { useTestCredential } from '~/composables/credential/useTestCredential'
    import useGetCredential from '~/composables/credential/useGetCredential'

    import { useConfigMapByName } from '~/workflows/composables/package/useConfigMapByName'
    import ErrorView from '@/common/error/index.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'

    import { useWorkflowHelper } from '~/workflows/composables/package/useWorkflowHelper'
    import useCredentialInfo from '~/composables/credential/useCredentialInfo'

    import useTestCredentialByID from '~/composables/credential/useTestCredentialByID'

    import { useConnectionStore } from '~/store/connection'
    import useUpdateCredential from '~/composables/credential/useUpdateCredential'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'

    export default defineComponent({
        name: 'CredentialInput',
        components: {
            FormItem: defineAsyncComponent(() =>
                import('~/workflows/components/dynamicForm2/formItem.vue')
            ),
            ErrorView,
            AtlanIcon,
            UserWrapper,
        },
        props: {
            property: {
                required: false,
                type: Object,
                default() {
                    return {}
                },
            },
            modelValue: {
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property, modelValue } = toRefs(props)

            let formState = inject('formState')
            const validateForm = inject('validateForm')

            const testMessage = ref('')
            const testIcon = ref('')
            const testClass = ref('')

            const isCredential = ref(false)
            const isEditVisible = ref(false)
            const isDirty = ref(false)

            const configMap = ref()

            const { data, isLoading, error } = useConfigMapByName(
                `${property.value.ui?.credentialType}`,
                true
            )

            const credential = ref({})

            const {
                host,
                port,
                name,
                authType,
                connector,
                updatedAt,
                updatedBy,
            } = useCredentialInfo()

            const { getImage } = useConnectionStore()
            const { buildCredentialBody, getCredentialState } =
                useWorkflowHelper()

            if (
                typeof modelValue.value === 'string' ||
                modelValue.value instanceof String
            ) {
                isCredential.value = true
                const { data: cred } = useGetCredential(modelValue.value, true)

                watch(cred, () => {
                    credential.value = cred.value

                    getCredentialState(property.value.id, cred.value, formState)

                    console.log('credBody', formState)

                    //convert body into formState
                })
            }

            const resetError = () => {
                testMessage.value = ''
                testIcon.value = ''
                testClass.value = ''
            }

            watch(data, () => {
                if (data.value.data.config) {
                    try {
                        configMap.value = JSON.parse(data.value.data.config)
                    } catch (e) {
                        console.error(e)
                    }
                } else {
                    configMap.value = {
                        properties: {
                            name: {
                                type: 'string',
                                required: false,
                                ui: {
                                    label: 'Name',
                                    hidden: true,
                                    placeholder: 'Host Name',
                                },
                            },
                            connector: {
                                type: 'string',
                                required: false,
                                ui: {
                                    label: 'Connector',
                                    hidden: true,
                                    placeholder: 'Connector',
                                },
                            },
                            connectorType: {
                                type: 'string',
                                required: false,
                                ui: {
                                    key: '_host',
                                    label: 'connectorType',
                                    placeholder: 'connectorType',
                                    hidden: true,
                                },
                            },
                            host: {
                                type: 'string',
                                required: true,
                                default:
                                    'jv22371.ap-south-1.aws.snowflakecomputing.com',
                                ui: {
                                    label: 'Account Identifiers (Host)',
                                    feedback: true,
                                    placeholder: 'Host Name',
                                    addonBefore: 'https://',
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter a valid host name',
                                        },
                                    ],
                                    grid: 6,
                                },
                            },
                            port: {
                                type: 'number',
                                default: 443,
                                required: true,
                                ui: {
                                    label: 'Port',
                                    placeholder: 'Port',
                                    disabled: true,
                                    grid: 2,
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter a valid port name',
                                        },
                                    ],
                                },
                            },
                            basic: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        required: true,
                                        default: 'atlanadmin',
                                        ui: {
                                            label: 'Username',
                                            placeholder: 'Username',
                                            feedback: true,
                                            message:
                                                'Please enter a valid username',
                                            grid: 4,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter a valid username',
                                                },
                                            ],
                                        },
                                    },
                                    password: {
                                        type: 'string',
                                        required: true,
                                        ui: {
                                            widget: 'password',
                                            label: 'Password',
                                            feedback: true,
                                            placeholder: 'Password',
                                            grid: 4,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter a valid password',
                                                },
                                            ],
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'nested',
                                    label: '',
                                    placeholder: 'Credential Type',
                                    nestedValue: false,
                                    hidden: false,
                                },
                            },
                        },
                    }
                }
            })

            // watch(data, () => {
            //     console.log('cinfig data', data.value)
            // })

            const successMessage = () => {
                testMessage.value = 'Authentication Successful'
                testIcon.value = 'RunSuccess'
                testClass.value = ''
            }

            const errorMessage = (message) => {
                testMessage.value = message
                testIcon.value = 'Error'
                testClass.value = 'text-red-500'
            }

            const credentialBody = computed(() =>
                buildCredentialBody(
                    formState,
                    property.value.id,
                    property.value.ui.credentialType,
                    credential.value.name
                )
            )

            const {
                data: testData,
                refresh,
                isLoading: isLoadingTest,
                error: errorTest,
            } = useTestCredential(credentialBody)

            const testPath = computed(() => ({
                id: credential.value.id,
            }))

            const toggleEdit = () => {
                resetError()
                isEditVisible.value = !isEditVisible.value
                isDirty.value = false
            }

            const {
                data: testDataByID,
                isLoading: isLoadingTestByID,
                error: errorTestByID,
                mutate: testByID,
            } = useTestCredentialByID(testPath, false)

            const {
                data: newCredential,
                mutate: updateByID,
                isLoading: isLoadingUpdate,
                error: errorUpdate,
            } = useUpdateCredential(testPath, credentialBody, false)

            provide('credentialBody', credentialBody)

            const handleTestAuthentication = async (skipId) => {
                if (isCredential.value && !skipId) {
                    testByID()
                } else {
                    resetError()
                    if (skipId) {
                        refresh()
                    } else {
                        const e = await validateForm()
                        if (!e) {
                            refresh()
                        } else {
                            testMessage.value =
                                'Please enter the required credentials'
                            testIcon.value = 'Error'
                            testClass.value = 'text-red-500'
                        }
                    }
                }
            }

            watch(testData, () => {
                if (testData.value?.message) {
                    successMessage()
                    message.success('Test Authentication was succesful')
                }
            })

            watch(testDataByID, () => {
                if (testDataByID.value?.message) {
                    successMessage()
                    message.success('Test Authentication was succesful')
                }
            })
            watch(errorTestByID, () => {
                if (!isLoadingTestByID.value) {
                    if (errorTestByID) {
                        errorMessage(
                            `Not able to authenticate your credentials - ${errorTestByID.value?.response?.data?.message}`
                        )
                        message.error(
                            'Test authentication failed. Please check your credentials'
                        )
                    }
                }
            })

            watch(errorTest, () => {
                if (!isLoadingTest.value) {
                    if (errorTest) {
                        errorMessage(
                            `Not able to authenticate your credentials`
                        )
                        message.error(
                            'Test authentication failed. Please check your credentials'
                        )
                    }
                }
            })

            const handleUpdate = async () => {
                handleTestAuthentication(true)
                await until(isLoadingTest).toBe(false)
                if (testData.value?.message) {
                    updateByID()
                }
            }

            watch(
                formState,
                () => {
                    console.log('changed state', isEditVisible.value)
                    if (isEditVisible.value) {
                        isDirty.value = true
                    }
                },
                { deep: true }
            )

            watch(newCredential, () => {
                isEditVisible.value = false
                message.success('Credential was succesful updated')
            })

            return {
                configMap,
                refresh,
                handleTestAuthentication,
                validateForm,
                isLoading,
                error,
                data,
                formState,
                resetError,
                testMessage,
                testIcon,
                testClass,
                isLoadingTest,
                errorTest,
                testData,
                errorMessage,

                credentialBody,
                credential,
                isCredential,
                getCredentialState,

                host,
                port,
                name,
                authType,

                updatedAt,
                updatedBy,
                getImage,
                connector,
                testDataByID,
                isLoadingTestByID,
                errorTestByID,
                testByID,
                testPath,
                isEditVisible,
                toggleEdit,
                handleUpdate,
                isLoadingUpdate,
                errorUpdate,
                newCredential,
                isDirty,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
