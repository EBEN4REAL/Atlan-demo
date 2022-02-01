<template>
    <div
        class="flex flex-col flex-grow overflow-y-auto text-gray-600 bg-white rounded"
    >
        <div class="mt-5 provider-wrapper">
            <div>
                <div class="p-4 mb-6 bg-gray-100 rounded">
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
                                class="flex items-center cursor-pointer text-primary"
                                @click="
                                    copyText(
                                        getSamlAssertionUrl(ssoForm.alias)
                                            .redirectUrl
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="mb-0.5"
                                ></AtlanIcon>
                                <div class="ml-1">Copy</div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="mb-2.5">
                            Atlan Audience URI (SP Entity ID)
                        </div>
                        <div class="flex justify-between mb-2 text-gray-500">
                            <div class="mr-3 break-all">
                                {{
                                    getSamlAssertionUrl(ssoForm.alias)
                                        .audienceUrl
                                }}
                            </div>
                            <div
                                class="flex items-center cursor-pointer text-primary"
                                @click="
                                    copyText(
                                        getSamlAssertionUrl(ssoForm.alias)
                                            .audienceUrl
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="mb-0.5"
                                ></AtlanIcon>
                                <div class="ml-1">Copy</div>
                            </div>
                        </div>
                    </div>
                    <div>
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
                                    <AtlanIcon icon="Download"></AtlanIcon>
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
                </a-form>
                <div v-if="provider.isCustomSaml" class="mt-6">
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
                            <!-- this will change when we start getting config details -->
                            <a-input
                                v-model:value="mapper.idpAttr"
                                class="text-gray-500"
                            />
                        </div>
                        <AtlanIcon icon="Mapper" class="text-gray-500" />
                        <div class="w-5/12">
                            <a-input
                                v-model:value="mapper.userAttr"
                                class="text-gray-500"
                                :disabled="true"
                            />
                        </div>
                        <AtlanBtn
                            v-if="
                                allowAddDeleteMappers &&
                                index === mapperLists.length - 1
                            "
                            size="sm"
                            color="secondary"
                            padding="compact"
                            class="mt-6"
                            @click="addNewMapper"
                            ><AtlanIcon icon="Add" class="gap-x-0"></AtlanIcon
                        ></AtlanBtn>
                        <AtlanBtn
                            v-if="
                                allowAddDeleteMappers &&
                                index !== mapperLists.length - 1
                            "
                            size="sm"
                            class="mt-6"
                            color="secondary"
                            padding="compact"
                            @click="removeMapper(index)"
                            ><AtlanIcon
                                icon="Delete"
                                class="gap-x-0"
                            ></AtlanIcon
                        ></AtlanBtn>
                    </div>
                    <div class="mb-6 font-bold text-gray-700">Customize</div>
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
        watch,
    } from 'vue'
    import { storeToRefs, storeToRefs } from 'pinia'
    import { message } from 'ant-design-vue'
    import { useRouter } from 'vue-router'
    import emptySSOImage from '~/assets/images/emptyCreds.png'
    import ImportMetadataFromXML from '../common/importMetadataFromXML.vue'
    import ImportText from '../common/importText.vue'
    import { useTenantStore } from '~/store/tenant'
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

    import { Identity } from '~/services/service/identity'
    import { Tenant } from '~/services/service/tenant'

    interface FormState {
        alias: string
        singleSignOnServiceUrl: string
        signingCertificate: string
        displayName: string
    }

    export default defineComponent({
        components: { ImportMetadataFromXML, ImportText, AtlanBtn },
        props: ['alias'],
        setup(props) {
            const allowAddDeleteMappers = ref(false)
            const tenantStore = useTenantStore()
            const router = useRouter()
            const { identityProviderMappers, identityProviders } =
                storeToRefs(tenantStore)
            const ssoProvider: any = ref({})

            watch(
                identityProviders,
                () => {
                    const ssoProviders = (
                        identityProviders?.value || []
                    )?.filter((idp) => {
                        if (idp?.alias === props.alias) return idp
                    })
                    ssoProvider.value = ssoProviders[0] || {}
                },
                { deep: true, immediate: true }
            )

            const defaultMappers = ref([])
            defaultMappers.value = (identityProviderMappers.value || [])
                .filter(
                    (mapper) =>
                        mapper?.identityProviderAlias ===
                        identityProviders?.value?.[0].alias
                )
                .map((mapper) => ({
                    userAttr: mapper?.config?.['user.attribute'] ?? '',
                    id: mapper?.id ?? '',
                    idpAttr: mapper?.config?.['attribute.name'] ?? '',
                }))
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

            const ssoForm: UnwrapRef<FormState> = reactive({
                alias: props.alias,
                singleSignOnServiceUrl: '',
                signingCertificate: '',
                displayName: '',
            })
            const isLoading = ref(false)

            const samlProvider = topSAMLProviders.find(
                (data) => data.alias === props.alias
            )
            const provider: any = samlProvider || customSamlProvider
            ssoForm.displayName =
                ssoProvider.value?.displayName || 'Login with SAML'
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
            const updateTenant = () => {
                const { data, isReady, error, isLoading } = Tenant.GetTenant()
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        if (isReady && !error.value && !isLoading.value) {
                            tenantStore.setTenant(data?.value)
                        } else if (error && error.value) {
                            console.error(
                                'Unable to update API Key. Please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }

            onMounted(() => {
                const data: any = toRaw(ssoProvider.value)
                ssoForm.singleSignOnServiceUrl =
                    data?.config?.singleSignOnServiceUrl
                ssoForm.signingCertificate = data?.config?.signingCertificate
            })

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
                id: string
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
                    id: mapObject.id,
                }
                mappers.push(mapper)
            }

            const updateMapper = async (mapper: any) => {
                try {
                    const { mutate: updateMapper } = Identity.updateMapper(
                        props.alias,
                        mapper
                    )
                    const promise = await updateMapper()
                    return promise
                } catch (error) {
                    console.log('Mapper creation failed=>', error.message)
                }
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
                        displayName: ssoForm.displayName,
                    }
                    mapperLists.value.map(
                        (mapper) => mapper?.userAttr && addMapper(mapper)
                    )
                    const mapperResponse: any = []
                    const { mutate: updateIDP } = Identity.updateIDP(
                        props.alias,
                        config
                    )
                    await updateIDP().then(() => {
                        mappers.map((mapper) =>
                            mapperResponse.push(updateMapper(mapper))
                        )
                    })
                    await Promise.all([...mapperResponse])

                    updateTenant()
                    isLoading.value = false
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
                removeMapper,
                addNewMapper,
                allowAddDeleteMappers,
                mapperLists,
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
