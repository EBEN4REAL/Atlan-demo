<template>
    <div class="text-sm text-gray-500">
        <p class="mb-3 text-sm">Classifications</p>
        <div class="flex flex-wrap items-stretch items-center lex">
            <template
                v-for="(classification, index) in splittedClassifications.a"
                :key="'classification-' + classification?.typeName + index"
            >
                <div
                    class="
                        relative
                        flex
                        items-stretch
                        px-3
                        py-1.5
                        mb-3
                        mr-3
                        font-bold
                        rounded-full
                        bg-gray-light
                        text-gray-700
                        group
                        justify-items-stretch
                        hover:bg-primary hover:text-white
                    "
                >
                    <div
                        class="flex items-center leading-none align-middle rounded cursor-pointer  drop-shadow-sm"
                        @click.prevent.stop="handleClassificationClick"
                    >
                        <div
                            class="
                                text-sm
                                font-bold
                                classification-name-width
                                truncate
                                ...
                            "
                        >
                            {{ classification?.typeName }}
                        </div>
                    </div>

                    <div
                        class="absolute flex items-center justify-center pl-3 pr-1 text-white bg-transparent border-none rounded-full opacity-0 cursor-pointer  group-hover:opacity-100 classification-cross-btn"
                        @click.stop="() => unLinkClassification(classification)"
                    >
                        <div class="flex items-center justify-center">
                            <fa icon="fal times-circle" class="" />
                        </div>
                    </div>
                </div>
            </template>
            <template
                v-if="showAll"
                v-for="(classification, index) in splittedClassifications.b"
                :key="'classification-' + classification?.typeName + index"
            >
                <div
                    class="
                        relative
                        flex
                        items-stretch
                        px-3
                        py-1.5
                        mb-3
                        mr-3
                        font-bold
                        rounded-full
                        bg-gray-light
                        text-gray-700
                        group
                        justify-items-stretch
                        hover:bg-primary hover:text-white
                    "
                >
                    <div
                        class="flex items-center leading-none align-middle rounded cursor-pointer  drop-shadow-sm"
                        @click.prevent.stop="handleClassificationClick"
                    >
                        <div
                            class="
                                text-sm
                                font-bold
                                classification-name-width
                                truncate
                                ...
                            "
                        >
                            {{ classification?.typeName }}
                        </div>
                    </div>

                    <div
                        class="absolute flex items-center justify-center pl-3 pr-1 text-white bg-transparent border-none rounded-full opacity-0 cursor-pointer  group-hover:opacity-100 classification-cross-btn"
                        @click.stop="() => unLinkClassification(classification)"
                    >
                        <div class="flex items-center justify-center">
                            <fa icon="fal times-circle" class="" />
                        </div>
                    </div>
                </div>
            </template>
            <div
                v-if="splittedClassifications.b.length > 0 && !showAll"
                class="flex items-center justify-center mb-3 mr-3 cursor-pointer "
                @click="() => toggleAllClassifications(true)"
            >
                <span
                    class="px-1 py-0.5 text-sm font-bold rounded text-primary"
                >
                    and {{ splittedClassifications.b.length }} more
                </span>
            </div>
            <div
                v-if="splittedClassifications.b.length > 0 && showAll"
                class="flex items-center justify-center mb-3 mr-3 cursor-pointer "
                @click="() => toggleAllClassifications(false)"
            >
                <span
                    class="px-1 py-0.5 text-sm font-bold rounded text-primary"
                >
                    show less
                </span>
            </div>
            <a-button
                v-if="asset.classifications?.length > 0"
                class="flex items-center justify-center w-8 h-8 px-2 py-2 mb-3 text-gray-700 border-none rounded-full  bg-gray-light hover:bg-primary hover:text-white"
                @click.stop="openLinkClassificationPopover"
            >
                <fa icon="fal plus" />
            </a-button>
        </div>
        <a-popover
            v-model:visible="linkClassificationPopover"
            placement="left"
            trigger="click"
            @visibleChange="handlePopoverVisibleChange"
        >
            <div
                v-if="asset.classifications?.length < 1"
                class="
                    items-center
                    px-3
                    py-1.5
                    mr-3
                    font-bold
                    rounded-full
                    text-sm
                    cursor-pointer
                    bg-gray-light
                    text-gray-700
                    inline-flex
                    hover:bg-primary hover:text-white
                "
            >
                <fa icon="fal plus" class="" />
                <span class="ml-2">Add Classifications</span>
            </div>
            <template #content>
                <div class="flex flex-col overflow-y-auto" style="width: 400px">
                    <div v-if="!showCreateClassificationPopover">
                        <p class="mb-2 text-sm font-bold text-gray-700">
                            Link Classification
                        </p>
                        <a-select
                            v-model:value="selectedClassificationForLink"
                            mode="multiple"
                            style="width: 100%"
                            :allow-clear="true"
                            :autofocus="true"
                            :show-search="true"
                            placeholder="Search for classifications"
                            @change="handleSelectedClassificationForLink"
                        >
                            <template
                                v-for="classification in availableClassificationsForLink"
                                :key="classification.name"
                            >
                                <a-select-option :value="classification.name">{{
                                    classification.displayName
                                }}</a-select-option>
                            </template>
                        </a-select>
                        <!-- <p class="text-sm text-gray-700">
                            Or create a new term
                            <a
                                class="text-sm"
                                @click="showCreateClassificationForm"
                                >here</a
                            >
                        </p> -->
                        <a-checkbox
                            v-if="selectedClassificationForLink.length < 2"
                            v-model:checked="linkClassificationData.propagate"
                            class="mt-2 text-sm text-gray-700"
                            >Propagate classification to related assets
                        </a-checkbox>
                        <a-checkbox
                            :disabled="!linkClassificationData.propagate"
                            v-model:checked="
                                linkClassificationData.removePropagationsOnEntityDelete
                            "
                            class="mt-2 text-sm text-gray"
                            >Remove propagation when related assets
                            <!-- <span class="font-semibold text-gray-500">{{
                                asset.displayText
                            }}</span> -->
                            are deleted
                        </a-checkbox>
                    </div>
                    <div v-else>
                        <p class="mb-2 text-sm font-bold text-gray-700">
                            Create Classification
                        </p>
                        <a-form
                            ref="createClassificationFormRef"
                            :model="formState"
                            :rules="rules"
                            layout="vertical"
                        >
                            <a-form-item
                                ref="name"
                                label="Name"
                                name="name"
                                class="mb-2"
                            >
                                <a-input
                                    v-model:value="formState.name"
                                    placeholder="Name of classification"
                                />
                            </a-form-item>
                            <a-form-item
                                ref="description"
                                label="Description"
                                name="description"
                                class="mb-3"
                            >
                                <a-textarea
                                    v-model:value="formState.description"
                                    showCount
                                    :maxlength="140"
                                    placeholder="Add a description"
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
                    <div class="flex items-center justify-between w-full mt-4">
                        <div
                            v-if="!showCreateClassificationPopover"
                            class="inline-flex flex-1 text-sm text-gray-700"
                        >
                            Or create a
                            <span
                                class="text-sm font-bold cursor-pointer  text-primary"
                                @click="showCreateClassificationForm"
                                >&nbsp;new term</span
                            >
                        </div>
                        <div
                            v-else
                            class="inline-flex flex-1 text-sm text-gray-700"
                        ></div>
                        <div
                            v-if="!showCreateClassificationPopover"
                            class="space-x-4"
                        >
                            <a-button
                                class="px-4"
                                @click="handleLinkClassificationPopoverCancel"
                                >Cancel</a-button
                            >
                            <a-button
                                type="primary"
                                :loading="
                                    linkClassificationStatus === 'loading'
                                        ? true
                                        : false
                                "
                                class="px-4"
                                @click="handleLinkClassificationPopoverSave"
                                >Link</a-button
                            >
                        </div>
                        <div v-else class="space-x-4">
                            <a-button
                                @click="
                                    () => {
                                        showCreateClassificationPopover = false
                                    }
                                "
                                class="px-4"
                                >Cancel</a-button
                            >
                            <a-button
                                type="primary"
                                class="px-4"
                                :loading="
                                    createClassificationStatus === 'loading'
                                        ? true
                                        : false
                                "
                                @click="createClassification"
                                >Create</a-button
                            >
                        </div>
                    </div>
                </div>
            </template>
        </a-popover>
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
        UnwrapRef,
        Ref,
    } from 'vue'
    import { Classification } from '~/api/atlas/classification'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { classificationInterface } from '~/types/classifications/classification.interface'
    import { typedefsInterface } from '~/types/typedefs/typedefs.interface'
    import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const selectedAsset = computed(() => props.selectedAsset)
            const classificationsStore = useClassificationStore()
            const asset = computed(() => props.selectedAsset ?? {})
            const linkClassificationPopover = ref(false)
            const linkClassificationStatus = ref('')
            const linkClassificationStatusError = ref('')
            const showAll = ref(false)
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
                selectedAssetClassifications: classificationInterface[],
                classifications: classificationInterface[]
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

            function formattedLinkedClassifications(
                classifications: classificationInterface[]
            ): Array<classificationInterface & { hideRemoveButton: boolean }> {
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
                classifications: classificationInterface[]
                multiple: boolean
            }) {
                console.log(selectedClassificationsForLink, 'selected Multiple')
                let { classifications } = selectedAsset.value
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
                        cache: '',
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
                removePropagationsOnEntityDelete: false,
                typeName: '',
            })

            const handleLinkClassificationPopoverSave = () => {
                const payload = ref([]) as Ref<any>
                if (selectedClassificationForLink.value.length > 1) {
                    payload.value = selectedClassificationForLink.value.map(
                        (classificationName) => ({
                            entityGuid: selectedAsset.value.guid,
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
                            entityGuid: selectedAsset.value.guid,
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
                const { error, isLoading } = Classification.linkClassification({
                    cache: undefined,
                    payload,
                    entityGuid: selectedAsset.value.guid,
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
            const handleSelectedClassificationForLink = (typeName: any) => {
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

            const resetRef = (ref: Ref, time: number) => {
                setTimeout(() => {
                    ref.value = ''
                }, time)
            }

            const createClassification = () => {
                const payload: {
                    classificationDefs: classificationInterface[]
                } = {
                    classificationDefs: [],
                }
                const classificationObj = {
                    attributeDefs: [],
                    description: '',
                    name: '',
                    superTypes: [],
                } as unknown as classificationInterface

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
                        } = Classification.createClassification<typedefsInterface>(
                            {
                                cache: false,
                                payload,
                            }
                        )

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

            function splitArray(sizeofSplit: number, arr: any[]) {
                if (sizeofSplit >= arr.length) {
                    return {
                        a: [...arr],
                        b: [],
                    }
                }
                const a: any[] = arr.slice(0, sizeofSplit)
                const b: any[] = arr.slice(sizeofSplit, arr.length)
                return {
                    a,
                    b,
                }
            }
            const splittedClassifications = ref(
                splitArray(5, assetLinkedClassifcations.value)
            )
            watch(assetLinkedClassifcations, () => {
                splittedClassifications.value = splitArray(
                    5,
                    assetLinkedClassifcations.value
                )
            })
            const toggleAllClassifications = (state: boolean) => {
                showAll.value = state
            }

            return {
                asset,
                selectedAsset,
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
                splittedClassifications,
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
                toggleAllClassifications,
                showAll,
            }
        },
    })

    // typeName is name in classification
</script>

<style lang="less" module>
    .borderless {
        @apply border-none shadow-none px-4 !important;

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
    .classification-cross-btn {
        height: 100%;
        right: 6px;
        @apply -top-0;
        background: linear-gradient(
            -90deg,
            rgba(82, 119, 215, 1) 60%,
            rgba(0, 0, 0, 0) 100%
        );
    }
    .classification-name-width {
        max-width: 12rem;
    }
</style>
