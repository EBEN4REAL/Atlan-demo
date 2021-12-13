/* eslint-disable import/prefer-default-export */
import { computed, watch, ref } from 'vue'

import { Tenant } from '~/services/service/tenant'
import useTenantData from '~/composables/tenant/useTenantData'

export function useSmtp() {
    const { smtpServer, updateSMTPConfig } = useTenantData()

    const formRef = ref()
    const userFieldRef = ref()
    const rules = {
        host: [
            {
                required: true,
                message: 'Host is required',
                trigger: 'blur',
            },
        ],
        from: [
            {
                required: true,
                message: 'From email address is required.',
                trigger: 'blur',
            },
            {
                type: 'email',
                message: 'Please enter a valid email address',
                trigger: 'blur',
            },
        ],
        replyTo: [
            {
                type: 'email',
                message: 'Please enter a valid email address',
                trigger: 'blur',
            },
        ],
    }

    const smtpConfig = [
        {
            id: 'host',
            type: 'text',
            label: 'Host',
            required: true,
        },
        {
            id: 'port',
            type: 'text',
            label: 'Port',
            placeholder: 'Defaults to 25',
        },
        {
            id: 'fromDisplayName',
            type: 'text',
            label: 'From Display Name',
        },
        {
            id: 'from',
            label: 'From Email',
            required: true,
        },
        {
            id: 'replyToDisplayName',
            type: 'text',
            label: 'Reply To Display Name ',
        },
        {
            id: 'replyTo',
            label: 'Reply To',
        },
        {
            id: 'ssl',
            type: 'switch',
            label: 'Enable SSL',
        },
        {
            id: 'starttls',
            type: 'switch',
            label: 'Enable Start TLS',
        },
        {
            id: 'auth',
            type: 'switch',
            label: 'Enable Authentication',
        },
    ]
    const testSmtpConfigState = ref('')
    const testSmtpConfigError = ref('')
    const saveSmtpConfigState = ref('')
    const saveSmtpConfigError = ref('')
    const passwordReentered = ref(false)

    const timerMessage = (
        ref: any,
        value: string = '',
        milliseconds: number = 4000
    ) => {
        setTimeout(() => {
            ref.value = value
        }, milliseconds)
    }

    const finalTestSmtpConfigError = computed(() =>
        testSmtpConfigError.value && testSmtpConfigError.value.length < 40
            ? testSmtpConfigError.value
            : 'SMTP config are incorrect'
    )

    const updateSmtpProperty = (key: string, value: string) => {
        if (key === 'password') passwordReentered.value = true

        const payload = {
            ...smtpServer.value,
            [key]: value,
        }
        updateSMTPConfig(payload)
    }

    const testSmtpConfig = () => {
        // if (passwordReentered.value) {
        //     testSmtpConfigState.value = 'INVALID'
        //     testSmtpConfigError.value = 'Please re-enter password to test'
        //     timerMessage(testSmtpConfigState)
        //     timerMessage(testSmtpConfigError)

        //     return
        // }
        const testErrorMessage = ref('')
        testErrorMessage.value = ''

        const params = computed(() => ({
            host: smtpServer.value.host,
            port: parseInt(smtpServer.value.port, 10),
            username: smtpServer.value.user,
            password: smtpServer.value.password,
            sslEnabled: smtpServer.value.ssl === 'true',
            tlsEnabled: smtpServer.value.startTls === 'true',
        }))

        const { data, isLoading, error, isReady, mutate } =
            Tenant.TestSmtpConfig(params, { asyncOptions: { immediate: false } })



        watch([error, isLoading], (e) => {
            if (isLoading.value)
                testErrorMessage.value = ''
            if (error?.value) {
                const errorMessage = e.response?.data?.message
                testErrorMessage.value = errorMessage
            }
        })

        return {
            isLoading, error, isReady, mutate, data, testErrorMessage
        }
    }

    const triggerBlur = (refName: any) => {
        refName.value.onFieldBlur()
    }

    const saveSmtpConfig = async () => {
        formRef.value
            .validate()
            .then(() => {
                saveSmtpConfigState.value = 'SAVING'
                const {
                    data: saveSmtpConfigReqData,
                    error: saveSmtpConfigReqError,
                    isLoading,
                } = Tenant.UpdateSmtpConfig({ smtpServer: smtpServer.value })
                watch([isLoading], () => {
                    if (!saveSmtpConfigReqError.value) {
                        saveSmtpConfigState.value = 'SUCCESS'
                        timerMessage(saveSmtpConfigState)
                    } else {
                        const errorMessage = ''
                        saveSmtpConfigState.value = 'ERROR'
                        saveSmtpConfigError.value = `${errorMessage}`
                        timerMessage(saveSmtpConfigState)
                    }
                })
            })
            .catch((error: any) => {
                saveSmtpConfigState.value = 'ERROR'
                timerMessage(saveSmtpConfigState)
            })
    }

    return {
        formRef,
        rules,
        userFieldRef,
        smtpConfig,
        testSmtpConfigState,
        testSmtpConfigError,
        saveSmtpConfigState,
        saveSmtpConfigError,
        passwordReentered,
        updateSmtpProperty,
        testSmtpConfig,
        saveSmtpConfig,
        smtpServer,
        finalTestSmtpConfigError,
        triggerBlur,
    }
}
