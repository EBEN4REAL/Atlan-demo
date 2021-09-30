<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        :closable="false"
        :class="$style.input"
        width="800px"
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
                                @click="handleMenuClick(item)"
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
                        class="items-center p-0 text-xs cursor-pointer"
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
                    <a-dropdown
                        placement="topLeft"
                        :trigger="['click']"
                        @click.stop="() => {}"
                        v-model:visible="isVisible"
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
                    </a-dropdown>
                    <Categories 
                        v-if="entityType === 'term'"
                        :glossaryQualifiedName="glossaryQualifiedName"
                        :categories="mode === 'create' ? categoryId ? [{guid: categoryId}] : [] : entity.attributes.categories"
                        :termGuid="mode === 'create' ? '' : entity.guid"
                        :term="mode === 'create' ? {} : entity"
                        mode="create"
                        @updateCategories="updateSelectedCategories"
                    />
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
        PropType
    } from 'vue'

    import StatusBadge from '@common/badge/status/index.vue'
    import AddGtcModalOwners from '@/glossary/common/addGtcModalOwners.vue'
    import Categories from '@/glossary/common/categories.vue'
    
    import useCreateGlossary from '~/components/glossary/composables/useCreateGlossary'
    import whoami from '~/composables/user/whoami'
    import useUpdateGtcEntity from '@/glossary/composables/useUpdateGtcEntity'
    import { Glossary as GlossaryApi } from '~/api/atlas/glossary'

    import { List } from '~/constant/status'
    import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            StatusBadge,
            AddGtcModalOwners,
            Categories,
        },
        props: {
            entityType: {
                type: String as PropType<'glossary' | 'category' | 'term'>,
                required: true,
                default: '',
            },
            glossaryId: {
                type: String,
                required: false,
                default: '',
            },
            glossaryQualifiedName: {
                type: String,
                required: false,
                default: '',
            },
            categoryId: {
                type: String,
                required: false,
                default: '',
            },
            mode: {
                type: String,
                required: false,
                default: 'create',
            },
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: false,
                default: () => {},
            },
        },
        emits: ['onAddGlossary'],
        setup(props, { emit }) {
            const { username: myUsername, name: myName } = whoami()

            const title = ref<string | undefined>('')
            const description = ref<string | undefined>('')
            const currentStatus = ref<string | undefined>('draft')
            const ownerUsers = ref<Array<any>>([myUsername.value])
            const ownerGroups = ref<Array<any>>([])
            const selectedCategories = ref<{categoryGuid: string}[]>([]);

            const visible = ref<boolean>(false)
            const isVisible = ref<boolean>(false)
            const isCreateMore = ref<boolean>(false)
            
            const titleBar: Ref<null | HTMLInputElement> = ref(null)
            
            const refreshEntity = inject<() => void>('refreshEntity')
            const updateTreeNode: Function | undefined =
                inject<any>('updateTreeNode')
            
            const { createTerm, createCategory, createGlossary } = useCreateGlossary()

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
                currentStatus.value = 'draft'
            }
            
            const showModal = async () => {
                resetInput()
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
                if (props.mode === 'edit') {
                    title.value = props?.entity?.displayText
                    description.value =
                        props?.entity?.attributes?.shortDescription ??
                        props?.entity?.attributes?.description
                    currentStatus.value = props?.entity?.attributes?.assetStatus
                    ownerUsers.value = props?.entity?.attributes?.ownerUsers
                        ?.split(',')
                        ?.filter((s) => s !== '') ?? []

                    ownerGroups.value = props?.entity?.attributes?.ownerGroups
                        ?.split(',')
                        ?.filter((s) => s !== '') ?? []
                }
            }

            const handleOk = () => {
                if (props.mode === 'edit') {
                    const { data: updateData, updateEntity } = useUpdateGtcEntity()
                    if(!selectedCategories.value.length) {
                        updateEntity(
                            props?.entityType,
                            props.entity?.guid ?? '',
                            {
                                name: title.value ?? (props.entityType === 'term' ? 'Untitled Term' : 'Untitled category'),
                                assetStatus: currentStatus.value ?? 'draft',
                                shortDescription: description.value ?? '',
                                ownerUsers: ownerUsers?.value?.join(),
                                ownerGroups: ownerGroups?.value?.join(),
                            },
                            true
                        )
                        watch(updateData, () => {
                            if (refreshEntity) refreshEntity()
                            if (updateTreeNode) {
                                updateTreeNode({
                                    guid: props.entity?.guid,
                                    name:  title.value ?? ( props.entityType === 'term' ? 'Untitled Term' : 'Untitled category'),
                                    assetStatus: currentStatus.value ?? 'draft',
                                    ownerUsers: ownerUsers?.value?.join(),
                                    ownerGroups: ownerGroups?.value?.join(),
                                    shortDescription: description.value ?? '',
                                })
                            }
                        })
                    } else {
                        const {data, error, isLoading} = GlossaryApi.UpdateGlossaryTerm(
                        props.entity.guid ?? '',
                        {
                            name: title.value ?? (props.entityType === 'term' ? 'Untitled Term' : 'Untitled category'),
                            assetStatus: currentStatus.value ?? 'draft',
                            shortDescription: description.value ?? '',
                            ownerUsers: ownerUsers?.value?.join(),
                            ownerGroups: ownerGroups?.value?.join(),
                            anchor: {
                                glossaryGuid: props.entity.attributes.anchor.guid
                            },
                            typeName: props.entity.typeName,
                            categories: selectedCategories.value,
                        }
                    )
                    watch(data, (newData) => {
                        if(newData?.guid) {
                            if(refreshEntity) refreshEntity();
                            selectedCategories.value = []
                        }
                    })
                    }
                    
                } else {
                    if (props.entityType === 'term')
                        createTerm(
                            props.glossaryId,
                            props.categoryId,
                            `${
                                !title.value
                                    ? 'Untitled term'
                                    : title.value
                            }`,
                            description.value,
                            currentStatus.value,
                            ownerUsers?.value?.join(),
                            ownerGroups?.value?.join(),
                            selectedCategories.value
                        )
                    else if (props.entityType === 'category')
                        createCategory(
                            props.glossaryId,
                            props.categoryId,
                            `${
                                !title.value
                                    ? 'Untitled category'
                                    : title.value
                            }`,
                            description.value,
                            currentStatus.value,
                            ownerUsers?.value?.join(),
                            ownerGroups?.value?.join()
                        )
                    else if (props.entityType === 'glossary') {
                        const { data } = createGlossary(
                            `${
                                !title.value
                                    ? 'Untitled category'
                                    : title.value
                            }`,
                            description.value,
                            currentStatus.value,
                            ownerUsers?.value?.join(),
                            ownerGroups?.value?.join()
                        )
                        watch(data, (newData) => {
                            if(newData) {
                            emit('onAddGlossary')
                            }
                        })
                    }
                    resetInput()
                }
                if (!isCreateMore.value) visible.value = false
            }
            const handleMenuClick = (status) => {
                currentStatus.value = status.id
            }
            const handleCancel = () => {
                resetInput()
                visible.value = false
            }
            const handleCloseOwnersModal = () => {
                isVisible.value = false
            }
            const handleOwnersUpdated = (updatedOwners) => {
                ownerUsers.value = updatedOwners.ownerUsers.value
                ownerGroups.value = updatedOwners.ownerGroups.value
            }
            const updateSelectedCategories = (newCategories: {categoryGuid: string}[]) => {
                selectedCategories.value = newCategories;
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
                handleMenuClick,
                currentStatus,
                handleCloseOwnersModal,
                isVisible,
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
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
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
