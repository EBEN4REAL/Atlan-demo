<template>
    <div class="mt-3 text-sm text-gray-description">
        <p class="mb-1">Classifications</p>
        <div class="py-1 rounded-lg">
                <a-popover
                    v-model:visible="linkClassificationPopover"
                    placement="left"
                    overlay-class-name="inlinepopover"
                    trigger="click"
                    @visibleChange="handlePopoverVisibleChange"
                >
                    <template #content>
                        <div
                            class="flex flex-col p-4 overflow-y-auto"
                            style="
                                width: 350px;
                                max-height: 300px;
                                min-height: 240px;
                            "
                        >
                            <div v-if="!showCreateClassificationPopover">
                                <p class="pb-1 text-lg text-gray-500 border-b">
                                    Link Classification
                                </p>
                                <p class="mb-1 text-sm text-gray-400">
                                    Select classifications
                                </p>
                                <a-select
                                    v-model:value="
                                        selectedClassificationForLink
                                    "
                                    mode="multiple"
                                    style="width: 100%"
                                    :allow-clear="true"
                                    :show-search="true"
                                    placeholder="Select one or more classifications"
                                    @change="
                                        handleSelectedClassificationForLink
                                    "
                                >
                                    <template
                                        v-for="classification in availableClassificationsForLink"
                                        :key="classification.name"
                                    >
                                        <a-select-option
                                            :value="classification.name"
                                            >{{
                                                classification.displayName
                                            }}</a-select-option
                                        >
                                    </template>
                                </a-select>
                                <p class="mt-2 text-xs text-gray-400">
                                    Can't find the right classification to link,
                                    create a new classification from
                                    <a
                                        class="text-sm"
                                        @click="showCreateClassificationForm"
                                        >here</a
                                    >
                                </p>
                                <a-checkbox
                                    v-if="
                                        selectedClassificationForLink.length < 2
                                    "
                                    v-model:checked="
                                        linkClassificationData.propagate
                                    "
                                    class="mt-2 text-gray-400"
                                    >Propagate classification to related assets
                                </a-checkbox>
                                <a-checkbox
                                    v-if="linkClassificationData.propagate"
                                    v-model:checked="
                                        linkClassificationData.removePropagationsOnEntityDelete
                                    "
                                    class="mt-2 text-gray-400"
                                    >Remove propagation when
                                    <span class="font-semibold text-gray-500">{{
                                        asset.displayText
                                    }}</span>
                                    is deleted
                                </a-checkbox>
                            </div>
                            <div v-else>
                                <p class="mb-1 text-lg text-gray-500 border-b">
                                    Create Classification
                                </p>
                                <a-form
                                    ref="createClassificationFormRef"
                                    :model="formState"
                                    :rules="rules"
                                    layout="vertical"
                                    class="mt-4"
                                >
                                    <a-form-item
                                        ref="name"
                                        label="Name"
                                        name="name"
                                    >
                                        <a-input
                                            v-model:value="formState.name"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        ref="description"
                                        label="Description"
                                        name="description"
                                    >
                                        <a-textarea
                                            v-model:value="
                                                formState.description
                                            "
                                        />
                                    </a-form-item>
                                </a-form>
                                <p
                                    v-if="createErrorText"
                                    class="mt-4 mb-0 text-sm text-red-500"
                                >
                                    {{ createErrorText }}
                                </p>
                            </div>
                        </div>

                        <div
                            v-if="!showCreateClassificationPopover"
                            class="flex justify-end p-2 space-x-2 border-t border-gray-100 "
                        >
                            <a-button
                                size="small"
                                @click="handleLinkClassificationPopoverCancel"
                                >Cancel</a-button
                            >
                            <a-button
                                type="primary"
                                size="small"
                                :loading="
                                    linkClassificationStatus === 'loading'
                                        ? true
                                        : false
                                "
                                @click="handleLinkClassificationPopoverSave"
                                >Link</a-button
                            >
                        </div>
                        <div
                            v-else
                            class="flex justify-end p-2 space-x-2 border-t border-gray-100 "
                        >
                            <a-button
                                size="small"
                                @click="
                                    () => {
                                        showCreateClassificationPopover = false
                                    }
                                "
                                >Cancel</a-button
                            >
                            <a-button
                                type="primary"
                                size="small"
                                :loading="
                                    createClassificationStatus === 'loading'
                                        ? true
                                        : false
                                "
                                @click="createClassification"
                                >Create</a-button
                            >
                        </div>
                    </template>
                    <div class="flex flex-wrap items-stretch items-center gap-x-2">
                    <template
                        v-for="(
                            classification, index
                        ) in assetLinkedClassifcations"
                        :key="
                            'classification-' + classification?.typeName + index
                        "
                    >
                        <div
                            class="flex items-stretch rounded justify-items-stretch"
                        >
                            <div
                                class="flex items-center px-2 py-2 leading-none align-middle cursor-pointer bg-primary-300 text-primary-400 bg-opacity-10 hover:bg-primary-500 hover:text-white drop-shadow-sm"
                                @click.prevent.stop="handleClassificationClick"
                            >
                                <fa
                                    v-if="classification.propagate"
                                    icon="fal chart-network"
                                    class="mr-1 leading-none pushtop"
                                ></fa>
                                <div class="text-shadow">
                                    {{ classification?.typeName }}
                                </div>
                            </div>
                            <a-button
                                v-if="!classification.hideRemoveButton"
                                :loading="
                                    unlinkClassificationStatus.status ===
                                        'loading' &&
                                    unlinkClassificationStatus.typeName ===
                                        classification.typeName
                                        ? true
                                        : false
                                "
                                class="flex items-center justify-center p-1 px-2 border-none bg-primary-300 hover:bg-primary-500 hover:text-white bg-opacity-10"
                                @click.stop="
                                    () => unLinkClassification(classification)
                                "
                            >
                                <span
                                    v-if="
                                        unlinkClassificationStatus.status ===
                                            'loading' &&
                                        unlinkClassificationStatus.typeName ===
                                            classification.typeName
                                            ? false
                                            : true
                                    "
                                    class="flex items-center justify-center"
                                >
                                    <fa icon="fal times-circle" class="" />
                                </span>
                            </a-button>
                        </div>
                    </template>
                    <div
                        v-if="asset.classifications?.length > 0"
                        class="flex items-center justify-center px-2 py-2 ml-1 rounded cursor-pointer text-primary _bg-primary-light hover:text-white hover:bg-primary"
                        @click.stop.prevent="openLinkClassificationPopover"
                    >
                        <span class="flex items-center justify-center">
                            <fa icon="fal plus" />
                        </span>
                    </div>
                    <div
                        v-else
                        class="
                            inline-flex
                            px-2
                            py-1.5
                            rounded
                            cursor-pointer
                            select-none
                            _bg-primary-light
                        "
                    >
                        <span class="flex items-center text-sm">
                            <fa icon="fal plus" class="text-primary" />
                        </span>
                        <span class="mt-1 ml-2 text-primary"
                            >Add Classifications</span
                        >
                    </div>
                    </div>
                </a-popover>
            </div>
        </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        watch,
        toRaw,
        reactive,
        PropType,
    } from 'vue'
    import { Classification } from '~/api/atlas/classification'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            selectedAssetData: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            const selectedAsset = computed(() => props.selectedAsset)
            const classificationsStore = useClassificationStore()
            const asset = computed(() => props.selectedAsset ?? {})
            const linkClassificationPopover = ref(false)
            const linkClassificationStatus = ref('')
            const linkClassificationStatusError = ref('')
            const availableClassificationsForLink = ref(
                getAvailableClassificationsForLink(
                    selectedAsset.value.classifications,
                    classificationsStore.classifications
                )
            )
            const unlinkClassificationStatus = ref({
                status: '',
                typeName: null,
            })
            const unlinkClassificationStatusErrorText = ref('')
            const showCreateClassificationPopover = ref(false)

            const createClassificationRef = ref(null)
            const showAddClassificationBtn = ref(false)

            // Todo need to add showAddTagButton props using policy

            /*
      const evaluateAssetAccess = ($axios, params) => {
    console.log(params);
  
    // return [{ username: "varun" }, { username: "krishna" }];
    return $axios.$post(`${tenantPath($axios)}/access/evaluate`, {
      ...params,
      validateStatus(status) {
        return status >= 200 && status < 300;
      }
    });
  };
  */

            /* classifications fxns */
            function getAvailableClassificationsForLink(
                selectedAssetClassifications: any,
                classifications: any
            ) {
                const availableClassifications: Array<any> = []

                classifications.forEach((classification) => {
                    let index = -1
                    if (selectedAssetClassifications?.length > 0) {
                        index = selectedAssetClassifications?.findIndex(
                            (cl) => cl.typeName === classification.name
                        )
                    }
                    if (index === -1)
                        availableClassifications.push(classification)
                })

                return availableClassifications
            }

            function removeClassificationFromSelectedAsset(
                selectedClassification: any
            ) {
                const { typeName } = selectedClassification
                const { classifications } = selectedAsset.value
                selectedAsset.value.classifications = classifications.filter(
                    (classification) => classification.typeName !== typeName
                )
                availableClassificationsForLink.value =
                    getAvailableClassificationsForLink(
                        selectedAsset.value.classifications,
                        classificationsStore.classifications
                    )
            }

            function formattedLinkedClassifications(classifications) {
                return classifications.map((classification) => {
                    if (
                        classification &&
                        classification.hasOwnProperty('isAutoClassification') &&
                        classification.isAutoClassification
                    ) {
                        return {
                            ...classification,
                            hideRemoveButton: false,
                        }
                    }
                    if (
                        classification.propagate &&
                        classification.entityGuid &&
                        selectedAsset.value.guid !== classification.entityGuid
                    ) {
                        return {
                            ...classification,
                            hideRemoveButton: true,
                        }
                    }
                    return {
                        ...classification,
                        hideRemoveButton: false,
                    }
                })
            }
            function addClassificationToSelectedAsset({
                classifications: selectedClassificationsForLink,
                multiple,
            }: {
                classifications: any
                multiple: boolean
            }) {
                console.log(selectedClassificationsForLink, 'selected Multiple')
                let { classifications } = selectedAsset.value
                console.log(selectedAsset.value, 'selected Asser')
                if (classifications?.length > 0) {
                    classifications = [
                        ...classifications,
                        ...selectedClassificationsForLink,
                    ]
                } else {
                    classifications = [...selectedClassificationsForLink]
                }
                selectedAsset.value.classifications =
                    formattedLinkedClassifications(classifications)
                availableClassificationsForLink.value =
                    getAvailableClassificationsForLink(
                        selectedAsset.value.classifications,
                        classificationsStore.classifications
                    )
            }
            function updateAvailableClassificationsForLink() {
                availableClassificationsForLink.value =
                    getAvailableClassificationsForLink(
                        selectedAsset.value.classifications,
                        classificationsStore.classifications
                    )
            }
            /* ------------------------------- */

            const assetLinkedClassifcations = computed(
                () => selectedAsset.value.classifications
            )
            console.log(assetLinkedClassifcations, 'assetLinkedClassifcations')

            const unLinkClassification = (classification: any) => {
                unlinkClassificationStatus.value.status = 'loading'
                unlinkClassificationStatus.value.typeName =
                    classification.typeName
                const { typeName, entityGuid } = classification
                // No content response
                const { data, error, isReady } =
                    Classification.archiveClassification({
                        cache: false,
                        typeName,
                        entityGuid,
                    })

                /* Todo show loader during unlinking of classification from asset */
                watch([data, error, isReady], () => {
                    if (isReady && !error.value) {
                        unlinkClassificationStatus.value.status = 'success'
                        unlinkClassificationStatus.value.typeName = null
                        removeClassificationFromSelectedAsset(classification)
                    } else {
                        unlinkClassificationStatus.value.status = 'failed'
                        unlinkClassificationStatus.value.typeName = null
                        unlinkClassificationStatusErrorText.value =
                            'something went wrong'
                        console.error('unling link failed')
                    }
                })
            }

            const openLinkClassificationPopover = () => {
                console.log('clicked')
                linkClassificationPopover.value = true
            }

            const linkClassificationData = ref({
                propagate: false,
                removePropagationsOnEntityDelete: true,
                typeName: '',
            })

            const handleLinkClassificationPopoverSave = () => {
                const payload = ref([])
                if (selectedClassificationForLink.value.length > 1) {
                    payload.value = selectedClassificationForLink.value.map(
                        (classificationName) => ({
                            entityGuid: asset.value.guid,
                            attributes: {},
                            propagate: false,
                            removePropagationsOnEntityDelete: true,
                            typeName: classificationName,
                            validityPeriods: [],
                        })
                    )
                } else {
                    payload.value = [
                        {
                            entityGuid: asset.value.guid,
                            attributes: {},
                            propagate: linkClassificationData.value.propagate,
                            removePropagationsOnEntityDelete:
                                linkClassificationData.value
                                    .removePropagationsOnEntityDelete,
                            typeName: linkClassificationData.value.typeName,
                            validityPeriods: [],
                        },
                    ]
                }

                linkClassificationStatus.value = 'loading'
                const { data, error, isReady, isLoading } =
                    Classification.linkClassification({
                        cache: undefined,
                        payload,
                        entityGuid: asset.value.guid,
                    })

                watch([isLoading], () => {
                    if (isLoading.value == false && !error.value) {
                        linkClassificationStatus.value = 'success'
                        linkClassificationPopover.value = false
                        const classifications = payload.value
                        console.log(payload.value, 'payloaddddd')
                        addClassificationToSelectedAsset({
                            classifications,
                            multiple: classifications.length > 1,
                        })
                        selectedClassificationForLink.value = []
                        linkClassificationData.value = {
                            propagate: false,
                            removePropagationsOnEntityDelete: true,
                            typeName: '',
                        }
                    } else {
                        console.log('link failed')
                        linkClassificationStatus.value = 'error'
                        linkClassificationStatusError.value =
                            'Something went wrong!'
                    }
                })
            }

            const handleLinkClassificationPopoverCancel = () => {
                linkClassificationPopover.value = false
            }

            const selectedClassificationForLink = ref([])
            const handleSelectedClassificationForLink = (typeName) => {
                const data = [...typeName]
                linkClassificationData.value.typeName = data.pop()
            }
            const showCreateClassificationForm = () => {
                showCreateClassificationPopover.value = true
            }

            const hideCreateClassificationWindow = () => {
                showCreateClassificationPopover.value = false
            }

            interface FormState {
                name: string
                description: string
            }
            const createClassificationStatus = ref('')
            const createErrorText = ref('')
            const createClassificationFormRef = ref()

            const formState: UnwrapRef<FormState> = reactive({
                name: '',
                description: '',
            })
            const rules = {
                name: [
                    {
                        required: true,
                        message: 'Please input Classification name',
                        trigger: 'blur',
                    },
                ],
            }

            const resetRef = (ref, time) => {
                setTimeout(() => {
                    ref.value = ''
                }, time)
            }

            const createClassification = () => {
                const payload = {
                    classificationDefs: [],
                }
                const classificationObj: any = {
                    attributeDefs: [],
                    description: '',
                    name: '',
                    superTypes: [],
                }

                createClassificationFormRef.value
                    .validate()
                    .then(() => {
                        classificationObj.name = formState.name
                        classificationObj.description = formState.description
                        payload.classificationDefs.push(classificationObj)
                        // create classification
                        createClassificationStatus.value = 'loading'
                        const {
                            data: createClassificationData,
                            error: createClassificationError,
                        } = Classification.createClassification({
                            cache: false,
                            payload,
                        })

                        watch(
                            [
                                createClassificationData,
                                createClassificationError,
                            ],
                            () => {
                                console.log(
                                    createClassificationData,
                                    createClassificationError
                                )
                                if (createClassificationData.value) {
                                    const classifications =
                                        createClassificationData.value
                                            .classificationDefs ?? []
                                    console.log(
                                        'getClassifications -> classifications',
                                        classifications
                                    )
                                    createClassificationStatus.value = 'success'
                                    formState.name = ''
                                    formState.description = ''
                                    classificationsStore.addClassifications(
                                        toRaw(classifications)
                                    )
                                    updateAvailableClassificationsForLink()
                                    hideCreateClassificationWindow()
                                } else {
                                    createClassificationStatus.value = 'error'
                                    const error = toRaw(
                                        createClassificationError.value
                                    )
                                    console.log(
                                        'errormessage',
                                        error.response.data.errorMessage
                                    )
                                    createErrorText.value =
                                        error.response.data.errorMessage
                                    resetRef(createErrorText, 6000)
                                }
                            }
                        )
                    })
                    .catch((error: ValidateErrorEntity<FormState>) => {
                        console.log('error', error)
                    })
            }

            const handleClassificationClick = () => {}
            const handlePopoverVisibleChange = () => {
                showCreateClassificationPopover.value = false
                selectedClassificationForLink.value = []
            }

            return {
                asset,
                unlinkClassificationStatus,
                handleSelectedClassificationForLink,
                createClassificationStatus,
                createClassificationFormRef,
                showCreateClassificationPopover,
                linkClassificationData,
                linkClassificationStatus,
                selectedClassificationForLink,
                handleLinkClassificationPopoverCancel,
                handleLinkClassificationPopoverSave,
                openLinkClassificationPopover,
                availableClassificationsForLink,
                linkClassificationPopover,
                assetLinkedClassifcations,
                unLinkClassification,
                handleClassificationClick,
                createClassificationRef,
                showCreateClassificationForm,
                createClassification,
                formState,
                rules,
                createErrorText,
                showAddClassificationBtn,
                handlePopoverVisibleChange,
            }
        },
    })

    // typeName is name in classification
</script>

<style lang="less" module>
    .borderless {
        @apply border-none shadow-none px-4 !important;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        &:global(.ant-input-affix-wrapper-focused) {
            @apply border-none shadow-none;
        }
    }
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
        @apply hidden;
    }
    // Aesterik in right side
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
        display: inline-block;
        margin-left: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }
</style>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
</style>
