<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="40%"
        :destroy-on-close="true"
        :closable="false"
        :footer="null"
    >
        <div class="px-5 py-3">
            <!-- header starts -->
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center">
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
                </div>
                <div class="text-xs">
                    <a-dropdown
                        placement="bottomLeft"
                        :trigger="['click']"
                        @click.stop="() => {}"
                    >
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    v-for="item in ListForSidebar"
                                    :key="item.id"
                                    @click="handleStatusChange(item)"
                                >
                                    <div class="flex items-center space-x-2">
                                        <component
                                            :is="item.icon"
                                            class="w-auto h-4 ml-1 mr-2 pushtop"
                                        />
                                        {{ item.label }}
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <div class="flex flex-row-reverse" style="width: 140px">
                            <AtlanIcon
                                icon="CaretDown"
                                class="w-4 h-4 ml-1"
                            ></AtlanIcon>
                            <StatusBadge
                                :status-id="entity.attributes.certificateStatus"
                                :show-chip-style-status="false"
                                :show-no-status="true"
                                :show-label="true"
                                :is-tree="false"
                                class="p-0 cursor-pointer"
                            ></StatusBadge>
                        </div>
                    </a-dropdown>
                </div>
            </div>
            <!-- header ends here  -->
            <a-input
                ref="titleBar"
                v-model:value="entity.attributes.name"
                :placeholder="`Untitled ${typeNameTitle}`"
                class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
                :class="$style.titleInput"
            />
            <a-textarea
                v-model:value="entity.attributes.userDescription"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="140"
                :rows="2"
            />
        </div>

        <div
            class="flex w-full px-5 py-3 border-t border-gray-200"
            :class="
                entityType !== 'AtlasGlossary'
                    ? 'justify-between'
                    : 'justify-end'
            "
        >
            <div class="flex items-center spaxe-x-4">
                <div
                    v-if="entityType !== 'AtlasGlossary'"
                    class="flex items-center space-x-2"
                >
                    <a-switch size="small" v-model:checked="isCreateMore" />
                    <p class="p-0 m-0">Create more</p>
                </div>
                <div class="flex items-center ml-2">
                    <AddOwners @saveOwners="handleOwnersChange" />
                </div>
            </div>
            <a-button
                type="primary"
                @click="handleSave"
                :loading="isLoading"
                class="self-end bg-primary"
                >Create</a-button
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

    import { useMagicKeys, whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { ListForSidebar } from '~/constant/status'

    import updateAsset from '~/composables/discovery/updateAsset'

    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'

    import GlossaryPopoverSelect from '@/common/popover/glossarySelect/index.vue'
    import AddOwners from '@/glossary/modal/addOwners.vue'
    import GTCSelect from '@/common/popover/gtcSelect/index.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
            GlossaryPopoverSelect,
            GTCSelect,
            StatusBadge,
            AddOwners,
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
            // shortcuts for cmnd+enter to save
            const keys = useMagicKeys()
            const { meta, Enter } = keys

            const localEntityType = ref(entityType.value)
            watch(entityType, () => {
                localEntityType.value = entityType.value
            })

            const { getGlossaryByQF } = useGlossaryData()
            const visible = ref(false)
            const isCreateMore = ref<boolean>()
            const entity = reactive({
                attributes: {
                    userDescription: '',
                    name: '',
                    qualifiedName: '',
                    certificateStatus: 'DRAFT',
                    ownersUsers: [],
                    ownerGroups: [],
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
            const handleCancel = () => {
                visible.value = false
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
                console.log(entity.attributes.name)
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
                    let eventCategory
                    let properties = {}
                    if (localEntityType.value === 'AtlasGlossaryCategory') {
                        eventCategory = 'category'
                        properties = {
                            create_more: isCreateMore.value,
                        }
                    } else if (localEntityType.value === 'AtlasGlossaryTerm') {
                        eventCategory = 'term'
                        properties = {
                            create_more: isCreateMore.value,
                        }
                    } else {
                        eventCategory = 'glossary'
                    }
                    useAddEvent('gtc', eventCategory, 'created', properties)
                    resetInput()
                    message.success(`${typeNameTitle.value} created`)
                    if (guidCreatedMaps.value?.length > 0) {
                        guid.value = guidCreatedMaps.value[0]
                    }
                    setTimeout(() => mutateUpdate(), 1000)
                }
            })

            const handleStatusChange = (status) => {
                entity.attributes.certificateStatus = status.id
            }
            const handleOwnersChange = (selectedValue) => {
                console.log(selectedValue)
                entity.attributes.ownerUsers = selectedValue?.value?.ownerUsers
                entity.attributes.ownerGroups =
                    selectedValue?.value?.ownerGroups
            }
            whenever(error, () => {
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
            whenever(Enter, () => {
                if (meta.value && Enter.value) {
                    Enter.value = false
                    meta.value = false
                    if (entity.attributes.name) handleSave()
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
                handleCancel,
                ListForSidebar,
                handleStatusChange,
                handleOwnersChange,
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
