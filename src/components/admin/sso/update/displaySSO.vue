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
                :disabled="!ssoForm.enabled"
                @change="handleChangeEnforceSSO"
            />
        </div>

        <a-modal
            :visible="showEnforceSSOWarningModal"
            :footer="null"
            :closable="false"
        >
            <div class="mb-4 text-lg">Required for enforcing SSO</div>
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
                    I have provided advanced notice and training for my company
                    on new login procedures
                </div>
            </div>
            <div class="flex justify-end mt-3">
                <AtlanBtn
                    padding="compact"
                    size="sm"
                    class="mr-1 bg-transparent border-transparent text-gray"
                    @click="showEnforceSSOWarningModal = false"
                >
                    Cancel
                </AtlanBtn>
                <AtlanBtn
                    padding="compact"
                    size="sm"
                    color="primary"
                    class="font-bold"
                    :is-loading="enforceSSOChanging"
                    :disabled="verifiedSSO && providedNotice"
                    @click="handleEnforceSSO"
                >
                    <span v-if="enforceSSOChanging">
                        {{
                            ssoForm.enforceSSO ? 'Enabling' : 'Disabling'
                        }}</span
                    >
                    <span v-else>
                        {{ ssoForm.enforceSSO ? 'Enable' : 'Disable' }}</span
                    >
                </AtlanBtn>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { topSAMLProviders, customSamlProvider } from '~/constant/saml'
import { IdentityProvider } from '~/api/auth/identityProvider'
import AtlanBtn from '@/UI/button.vue'

import { useTenantStore } from '~/services/keycloak/tenant/store'
import { Tenant } from '~/api/auth/tenant'

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
        const tenantData: any = computed(() => tenantStore.getTenant)
        const idp: any = computed(
            () => tenantData?.value?.identityProviders[0] || {}
        )
        const samlProvider = topSAMLProviders.find(
            (data) => data.alias === idp.value.alias
        )
        const provider: any = samlProvider || customSamlProvider
        const verifiedSSO = ref(true)
        const providedNotice = ref(true)
        const showEnforceSSOWarningModal = ref(false)
        const enforceSSOChanging = ref(false)
        const defaultIDPList: any = ref({})
        const getDefaultIDPList = async () => {
            try {
                const data = (await IdentityProvider.getDefaultIDP()) || {}
                defaultIDPList.value = { ...data }
            } catch (error) {
                console.error('Unable to fetch default idps::', error.message)
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
            const tenantResponse: any = await Tenant.Get()
            tenantStore.setData(tenantResponse)
        }
        const handleChangeEnableSSO = async () => {
            try {
                const config = {
                    ...idp.value,
                    enabled: ssoForm.enabled,
                }
                await IdentityProvider.updateIDP(idp.value?.alias, config)
                if (!ssoForm.enabled)
                    await IdentityProvider.deleteDefaultIDP(idp.value?.alias)
                await updateTenant()
                await getDefaultIDPList()
                await setConfig()
                message.success({
                    content: `${
                        ssoForm.enabled ? 'SSO enabled' : 'SSO disabled'
                    }`,
                })
            } catch (error) {
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
                    await IdentityProvider.setDefaultIDP(idp.value?.alias)
                } else {
                    await IdentityProvider.deleteDefaultIDP(idp.value?.alias)
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
            }
        }
        const handleChangeEnforceSSO = () => {
            showEnforceSSOWarningModal.value = true
        }
        const showDeleteSSOModal = () => {
            showDeleteModal.value = !showDeleteModal.value
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
        }
    },
})
</script>
<style lang="less" scoped>
.provider-wrapper {
    max-width: 38rem;
}
</style>