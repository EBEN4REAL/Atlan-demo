<template>
    <div>
        <!-- <ArchiveMetadataModal
      v-if="showArchiveMetadataModal"
      @close="showArchiveMetadataModal = false"
      :businessMetadata="localBm"
      @afterArchive="handleAfterArchive"
      @updateBusinessMetadataList="updateBusinessMetadata"
      :visible="showArchiveMetadataModal"
    /> -->
        <div class="flex items-center justify-between px-4 py-3 border-b">
            <div>
                <div class="flex items-center gap-2">
                    <img
                        v-if="localBm?.options?.image"
                        :src="localBm.options.image"
                        alt=""
                        class="w-auto h-7"
                    />
                    <div class="text-2xl text-primary">
                        {{ localBm.options && localBm.options.displayName }}
                    </div>
                </div>
                <div>
                    <CreateUpdateInfo
                        :created-at="localBm.createTime"
                        :updated-at="localBm.updateTime"
                        :created-by="localBm.createdBy"
                        :updated-by="localBm.updatedBy"
                    />
                </div>
            </div>
            <div class="flex items-center">
                <a-popover title="Error" placement="left">
                    <template #content>
                        <div style="max-width: 450px">
                            {{
                                `Unable to ${
                                    localBm.guid !== 'new' ? 'update' : 'create'
                                } custom metadata, please check your config. ${
                                    (error &&
                                        error.data &&
                                        error.data.errorMessage) ||
                                    ''
                                }`
                            }}
                        </div>
                    </template>
                    <span type="primary" class="text-warning">
                        <fa
                            v-if="error"
                            icon="fal info-circle"
                            class="mr-3"
                        ></fa>
                    </span>
                </a-popover>
                <span
                    v-if="localBm.guid !== 'new'"
                    class="mr-5 cursor-pointer hover-underline"
                    @click.prevent.stop="copyAPI(localBm.name)"
                >
                    <span class="">
                        <AtlanIcon icon="CopyOutlined" />
                    </span>
                </span>
                <a-button
                    v-if="isUpdated"
                    class="mr-2 rounded-md ant-btn"
                    @click="handleDiscardChanges"
                >
                    Discard
                </a-button>
                <a-button
                    v-if="(isUpdated && updatePermission ) || localBm.guid === 'new'"
                    class="rounded-md ant-btn ant-btn-primary"
                    :loading="loading"
                    :loading-text="'Saving...'"
                    @click="handleAddBusinessMetadata"
                >
                    Save
                </a-button>
                <a-button v-else variant="alt-primary px-3"> Saved </a-button>
                <a-dropdown
                    v-if="localBm.guid !== 'new' && dropdownOptions.length"
                    trigger="click"
                    dropdown-menu-class="mt-1 ml-4"
                >
                    <span
                        ><fa icon="fal ellipsis-v" class="ml-1 text-xl"></fa
                    ></span>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                v-for="(d, x) in dropdownOptions"
                                :key="x"
                            >
                                <a-button @click="d.handleClick">
                                    <fa :icon="d.icon" />
                                    {{ d.title }}
                                </a-button>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <div
            class="px-4 py-3 overflow-y-auto"
            style="height: calc(100% - 4.3rem)"
        >
            <div class="pb-4 mb-3 border-b">
                <div class="w-1/2 px-0 mb-4">
                    <label for="name" class="mb-1"
                        >Name
                        <sup class="text-red">*</sup>
                    </label>
                    <input
                        v-if="updatePermission"
                        id="name"
                        v-model="localBm.options.displayName"
                        type="text"
                        class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none  text-grey-darker border-grey"
                        name="Name"
                        @input="onUpdate"
                    />
                    <span 
                        v-else 
                        class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white rounded appearance-none  text-grey-darker border-grey"
                    >
                        {{localBm.options.displayName}}
                    </span>
                </div>
                <div>
                    <label for="description" class="mb-1">Description</label>
                    <textarea
                        v-if="updatePermission"
                        id="description"
                        v-model="localBm.description"
                        placeholder="Add some details about this metadata."
                        class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none  text-grey-darker border-grey"
                        name="Description"
                        :rows="2"
                        @input="onUpdate"
                    ></textarea>
                    <div
                        v-else
                        class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white rounded appearance-none  text-grey-darker border-grey"
                    >
                        {{ localBm.description }}
                    </div>
                </div>
                <div class="mt-4">
                    <label for="description" class="block mb-1"
                        >Metadata Image</label
                    >
                    <div class="flex gap-3">
                        <span v-if="localBm.options.imageDetails">{{
                            JSON.parse(localBm.options.imageDetails).fileName
                        }}</span>
                        <span
                            v-if="localBm.options.imageDetails"
                            class="text-red-600 cursor-pointer"
                            @click="handleRemoveImage"
                            >Remove
                        </span>
                        <a-upload
                            name="image"
                            accept="image/*"
                            :multiple="false"
                            :custom-request="handleUploadImage"
                            :show-upload-list="false"
                        >
                            <span class="text-primary">Upload</span>
                        </a-upload>
                    </div>
                </div>
            </div>
            <label class="block mb-2"
                >Attributes ({{ localBm.attributeDefs.length }})</label
            >
            <div class="flex items-center mb-4">
                <div class="mr-4">
                    <div
                        class="relative flex items-stretch w-full overflow-hidden "
                    >
                        <a-input
                            v-model:value="attrsearchText"
                            class="w-full h-8 px-2 pl-2"
                            :placeholder="'Search attribute'"
                        >
                            <template #suffix>
                                <fa
                                    v-if="!attrsearchText"
                                    icon="fal search"
                                    class="text-gray-500"
                                ></fa>
                                <fa
                                    v-else
                                    icon="fal times-circle"
                                    class="text-red-600 cursor-pointer"
                                    @click="clearSearchText"
                                ></fa>
                            </template>
                        </a-input>
                    </div>
                </div>
                <a-button
                    variant="alt-primary"
                    class="rounded-md ant-btn ant-btn-primary"
                    @click="handleAddNewAttribute"
                >
                    New attribute
                </a-button>
            </div>

            <a-collapse
                v-if="
                    attrsearchText
                        ? searchedAttributes.length
                        : localBm.attributeDefs.length
                "
                :accordion="true"
            >
                <a-collapse-panel
                    v-for="(attribute, index) in attrsearchText
                        ? searchedAttributes
                        : localBm.attributeDefs"
                    :key="index + 1"
                    :header="attribute.options.displayName || 'New attribute'"
                    class="advanceConfigCollapse"
                >
                    <template #extra>
                        <span
                            v-if="attribute.isNew"
                            class="text-gray hover:text-red-600 cursor"
                            @click.prevent.stop="handleRemoveAttribute(index)"
                        >
                            Remove
                        </span>
                        <span
                            v-else
                            class="cursor-pointer hover-underline"
                            @click.prevent.stop="copyAPI(attribute.name)"
                        >
                            <span class="">
                                <AtlanIcon icon="CopyOutlined" />
                            </span>
                        </span>
                    </template>
                    <AddAttributeCard
                        :ref="`attribute-${index}`"
                        :key="attribute.id"
                        :attribute="attribute"
                        :is-edit="!localBm.guid !== 'new' && !attribute.isNew"
                        @remove="handleRemoveAttribute(index)"
                        @updateAttribute="
                            (updatedAttribute) =>
                                onAttributeValuesChange(updatedAttribute, index)
                        "
                    />
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, computed, onMounted, watch, Ref } from 'vue'

    // ? Components
    import { message } from 'ant-design-vue'
    import AddAttributeCard from '@/admin/custom-metadata/addAttributeCard.vue'
    import CreateUpdateInfo from '@/common/createUpdateInfo.vue'
    import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'
    import { BusinessMetadataService } from '~/api/atlas/businessMetadata'

    // ? Store
    import useBusinessMetadataStore from '~/store/businessMetadata'
    import { useAccessStore } from '~/services/access/accessStore'

    import { copyToClipboard } from '~/utils/clipboard'

    interface attributeDefs {
        name: string
        options: { displayName: string }
    }

    export default defineComponent({
        components: {
            AddAttributeCard,
            CreateUpdateInfo,
        },
        props: {
            selectedBm: {
                type: Object,
                required: true,
            },
        },
        emits: [
            'update',
            'removeNewBm',
            'clearUpdatedBm',
            'clearNewBm',
            'selectBm',
        ],
        setup(props, context) {
            const store = useBusinessMetadataStore()
            const accessStore = useAccessStore()

            const updatePermission = computed(() => accessStore.checkPermission('UPDATE_BUSINESS_METADATA'))
            // * Data
            const localBm = ref({
                name: '',
                description: '',
                options: { displayName: '' },
                guid: '',
                attributeDefs: <attributeDefs[]>[],
            })

            const attrsearchText = ref('')
            const panelModel = ref(1)
            const isUpdated = ref(false)
            const showArchiveMetadataModal = ref(false)
            const loading = ref(false)
            const error = ref('')

            const {
                getDefaultAttributeTemplate,
                getUpdatePayload,
                validatePayload,
            } = useBusinessMetadata()

            const copyAPI = (text: string) => {
                copyToClipboard(text)
                message.success({
                    content: 'GUID Copied!',
                })
            }

            const clearSearchText = () => {
                attrsearchText.value = ''
            }

            const onUpdate = () => {
                isUpdated.value = true
                context.emit(
                    'update',
                    JSON.parse(JSON.stringify(localBm.value))
                )
            }

            /**
             * @desc resets all local state to before edit
             */
            const handleDiscardChanges = () => {
                if (props.selectedBm && props.selectedBm.guid === 'new')
                    context.emit('removeNewBm')
                else if (props.selectedBm && props.selectedBm.guid) {
                    localBm.value = JSON.parse(JSON.stringify(props.selectedBm))
                }
                isUpdated.value = false
                error.value = null
                context.emit('clearUpdatedBm')
            }

            /**
             * @param {Array} serviceResponse - BM data return after successfull create/update BM
             * @desc update stale BM in store
             */
            const handleBmUpdateSuccess = (serviceResponse: any[]) => {
                if (localBm.value.guid === 'new') {
                    store.businessMetadataAppendToList(serviceResponse[0])
                    context.emit('clearNewBm')
                    context.emit(
                        'selectBm',
                        JSON.parse(JSON.stringify(serviceResponse[0]))
                    )
                } else {
                    store.updateBusinessMetadataInList(serviceResponse[0])
                }
                // eslint-disable-next-line
                localBm.value = JSON.parse(JSON.stringify(serviceResponse[0]))
                context.emit('clearUpdatedBm')
            }

            /**
             * @param {Object} apiResponse - object return from update api call
             * @desc - handles success and error for update
             */
            const handleUpdateBMResponse = (apiResponse: Ref) => {
                watch(
                    () => apiResponse.value.data,
                    () => {
                        if (
                            apiResponse.value?.data?.businessMetadataDefs.length
                        ) {
                            handleBmUpdateSuccess(
                                apiResponse.value.data.businessMetadataDefs
                            )
                        }

                        loading.value = false
                        isUpdated.value = false
                    }
                )

                watch(
                    () => apiResponse.value.error,
                    (e) => {
                        loading.value = false
                        console.log(
                            '🚀 ~ file: businessMetadataProfile.vue ~ handleAddBusinessMetadata ~ error',
                            e
                        )
                        if (e?.response?.data?.errorMessage) {
                            error.value = {
                                data: {
                                    errorMessage: e.response.data.errorMessage,
                                },
                            }
                            console.log(error.value)
                        }
                    }
                )
            }

            /**
             * @desc action for @save event, validates the data and/or makes the api call,
             *       Also updates the BM Store with the updated data
             */
            const handleAddBusinessMetadata = async () => {
                error.value = null
                const validatedBm = validatePayload(localBm.value)

                if (validatedBm.error) {
                    error.value = validatedBm.error
                    return
                }
                loading.value = true
                const apiResponse = ref()
                if (validatedBm.data?.guid === 'new')
                    apiResponse.value =
                        BusinessMetadataService.addNewBusinessMetadata(
                            getUpdatePayload(validatedBm.data)
                        )
                else
                    apiResponse.value =
                        BusinessMetadataService.updateNewBusinessMetadata(
                            getUpdatePayload(validatedBm.data)
                        )

                handleUpdateBMResponse(apiResponse)
            }

            const handleAddNewAttribute = () => {
                localBm.value.attributeDefs = [
                    {
                        ...JSON.parse(
                            JSON.stringify(getDefaultAttributeTemplate())
                        ),
                        id: Date.now(),
                    },
                    ...localBm.value.attributeDefs,
                ]
                onUpdate()
            }

            /**
             * @desc watchers from add attribute card is emitting this which updates the local BM attributes
             *
             */
            const onAttributeValuesChange = (
                _uAttribute: {},
                uIndex: number
            ) => {
                localBm.value.attributeDefs = localBm.value.attributeDefs.map(
                    (attribute: object, index: number) => {
                        if (index === uIndex) {
                            return {
                                ...attribute,
                                ..._uAttribute,
                            }
                        }
                        return attribute
                    }
                )
                onUpdate()
            }

            /**
             * @param {Number} index - index of the newly added attribute
             * @desc removes newly added attribute if not saved
             */
            const handleRemoveAttribute = (index: number) => {
                const tempAttributes = JSON.parse(
                    JSON.stringify(localBm.value.attributeDefs)
                )
                tempAttributes.splice(index, 1)
                localBm.value.attributeDefs = tempAttributes
                onUpdate()
            }

            // * Computed
            const dropdownOptions = computed(() => [
                // {
                //   title: `Archive metadata`,
                //   icon: "fal trash text-red",
                //   iconType: "far",
                //   handleClick: onShowArchiveMetadataModal,
                // },
            ])

            const searchedAttributes = computed(() => {
                if (attrsearchText.value) {
                    return localBm.value.attributeDefs.filter(
                        (attr: { name: string }) =>
                            attr.name
                                .toUpperCase()
                                .includes(attrsearchText.value.toUpperCase())
                    )
                }
                return localBm.value.attributeDefs
            })

            // * Lifecycle hooks
            /**
             * @desc if a BM is select on the BM list, make a local copy
             *       is Selected BM is a new template, enable editMode
             *       also add an empty attribute for the new BM
             */
            onMounted(() => {
                if (props.selectedBm && props.selectedBm.guid) {
                    localBm.value = JSON.parse(JSON.stringify(props.selectedBm))
                    if (props.selectedBm.guid === 'new') {
                        isUpdated.value = true
                        if (!props.selectedBm.attributeDefs.length) {
                            handleAddNewAttribute()
                        }
                    }
                }
            })

            const imageFile = ref()

            const handleUploadImage = (image) => {
                imageFile.value = image.file
                const reader = new FileReader()

                reader.addEventListener(
                    'load',
                    () => {
                        // convert image file to base64 string
                        const img = new Image()
                        img.src = reader.result

                        img.onload = () => {
                            const canvas = document.createElement('canvas')
                            canvas.width = 200
                            canvas.height = 200
                            const ctx = canvas.getContext('2d')
                            ctx.drawImage(img, 0, 0, 200, 200)
                            localBm.value.options.image = canvas.toDataURL(
                                imageFile.value.type
                            )
                            localBm.value.options.imageDetails = JSON.stringify(
                                {
                                    ...(localBm.value?.options?.imageDetails ||
                                        {}),
                                    uploadAt: Date.now().toString(),
                                    fileName: imageFile.value.name,
                                }
                            )
                        }
                    },
                    false
                )
                reader.readAsDataURL(imageFile.value)
                onUpdate()
                return true
            }

            const handleRemoveImage = () => {
                imageFile.value = null
                localBm.value.options.image = null
                localBm.value.options.imageDetails = null
                onUpdate()
            }

            return {
                handleUploadImage,
                handleRemoveImage,
                imageFile,
                attrsearchText,
                clearSearchText,
                dropdownOptions,
                error,
                handleAddBusinessMetadata,
                handleAddNewAttribute,
                handleDiscardChanges,
                handleRemoveAttribute,
                isUpdated,
                loading,
                localBm,
                onAttributeValuesChange,
                onUpdate,
                panelModel,
                copyAPI,
                searchedAttributes,
                showArchiveMetadataModal,
                updatePermission
            }
        },
    })
</script>

<style lang="less">
    .advanceConfigCollapse {
        .ant-collapse-header {
            background-color: #fff !important;
        }
        .ant-collapse-content-box {
            background-color: #f8f8fd !important;
        }
    }
</style>
