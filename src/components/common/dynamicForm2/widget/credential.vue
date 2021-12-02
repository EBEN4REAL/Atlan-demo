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
    <template v-else-if="configMap">
        <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
        <div class="flex items-center">
            <a-button
                :loading="isLoadingTest"
                @click="handleTestAuthentication"
                class="text-white bg-success border-success"
                >Test Authentication</a-button
            >
            <div class="flex ml-2" v-if="testMessage">
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
    import { useConfigMapList } from '~/composables/package/useConfigMapList'
    import ErrorView from '@common/error/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    import { useWorkflowHelper } from '~/composables/package/useWorkflowHelper'

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
            const { property } = toRefs(props)

            const formState = inject('formState')
            const validateForm = inject('validateForm')

            const testMessage = ref('')
            const testIcon = ref('')
            const testClass = ref('')

            const configMap = ref()

            const { isLoading, error, data, list } = useConfigMapList({
                dependentKey: ref(true),
                limit: ref(1),
                filter: ref({
                    $or: [
                        {
                            name: `${property.value.ui?.credentialType}`,
                        },
                    ],
                }),
            })

            const resetError = () => {
                testMessage.value = ''
                testIcon.value = ''
                testClass.value = ''
            }

            watch(data, () => {
                if (list.value.length > 0) {
                    try {
                        configMap.value = JSON.parse(list.value[0].data.config)
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

            watch(credentialBody, () => {
                console.log('chaneg credentials -----')
                // formState[`${property.value.id}`] = credentialBody.value
            })

            const {
                data: testData,
                refresh,
                isLoading: isLoadingTest,
                error: errorTest,
            } = useTestCredential(credentialBody)

            provide('credentialBody', credentialBody)

            const handleTestAuthentication = async () => {
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

            watch(testData, () => {
                successMessage()
            })
            watch(errorTest, () => {
                console.log(errorTest.value?.response?.data.message)
                errorMessage(
                    `Not able to authenticate your credentials - ${errorTest.value?.response?.data?.message}`
                )
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
                list,
                credentialBody,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
