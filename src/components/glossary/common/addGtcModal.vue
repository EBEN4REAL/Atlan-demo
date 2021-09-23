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
        <template #title class="bg-red-500 border-0">
            <slot name="header" />
        </template>
        <template #footer>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
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
                            class="p-0 cursor-pointer"
                        ></StatusBadge>
                        <AtlanIcon
                            class="pt-1 ml-4 transform -rotate-90"
                            icon="ChevronDown"
                        />
                    </a-dropdown>
                    <a-dropdown
                        placement="topLeft"
                        :trigger="['click']"
                        @click.stop="() => {}"
                        v-model:visible="isVisible"
                    >
                        <template #overlay>
                            <AddGtcModalOwners
                                @closeDropdown="handleCloseOwnersModal"
                                @ownersUpdated="handleOwnersUpdated"
                                :defaultOwner="myUsername"
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
                    <div class="flex items-center space-x-2">
                        <a-switch size="small" v-model:checked="isCreateMore" />
                        <p class="p-0 m-0">Create more</p>
                    </div>
                </div>
                <div class="flex items-center justify-end space-x-3">
                    <a-button @click="handleCancel">Cancel</a-button>
                    <a-button type="primary" @click="handleOk"
                        >Add term</a-button
                    >
                </div>
            </div>
        </template>
        <a-input
            :ref="titleBar"
            v-model:value="title"
            :placeholder="`Untitled ${entityType}`"
            class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
            :class="$style.titleInput"
        />
        <a-textarea
            v-model:value="description"
            placeholder="Add description..."
            class="text-gray-500 border-0 shadow-none outline-none"
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
        Ref,
    } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import AddGtcModalOwners from '@/glossary/common/addGtcModalOwners.vue'
    import useCreateGlossary from '~/components/glossary/composables/useCreateGlossary'
    import whoami from '~/composables/user/whoami'
    import { List } from '~/constant/status'

    export default defineComponent({
        components: {
            StatusBadge,
            AddGtcModalOwners,
        },
        props: {
            entityType: {
                type: String,
                required: true,
                default: '',
            },
            glossaryId: {
                type: String,
                required: true,
                default: '',
            },
            categoryId: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['onAddTerm'],
        setup(props, context) {
            const { username: myUsername, name: myName } = whoami()
            const title = ref<String>('')
            const description = ref<String>('')
            const currentStatus = ref<String>('draft')
            const ownerUsers = ref([myUsername.value])
            const ownerGroups = ref([])
            const visible = ref<boolean>(false)
            const isVisible = ref<boolean>(false)
            const isCreateMore = ref<boolean>(false)
            const titleBar: Ref<null | HTMLInputElement> = ref(null)
            const { createTerm, createCategory } = useCreateGlossary()

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
            const showModal = () => {
                resetInput()
                visible.value = true
            }

            const handleOk = () => {
                if (props.entityType === 'term')
                    createTerm(
                        props.glossaryId,
                        props.categoryId,
                        `${title.value === '' ? 'Untitled term' : title.value}`,
                        description.value,
                        currentStatus.value,
                        ownerUsers?.value?.value?.join(),
                        ownerGroups?.value?.value?.join()
                    )
                else if (props.entityType === 'category')
                    createCategory(
                        props.glossaryId,
                        props.categoryId,
                        `${title.value === '' ? 'Untitled term' : title.value}`,
                        description.value,
                        currentStatus.value,
                        ownerUsers?.value?.value?.join(),
                        ownerGroups?.value?.value?.join()
                    )

                if (!isCreateMore.value) visible.value = false

                resetInput()
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
            onMounted(async () => {
                await nextTick()
                titleBar.value?.focus()
            })

            return {
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
            @apply px-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
