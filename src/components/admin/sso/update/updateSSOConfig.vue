<template>
    <div class="mx-auto text-gray-600 bg-white rounded">
        <div class="mt-5 provider-wrapper">
            <div>
                <div class="mb-16">
                    <div class="mb-6 font-bold text-gray-700">
                        Service provider metadata
                    </div>
                    <div class="mb-4">
                        <div class="mb-2.5">Atlan SAML Assertion URL</div>
                        <div class="flex justify-between mb-2 text-gray-500">
                            <div class="mr-3 break-all">
                                {{
                                    getSamlAssertionUrl(ssoForm.alias)
                                        .redirectUrl
                                }}
                            </div>
                            <div
                                class="flex items-center cursor-pointer  text-primary"
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="mb-0.5"
                                    @click="
                                        copyText(
                                            getSamlAssertionUrl(ssoForm.alias)
                                                .redirectUrl
                                        )
                                    "
                                ></AtlanIcon>
                                <div class="ml-1">Copy</div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="mb-2.5">
                            Atlan Audience URL (SP Entity ID)
                        </div>
                        <div class="flex justify-between mb-2 text-gray-500">
                            <div class="mr-3 break-all">
                                {{
                                    getSamlAssertionUrl(ssoForm.alias)
                                        .audienceUrl
                                }}
                            </div>
                            <div
                                class="flex items-center cursor-pointer  text-primary"
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="mb-0.5"
                                    @click="
                                        copyText(
                                            getSamlAssertionUrl(ssoForm.alias)
                                                .audienceUrl
                                        )
                                    "
                                ></AtlanIcon>
                                <div class="ml-1">Copy</div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="mb-2.5">Atlan SSO metadata</div>
                        <div>
                            <AtlanBtn
                                color="secondary"
                                padding="compact"
                                size="sm"
                                class="shadow-sm"
                                @click="downloadMetadataFile"
                            >
                                <div class="flex flex-row items-center">
                                    <fa
                                        icon="fal arrow-down"
                                        class="text-sm"
                                    ></fa>
                                    <span class="ml-1"
                                        >Download metadata file</span
                                    >
                                </div>
                            </AtlanBtn>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between mb-6">
                    <div class="font-bold text-gray-700">
                        Identity provider metadata
                    </div>
                    <ImportMetadataFromXML @setSSODetails="setSSODetails" />
                </div>

                <a-form
                    ref="form"
                    label-align="left"
                    :model="ssoForm"
                    :colon="false"
                    layout="vertical"
                >
                    <a-form-item>
                        <template #label>
                            <div class="">
                                <div class="mb-2">SAML SSO URL</div>
                            </div>
                        </template>
                        <a-input
                            v-model:value="ssoForm.singleSignOnServiceUrl"
                        />
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            <span>
                                <div class="mb-2">Path Certificate</div>
                            </span>
                        </template>
                        <a-textarea
                            v-model:value="ssoForm.signingCertificate"
                            :rows="4"
                        />
                        <span class="text-gray-500"
                            >Paste x.509 Certificate here or
                            <ImportText
                                @importCertificate="importCertificate"
                            />
                        </span>
                    </a-form-item>
                    <div class="flex justify-end mt-3">
                        <div>
                            <AtlanBtn
                                type="primary"
                                :is-loading="isLoading"
                                padding="compact"
                                size="sm"
                                class="px-5"
                                @click="updateSSO"
                            >
                                <span v-if="isLoading" class="font-bold"
                                    >Updating</span
                                >
                                <span v-else class="font-bold">Update</span>
                            </AtlanBtn>
                        </div>
                    </div>
                </a-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        reactive,
        UnwrapRef,
        computed,
        onMounted,
        toRaw,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { useRouter } from 'vue-router'
    import emptySSOImage from '~/assets/images/emptyCreds.png'
    import ImportMetadataFromXML from '../common/importMetadataFromXML.vue'
    import ImportText from '../common/importText.vue'
    import { useTenantStore } from '~/services/keycloak/tenant/store'
    import AtlanBtn from '@/UI/button.vue'

    import {
        topSAMLProviders,
        customSamlProvider,
        downloadMetadata,
    } from '~/constant/saml'
    import { getEnv } from '~/modules/__env'
    import { copyToClipboard } from '~/utils/clipboard'
    // @ts-ignore
    import { downloadFile } from '~/utils/library/download'

    import { IdentityProvider } from '~/api/auth/identityProvider'
    import { Tenant } from '~/api/auth/tenant'

    interface FormState {
        alias: string
        singleSignOnServiceUrl: string
        signingCertificate: string
    }

    export default defineComponent({
        components: { ImportMetadataFromXML, ImportText, AtlanBtn },
        props: ['alias'],
        setup(props, context) {
            console.log(context, 'context')
            const tenantStore = useTenantStore()
            const router = useRouter()
            const tenantData: any = computed(() => tenantStore.getTenant)
            const identityProviders: Array<any> =
                tenantData?.value?.identityProviders || []
            const ssoProvider: any = computed(() => {
                const ssoProviders = identityProviders.filter((idp) => {
                    if (idp?.alias === props.alias) return idp
                })
                return ssoProviders[0] || {}
            })

            const ssoForm: UnwrapRef<FormState> = reactive({
                alias: props.alias,
                singleSignOnServiceUrl: '',
                signingCertificate: '',
            })
            const isLoading = ref(false)

            const samlProvider = topSAMLProviders.find(
                (data) => data.alias === props.alias
            )
            const provider: any = samlProvider || customSamlProvider

            const getSamlAssertionUrl = (alias: string) => {
                const baseUrl = `${window.location.protocol}//${window.location.host}/auth`
                const redirectUrl = `${baseUrl}/realms/${
                    getEnv().DEFAULT_REALM
                }/broker/${alias}/endpoint`
                const audienceUrl = `${baseUrl}/realms/${
                    getEnv().DEFAULT_REALM
                }`
                return {
                    redirectUrl,
                    audienceUrl,
                }
            }

            const importCertificate = (text: string) => {
                ssoForm.signingCertificate = text
            }

            const setSSODetails = (metadata: {
                signingCertificate: string
                singleSignOnServiceUrl: string
            }) => {
                console.log('value recieved from xml=>', metadata)
                ssoForm.signingCertificate = metadata?.signingCertificate
                ssoForm.singleSignOnServiceUrl =
                    metadata?.singleSignOnServiceUrl
            }

            const updateSSO = async () => {
                try {
                    isLoading.value = true
                    const data: any = toRaw(ssoProvider.value)
                    const config = {
                        ...data,
                        config: {
                            ...data.config,
                            signingCertificate: ssoForm.signingCertificate,
                            singleSignOnServiceUrl:
                                ssoForm.singleSignOnServiceUrl,
                        },
                    }
                    console.log(config)
                    await IdentityProvider.updateIDP(props.alias, config)
                    isLoading.value = false
                    await updateTenant()
                    message.success({
                        content: 'Details Updated',
                    })
                    showConfigScreen()
                } catch (error) {
                    message.error({
                        content: 'Update failed',
                    })
                    isLoading.value = false
                }
            }

            const copyText = (url: string) => {
                copyToClipboard(url)
                message.success('URL copied')
            }

            const showConfigScreen = () => {
                console.log('back')
                router.push('/admin/sso')
            }

            const downloadMetadataFile = () => {
                const metaData: any = downloadMetadata
                const templateMetadata = metaData.template
                    .replace(
                        /{{redirectUrl}}/g,
                        getSamlAssertionUrl(ssoForm.alias).redirectUrl
                    )
                    .replace(
                        /{{audienceUrl}}/g,
                        getSamlAssertionUrl(ssoForm.alias).audienceUrl
                    )
                const data = templateMetadata.trim()
                const filename = 'AtlanSPMetadata.xml'
                const type = 'text/xml'
                downloadFile(data, filename, type)
            }

            const updateTenant = async () => {
                const tenantResponse: any = await Tenant.Get()
                tenantStore.setData(tenantResponse)
            }

            onMounted(() => {
                const data: any = toRaw(ssoProvider.value)
                ssoForm.singleSignOnServiceUrl =
                    data?.config?.singleSignOnServiceUrl
                ssoForm.signingCertificate = data?.config?.signingCertificate
            })

            return {
                ssoForm,
                labelCol: { span: 4 },
                wrapperCol: { span: 14, offset: 4 },
                getSamlAssertionUrl,
                copyText,
                importCertificate,
                setSSODetails,
                isLoading,
                provider,
                showConfigScreen,
                ssoProvider,
                updateSSO,
                emptySSOImage,
                downloadMetadataFile,
            }
        },
    })
</script>
<style lang="less" scoped>
    .copyBtn {
        pointer-events: all !important;
        cursor: pointer;
    }

    .metadata-container {
        background-color: #f5f5f5;
        padding: 1.25rem 1rem 0.1rem 1rem;
        border-radius: 4px;
        margin-top: 1.5rem;
    }
    .metadata-input .ant-input-disabled {
        background-color: white;
    }
    .provider-wrapper {
        max-width: 38rem;
    }
</style>
