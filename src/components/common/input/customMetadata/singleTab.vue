<template>
    <div v-if="loading" class="flex items-center justify-center w-full h-full">
        <AtlanLoader class="h-8" />
    </div>
    <div
        v-else-if="applicableList.filter((i) => hasValue(i)).length"
        ref="target"
        class="flex flex-col w-full overflow-hidden gap-y-2"
    >
        <!-- header starts here -->
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 gap-x-4 group bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    width="w-4"
                    class="mr-1"
                    :display-mode="true"
                    emoji-size="text-md"
                />
                <Truncate
                    :tooltip-text="data.label"
                    placement="left"
                    :should-open-in-new-tab="true"
                    :classes="
                        checkAccess(page.PAGE_GOVERNANCE)
                            ? 'text-primary hover:underline mr-1 font-semibold'
                            : 'mr-1 line-clamp-1'
                    "
                    v-bind="
                        checkAccess(page.PAGE_GOVERNANCE)
                            ? {
                                  routeTo: `/governance/custom-metadata/${data.guid}`,
                              }
                            : {}
                    "
                    clamp-percentage="85%"
                />
                <a-tooltip>
                    <template #title>
                        <span>{{ data?.description }}</span>
                    </template>
                    <div class="flex items-center">
                        <AtlanIcon
                            v-if="data?.description"
                            class="text-gray-400 hover:text-gray-500 mb-0.5"
                            icon="Info"
                        />
                    </div>
                </a-tooltip>
            </span>
            <div
                v-if="
                    selectedAssetUpdatePermission(
                        selectedAsset,
                        isDrawer,
                        'ENTITY_UPDATE_BUSINESS_METADATA'
                    ) && !viewOnly
                "
                class="font-bold cursor-pointer hover:underline text-primary"
                @click="switchTab(selectedAsset, data?.label)"
            >
                Edit
            </div>
        </div>
        <!-- header ends here -->

        <template v-if="data?.options?.isLocked === 'true'">
            <div
                class="flex items-center p-2 mx-5 my-2 text-xs rounded gap-x-2 bg-primary-light text-primary"
            >
                <InternalCMBanner />
            </div>
        </template>

        <div class="flex flex-col flex-grow pl-5 pr-5 overflow-y-auto">
            <!-- showing non empty starts here -->
            <template
                v-for="(a, x) in applicableList.filter((i) => hasValue(i))"
                :key="x"
            >
                <div class="mb-3">
                    <div class="flex mb-1 font-normal text-gray-500">
                        <Truncate
                            :tooltip-text="a.displayName"
                            :rows="1"
                            width="500px"
                            placement="left"
                            classes="text-gray-500"
                        />
                        <a-tooltip>
                            <template #title>
                                <span>{{ a.options.description }}</span>
                            </template>
                            <div class="">
                                <AtlanIcon
                                    v-if="a.options.description"
                                    class="h-4 mb-1 ml-2 text-gray-400 hover:text-gray-500"
                                    icon="Info"
                                />
                            </div>
                        </a-tooltip>
                    </div>

                    <ReadOnly :attribute="a" />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        watch,
        PropType,
        defineAsyncComponent,
        inject,
        computed,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import Truncate from '@/common/ellipsis/index.vue'
    import page from '~/constant/accessControl/page'
    import useAuth from '~/composables/auth/useAuth'
    import InternalCMBanner from '@/common/customMetadata/internalCMBanner.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { useTypedefStore } from '~/store/typedef'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {
            InternalCMBanner,
            Truncate,
            ReadOnly: defineAsyncComponent(
                () =>
                    import(
                        '@/common/assets/preview/customMetadata/readOnly.vue'
                    )
            ),
            PreviewTabsIcon,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { selectedAsset, data } = toRefs(props)

            const loading = ref(false)
            const viewOnly = ref(data.value?.options?.isLocked === 'true')
            const guid = ref()
            const { checkAccess } = useAuth()

            const typedefStore = useTypedefStore()

            const customMetadataListProjections = computed(() =>
                typedefStore.getCustomMetadataListProjectionsByName(
                    data.value?.id
                )
            )

            const {
                asset,
                mutate: mutateCM,
                isReady: isCmReady,
                isLoading: isCmLoading,
            } = useAssetAttributes({
                id: guid,
                attributes: customMetadataListProjections,
            })

            const { selectedAssetUpdatePermission } = useAssetInfo()
            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getApplicableAttributes,
                getEnumOptions,
                getHumanTypeName,
            } = useCustomMetadataHelpers()

            // ? local attribute list , may consist of key - values required by this component only, (ex, boolean unsavedChanges )
            const applicableList = ref(
                getApplicableAttributes(
                    data.value,
                    selectedAsset.value?.typeName
                )
            )

            const initializeAttributesList = () => {
                applicableList.value = []
                applicableList.value = getApplicableAttributes(
                    data.value,
                    selectedAsset.value?.typeName
                )
            }

            /**
             * @desc parses all the attached bm from the asset payload and
             *  forms the initial attribute list
             */
            const setAttributesList = () => {
                initializeAttributesList()
                if (asset.value?.attributes) {
                    const bmAttributes = Object.keys(
                        asset.value?.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    if (bmAttributes.length)
                        bmAttributes.forEach((ab) => {
                            if (data.value.id === ab.split('.')[0]) {
                                const attribute = ab.split('.')[1]

                                const value = asset.value?.attributes[ab]
                                const attrIndex =
                                    applicableList.value.findIndex(
                                        (a) => a.name === attribute
                                    )
                                const options =
                                    applicableList.value[attrIndex]?.options

                                if (attrIndex > -1) {
                                    if (options?.multiValueSelect === 'true') {
                                        // value = JSON.parse(value)
                                    }

                                    applicableList.value[attrIndex].value =
                                        value
                                }
                            }
                        })
                }
            }

            whenever(isCmReady, () => setAttributesList())

            watch(isCmLoading, () => {
                loading.value = isCmLoading.value
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    guid.value = selectedAsset.value?.guid
                    mutateCM()
                    initializeAttributesList()
                },
                {
                    immediate: true,
                }
            )

            const hasValue = (a) => {
                const isMultivalued =
                    a?.options?.multiValueSelect === 'true' ||
                    a?.options?.multiValueSelect === true
                const dataType = getDatatypeOfAttribute(a)

                if (
                    [
                        'url',
                        'text',
                        'int',
                        'float',
                        'number',
                        'decimal',
                        'users',
                        'groups',
                        'enum',
                    ].includes(dataType) &&
                    isMultivalued
                )
                    return !!a.value?.length
                if (
                    ['url', 'text', 'users', 'groups', 'enum'].includes(
                        dataType
                    )
                )
                    return !!a.value
                return !!formatDisplayValue(a.value?.toString() || '', dataType)
            }
            const isProfile = inject('isProfile')

            const switchTab = inject('switchTab')

            return {
                viewOnly,
                switchTab,
                checkAccess,
                page,
                getHumanTypeName,
                isProfile,
                hasValue,
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                applicableList,
                getEnumOptions,
                loading,
                selectedAssetUpdatePermission,
            }
        },
    })
</script>
<style scoped>
    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
        max-height: 500px;
    }

    .slide-fade-leave-active {
        transition: all 0.3s ease-out;
        max-height: 500px;
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        max-height: 0;
    }
    /* // m-0 h-10 mt-4 mx-auto w-32 */
</style>
