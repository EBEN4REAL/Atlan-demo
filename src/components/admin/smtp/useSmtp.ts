import { computed, watch, ref, Ref } from 'vue'
import { smtp_form, default_model } from '~/constant/smtp'

import { Tenant } from '~/services/service/tenant'
import useTenantData from '~/composables/tenant/useTenantData'
import { isString } from '~/utils/checkType'

interface SmtpFormModel {
    "auth": boolean,
    "from": string,
    "fromDisplayName": string
    "host": string,
    "password": string,
    "port": number,
    "replyTo": string,
    "replyToDisplayName": string,
    "ssl": boolean,
    "starttls": boolean,
    "user": string
}

export function useSmtp() {
    const { smtpServer, tenantRaw, setSMTPConfig } = useTenantData()

    const formRef = ref()
    const userFieldRef = ref()
    const password = ref("")


    const parseSmtpServer = (c) => {
        const config = { ...default_model, ...c }
        Object.keys(config).forEach(k => {
            const type = smtp_form.find(f => f.id === k)?.type
            if (type && ['integer', 'switch', 'number'].includes(type) && isString(config[k]))
                config[k] = JSON.parse(config[k])

        })
        return config
    }
    const smtpFormModal = ref<SmtpFormModel>(
        { ...parseSmtpServer(smtpServer.value) }
    )

    const testSmtpConfig = () => {
        const testErrorMessage = ref('')
        testErrorMessage.value = ''

        const { data, isLoading, error, isReady, mutate } =
            Tenant.TestSmtpConfig(smtpFormModal, { asyncOptions: { immediate: false } })



        watch([error, isLoading], (e) => {
            if (isLoading.value)
                testErrorMessage.value = ''
            if (error?.value) {
                const errorMessage = error?.value.response?.data?.message
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

    const objtoString = (o) => {
        const config = { ...o }
        Object.keys(config).forEach(k => {
            config[k] = config[k]?.toString() ?? ''
        })
        return config
    }
    const body = computed(() => ({
        ...tenantRaw.value,
        smtpServer: objtoString(smtpFormModal.value)
    }))

    const { data, isLoading, error, isReady, mutate } = Tenant.UpdateTenant(body, { asyncOptions: { immediate: false } })
    const errorMessage = ref('')

    const saveSmtpConfig = async () => {
        formRef.value
            .validate()
            .then(async () => {
                await mutate()
                watch([error, data], () => {
                    if (data.value)
                        errorMessage.value = ''
                    setSMTPConfig(objtoString(smtpFormModal.value))
                    if (error?.value) {
                        const msg = error?.value.response?.data?.message
                        errorMessage.value = msg
                    }
                })
            })
    }

    const setPassword = () => {
        // if password previously saved then  == ********** else == ""
        smtpFormModal.value.password = password.value || "**********"
    }

    return {
        setPassword,
        data, isLoading, error, isReady,
        smtpFormModal,
        formRef,
        tenantRaw,
        userFieldRef,
        testSmtpConfig,
        saveSmtpConfig,
        smtpServer,
        errorMessage,
        triggerBlur,
        password
    }
}
