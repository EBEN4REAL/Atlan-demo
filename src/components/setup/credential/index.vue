<template>
    <FormGenerator />
</template>

<script lang="ts">
    import { defineComponent, PropType, reactive, ref, watch } from 'vue'

    import { BotsType } from '~/types/atlas/bots'
    import useBotModel from '~/composables/connection/useBotModel'
    import useConnectionTest from '~/composables/bots/useConnectionTest'
    import useCredentialTest from '~/composables/bots/useCredentialTest'
    import useCredentialTestbyID from '~/composables/bots/useCredentialTestByID'
    import FormGenerator from '@/common/formGenerator/index.vue'

    export default defineComponent({
        components: { FormGenerator },
        props: {
            item: {
                type: Object as PropType<BotsType>,
                required: false,
                default(): any {
                    return {}
                },
            },
            isEdit: {
                type: Boolean,
                required: false,
                default(): any {
                    return false
                },
            },
            defaultCredential: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
            defaultConnection: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
        },
        emits: ['verified'],
        setup(props, { emit }) {
            const form = ref('')

            const {
                host: hostLocal,
                port: portLocal,
                database: databaseLocal,
                extraAttributes: extraAttributesLocal,
                authAttributes: authAttributesLocal,
                enumAttributes,
                authTypes,
            } = useBotModel(props.item)

            const credential: {
                [key: string]: any
            } = reactive({
                displayName: '',
                host: hostLocal.value?.default,
                port: parseInt(portLocal?.value?.default),
                database: databaseLocal?.value?.default,
                connType: props.item?.attributes?.integrationName,
                login: '',
                password: '',
                authType: authTypes.value[0]?.id,
                url: props?.item?.attributes?.config.attributes
                    .credentialTemplate?.url,
                driver: props.item?.attributes?.config?.attributes
                    ?.credentialTemplate?.driver,
                driverProperties:
                    props.item?.attributes?.config?.attributes
                        ?.credentialTemplate?.driverProperties,
                extra: {},
            })

            const credentialGuid = ref('')
            if (props.isEdit) {
                credential.displayName =
                    props.defaultConnection?.attributes?.displayName
                credential.host = props.defaultConnection?.attributes?.host
                credential.port = props.defaultConnection?.attributes?.port
                credential.authType =
                    props.defaultCredential?.attributes?.authType
                // change it to credential
                credential.extra = props.defaultCredential?.attributes?.extra
                credentialGuid.value = props.defaultCredential?.guid
            }

            /**
             * @desc useConnectionTest - testing for connections
             */
            const {
                data,
                isError: errorNetwork,
                isLoading: isNetworkTestLoading,
                isSuccess: isNetworkTestSuccess,
                isError: isNetworkTestError,
                alertType: networkAlertType,
                alertMessage: networkAlertMessage,
                errorMessage: networkErrorMessage,
                replaceBody: replaceNetworkTestBody,
            } = useConnectionTest({}, { immediate: false })

            const handleNetworkTest = () => {
                replaceNetworkTestBody({
                    host: credential.host,
                    port: credential.port,
                })
            }

            /**
             * @desc useCredentialTest - testing for credentials with body
             */
            const {
                data: stateCredential,
                isLoading: isCredTestLoading,
                isSuccess: isCredTestSuccess,
                isError: isCredTestError,
                alertType: credAlertType,
                alertMessage: credAlertMessage,
                errorMessage: credErrorMessage,
                replaceBody: replaceCredentialTestBody,
            } = useCredentialTest(credentialGuid.value, { immediate: false })

            /**
             * @desc useCredentialTest - testing for credentials with existing guid
             */
            const {
                isLoading: isCredIdTestLoading,
                isSuccess: isCredIdTestSuccess,
                isError: isCredIdTestError,
                alertType: credIdAlertType,
                alertMessage: credIdAlertMessage,
                errorMessage: credIdErrorMessage,
                replaceId: replaceCredID,
            } = useCredentialTestbyID(credentialGuid.value, {
                immediate: false,
            })

            const handleCredentialTest = () => {
                if (props.isEdit) {
                    if (credential.login || credential.password) {
                        replaceCredentialTestBody(credential)
                    } else {
                        replaceCredID(credentialGuid.value)
                    }
                } else {
                    replaceCredentialTestBody(credential)
                }
            }

            const handleTest = () => {
                handleNetworkTest()
                handleCredentialTest()
            }

            const handleAuthTypeChange = () => {
                credential.login = ''
                credential.password = ''
            }

            /**
             * ??
             */
            watch(
                [
                    isNetworkTestLoading,
                    isCredTestLoading,
                    isCredIdTestLoading,
                    isNetworkTestSuccess,
                    isCredTestSuccess,
                ],
                () => {
                    if (
                        props.isEdit &&
                        !credential.login &&
                        !credential.password
                    ) {
                        if (
                            !isNetworkTestLoading.value &&
                            !isCredIdTestLoading.value
                        ) {
                            if (
                                isCredIdTestSuccess.value &&
                                isNetworkTestSuccess.value
                            ) {
                                emit('verified', credential)
                            } else if (
                                isNetworkTestError.value ||
                                isCredIdTestError.value
                            ) {
                                emit('verified', null)
                            }
                        }
                    } else if (
                        !isNetworkTestLoading.value &&
                        !isCredTestLoading.value
                    ) {
                        if (
                            isCredTestSuccess.value &&
                            isNetworkTestSuccess.value
                        ) {
                            emit('verified', credential)
                        } else if (
                            isNetworkTestError.value ||
                            isCredTestError.value
                        ) {
                            emit('verified', null)
                        }
                    }
                }
            )

            /**
             * @desc test the current credentials,
             * return credentials if true else null
             */
            const getCredential = async () => {
                try {
                    await form.value.validate()
                    handleTest()
                    return JSON.parse(JSON.stringify(credential))
                } catch (err) {
                    return null
                }
            }

            return {
                data,
                errorNetwork,
                stateCredential,
                hostLocal,
                portLocal,
                databaseLocal,
                extraAttributesLocal,
                authAttributesLocal,
                credential,
                authTypes,
                credentialGuid,
                enumAttributes,
                handleTest,
                handleNetworkTest,
                handleCredentialTest,
                isNetworkTestLoading,
                isNetworkTestSuccess,
                isNetworkTestError,
                networkAlertType,
                networkAlertMessage,
                networkErrorMessage,
                isCredTestLoading,
                isCredTestSuccess,
                isCredTestError,
                credAlertType,
                credAlertMessage,
                credErrorMessage,
                handleAuthTypeChange,
                form,
                getCredential,
                isCredIdTestLoading,
                isCredIdTestSuccess,
                isCredIdTestError,
                credIdAlertType,
                credIdAlertMessage,
                credIdErrorMessage,
                replaceCredID,
            }
        },
        data() {
            return {
                nameRules: [
                    {
                        required: true,
                        message: 'Name of the connection is mandatory',
                        trigger: 'blur',
                    },
                ],
            }
        },
        methods: {},
    })
</script>
