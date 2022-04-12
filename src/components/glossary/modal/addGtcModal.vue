// TODO: refactor this file after request creation
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
        <div
            v-if="!hasCreatePermission"
            class="px-3 py-2 mb-3 bg-gray-100 fixed top-14 rounded text-gray-500 text-xs"
            style="width: 40%"
        >
            You don't have access to create {{ typeNameTitle }}, but you can
            suggest them to your
            <span class="text-primary cursor-pointer">
                <a-popover placement="rightBottom">
                    <template #content>
                        <AdminList></AdminList>
                    </template>
                    <span>workspace admins</span>
                </a-popover>
            </span>
        </div>

        <div class="px-5 py-3">
            <!-- header starts -->
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center">
                    <div
                        v-if="
                            entityType === 'AtlasGlossary' ||
                            (!glossaryQualifiedName && !showGlossarySelect)
                        "
                        class="flex items-center uppercase"
                    >
                        <AtlanIcon
                            icon="Glossary"
                            class="self-center pr-1"
                        ></AtlanIcon>
                        New Glossary
                    </div>

                    <div
                        v-if="showGlossarySelect && !glossaryQualifiedName"
                        class="border px-1 py-0.5 rounded flex align-center"
                    >
                        <GlossarySelect
                            v-model="parentGlossary"
                            @change="handleSelectGlossary"
                            :showAllGlossary="false"
                            size="small"
                        ></GlossarySelect>
                    </div>
                    <atlan-icon
                        v-if="showGlossarySelect && !glossaryQualifiedName"
                        icon="CaretRight"
                        class="mx-2"
                    />
                    <div
                        v-if="glossaryName && entityType !== 'AtlasGlossary'"
                        class="flex items-center border rounded py-0.5 px-1"
                        style="max-width: 150px"
                    >
                        <div class="w-4 mb-0.5">
                            <AtlanIcon
                                icon="Glossary"
                                class="self-center"
                            ></AtlanIcon>
                        </div>
                        <Tooltip
                            :tooltip-text="`${glossaryName}`"
                            :classes="'pr-1 pl-0.5'"
                        />
                    </div>
                    <atlan-icon
                        v-if="glossaryName && entityType !== 'AtlasGlossary'"
                        icon="CaretRight"
                        class="px-2"
                    />
                    <div
                        v-if="glossaryName && categoryName && categoryGuid"
                        class="flex items-center border rounded py-0.5 px-1"
                        style="max-width: 150px"
                    >
                        <div class="w-4 mb-0.5">
                            <AtlanIcon
                                icon="Category"
                                class="self-center"
                            ></AtlanIcon>
                        </div>
                        <Tooltip
                            :tooltip-text="`${categoryName}`"
                            :classes="'pr-1 pl-0.5'"
                        />
                    </div>
                    <atlan-icon
                        v-if="glossaryName && categoryName && categoryGuid"
                        icon="CaretRight"
                        class="px-2"
                    />

                    <GTCSelect
                        v-if="
                            (showGlossarySelect || glossaryQualifiedName) &&
                            entityType !== 'AtlasGlossary'
                        "
                        class="p-1 mr-3 bg-white border rounded"
                        v-model="localEntityType"
                    ></GTCSelect>
                </div>
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
                                <div
                                    class="flex items-center space-x-2 text-xs"
                                >
                                    <component
                                        :is="item.icon"
                                        class="w-auto h-4 ml-1 mr-2 pushtop"
                                    />
                                    {{ item.label }}
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <div
                        class="flex flex-row-reverse text-xs"
                        style="width: 140px"
                    >
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
            <!-- header ends here  -->
            <a-input
                ref="titleBar"
                v-model:value="entity.attributes.name"
                :placeholder="`Name`"
                class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
                :class="$style.titleInput"
            />
            <a-textarea
                v-model:value="entity.attributes.userDescription"
                placeholder="Description"
                class="text-gray-500 border-0 shadow-none outline-none"
                :rows="2"
            />
        </div>

        <div
            class="flex justify-between w-full px-5 py-3 border-t border-gray-200"
        >
            <div class="flex items-center spaxe-x-4">
                <div
                    v-if="entityType !== 'AtlasGlossary' && hasCreatePermission"
                    class="flex items-center mr-2 space-x-2"
                >
                    <a-switch size="small" v-model:checked="isCreateMore" />
                    <p class="p-0 m-0">Create more</p>
                </div>
                <div class="flex items-center">
                    <AddOwners @saveOwners="handleOwnersChange" />
                </div>
            </div>
            <a-button
                v-if="hasCreatePermission"
                type="primary"
                @click="handleSave"
                :loading="isLoading"
                class="self-end bg-primary"
                >Create</a-button
            >
            <a-button
                v-else
                type="primary"
                @click="handleRequest"
                :loading="isLoading"
                class="self-end bg-primary"
                >Request</a-button
            >
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
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
    import { useRouter, useRoute } from 'vue-router'
    import { message } from 'ant-design-vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { ListForSidebar } from '~/constant/status'

    import updateAsset from '~/composables/discovery/updateAsset'

    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'

    import GlossaryPopoverSelect from '@/common/popover/glossarySelect/index.vue'
    import AddOwners from '@/glossary/modal/addOwners.vue'
    import GTCSelect from '@/common/popover/gtcSelect/index.vue'
    import GlossarySelect from '@/common/popover/glossarySelect/index.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useCreateRequests } from '~/composables/requests/useCreateRequests'
    import useGTCPermissions, {
        fetchGlossaryPermission,
    } from '~/composables/glossary/useGTCPermissions'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
            GlossaryPopoverSelect,
            GTCSelect,
            StatusBadge,
            AddOwners,
            GlossarySelect,
            Tooltip,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
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
            showGlossarySelect: {
                type: Boolean,
                required: false,
                default: false,
            },
            createPermission: {
                type: Boolean,
                required: false,
                default: false,
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
                createPermission,
            } = toRefs(props)
            const checkDuplicateCategoryNames = inject(
                'checkDuplicateCategoryNames',
                (...args) => false
            )
            // shortcuts for cmnd+enter to save
            const keys = useMagicKeys()
            const { meta, Enter } = keys

            const router = useRouter()
            const localEntityType = ref(entityType.value)
            const { role } = whoami()
            watch(entityType, () => {
                localEntityType.value = entityType.value
            })

            const { getGlossaryByQF, selectedGlossary } = useGlossaryData()
            const parentGlossaryQf = computed(() =>
                selectedGlossary.value?.typeName === 'AtlasGlossary'
                    ? selectedGlossary.value?.attributes?.qualifiedName
                    : selectedGlossary?.value?.attributes?.anchor
                          ?.uniqueAttributes?.qualifiedName
            )
            const parentGlossary = ref(parentGlossaryQf.value)
            const visible = ref(false)
            const isCreateMore = ref<boolean>()
            const anchorQf = computed(() =>
                glossaryQualifiedName.value.length
                    ? glossaryQualifiedName.value
                    : parentGlossary.value
            )
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
            // handle create permissions for gtc
            const glossaryForPermission = computed(() => {
                if (props.showGlossarySelect) {
                    return getGlossaryByQF(parentGlossary.value)
                }
                return getGlossaryByQF(props.glossaryQualifiedName)
            })
            const {
                createPermission: hasCreatePermission,
                fetch: fetchPermissions,
            } = fetchGlossaryPermission(glossaryForPermission, false)

            const handleFetchPermission = () => {
                console.log(
                    'calling fetch permissions for -> ',
                    getGlossaryByQF(parentGlossary.value)
                )
                if (parentGlossary.value) {
                    console.log('fetching again')
                    fetchPermissions()
                }
                console.log(hasCreatePermission.value)
            }
            /*
            const showRequestElements = computed(() => {
                if (role.value?.toLowerCase() === 'admin') return false
                return !hasCreatePermission.value
            })
            */
            const showModal = async () => {
                //               handleFetchPermission()
                fetchPermissions()
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
            const constructPayload = () => {
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
                            guid: getGlossaryByQF(anchorQf.value)?.guid,
                        },
                    }
                    console.log(entity)
                    if (
                        categoryGuid.value &&
                        categoryGuid.value !==
                            getGlossaryByQF(anchorQf.value)?.guid
                    ) {
                        if (typeNameTitle.value === 'Category') {
                            entity.relationshipAttributes.parentCategory = {
                                typeName: 'AtlasGlossaryCategory',
                                guid: categoryGuid.value,
                            }
                            if (!hasCreatePermission.value) {
                                entity.relationshipAttributes.parentCategory.attributes =
                                    {
                                        name: props.categoryName,
                                    }
                            }
                        }
                        if (typeNameTitle.value === 'Term') {
                            entity.relationshipAttributes.categories = [
                                {
                                    typeName: 'AtlasGlossaryCategory',
                                    guid: categoryGuid.value,
                                },
                            ]
                            if (!hasCreatePermission.value) {
                                entity.relationshipAttributes.categories[0].attributes =
                                    {
                                        name: props.categoryName,
                                    }
                            }
                        }
                    }
                }
            }
            const handleSave = () => {
                defaultRetry.value = 2
                if (entity.attributes.name) {
                    constructPayload()
                    body.value = {
                        entities: [entity],
                    }
                    const duplicateExists = checkDuplicateCategoryNames(
                        categoryGuid.value,
                        entity.attributes.name
                    )
                    if (
                        entity.typeName === 'AtlasGlossaryCategory' &&
                        duplicateExists
                    ) {
                        message.error(
                            `${entity.attributes.name} already exists on this level!`
                        )
                        return
                    }
                    mutateAsset()
                } else {
                    message.warning(`Please enter a name`)
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
                    if (props.showGlossarySelect)
                        emit(
                            'add',
                            asset.value,
                            getGlossaryByQF(anchorQf.value)
                        )
                    else emit('add', asset.value)
                    if (asset?.value?.guid)
                        router.push(`/glossary/${asset?.value?.guid}/overview`)
                } else if (defaultRetry.value > 0) {
                    defaultRetry.value -= 1
                    mutateUpdate()
                }
            })
            whenever(Enter, () => {
                if (meta.value && Enter.value) {
                    Enter.value = false
                    meta.value = false
                    if (entity.attributes.name && hasCreatePermission?.value) {
                        handleSave()
                    }
                }
            })

            watch(selectedGlossary, () => {
                parentGlossary.value = parentGlossaryQf.value
                console.log(parentGlossaryQf.value)
            })

            const handleSelectGlossary = (val) => {
                // handleFetchPermission()
                fetchPermissions()
            }
            const handleRequest = () => {
                console.log('raising request')
                let requestType
                constructPayload()
                const glossaryPayload = entity

                if (props.entityType === 'AtlasGlossary') {
                    requestType = 'create_glossary'
                } else if (props.entityType === 'AtlasGlossaryCategory')
                    requestType = 'create_category'
                else requestType = 'create_term'
                glossaryPayload.relationshipAttributes.anchor.attributes = {
                    name: props.glossaryName,
                }

                console.log(requestType)
                console.log(glossaryPayload)
                const {
                    error: requestError,
                    isLoading: isRequestLoading,
                    isReady: requestReady,
                } = useCreateRequests({
                    requestType,
                    glossaryPayload,
                })
                whenever(requestError, () => {
                    if (requestError.value) {
                        message.error(`Request failed`)
                        handleCancel()
                    }
                })
                whenever(requestReady, () => {
                    if (requestReady.value) {
                        message.success(`Request raised`)
                        handleCancel()
                    }
                })
            }
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
                parentGlossary,
                handleSelectGlossary,
                handleRequest,
                createPermission,
                hasCreatePermission,
                glossaryForPermission,
                role,
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
