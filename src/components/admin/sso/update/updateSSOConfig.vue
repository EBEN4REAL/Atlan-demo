<template>
    <div v-if="Object.keys(ssoProvider).length">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center text-2xl">
                <img
                    v-if="!provider.isCustomSaml"
                    :src="provider.image"
                    alt="provider"
                    class="w-6 mr-2"
                />
                <fa
                    v-else
                    icon="fas key"
                    class="p-1 mr-2 text-3xl bg-yellow-400 rounded"
                />
                <span>{{ provider.title || 'SAML 2.0' }}</span>
            </div>
            <a-button type="link" @click="showConfigScreen">
                <fa icon="fal times" class="text-xl text-gray-600"></fa>
            </a-button>
        </div>
        <a-divider />
        <div class="my-4">
            <div>
                <a-form
                    ref="form"
                    label-align="left"
                    :label-col="{ span: 10 }"
                    :wrapper-col="{ span: 12, offset: 2 }"
                    :model="ssoForm"
                    :colon="false"
                >
                    <div class="metadata-container">
                        <span
                            class="block mb-4 text-lg font-medium text-gray-600"
                        >
                            Service provider metadata
                        </span>
                        <a-form-item label="Atlan SAML Assertion URL:">
                            <a-input
                                :default-value="
                                    getSamlAssertionUrl(ssoForm.alias)
                                        .redirectUrl
                                "
                                class="metadata-input"
                                disabled
                            >
                                <template #addonAfter>
                                    <span
                                        class="flex items-center justify-between  copyBtn"
                                        @click="
                                            copyText(
                                                getSamlAssertionUrl(
                                                    ssoForm.alias
                                                ).redirectUrl
                                            )
                                        "
                                    >
                                        <!-- <a-icon class="mr-1" type="copy" /> -->
                                        Copy
                                    </span>
                                </template>
                            </a-input>
                        </a-form-item>

                        <a-form-item label="Atlan Audience URL (SP Entity ID):">
                            <a-input
                                :default-value="
                                    getSamlAssertionUrl(ssoForm.alias)
                                        .audienceUrl
                                "
                                class="metadata-input"
                                disabled
                            >
                                <template #addonAfter>
                                    <span
                                        class="flex items-center justify-between  copyBtn"
                                        @click="
                                            copyText(
                                                getSamlAssertionUrl(
                                                    ssoForm.alias
                                                ).audienceUrl
                                            )
                                        "
                                    >
                                        <!-- <a-icon class="mr-1" type="copy" /> -->
                                        Copy
                                    </span>
                                </template>
                            </a-input>
                        </a-form-item>

                        <a-form-item label="Atlan SSO SAML Metadata:">
                            <a-button
                                class="block px-0 mr-auto"
                                type="link"
                                @click="downloadMetadataFile"
                            >
                                <div class="flex flex-row items-center">
                                    <span class="mr-1">Download Metadata</span>
                                    <fa
                                        icon="fal arrow-down"
                                        class="text-sm"
                                    ></fa>
                                </div>
                            </a-button>
                        </a-form-item>
                    </div>
                    <div class="flex items-center justify-between mt-8">
                        <span class="text-lg font-medium text-gray-600"
                            >Identity provider metadata</span
                        >
                        <ImportMetadataFromXML @setSSODetails="setSSODetails" />
                    </div>
                    <a-divider class="my-4 mb-8" />
                    <a-form-item>
                        <template #label>
                            <span class="flex flex-col h-48">
                                <strong class="mb-2 text-gray-600">
                                    SAML SSO URL:
                                </strong>
                                <span class="mb-2 leading-3 text-gray"
                                    >Enter your SAML 2.0 Endpoint.</span
                                >
                                <span class="leading-3 text-gray"
                                    >This is where users will be redirected to
                                    login.</span
                                >
                            </span>
                        </template>
                        <a-input
                            v-model:value="ssoForm.singleSignOnServiceUrl"
                        />
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            <span class="flex flex-col h-48">
                                <strong class="mb-2 text-gray-600">
                                    Public Certificate:
                                </strong>
                                <span class="leading-3 text-gray"
                                    >x.509 Certificate</span
                                >
                                <span class="leading-3"
                                    >Paste or
                                    <ImportText
                                        @importCertificate="importCertificate"
                                    />
                                </span>
                            </span>
                        </template>
                        <a-textarea
                            v-model:value="ssoForm.signingCertificate"
                            :rows="4"
                        />
                    </a-form-item>
                    <div class="flex justify-end mt-10">
                        <div>
                            <a-button class="mx-5" @click="showConfigScreen">
                                Cancel
                            </a-button>
                        </div>
                        <div>
                            <a-button
                                class="px-6"
                                type="primary"
                                :loading="isLoading"
                                @click="updateSSO"
                            >
                                Update
                            </a-button>
                        </div>
                    </div>
                </a-form>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="w-full p-4 text-center h-96">
            <img
                :src="emptySSOImage"
                class="h-48 p-2 mx-auto"
                alt="Empty Image"
            />
            <strong class="block py-8 text-lg"
                >Oops! SSO provider doesn't exist.</strong
            >
            <router-link to="/admin/sso">
                <a-button style="width: 150px" type="primary">
                    Go Back
                </a-button>
            </router-link>
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
    import useTenantData from '~/services2/service/composable/useTenantData'
    import useTenant from '~/services2/service/composable/useTenant'

    interface FormState {
        alias: string
        singleSignOnServiceUrl: string
        signingCertificate: string
    }

    export default defineComponent({
        components: { ImportMetadataFromXML, ImportText },
        props: ['alias'],
        setup(props, context) {
            const { identityProviders } = useTenantData()
            const router = useRouter()

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
                useTenant()
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
</style>
