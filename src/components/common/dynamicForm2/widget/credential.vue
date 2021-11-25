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
    <template v-else>
        <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
        <div class="flex items-center">
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
        onMounted,
        onBeforeMount,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { useTestCredential } from '~/composables/credential/useTestCredential'
    import { useConfigMapList } from '~/composables/package/useConfigMapList'
    import ErrorView from '@common/error/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'

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

            const body = reactive({
                connector: 'Lorem veniam', // snowflake
                authType: 'sit ullamco',
                extra: {},
                host: 'voluptate tempor a',
                password: 'est ut amet quis irure',
                username: 'occaecat incididunt deserunt',
                port: -228305,
            })
            const dependentKey = ref()

            const {
                data: testData,
                refresh,
                isLoading: isLoadingTest,
                error: errorTest,
            } = useTestCredential(body)

            const configMap = ref({
                title: 'Config Map',
                description: 'Config Map for input parameters',
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
                            label: 'Host',
                            feedback: true,
                            placeholder: 'Host Name',
                            help: 'Please enter a valid host name',
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter a valid host name',
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
                                    message: 'Please enter a valid port name',
                                },
                            ],
                        },
                    },
                    'auth-type': {
                        type: 'string',
                        enum: ['basic', 'private'],
                        default: 'basic',
                        required: true,
                        enumNames: ['Basic', 'Private'],
                        ui: {
                            widget: 'radio',
                            label: 'Authentication',
                            placeholder: 'Credential Type',

                            rules: [
                                {
                                    required: true,
                                    message:
                                        'Please enter a valid authentication type',
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
                                    message: 'Please enter a valid username',
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
                            hidden: true,
                        },
                    },
                    private: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                                ui: {
                                    label: 'private',
                                    placeholder: 'Username',
                                    grid: 4,
                                },
                            },
                            password: {
                                type: 'string',
                                ui: {
                                    label: 'private',
                                    placeholder: 'Password',
                                    grid: 4,
                                },
                            },
                        },
                        ui: {
                            widget: 'nested',
                            label: 'Private Key',
                            nestedValue: false,
                            placeholder: 'Credential Type',
                            hidden: true,
                        },
                    },
                    extra: {
                        type: 'object',
                        properties: {
                            role: {
                                type: 'string',
                                ui: {
                                    widget: 'sql',
                                    label: 'Role',
                                    placeholder: 'Role',
                                    query: 'show roles',
                                    grid: 4,
                                },
                            },
                            warehouse: {
                                type: 'string',
                                ui: {
                                    widget: 'sql',
                                    label: 'Warehouse',
                                    placeholder: 'Warehouse',
                                    query: 'show warehouses',
                                    grid: 4,
                                },
                            },
                        },
                        ui: {
                            widget: 'nested',
                            label: '',
                            header: 'Advanced',
                            hidden: false,
                        },
                    },
                },
                anyOf: [
                    {
                        properties: {
                            'auth-type': {
                                const: 'basic',
                            },
                        },
                        required: ['basic'],
                    },
                    {
                        properties: {
                            'auth-type': {
                                const: 'private',
                            },
                        },
                        required: ['private'],
                    },
                ],
            })

            const { isLoading, error, data } = useConfigMapList({
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
            const successMessage = () => {
                testMessage.value = 'Success'
                testIcon.value = 'Tick'
                testClass.value = ''
            }
            const errorMessage = (message) => {
                testMessage.value = message
                testIcon.value = 'Error'
                testClass.value = 'text-red-500'
            }

            const setBody = () => {
                body.host = formState[`${property.value.id}.host`]
                body.port = parseInt(formState[`${property.value.id}.port`])
                body.authType = formState[`${property.value.id}.auth-type`]
                body.username =
                    formState[`${property.value.id}.${body.authType}.username`]
                body.password =
                    formState[`${property.value.id}.${body.authType}.password`]

                body.extra = {}
                Object.keys(formState).forEach((key) => {
                    if (key.includes(`${property.value.id}.extra.`)) {
                        body.extra[
                            key.replace(`${property.value.id}.extra.`, '')
                        ] = formState[key]
                    }
                })
                body.connectorConfigName = property.value.ui?.credentialType
            }

            const handleTestAuthentication = async () => {
                resetError()
                const e = await validateForm()
                if (!e) {
                    setBody()
                    console.log(body)
                    refresh()
                } else {
                    testMessage.value = 'Please enter correct credentials'
                    testIcon.value = 'Error'
                    testClass.value = 'text-red-500'
                    console.log('error', e)
                }
            }

            watch(data, () => {
                // if (data.value?.length > 0) {
                //     configMap.value = data.value[0]
                // }
            })

            watch(testData, () => {
                // console.log('test')
                successMessage()
                // if (data.value?.length > 0) {
                //     configMap.value = data.value[0]
                // }
            })
            watch(errorTest, () => {
                console.log('test error')
                errorMessage('Not able to authenticate your credentials')
                // successMessage()
                // if (data.value?.length > 0) {
                //     configMap.value = data.value[0]
                // }
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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
