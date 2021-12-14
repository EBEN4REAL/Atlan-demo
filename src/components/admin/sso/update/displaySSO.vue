<template>
    <div class="mt-5 provider-wrapper">
        <div class="flex justify-between mb-5">
            <div class="flex flex-col">
                <span class="mb-1.5">Enable SSO</span>
                <div class="text-xs text-gray-500">
                    Allows user to login with SSO;
                </div>
                <div class="text-xs text-gray-500">
                    They can also login via email.
                </div>
            </div>
            <a-switch
                v-model:checked="ssoForm.enabled"
                :loading="enableSSOChanging"
                @change="handleChangeEnableSSO"
            />
        </div>
        <div class="flex justify-between mb-5">
            <div class="flex flex-col">
                <span class="mb-1.5">Enforce SSO</span>
                <div class="text-xs text-gray-500 w-52">
                    User will be automatically redirected to configured SSO
                </div>
            </div>
            <a-switch
                v-model:checked="ssoForm.enforceSSO"
                :loading="enforceSSOChanging"
                :disabled="!ssoForm.enabled"
                @change="handleChangeEnforceSSO"
            />
        </div>

        <a-modal
            :visible="showEnforceSSOWarningModal"
            :footer="null"
            :closable="false"
            :destroy-on-close="true"
        >
            <div class="p-5">
                <div class="mb-4 text-lg">Enforce SSO</div>
                <div class="mb-3 font-bold">
                    <span class="text-error"> Warning </span>
                    <span class="font-normal"> : </span>
                    <span
                        >You can lock all users including yourself out of your
                        account if not properly tested.</span
                    >
                </div>
                <div class="flex mb-2">
                    <a-checkbox v-model:checked="verifiedSSO" />
                    <div class="ml-2">
                        I have verfied the SSO connection by loggin in and out
                        successfully
                    </div>
                </div>
                <div class="flex">
                    <a-checkbox v-model:checked="providedNotice" />
                    <div class="ml-2">
                        I have provided advanced notice and training for my
                        company on new login procedures
                    </div>
                </div>
                <div class="flex justify-end mt-3">
                    <AtlanBtn
                        padding="compact"
                        size="sm"
                        class="mr-1 bg-transparent border-transparent text-gray"
                        @click="handleCancelEnforceSSO"
                    >
                        Cancel
                    </AtlanBtn>
                    <AtlanBtn
                        padding="compact"
                        size="sm"
                        color="primary"
                        class="font-bold"
                        :is-loading="enforceSSOChanging"
                        :disabled="!verifiedSSO || !providedNotice"
                        @click="handleEnforceSSO"
                    >
                        <span v-if="enforceSSOChanging">
                            {{
                                ssoForm.enforceSSO ? 'Enforcing' : 'Disabling'
                            }}</span
                        >
                        <span v-else>
                            {{
                                ssoForm.enforceSSO ? 'Enforce' : 'Disable'
                            }}</span
                        >
                    </AtlanBtn>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, reactive, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import { topSAMLProviders, customSamlProvider } from '~/constant/saml'
    import { Identity } from '~/services/service/identity'
    import AtlanBtn from '@/UI/button.vue'

    import { useTenantStore } from '~/store/tenant'
    import { Tenant } from '~/services/service/tenant'

    export default defineComponent({
        components: { AtlanBtn },
        setup() {
            const showDeleteModal = ref(false)
            const isDeleting = ref(false)
            const ssoForm = reactive({
                enabled: false,
                enforceSSO: false,
            })
            const defaultSSO = ref(false)
            const formLoading = ref(false)
            const tenantStore = useTenantStore()

            const idp: any = computed(
                () => tenantStore.identityProviders[0] || {}
            )
            const samlProvider = topSAMLProviders.find(
                (data) => data.alias === idp.value.alias
            )
            const provider: any = samlProvider || customSamlProvider
            const verifiedSSO = ref(false)
            const providedNotice = ref(false)
            const showEnforceSSOWarningModal = ref(false)
            const enforceSSOChanging = ref(false)
            const enableSSOChanging = ref(false)
            const defaultIDPList: any = ref({})
            const getDefaultIDPList = async () => {
                try {
                    const { mutate: getDefaultIDP } = Identity.getDefaultIDP()
                    defaultIDPList.value = await getDefaultIDP()
                    // defaultIDPList.value = { ...data }
                } catch (error) {
                    console.error(
                        'Unable to fetch default idps::',
                        error.message
                    )
                    defaultIDPList.value = {}
                }
            }
            const setConfig = async () => {
                if (!Object.keys(defaultIDPList.value).length)
                    await getDefaultIDPList()
                if (defaultIDPList.value?.alias === idp.value?.alias) {
                    defaultSSO.value = true
                    ssoForm.enforceSSO = true
                } else {
                    defaultSSO.value = false
                    ssoForm.enforceSSO = false
                }
                ssoForm.enabled = idp.value?.enabled
            }
            setConfig()
            const updateTenant = async () => {
                const tenantResponse: any = await Tenant.GetTenant()
                tenantStore.setTenant(tenantResponse)
            }
            const handleChangeEnableSSO = async () => {
                try {
                    enableSSOChanging.value = true
                    const config = {
                        ...idp.value,
                        enabled: ssoForm.enabled,
                    }
                    const { mutate: updateIDP } = Identity.updateIDP(
                        idp.value?.alias,
                        config
                    )
                    await updateIDP()
                    if (!ssoForm.enabled) {
                        const { mutate: deleteDefaultIDP } =
                            Identity.deleteDefaultIDP(idp.value?.alias)
                        await deleteDefaultIDP()
                    }

                    await updateTenant()
                    await getDefaultIDPList()
                    await setConfig()
                    enableSSOChanging.value = false
                    message.success({
                        content: `${
                            ssoForm.enabled ? 'SSO enabled' : 'SSO disabled'
                        }`,
                    })
                } catch (error) {
                    enableSSOChanging.value = false
                    message.error({
                        content: `Unable to ${
                            ssoForm.enabled ? 'enable' : 'disable'
                        } SSO`,
                    })
                }
            }

            const handleEnforceSSO = async () => {
                try {
                    enforceSSOChanging.value = true
                    if (ssoForm.enforceSSO) {
                        const { mutate: setDefaultIDP } =
                            Identity.setDefaultIDP(idp.value?.alias)
                        await setDefaultIDP()
                    } else {
                        const { mutate: deleteDefaultIDP } =
                            Identity.deleteDefaultIDP(idp.value?.alias)
                        await deleteDefaultIDP()
                    }
                    await updateTenant()
                    await getDefaultIDPList()
                    await setConfig()
                    showEnforceSSOWarningModal.value = false
                    enforceSSOChanging.value = false
                    message.success({
                        content: `${
                            ssoForm.enforceSSO
                                ? 'Configured SSO as default mode'
                                : 'Disabled SSO as default mode'
                        }`,
                    })
                } catch (error) {
                    enforceSSOChanging.value = false
                    showEnforceSSOWarningModal.value = false
                    message.error(
                        `Unable to ${
                            ssoForm.enforceSSO ? 'enable' : 'disable'
                        } enforce SSO`
                    )
                } finally {
                    providedNotice.value = false
                    verifiedSSO.value = false
                }
            }
            const handleChangeEnforceSSO = () => {
                if (ssoForm.enforceSSO === true)
                    showEnforceSSOWarningModal.value = true
                else handleEnforceSSO()
            }
            const showDeleteSSOModal = () => {
                showDeleteModal.value = !showDeleteModal.value
            }
            const handleCancelEnforceSSO = () => {
                showEnforceSSOWarningModal.value = false
                ssoForm.enforceSSO = false
            }
            return {
                provider,
                showDeleteModal,
                ssoForm,
                showDeleteSSOModal,
                formLoading,
                isDeleting,
                handleChangeEnableSSO,
                handleChangeEnforceSSO,
                handleEnforceSSO,
                verifiedSSO,
                providedNotice,
                showEnforceSSOWarningModal,
                idp,
                enforceSSOChanging,
                enableSSOChanging,
                handleCancelEnforceSSO,
            }
        },
    })
</script>
<style lang="less" scoped>
    .provider-wrapper {
        max-width: 38rem;
    }
</style>
