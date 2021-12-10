<template>
    <DefaultLayout>
        <template #header>
            <div class="flex items-center pb-3 -mt-3 text-2xl text-gray">
                <span>Single Sign on</span>
            </div>
        </template>
        <div v-if="Object.keys(ssoProvider).length">
            <div class="flex items-center justify-between mb-5">
                <div class="flex items-center text-lg">
                    <img
                        v-if="!provider.isCustomSaml"
                        :src="provider.image"
                        alt="provider"
                        class="w-4 mr-2"
                    />
                    <fa
                        v-else
                        icon="fas key"
                        class="p-1 mr-2 text-3xl bg-yellow-400 rounded"
                    />
                    <span>{{ provider.title || 'SAML 2.0' }}</span>
                </div>
                <AtlanBtn
                    padding="compact"
                    color="secondary"
                    size="sm"
                    class="shadow-sm"
                    @click="showDeleteSSOModal"
                >
                    <span class="text-error">Delete configuration</span>
                </AtlanBtn>
            </div>
            <div class="sso-tabs">
                <MinimalTab
                    v-model:active="activeTabKey"
                    :data="tabConfig"
             
                />
            </div>
           
            <keep-alive>
                <UpdateSSOConfig
                    v-if="activeTabKey === 'configure'"
                    :alias="alias"
                />
                <div v-else-if="activeTabKey === 'overview'">
                    <DisplaySSO
                        :provider-details="identityProviders[0] || {}"
                    />
                </div>
            </keep-alive>
        </div>
        <!-- <div v-else>
            <div
                class="flex flex-col items-center justify-center w-full p-4 text-center h-96"
            >
                <img
                    :src="emptySSOImage"
                    class="h-48 p-2 mx-auto"
                    alt="Empty Image"
                />
                <div class="block py-8 text-lg">
                    Oops! SSO provider doesn't exist.
                </div>
                <router-link to="/admin/sso">
                    <AtlanBtn padding="compact" type="primary" size="sm">
                        <span class="font-bold">Go Back</span>
                    </AtlanBtn>
                </router-link>
            </div>
        </div> -->
        <a-modal
            :visible="showDeleteModal"
            :footer="null"
            @cancel="showDeleteSSOModal"
        >
            <div class="p-4">
                <div class="mb-3 text-base">Delete SSO Provider</div>
                Are you sure you want to remove
                <strong>{{ provider.title }}</strong
                >?
                <div class="flex justify-end mt-2">
                    <div>
                        <AtlanBtn
                            padding="compact"
                            size="sm"
                            class="mx-2 bg-transparent border-transparent shadow-none text-gray"
                            @click="showDeleteSSOModal"
                        >
                            Cancel
                        </AtlanBtn>
                    </div>
                    <div>
                        <AtlanBtn
                            padding="compact"
                            size="sm"
                            class="font-bold bg-error border-error"
                            :is-loading="isDeleting"
                            @click="deleteSSO"
                            ><span v-if="isDeleting">Deleting</span>
                            <span v-else>Delete</span></AtlanBtn
                        >
                        <!-- <a-button
                        type="danger"
                        :loading="isDeleting"
                        @click="deleteSSO"
                    >
                        Delete
                    </a-button> -->
                    </div>
                </div>
            </div>
        </a-modal>
    </DefaultLayout>
</template>
<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
    import { message } from 'ant-design-vue'
    import UpdateSSOConfig from '~/components/admin/sso/update/updateSSOConfig.vue'
    import { useTenantStore } from '~/store/tenant'
    import { topSAMLProviders, customSamlProvider } from '~/constant/saml'
    import MinimalTab from '@/UI/minimalTab.vue'
    import emptySSOImage from '~/assets/images/emptyCreds.png'
    import DisplaySSO from '@/admin/sso/update/displaySSO.vue'
    import DefaultLayout from '@/admin/layout.vue'
    import { Identity } from '~/services/service/identity'
    import AtlanBtn from '@/UI/button.vue'
    import { Tenant } from '~/services/service/tenant'

    export default defineComponent({
        components: {
            UpdateSSOConfig,
            MinimalTab,
            DisplaySSO,
            DefaultLayout,
            AtlanBtn,
        },
        setup() {
            const route = useRoute()
            const router = useRouter()
            const alias = computed(() => route?.params?.alias || '')
            const tenantStore = useTenantStore()
            const { identityProviders } = storeToRefs(tenantStore)
            // const identityProviders: Array<any> =
            //     tenantStore.identityProviders || []
            const ssoProvider: any = computed(
                () =>
                    identityProviders.value.find(
                        (idp) => idp?.alias === alias.value
                    ) || {}
            )
            const samlProvider = topSAMLProviders.find(
                (data) => data.alias === alias.value
            )
            const provider: any = samlProvider || customSamlProvider
            const tabConfig = computed(() => [
                {
                    label: 'Overview',
                    key: 'overview',
                },
                {
                    label: 'Configure',
                    key: 'configure',
                },
            ])
            const activeTabKey = ref('overview')
            const updateTenant = async () => {
                const tenantResponse: any = await Tenant.GetTenant()
                tenantStore.setTenant(tenantResponse)
            }
            const showDeleteModal = ref(false)
            const isDeleting = ref(false)
            const defaultSSO = ref(false)
            const showDeleteSSOModal = () => {
                showDeleteModal.value = !showDeleteModal.value
            }
            const deleteSSO = async () => {
                try {
                    isDeleting.value = true
                    const { mutate: deleteIDP } = Identity.deleteIDP(
                        alias.value as string
                    )
                    await deleteIDP()
                    if (defaultSSO.value) {
                        const { mutate: deleteDefaultIDP } =
                            Identity.deleteDefaultIDP(alias.value as string)
                        await deleteDefaultIDP()
                    }
                    message.success({
                        content: 'Provider removed.',
                    })
                    await updateTenant()
                    showDeleteSSOModal()
                    isDeleting.value = false
                    router.push(`/admin/sso`)
                } catch (error) {
                    message.error({
                        content: 'Failed to remove.',
                    })
                }
            }

            return {
                alias,
                ssoProvider,
                provider,
                tabConfig,
                activeTabKey,
                emptySSOImage,
                identityProviders,
                showDeleteSSOModal,
                deleteSSO,
                showDeleteModal,
                samlProvider,
                isDeleting,
            }
        },
    })
</script>
<style lang="less">
.sso-tabs {
     .minimal-tab-bar{
        .ant-tabs-tab:first-child {
            margin-left: 0 !important;
        }
        }
}
</style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
