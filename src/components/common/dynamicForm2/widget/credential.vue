<template>
    <div
        class="flex items-center justify-center flex-grow"
        style="height: 100px"
        v-if="isLoading"
    >
        <a-spin icon="Loader" class="mt-1 mr-2"></a-spin>
        Loading Credential Configuration
    </div>
    <div
        v-else-if="!isLoading && error"
        class="flex items-center justify-center flex-grow"
    >
        <ErrorView :error="error"></ErrorView>
    </div>
    <div v-else-if="isCredential && credential" class="flex flex-col w-2/3">
        <div class="flex flex-col px-3 py-2 border rounded gap-y-2">
            <div class="flex items-center font-semibold">
                <div class="flex items-center mr-1">
                    <img
                        :src="getImage(connector(credential))"
                        class="w-4 h-4"
                    />
                    <span class="ml-1 capitalize">{{
                        connector(credential)
                    }}</span>
                </div>
                Credential
            </div>

            <div class="flex gap-x-3">
                <div class="flex flex-col">
                    <div class="text-gray-500">Host</div>
                    <div class="text-gray-700">
                        {{ host(credential) }}
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="text-gray-500">Port</div>
                    <div class="text-gray-700">
                        {{ port(credential) }}
                    </div>
                </div>
            </div>
            <div class="flex gap-x-3">
                <div class="flex flex-col">
                    <div class="text-gray-500">Auth Type</div>
                    <div class="text-gray-700 capitalize">
                        <AtlanIcon
                            icon="Lock"
                            class="mb-0.5 text-yellow-400"
                        ></AtlanIcon>
                        {{ authType(credential) }}
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="text-gray-500">Reference</div>
                    <div class="text-gray-700">
                        {{ credential.id }}
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="text-gray-500">
                    last updated {{ updatedAt(credential, true) }} by
                    {{ updatedBy(credential) }}
                </div>
                <a-button @click="toggleEdit">Edit</a-button>
            </div>
        </div>
        <div class="flex mt-3">
            <a-button
                :loading="isLoadingTestByID"
                @click="handleTestAuthentication"
                class="text-white bg-success border-success"
                >Test Authentication</a-button
            >
            <div class="flex items-center ml-2" v-if="testMessage">
                <AtlanIcon :icon="testIcon" class="mr-1"></AtlanIcon>
                <span :class="testClass">{{ testMessage }}</span>
            </div>
        </div>
        <a-modal
            v-model:visible="isEditVisible"
            okText="Update"
            title="Edit Credential"
        >
            <div class="px-4 py-3">
                <FormItem
                    :configMap="configMap"
                    :baseKey="property.id"
                ></FormItem>
                <div class="flex">
                    <a-button
                        :loading="isLoadingTest"
                        @click="handleTestAuthentication"
                        class="text-white bg-success border-success"
                        >Test Authentication</a-button
                    >
                    <div class="flex items-center ml-2" v-if="testMessage">
                        <AtlanIcon :icon="testIcon" class="mr-1"></AtlanIcon>
                        <span :class="testClass">{{ testMessage }}</span>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>

    <template v-else-if="configMap && !isCredential">
        <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
        <div class="flex">
            <a-button
                :loading="isLoadingTest"
                @click="handleTestAuthentication"
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
    import { useVModels } from '@vueuse/core'
    import { useTestCredential } from '~/composables/credential/useTestCredential'
    import useGetCredential from '~/composables/credential/useGetCredential'

    import { useConfigMapByName } from '~/composables/package/useConfigMapByName'
    import ErrorView from '@common/error/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    import { useWorkflowHelper } from '~/composables/package/useWorkflowHelper'
    import useCredentialInfo from '~/composables/credential/useCredentialInfo'

    import useTestCredentialByID from '~/composables/credential/useTestCredentialByID'

    import { useConnectionStore } from '~/store/connection'
    // import DynamicForm from '@/common/dynamicForm2/index.vue'

    export default defineComponent({
        name: 'CredentialInput',
        components: {
            FormItem: defineAsyncComponent(() =>
                import('@/common/dynamicForm2/formItem.vue')
            ),
            ErrorView,
            AtlanIcon,
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
                type: Object,
                default() {
                    return {}
                },
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property, modelValue } = toRefs(props)

            const formState = inject('formState')
            const validateForm = inject('validateForm')

            const testMessage = ref('')
            const testIcon = ref('')
            const testClass = ref('')

            const isCredential = ref(false)
            const isEditVisible = ref(false)

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

            if (
                typeof modelValue.value === 'string' ||
                modelValue.value instanceof String
            ) {
                isCredential.value = true
                const { data: cred } = useGetCredential(modelValue.value, true)

                watch(cred, () => {
                    credential.value = cred.value
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
                testMessage.value = 'Success'
                testIcon.value = 'RunSuccess'
                testClass.value = ''
            }

            const errorMessage = (message) => {
                testMessage.value = message
                testIcon.value = 'Error'
                testClass.value = 'text-red-500'
            }

            const { buildCredentialBody } = useWorkflowHelper()

            const credentialBody = computed(() =>
                buildCredentialBody(
                    formState,
                    property.value.id,
                    property.value.ui.credentialType
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
                isEditVisible.value = !isEditVisible.value
            }

            const {
                data: testDataByID,
                isLoading: isLoadingTestByID,
                error: errorTestByID,
                mutate: testByID,
            } = useTestCredentialByID(testPath, false)

            provide('credentialBody', credentialBody)

            const handleTestAuthentication = async () => {
                if (isCredential.value) {
                    testByID()
                } else {
                    resetError()
                    const e = await validateForm()
                    if (!e) {
                        refresh()
                    } else {
                        testMessage.value = 'Please enter correct credentials'
                        testIcon.value = 'Error'
                        testClass.value = 'text-red-500'
                    }
                }
            }

            watch([testData, testDataByID], () => {
                successMessage()
            })
            watch([errorTest, errorTestByID], () => {
                if (isCredential.value && !isLoadingTestByID.value) {
                    if (errorTestByID) {
                        errorMessage(
                            `Not able to authenticate your credentials - ${errorTestByID.value?.response?.data?.message}`
                        )
                    }
                }
                if (!isLoadingTest.value) {
                    if (errorTest) {
                        errorMessage(
                            `Not able to authenticate your credentials - ${errorTest.value?.response?.data?.message}`
                        )
                    }
                }
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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
