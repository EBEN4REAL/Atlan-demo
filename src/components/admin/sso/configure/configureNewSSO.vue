<template>
    <DefaultLayout>
        <template #header>
            <div class="flex items-center -mt-3 text-2xl text-gray">
                <a-button
                    class="px-0.5 border-transparent shadow-none hover:border-gray-300 hover:px-1 py-0.5"
                    @click="$router.back()"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-5 h-5 text-gray-500 transform rotate-180"
                    />
                </a-button>

                <div class="flex items-center justify-between">
                    <div class="flex items-center text-lg">
                        <img
                            v-if="!provider.isCustomSaml"
                            :src="provider.image"
                            alt="provider"
                            class="w-4 mr-2"
                        />
                        <AtlanIcon
                            v-else
                            icon="PrimaryKey"
                            class="self-center h-6 mr-1 text-alert"
                        />
                        <span>{{ provider.title || 'SAML 2.0' }}</span>
                    </div>
                </div>
            </div>
        </template>
        <div class="px-5 mx-auto text-gray-600 bg-white rounded">
            <div class="provider-wrapper">
                <!-- Alias input for custom SSO -->
                <div v-if="!isAliasPresent">
                    <a-form
                        :model="ssoForm"
                        label-align="left"
                        layout="vertical"
                    >
                        <a-form-item label="Alias" class="font-bold">
                            <a-input
                                v-model:value="ssoForm.alias"
                                placeholder="Enter Alias here"
                                class="mt-1"
                            />
                        </a-form-item>
                    </a-form>
                    <div class="flex items-center justify-end gap-x-3">
                        <AtlanButton2
                            label="Cancel"
                            color="secondary"
                            bold
                            @click="showSSOScreen"
                        />
                        <AtlanButton2 label="Next" bold @click="changeAlias" />
                    </div>
                </div>
                <div v-else>
                    <div class="p-4 bg-gray-100 rounded">
                        <div class="mb-6 font-bold text-gray-700">
                            Service provider metadata
                        </div>
                        <div
                            v-for="(
                                meta, index
                            ) in provider.serviceProviderMetadata"
                            :key="index"
                            class="mb-4"
                        >
                            <div class="mb-2.5">{{ meta.label }}</div>
                            <div
                                v-for="(urlSuffix, idx) in meta.suffix"
                                :key="idx"
                                class="flex justify-between mb-2 text-gray-500"
                            >
                                <div class="mr-3 break-all">
                                    {{ getEnrichedUrl(urlSuffix) }}
                                </div>
                                <div
                                    class="flex items-center cursor-pointer text-primary"
                                    @click="copyText(getEnrichedUrl(urlSuffix))"
                                >
                                    <AtlanIcon
                                        icon="CopyOutlined"
                                        class="mb-0.5"
                                    ></AtlanIcon>
                                    <div class="ml-1">Copy</div>
                                </div>
                            </div>
                        </div>
                        <div class="" v-if="!provider.hideDownloadMetadataButton">
                            <div class="mb-2.5">Atlan SSO metadata</div>
                            <div>
                                <AtlanButton2
                                    color="secondary"
                                    prefix-icon="Download"
                                    label="Download metadata file"
                                    @click="downloadMetadataFile"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mt-9">
                            <div class="mb-6 font-bold text-gray-700">
                                Identity provider metadata
                            </div>
                            <ImportMetadataFromXML
                                @setSSODetails="setSSODetails"
                            />
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
                                        <!-- <span class="mb-2 leading-3 text-gray"
                                        >Enter your SAML 2.0 Endpoint.</span
                                    >
                                    <span class="leading-3 text-gray"
                                        >This is where users will be redirected
                                        to login.</span
                                    > -->
                                    </div>
                                </template>
                                <a-input
                                    v-model:value="
                                        ssoForm.singleSignOnServiceUrl
                                    "
                                    placeholder="Enter your SAML 2.0 endpoint here"
                                />
                            </a-form-item>
                            <a-form-item>
                                <template #label>
                                    <span>
                                        <div class="mb-2">Path Certificate</div>
                                        <!-- <span class="leading-3 text-gray"
                                        >x.509 Certificate</span
                                    > -->
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
                            <a-form-item class="-mt-2.5" v-if="ssoForm.alias==='azure'">
                                <template #label>
                                    <div class="">
                                        <div class="mb-2">
                                            Single Logout Service URL
                                        </div>
                                    </div>
                                </template>
                                <a-input
                                    v-model:value="
                                        ssoForm.singleLogoutServiceUrl
                                    "
                                />
                            </a-form-item>
                        </a-form>
                    </div>
                    <div v-if="provider.isCustomSaml" class="mt-9">
                        <div class="mb-12">
                            <div class="mb-6 font-bold text-gray-700">
                                Attribute Mapper
                            </div>
                            <div
                                class="flex flex-row items-center justify-between w-full"
                            >
                                <div class="w-5/12 mb-2">IDP Attribute</div>
                                <div class="w-5/12 mb-2">User Attribute</div>
                            </div>

                            <div
                                v-for="(mapper, index) in mapperLists"
                                :key="index"
                                class="flex flex-row items-center justify-between w-full mb-8"
                            >
                                <div class="w-5/12">
                                    <a-input
                                        v-model:value="mapper.idpAttr"
                                        class="text-gray-500"
                                    />
                                </div>
                                <!-- <fa
                                icon="fal arrow-circle-right"
                                class="mx-3 mt-4 text-lg text-gray-600"
                            ></fa> -->
                                <AtlanIcon
                                    icon="Mapper"
                                    class="text-gray-500"
                                />
                                <div class="w-5/12">
                                    <a-input
                                        v-model:value="mapper.userAttr"
                                        class="text-gray-500"
                                        :disabled="true"
                                    />
                                </div>

                                <IconButton
                                    v-if="
                                        allowAddDeleteMappers &&
                                        index === mapperLists.length - 1
                                    "
                                    icon="Add"
                                    class="mt-6"
                                    @click="addNewMapper"
                                />

                                <IconButton
                                    v-if="
                                        allowAddDeleteMappers &&
                                        index !== mapperLists.length - 1
                                    "
                                    icon="Delete"
                                    class="mt-6"
                                    @click="removeMapper(index)"
                                />
                            </div>
                        </div>

                        <div class="mb-6 font-bold text-gray-700">
                            Customize
                        </div>
                        <div class="flex flex-row justify-between w-full mb-10">
                            <div class="w-5/12">
                                <div class="mb-2">Sign in button text</div>
                                <a-input
                                    v-model:value="ssoForm.displayName"
                                    class="text-gray-500"
                                />
                            </div>
                            <div class="w-5/12">
                                <div class="mb-2">Button Preview</div>
                                <a-button class="w-full" type="primary">{{
                                    ssoForm.displayName
                                }}</a-button>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end mt-9">
                        <AtlanButton2
                            label="Cancel"
                            color="secondary"
                            @click="showSSOScreen"
                            class="mr-5"
                        />
                        <AtlanButton2
                            :loading="isLoading"
                            :label="isLoading ? 'Configuring' : 'Save'"
                            bold
                            @click="onSubmit"
                        />
                    </div>
                    <!-- </a-form> -->
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        reactive,
        toRaw,
        UnwrapRef,
        onBeforeUnmount,
        computed,
        watch,
    } from 'vue'

    import { message } from 'ant-design-vue'
    import { useRoute, useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import ImportMetadataFromXML from '../common/importMetadataFromXML.vue'
    import ImportText from '../common/importText.vue'
    import { useTenantStore } from '~/store/tenant'

    import {
        topSAMLProviders,
        customSamlProvider,
        mapperList,
        downloadMetadata,
    } from '~/constant/saml'
    import { getEnv } from '~/modules/__env'
    import { copyToClipboard } from '~/utils/clipboard'

    import { Identity } from '~/services/service/identity'
    // @ts-ignore
    import { downloadFile } from '~/utils/library/download'
    import { Tenant } from '~/services/service/tenant'
    import DefaultLayout from '@/admin/layout.vue'
    import AtlanBtn from '@/UI/button.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    interface FormState {
        alias: string
        singleSignOnServiceUrl: string
        singleLogoutServiceUrl: string
        signingCertificate: string
        displayName: string
    }

    export default defineComponent({
        components: {
            ImportMetadataFromXML,
            ImportText,
            DefaultLayout,
            AtlanBtn,
        },
        setup() {
            const allowAddDeleteMappers = ref(false)
            const route = useRoute()
            const router = useRouter()
            const alias = ref(route?.params?.alias ?? '')
            const isAliasPresent = ref(alias.value !== 'custom')
            const ssoForm: UnwrapRef<FormState> = reactive({
                alias: '',
                singleSignOnServiceUrl: '',
                singleLogoutServiceUrl: '',
                signingCertificate: '',
                displayName: '',
            })
            const isLoading = ref(false)
            const tenantStore = useTenantStore()
            const { identityProviders } = storeToRefs(tenantStore)
            const defaultMappers = mapperList
            const mapperLists = ref(defaultMappers)
            const mappers: {
                name: any
                identityProviderAlias: string
                identityProviderMapper: string
                config: {
                    syncMode: string
                    'user.attribute': any
                    'attribute.friendly.name': any
                    'attribute.name': any
                }
            }[] = []

            const samlProvider = topSAMLProviders.find(
                (data) => data.alias === alias.value
            )

            ssoForm.alias = samlProvider?.alias || ''
            ssoForm.displayName =
                samlProvider?.defaultConfig?.displayName || 'Login with SAML'
            const provider: any = samlProvider || customSamlProvider

            const config = reactive({
                alias: ssoForm.alias,
                providerId: 'saml',
                enabled: true,
                trustEmail: true,
                storeToken: false,
                addReadTokenRoleOnCreate: false,
                linkOnly: false,
                firstBrokerLoginFlowAlias: 'first broker login',
                config: {
                    nameIDPolicyFormat:
                        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
                    postBindingAuthnRequest: 'true',
                    postBindingResponse: 'true',
                    principalType: 'SUBJECT',
                    syncMode: 'IMPORT',
                    singleSignOnServiceUrl:
                        ssoForm.singleSignOnServiceUrl || '',
                    signingCertificate: ssoForm.signingCertificate || '',
                },
                displayName: ssoForm?.displayName || 'Login with SAML',
            })

            const showConfigScreen = () => {
                router.push(`/admin/sso/${ssoForm.alias}`)
            }
            const showSSOScreen = () => {
                router.push('/admin/sso')
            }
            const changeAlias = (e: Event) => {
                e.preventDefault()
                if (ssoForm.alias === '') {
                    return message.error({ content: 'Enter Alias' })
                }
                ssoForm.alias = (ssoForm.alias || '')
                    .trim()
                    .toLowerCase()
                    .replace(/[!:;@#$%^&*'"<>,/.\\(){}[\]|`~?+=-]+/g, '')
                    .replace(/[ ]+/g, '_')
                config.alias = ssoForm.alias
                isAliasPresent.value = true
            }
            const getEnrichedUrl = (suffix) => {
                const baseUrl = `${window.location.protocol}//${window.location.host}/auth`
                const realmInfo = `realms/${getEnv().DEFAULT_REALM}`

                return provider.isCustomSaml && suffix !== ''
                    ? `${baseUrl}/${realmInfo}/broker/${ssoForm.alias}${suffix}`
                    : `${baseUrl}/${realmInfo}${suffix}`
            }
            const getSamlAssertionUrl = (alias: string) => {
                const baseUrl = `${window.location.protocol}//${window.location.host}/auth`
                const redirectUrl = `${baseUrl}/realms/${
                    getEnv().DEFAULT_REALM
                }${
                    provider.isCustomSaml
                        ? `/broker/${alias}${provider.samlAssertionUrlSuffix}`
                        : provider.samlAssertionUrlSuffix
                }`
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

            const addNewMapper = () => {
                mapperLists.value = [
                    ...mapperLists.value,
                    {
                        userAttr: '',
                        idpAttr: '',
                        isSystem: true,
                    },
                ]
            }

            const removeMapper = (index: number) => {
                console.log(index)
                mapperLists.value.splice(index, 1)
                if (!mapperLists.value.length) {
                    mapperLists.value = [
                        {
                            userAttr: '',
                            idpAttr: '',
                            isSystem: true,
                        },
                    ]
                }
            }

            const addMapper = (mapObject: {
                userAttr: any
                idpAttr: any
                isSystem?: boolean
            }) => {
                const mapper = {
                    name: mapObject.userAttr || '',
                    identityProviderAlias: ssoForm.alias,
                    identityProviderMapper: 'saml-user-attribute-idp-mapper',
                    config: {
                        syncMode: 'IMPORT',
                        'user.attribute': mapObject.userAttr || '',
                        'attribute.friendly.name': mapObject.userAttr || '',
                        'attribute.name': mapObject.idpAttr || '',
                    },
                }
                mappers.push(mapper)
            }

            const createMapper = async (mapper: any) => {
                try {
                    const { mutate: createMapper } = Identity.createMapper(
                        config.alias,
                        mapper
                    )
                    const response = await createMapper()
                    return response
                } catch (error) {
                    console.log('Mapper creation failed=>', error.message)
                }
            }
            const checkAliasPresent = () => {
                const alias = identityProviders?.value?.find(
                    (provider) => provider.alias === ssoForm.alias
                )
                return !!alias
            }
            const updateTenant = () => {
                const { data, isReady, error, isLoading } = Tenant.GetTenant()
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        if (isReady && !error.value && !isLoading.value) {
                            tenantStore.setTenant(data?.value)
                            router.push('/admin/sso')
                        } else if (error && error.value) {
                            console.error(
                                'Unable to update API Key. Please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }

            const onSubmit = async () => {
                if (checkAliasPresent()) {
                    return message.error({
                        content: 'Try another alias.',
                    })
                }
                if (
                    ssoForm.singleSignOnServiceUrl === '' ||
                    ssoForm.signingCertificate === ''
                )
                    return message.error({
                        content: 'Enter all details.',
                    })
                isLoading.value = true
                config.alias = ssoForm.alias
                config.displayName = ssoForm.displayName
                config.config.singleSignOnServiceUrl =
                    ssoForm.singleSignOnServiceUrl
                config.config.signingCertificate = ssoForm.signingCertificate
                mappers.length = 0
                mapperLists.value.map(
                    (mapper) => mapper?.userAttr && addMapper(mapper)
                )
                const params = toRaw(config)
                if (ssoForm.singleLogoutServiceUrl)
                    params.config.singleLogoutServiceUrl =
                        ssoForm.singleLogoutServiceUrl
                else delete params.config.singleLogoutServiceUrl
                console.log('submit SSO data=>', params, mappers)
                const mapperResponse: any = []
                try {
                    const { mutate: createIDP } = Identity.createIDP(params)
                    await createIDP().then(() => {
                        mappers.map((mapper) =>
                            mapperResponse.push(createMapper(mapper))
                        )
                    })
                    await Promise.all([...mapperResponse])
                    updateTenant()
                    showConfigScreen()
                    message.success({
                        content: 'SSO added!',
                    })
                    useAddEvent('admin', 'sso', 'added', { alias: alias.value })
                } catch (error) {
                    isLoading.value = false
                    console.error('Create IDP error::', error.message)
                    message.error({
                        content: 'Unsuccessfull!',
                    })
                }
            }

            const copyText = (url: string) => {
                copyToClipboard(url)
                message.success('URL copied')
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

            onBeforeUnmount(() => {
                mapperLists.value = defaultMappers
            })
            const tabConfig = computed(() => [
                {
                    label: 'Configure',
                    key: 'configure',
                },
            ])
            return {
                provider,
                ssoForm,
                isAliasPresent,
                changeAlias,
                onSubmit,
                config,
                showConfigScreen,
                getSamlAssertionUrl,
                copyText,
                importCertificate,
                mapperLists,
                addNewMapper,
                removeMapper,
                setSSODetails,
                isLoading,
                downloadMetadataFile,
                samlProvider,
                tabConfig,
                allowAddDeleteMappers,
                showSSOScreen,
                getEnrichedUrl,
            }
        },
    })
</script>
<style lang="less">
    .sso-tabs {
        .ant-tabs-tab:first-child {
            margin-left: 0 !important;
        }
    }
</style>
<style scoped>
    .copyBtn {
        pointer-events: all !important;
        cursor: pointer;
    }

    .metadata-container {
        /* background-color: #f5f5f5;
    padding: 1.25rem 1rem 0.1rem 1rem;
    border-radius: 4px; */
    }
    .metadata-input .ant-input-disabled {
        background-color: white;
    }
    .provider-wrapper {
        max-width: 50rem;
    }
</style>
