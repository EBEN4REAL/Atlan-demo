<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="800px"
        :closable="false"
    >
        <template #title>
            <div class="flex items-center justify-between w-full">
                <slot name="header" />

                <a-dropdown
                    placement="bottomLeft"
                    :trigger="['click']"
                    @click.stop="() => {}"
                >
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                v-for="item in List"
                                :key="item"
                                @click="handleCertificationMenuClick(item)"
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
                    <StatusBadge
                        :status-id="currentStatus"
                        :show-chip-style-status="false"
                        :show-no-status="true"
                        :show-label="true"
                        class="items-center p-0 text-sm cursor-pointer"
                    ></StatusBadge>
                    <AtlanIcon
                        class="pt-1 ml-4 transform -rotate-90"
                        icon="ChevronDown"
                    />
                </a-dropdown>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                    <!-- <a-dropdown
                        placement="topLeft"
                        :trigger="['click']"
                        @click.stop="() => {}"
                        v-model:visible="isOwnersVisible"
                    >
                        <template #overlay>
                            <AddGtcModalOwners
                                :defaultOwner="ownerUsers?.join() ?? ''"
                                :defaultGroups="ownerGroups?.join() ?? ''"
                                @closeDropdown="handleCloseOwnersModal"
                                @ownersUpdated="handleOwnersUpdated"
                                class="px-4 py-2"
                            />
                        </template>
                        <a-button class="flex items-center">
                            <AtlanIcon
                                v-if="ownerUsers?.length <= 1"
                                icon="User"
                                class="m-0 mr-1"
                            />
                            <AtlanIcon
                                v-else
                                icon="Group"
                                class="h-4 mr-2  text-primary group-hover:text-white"
                            />
                            <span
                                class="capitalize"
                                :class="{
                                    'text-primary': ownerUsers?.length > 1,
                                }"
                            >
                                {{ ownerBtnText }}
                            </span>
                        </a-button>
                    </a-dropdown> -->

                    <!-- <Categories
                        v-if="entityType === 'term'"
                        :parentGlossaryQualifiedName="parentGlossaryQualifiedName"
                        :categories="
                            mode === 'create'
                                ? parentCategoryGuid
                                    ? [{ guid: parentCategoryGuid }]
                                    : []
                                : entity.attributes.categories
                        "
                        :termGuid="mode === 'create' ? '' : entity.guid"
                        :term="mode === 'create' ? {} : entity"
                        mode="create"
                        @updateCategories="updateSelectedCategories"
                    /> -->

                    <div
                        v-if="mode !== 'edit'"
                        class="flex items-center space-x-2"
                    >
                        <a-switch size="small" v-model:checked="isCreateMore" />
                        <p class="p-0 m-0">Create more</p>
                    </div>
                </div>
                <div class="flex items-center justify-end space-x-3">
                    <a-button @click="handleCancel">Cancel</a-button>
                    <a-button type="primary" @click="handleOk">{{
                        mode !== 'edit' ? 'Create' : 'Edit'
                    }}</a-button>
                </div>
            </div>
        </template>
        
        <a-input
            ref="titleBar"
            v-model:value="title"
            :placeholder="`Untitled ${entityType}`"
            class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
            :class="$style.titleInput"
        />
        <a-textarea
            v-model:value="description"
            placeholder="Add description..."
            class="text-gray-500 border-0 shadow-none outline-none"
            :maxlength="140"
            :rows="2"
        />
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
    } from 'vue'
    import { useVModels } from '@vueuse/core'

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

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
            StatusBadge,
            // AddGtcModalOwners,
            // Categories,
        },
        props: {
            entityType: {
                type: String as PropType<'glossary' | 'category' | 'term'>,
                required: true,
            },
            parentGlossaryGuid: {
                type: String,
                required: false,
                default: ''
            },
            parentGlossaryQualifiedName: {
                type: String,
                required: false,
            },
            parentCategoryGuid: {
                type: String,
                required: false,
            },
            categoryQualifiedName: {
                type: String,
                required: false,
            },
            mode: {
                type: String as PropType<'edit' | 'create'>,
                required: false,
                default: 'create',
            },
            entity: { // needed only if mode == 'edit'
                type: Object as PropType<Glossary | Category | Term>,
                required: false,
                default: () => {},
            },
            visible: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['onAddGlossary', 'update:visible'],
        setup(props, { emit }) {
            const { username: myUsername } = whoami()

            const { entity } = toRefs(props)
            const visible = ref(props.visible)

            const title = ref<string>('')
            const description = ref<string | undefined>('')
            const currentStatus = ref<"DRAFT" | "VERIFIED" | "ISSUE" | undefined>('DRAFT')
            const ownerUsers = ref<string[]>([myUsername.value])
            const ownerGroups = ref<string[]>([])
            const selectedCategories = ref<{ categoryGuid: string }[]>([])
            const addedCategories = ref([])
            const removedCategories = ref([])

            const isOwnersVisible = ref<boolean>(false)
            const isCreateMore = ref<boolean>(false)

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const refreshEntity = inject<() => void>('refreshEntity')
            // const currentProfile = inject<Ref<Glossary | Term | Category>>('currentEntity')

            const updateTreeNode: Function | undefined =
                inject<any>('updateTreeNode')
            const reorderTreeNodes =
                inject<
                    (
                        guid: string,
                        fromGuid?: string,
                        toGuid?: string,
                        categories?: { categoryGuid: string }[]
                    ) => void
                >('reorderTreeNodes', () => {})

            const { createTerm, createCategory, createGlossary } =
                useCreateGlossary()

            const ownerBtnText = computed(() => {
                let str = ''
                if (ownerUsers?.value?.length === 1) str += ownerUsers.value
                if (ownerUsers?.value?.length > 1)
                    str += `${ownerUsers?.value?.length} users`
                if (
                    ownerUsers?.value?.length > 0 &&
                    ownerGroups?.value?.length > 0
                )
                    str += ' & '

                if (ownerGroups?.value?.length > 0)
                    str += `${ownerGroups?.value?.length} ${
                        ownerGroups?.value?.length > 1 ? 'groups' : 'group'
                    }`
                if (
                    ownerUsers.value.length === 0 &&
                    ownerGroups.value.length == 0
                )
                    str += 'Owners'
                return str
            })

            const resetInput = () => {
                title.value = ''
                description.value = ''
                currentStatus.value = 'DRAFT'
            }

            const showModal = async () => {
                resetInput()
                visible.value = true
                await nextTick()
                titleBar.value?.focus()

                if (props.mode === 'edit') {
                    title.value = props?.entity?.displayText ?? ''
                    description.value =
                        props?.entity?.attributes?.shortDescription ??
                        props?.entity?.attributes?.description
                    currentStatus.value =
                        props?.entity?.attributes?.certificateStatus
                    ownerUsers.value =
                        props?.entity?.attributes?.ownerUsers ?? []
                    ownerGroups.value =
                        props?.entity?.attributes?.ownerGroups ?? []
                }
            }

            const handleOk = () => {
                title.value = title.value.length ? title.value : `Untitled ${props.entityType}`
                if (props.mode === 'edit') {
                    // if (!selectedCategories.value.length) {
                    const { data } =
                        useUpdateGtcEntity(
                            {
                                typeName: entity.value.typeName,
                                qualifiedName: entity.value.attributes.qualifiedName,
                                name: entity.value.attributes.name,
                                anchor: entity.value.attributes?.anchor,
                                updates: {
                                    name:
                                        title.value,
                                    certificateStatus:
                                        currentStatus.value ?? 'DRAFT',
                                    shortDescription: description.value ?? '',
                                    ownerUsers: ownerUsers?.value,
                                    ownerGroups: ownerGroups?.value,  
                                    categories: selectedCategories.value
                                }
                            }
                        )
                        watch(data, () => {
                            // if (refreshEntity && currentProfile?.value?.guid === props.entity?.guid) refreshEntity()
                            if (updateTreeNode) {
                                updateTreeNode({
                                    guid: props.entity?.guid,
                                    name:
                                        title.value ??
                                        (props.entityType === 'term'
                                            ? 'Untitled Term'
                                            : 'Untitled category'),
                                    certificateStatus:
                                        currentStatus.value ?? 'DRAFT',
                                    ownerUsers: ownerUsers?.value?.join(),
                                    ownerGroups: ownerGroups?.value?.join(),
                                    shortDescription: description.value ?? '',
                                })
                            }

                            if (entity) {
                                entity.value.attributes.certificateStatus =
                                    currentStatus.value
                                entity.value.attributes.ownerUsers =
                                    ownerUsers?.value
                                entity.value.attributes.ownerGroups =
                                    ownerGroups?.value
                                entity.value.attributes.shortDescription =
                                    description?.value
                                entity.value.attributes.name = title.value
                                entity.value.displayText = title.value
                                if(entity.value.typeName === 'AtlasGlossaryTerm')
                                    entity.value.attributes.categories = selectedCategories.value
                            }
                            if (reorderTreeNodes) {
                                addedCategories.value.forEach(
                                    (category: any) => {
                                        reorderTreeNodes(
                                            props.entity?.guid ?? '',
                                            undefined,
                                            category.guid,
                                            selectedCategories.value
                                        )
                                    }
                                )
                                if(selectedCategories.value.length && addedCategories.value.length) {
                                    reorderTreeNodes(
                                        props.entity?.guid ?? '',
                                        'root',
                                        undefined,
                                        selectedCategories.value
                                    )
                                }

                                if(!selectedCategories.value.length && removedCategories.value.length) {
                                    reorderTreeNodes(
                                        props.entity?.guid ?? '',
                                        undefined,
                                        'root',
                                        selectedCategories.value
                                    )
                                }
                                removedCategories.value.forEach(
                                    (category: any) => {
                                        reorderTreeNodes(
                                            props.entity?.guid ?? '',
                                            category.guid,
                                            undefined,
                                            selectedCategories.value
                                        )
                                    }
                                )
                            }
                            selectedCategories.value = []
                        })
                } 
                else {
                    if (props.entityType === 'term')
                        createTerm({
                            parentGlossaryGuid: props.parentGlossaryGuid,
                            parentCategoryGuid: props.parentCategoryGuid,
                            parentCategoryQf: props.categoryQualifiedName,
                            title: title.value,
                            description: description.value,
                            status: currentStatus.value,
                            ownerUsers: ownerUsers?.value,
                            ownerGroups: ownerGroups?.value,
                            categories: selectedCategories.value
                        })
                    else if (props.entityType === 'category')
                        createCategory({
                            parentGlossaryGuid: props.parentGlossaryGuid,
                            parentCategoryGuid: props.parentCategoryGuid,
                            parentCategoryQf: props.categoryQualifiedName,
                            title: title.value,
                            description: description.value,
                            status: currentStatus.value,
                            ownerUsers: ownerUsers?.value,
                            ownerGroups: ownerGroups?.value
                        })
                    else if (props.entityType === 'glossary') {
                        const { data } = createGlossary({
                            title: title.value,
                            description: description.value,
                            status: currentStatus.value,
                            ownerUsers: ownerUsers?.value,
                            ownerGroups: ownerGroups?.value
                        })
                        watch(data, (newData) => {
                            if (newData) {
                                if (refreshEntity) refreshEntity()
                                setTimeout(() => {
                                    emit('onAddGlossary')
                                }, 500)
                            }
                        })
                    }
                    resetInput()
                }
                if (!isCreateMore.value) visible.value = false
            }
            const handleCertificationMenuClick = (status) => {
                currentStatus.value = status.id
            }
            const handleCancel = () => {
                resetInput()
                visible.value = false
            }
            const handleCloseOwnersModal = () => {
                isOwnersVisible.value = false
            }
            const handleOwnersUpdated = (updatedOwners) => {
                ownerUsers.value = updatedOwners.ownerUsers.value
                ownerGroups.value = updatedOwners.ownerGroups.value
            }
            const updateSelectedCategories = (
                newCategories: { categoryGuid: string }[],
                added: any,
                removed: any
            ) => {
                selectedCategories.value = newCategories
                addedCategories.value = added
                removedCategories.value = removed
            }
            onMounted(async () => {
                await nextTick()
                titleBar.value?.focus()
            })

            return {
                selectedCategories,
                handleOk,
                handleCancel,
                description,
                title,
                showModal,
                visible,
                isCreateMore,
                titleBar,
                List,
                handleCertificationMenuClick,
                currentStatus,
                handleCloseOwnersModal,
                isOwnersVisible,
                handleOwnersUpdated,
                ownerGroups,
                ownerUsers,
                myUsername,
                ownerBtnText,
                updateSelectedCategories,
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
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-4 pt-0 pb-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
