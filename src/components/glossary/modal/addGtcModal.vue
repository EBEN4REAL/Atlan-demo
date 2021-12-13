<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="50%"
        :destroy-on-close="true"
        :closable="true"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <div class="flex items-center mb-1">
                <div
                    v-if="!glossaryQualifiedName"
                    class="flex items-center uppercase"
                >
                    <AtlanIcon
                        icon="Glossary"
                        class="self-center pr-1"
                    ></AtlanIcon>
                    New Glossary
                </div>
                <GTCSelect
                    v-else
                    class="p-1 mr-3 bg-gray-100 rounded"
                    v-model="localEntityType"
                ></GTCSelect>

                <div v-if="glossaryName" class="flex items-center mr-2">
                    <AtlanIcon
                        icon="Glossary"
                        class="self-center pr-1"
                    ></AtlanIcon>
                    {{ glossaryName }}
                </div>
                <div
                    v-if="glossaryName && categoryName && categoryGuid"
                    class="flex items-center"
                >
                    <AtlanIcon
                        icon="Category"
                        class="self-center pr-1"
                    ></AtlanIcon>
                    {{ categoryName }}
                </div>

                <!-- <GlossaryPopoverSelect
                    v-else-if="
                        !localQualifiedName &&
                        (localEntityType === 'AtlasGlossaryTerm' ||
                            localEntityType === 'AtlasGlossaryCategory')
                    "
                    class="p-1 bg-gray-100 rounded"
                    v-model="localQualifiedName"
                ></GlossaryPopoverSelect> -->
            </div>

            <a-input
                ref="titleBar"
                v-model:value="entity.attributes.name"
                :placeholder="`Untitled ${typeNameTitle}`"
                class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
                :class="$style.titleInput"
            />
            <a-textarea
                v-model:value="entity.attributes.description"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="140"
                :rows="2"
            />
        </div>

        <div class="flex justify-between p-3 border-t border-gray-200">
            <div class="flex items-center space-x-2">
                <a-switch size="small" v-model:checked="isCreateMore" />
                <p class="p-0 m-0">Create more</p>
            </div>

            <a-button type="primary" @click="handleSave" :loading="isLoading"
                >Save</a-button
            >
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        onMounted,
        nextTick,
        watch,
        Ref,
        inject,
        PropType,
        toRefs,
        reactive,
    } from 'vue'

    import StatusBadge from '@common/badge/status/index.vue'
    // import AddGtcModalOwners from './addGtcModalOwners.vue'
    // import Categories from '@/glossary/common/categories.vue'

    import useCreateGlossary from '~/composables/glossary/useCreateGlossary'
    import whoami from '~/composables/user/whoami'
    import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'

    import { List } from '~/constant/status'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { useVModels, whenever } from '@vueuse/core'
    import updateAsset from '~/composables/discovery/updateAsset'
    import { generateUUID } from '~/utils/helper/generator'
    import { message } from 'ant-design-vue'

    import { mutate } from 'swrv'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import useGlossary from '~/composables/glossary2/useGlossary'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'

    import GlossaryPopoverSelect from '@/common/popover/glossarySelect/index.vue'

    import GTCSelect from '@/common/popover/gtcSelect/index.vue'

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
            GlossaryPopoverSelect,
            GTCSelect,
            // AddGtcModalOwners,
            // Categories,
        },
        props: {
            entityType: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            glossaryName: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            categoryName: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },

            glossaryQualifiedName: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            categoryGuid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['add', 'update:visible'],
        setup(props, { emit }) {
            const {
                entityType,
                glossaryQualifiedName,
                categoryGuid,
                glossaryName,
                categoryName,
            } = toRefs(props)

            const localEntityType = ref(entityType.value)
            watch(entityType, () => {
                localEntityType.value = entityType.value
            })

            const { getGlossaryByQF } = useGlossaryData()
            const visible = ref(false)
            const isCreateMore = ref<boolean>(false)

            const entity = reactive({
                attributes: {
                    userDescription: '',
                    name: '',
                    qualifiedName: '',
                },
            })
            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const showModal = async () => {
                resetInput()
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
            }

            const body = ref({
                entities: [],
            })

            const {
                mutate: mutateAsset,
                isLoading,
                isReady,
                guidUpdatedMaps,
                guidCreatedMaps,
                error,
            } = updateAsset(body)

            const resetInput = () => {
                entity.attributes.name = ''
                entity.attributes.userDescription = ''
            }

            const typeNameTitle = computed(() => {
                switch (localEntityType.value) {
                    case 'AtlasGlossary':
                        return 'Glossary'
                    case 'AtlasGlossaryCategory':
                        return 'Category'
                    case 'AtlasGlossaryTerm':
                        return 'Term'
                    default:
                        return 'Glossary'
                }
            })

            const defaultRetry = ref(3)
            const handleSave = () => {
                defaultRetry.value = 2
                if (entity.attributes.name) {
                    entity.typeName = localEntityType.value
                    if (typeNameTitle.value === 'Glossary') {
                        entity.attributes.qualifiedName = ''
                    }

                    if (
                        ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'].includes(
                            entityType.value
                        )
                    ) {
                        entity.attributes.qualifiedName = ''
                        entity.relationshipAttributes = {
                            anchor: {
                                typeName: 'AtlasGlossary',
                                guid: getGlossaryByQF(
                                    glossaryQualifiedName.value
                                )?.guid,
                            },
                        }
                        if (
                            categoryGuid.value &&
                            categoryGuid.value !==
                                getGlossaryByQF(glossaryQualifiedName.value)
                                    ?.guid
                        ) {
                            if (typeNameTitle.value === 'Category') {
                                entity.relationshipAttributes.parentCategory = {
                                    typeName: 'AtlasGlossaryCategory',
                                    guid: categoryGuid.value,
                                }
                            }
                            if (typeNameTitle.value === 'Term') {
                                entity.relationshipAttributes.categories = [
                                    {
                                        typeName: 'AtlasGlossaryCategory',
                                        guid: categoryGuid.value,
                                    },
                                ]
                            }
                        }
                    }

                    body.value = {
                        entities: [entity],
                    }
                    mutateAsset()
                } else {
                    message.warning(`Please enter the mandatory name`)
                }
            }

            const guid = ref(null)

            const {
                asset,
                mutate: mutateUpdate,
                isReady: isUpdateReady,
            } = useCurrentUpdate({
                id: guid,
            })

            whenever(isReady, () => {
                if (error.value) {
                    console.error(error.value)
                } else {
                    if (!isCreateMore.value) {
                        visible.value = false
                    }
                    resetInput()
                    message.success(`${typeNameTitle.value} created`)

                    if (guidCreatedMaps.value?.length > 0) {
                        guid.value = guidCreatedMaps.value[0]
                    }
                    setTimeout(() => mutateUpdate(), 1000)
                }
            })

            whenever(error, () => {
                console.log(error.value.response?.data?.errorMessage)
                if (error.value) {
                    if (error.value.response?.status === 409) {
                        message.error(
                            `${entity.attributes.name} already exists`
                        )
                    } else {
                        message.error(
                            `${entity.attributes.name} creation failed - ${error.value.response?.data?.errorMessage}`
                        )
                    }
                }
            })

            whenever(isUpdateReady, () => {
                if (asset.value?.attributes?.qualifiedName) {
                    emit('add', asset.value)
                } else if (defaultRetry.value > 0) {
                    defaultRetry.value -= 1
                    mutateUpdate()
                }
            })

            return {
                visible,
                showModal,
                resetInput,
                isUpdateReady,
                titleBar,
                entityType,
                typeNameTitle,
                handleSave,
                mutateUpdate,
                isUpdateReady,
                guidUpdatedMaps,
                asset,
                glossaryQualifiedName,
                entity,
                isLoading,
                isReady,
                error,
                getGlossaryByQF,
                isCreateMore,
                guidCreatedMaps,
                categoryGuid,
                glossaryName,
                categoryName,
                localEntityType,
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.ant-modal-content) {
            @apply rounded-md  !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
