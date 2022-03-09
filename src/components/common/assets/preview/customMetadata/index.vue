<template>
    <div v-if="loading" class="flex items-center justify-center w-full h-full">
        <AtlanLoader class="h-8" />
    </div>
    <div
        v-else
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
                    class="mr-1"
                    :display-mode="true"
                    emoji-size="text-md"
                />
                <Truncate
                    :tooltip-text="data.label"
                    :rows="2"
                    placement="left"
                    :should-open-in-new-tab="true"
                    :classes="
                        checkAccess(page.PAGE_GOVERNANCE)
                            ? 'text-primary hover:underline mr-1 font-semibold'
                            : 'mr-1 line-clamp-1'
                    "
                    width="200px"
                    v-bind="
                        checkAccess(page.PAGE_GOVERNANCE)
                            ? {
                                  routeTo: `/governance/custom-metadata/${data.guid}`,
                              }
                            : {}
                    "
                />
                <a-tooltip>
                    <template #title>
                        <span>{{ data?.description }}</span>
                    </template>
                    <div class="flex items-center">
                        <AtlanIcon
                            v-if="data?.description"
                            class="text-gray-400 hover:text-gray-500"
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
            >
                <div
                    v-if="
                        readOnly &&
                        applicableList.filter((i) => hasValue(i)).length
                    "
                    class=""
                >
                    <span
                        class="font-bold cursor-pointer hover:underline text-primary"
                        @click="() => (readOnly = false)"
                    >
                        Edit
                    </span>
                </div>
                <div v-else-if="!readOnly" class="flex items-center gap-x-2">
                    <span
                        class="text-sm font-medium text-gray-500 cursor-pointer"
                        @click="handleCancel"
                    >
                        Cancel
                    </span>
                    <AtlanButton
                        :disabled="!isEdit"
                        size="small"
                        padding="compact"
                        @click="handleUpdate"
                    >
                        Update
                    </AtlanButton>
                </div>
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
            <template v-if="readOnly">
                <template
                    v-if="applicableList.filter((i) => hasValue(i)).length"
                >
                    <template
                        v-for="(a, x) in applicableList.filter((i) =>
                            hasValue(i)
                        )"
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
                </template>
                <!-- showing non empty ends here -->

                <!-- showing empty starts here -->
                <template
                    v-if="applicableList.filter((i) => !hasValue(i)).length"
                >
                    <transition name="slide-fade">
                        <div v-if="showMore" class="pt-2 border-t">
                            <template
                                v-for="(a, x) in applicableList.filter(
                                    (i) => !hasValue(i)
                                )"
                                :key="x"
                            >
                                <div
                                    class="flex mb-2 font-normal text-gray-600 gap-x-2"
                                >
                                    <Truncate
                                        classes="text-gray-600"
                                        clamp-percentage="80%"
                                        :tooltip-text="a.displayName"
                                        width="500px"
                                        placement="left"
                                    />
                                    <template
                                        v-if="
                                            getHumanTypeName(
                                                getDatatypeOfAttribute(a)
                                            ) !== 'Text'
                                        "
                                    >
                                        <div>
                                            ({{
                                                getHumanTypeName(
                                                    getDatatypeOfAttribute(a)
                                                ).toLowerCase()
                                            }})
                                        </div>
                                    </template>
                                    <a-tooltip>
                                        <template #title>
                                            <span>{{
                                                a.options.description
                                            }}</span>
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
                            </template>
                        </div>
                    </transition>
                    <div
                        v-if="applicableList.filter((i) => hasValue(i)).length"
                        class="mt-2 mb-2"
                    >
                        <span
                            class="text-gray-500 bg-white border-b border-gray-500 border-dashed cursor-pointer hover:text-primary hover:border-primary"
                            :class="
                                !applicableList.filter((i) => !hasValue(i))
                                    .length
                                    ? 'hidden'
                                    : ''
                            "
                            @click="showMore = !showMore"
                        >
                            <AtlanIcon
                                v-if="!showMore"
                                icon="Add"
                                class="h-3 mb-1"
                            />
                            {{
                                showMore
                                    ? 'Hide empty properties'
                                    : `Show ${
                                          applicableList.filter(
                                              (i) => !hasValue(i)
                                          ).length
                                      } empty properties`
                            }}
                        </span>
                    </div>
                </template>

                <template
                    v-if="
                        applicableList.length ===
                        applicableList.filter((i) => !hasValue(i)).length
                    "
                >
                    <EmptyView empty-screen="EmptyCM" class="h-24 mt-8 mb-6" />
                    <div
                        class="flex flex-col items-center text-gray-500 gap-y-5"
                    >
                        <div class="">
                            <div v-if="isEvaluating" class="w-64">
                                <a-skeleton
                                    :loading="true"
                                    active
                                    class="w-full"
                                    :title="false"
                                    :paragraph="{ rows: 2 }"
                                />
                            </div>
                            <template
                                v-else-if="
                                    selectedAssetUpdatePermission(
                                        selectedAsset,
                                        isDrawer,
                                        'ENTITY_UPDATE_BUSINESS_METADATA'
                                    ) && !viewOnly
                                "
                            >
                                <PropertyPopover
                                    :applicable-list="applicableList"
                                />

                                <span> are available to be populated.</span>
                            </template>
                            <template v-else>
                                <PropertyPopover
                                    :applicable-list="applicableList"
                                />
                                <span> haven’t been populated yet. </span>
                            </template>
                        </div>
                        <AtlanButton
                            v-if="
                                selectedAssetUpdatePermission(
                                    selectedAsset,
                                    isDrawer,
                                    'ENTITY_UPDATE_BUSINESS_METADATA'
                                ) && !viewOnly
                            "
                            color="primary"
                            padding="compact"
                            @click="() => (readOnly = false)"
                        >
                            <AtlanIcon icon="Edit" /> Start Editing
                        </AtlanButton>
                    </div>
                </template>
                <!-- showing empty ends here -->
            </template>

            <!-- if edit mode show everything as it is -->
            <template v-if="!readOnly">
                <template v-for="(a, x) in applicableList" :key="x">
                    <div class="mb-3">
                        <div class="flex mb-1 font-normal text-gray-500">
                            <Truncate
                                :tooltip-text="a.displayName"
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

                        <EditState
                            v-model="a.value"
                            :index="x"
                            :attribute="a"
                            @change="handleChange(x, a.value)"
                        />
                    </div>
                </template>
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
        inject,
        defineAsyncComponent,
        Ref,
        h,
        resolveComponent,
        inject,
        computed,
    } from 'vue'
    import {
        whenever,
        useMagicKeys,
        onKeyStroke,
        watchOnce,
        onClickOutside,
    } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import { Types } from '~/services/meta/types/index'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useCustomMetadataUpdate } from '~/composables/discovery/useCurrentUpdate'
    import Confirm from '@/common/modal/confirm.vue'
    import EmptyView from '@/common/empty/index.vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import { truncate } from '~/utils/string'
    import page from '~/constant/accessControl/page'
    import useAuth from '~/composables/auth/useAuth'
    import PropertyPopover from '@/common/assets/preview/customMetadata/misc/propertyPopover.vue'
    import InternalCMBanner from '@/common/customMetadata/internalCMBanner.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { useTypedefStore } from '~/store/typedef'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {
            InternalCMBanner,
            PropertyPopover,
            Truncate,
            ReadOnly: defineAsyncComponent(() => import('./readOnly.vue')),
            EditState: defineAsyncComponent(() => import('./editState.vue')),
            EmptyView,
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
            const { selectedAsset, data, isDrawer } = toRefs(props)

            const readOnly = ref(true)
            const loading = ref(false)
            const showMore = ref(false)
            const viewOnly = ref(data.value.options?.isLocked === 'true')
            const guid = ref()
            const { checkAccess } = useAuth()
            const isEvaluating = inject('isEvaluating')

            const typedefStore = useTypedefStore()

            const customMetadataListProjections = computed(() =>
                typedefStore.getCustomMetadataListProjectionsByName(
                    data.value?.id
                )
            )

            console.log('hello', customMetadataListProjections.value)

            const { title, selectedAssetUpdatePermission } = useAssetInfo()
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
                    selectedAsset.value.typeName
                )
            )
            const payload = ref({})

            const initializeAttributesList = () => {
                applicableList.value = []
                applicableList.value = getApplicableAttributes(
                    data.value,
                    selectedAsset.value.typeName
                )
            }

            /**
             * @desc parses all the attached bm from the asset payload and
             *  forms the initial attribute list
             */
            const setAttributesList = () => {
                initializeAttributesList()
                if (selectedAsset.value?.attributes) {
                    const bmAttributes = Object.keys(
                        selectedAsset.value.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    if (bmAttributes.length)
                        bmAttributes.forEach((ab) => {
                            if (data.value.id === ab.split('.')[0]) {
                                const attribute = ab.split('.')[1]

                                const value = selectedAsset.value.attributes[ab]
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

            const payloadConstructor = () => {
                const payloadObj = { [data.value.id]: {} }
                const checkIfDelete = (v, multiValue) => {
                    if (multiValue) return !v?.length
                    return v == null || v === ''
                }

                applicableList.value.forEach((at) => {
                    if (at.unsavedChanges) {
                        if (
                            checkIfDelete(
                                at.value,
                                at.options.multiValueSelect === 'true'
                            )
                        )
                            payloadObj[data.value.id][at.name] = null
                        else payloadObj[data.value.id][at.name] = at.value
                    }
                })

                return payloadObj
            }

            const {
                asset,
                mutate: mutateUpdate,
                isReady: isUpdateReady,
            } = useCustomMetadataUpdate({
                id: guid,
                attributes: customMetadataListProjections,
            })

            const isEdit = ref(false)

            const handleUpdate = () => {
                payload.value = payloadConstructor()
                const { error, isReady, isLoading } =
                    Types.updateAssetBMChanges(
                        selectedAsset.value?.guid,
                        payload.value
                    )
                loading.value = isLoading.value

                watch([() => isLoading, error, isReady], () => {
                    if (error.value) {
                        loading.value = false
                        message.error(
                            'Some error occured...Please try again later.'
                        )
                        setAttributesList()
                    } else if (isReady?.value) {
                        loading.value = false
                        message.success(
                            `${truncate(
                                data.value?.label,
                                25
                            )} attributes for ${title(
                                selectedAsset.value
                            )} updated`
                        )
                        guid.value = selectedAsset.value.guid

                        mutateUpdate()
                    }
                    isEdit.value = false
                })

                readOnly.value = true
            }

            const cancel = () => {
                applicableList.value.forEach((att, idx) => {
                    applicableList.value[idx].value = ''
                    applicableList.value[idx].unsavedChanges = false
                })
                setAttributesList()
                readOnly.value = true
                isEdit.value = false
            }

            const handleCancel = () => {
                if (isEdit.value) {
                    Modal.confirm({
                        icon: null,
                        title: () =>
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                'Discard'
                            ),
                        content: () =>
                            h(Confirm, {
                                title: data.value.label,
                            }),
                        okType: 'danger',
                        autoFocusButton: null,
                        okButtonProps: {
                            type: 'primary',
                        },
                        okText: 'Discard',
                        onOk: cancel,
                    })
                } else cancel()
            }

            const handleChange = (index, value) => {
                if (!isEdit.value) isEdit.value = true
                applicableList.value[index].value = value
                applicableList.value[index].unsavedChanges = true
            }

            const updateList = inject('updateList', () => ({})) as Function
            const updateDrawerList = inject(
                'updateDrawerList',
                () => ({})
            ) as Function

            whenever(isUpdateReady, () => {
                if (
                    asset.value.typeName !== 'AtlasGlossary' &&
                    asset.value.typeName !== 'AtlasGlossaryCategory' &&
                    asset.value.typeName !== 'AtlasGlossaryTerm'
                ) {
                    if (isDrawer.value) updateDrawerList(asset.value)
                    else updateList(asset.value)
                }
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    initializeAttributesList()
                },
                {
                    immediate: true,
                }
            )

            setAttributesList()

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

            const readOnlySort = (a, b) =>
                hasValue(a) && !hasValue(b) ? -1 : 1

            onKeyStroke(['Enter'], (e) => {
                e.stopPropagation()
                if ((e.ctrlKey || e.metaKey) && isEdit.value && !readOnly.value)
                    handleUpdate()
            })

            return {
                viewOnly,
                isEvaluating,
                checkAccess,
                page,
                getHumanTypeName,
                isProfile,

                showMore,
                readOnlySort,
                hasValue,
                isEdit,
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                applicableList,
                readOnly,
                handleUpdate,
                handleCancel,
                getEnumOptions,
                handleChange,
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
