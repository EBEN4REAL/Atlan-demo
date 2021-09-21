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
            <slot name="header" />
        </template>
        <template #footer>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-4">
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
                        <a-button> {{ ownerBtnText }} </a-button>
                    </a-dropdown>
                </div>
                <div class="flex items-center justify-end space-x-3">
                    <a-switch size="small" v-model:checked="isCreateMore" />
                    <p class="p-0 m-0">Create more</p>
                    <a-button @click="handleCancel">Cancel</a-button>
                    <a-button type="primary" @click="handleOk"
                        >Add term</a-button
                    >
                </div>
            </div>
        </template>
        <div class="my-3">
            <a-input
                :ref="titleBar"
                v-model:value="title"
                placeholder="Title..."
                class="text-lg border-0 shadow-none outline-none"
            />
        </div>
        <a-input
            v-model:value="description"
            placeholder="Description..."
            class="border-0 shadow-none outline-none"
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
            parentName: {
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

            const parent = computed(() => props.parentName)
            const ownerBtnText = computed(() => {
                let str = ''
                if (ownerUsers?.value?.value?.length > 0)
                    str += `${ownerUsers?.value?.value?.length} ${
                        ownerUsers?.value?.value?.length > 1 ? 'users' : 'user'
                    }`
                if (
                    ownerUsers?.value?.value?.length > 0 &&
                    ownerGroups?.value?.value?.length > 0
                )
                    str += ' & '

                if (ownerGroups?.value?.value?.length > 0)
                    str += `${ownerGroups?.value?.value?.length} ${
                        ownerGroups?.value?.value?.length > 1
                            ? 'groups'
                            : 'group'
                    }`

                if (
                    ownerUsers?.value?.value?.length > 0 ||
                    ownerGroups?.value?.value?.length > 0
                )
                    str += ' selected'
                else str += 'Owners'
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
                if (props.categoryId === '') {
                    createTerm(
                        props.glossaryId,
                        '',
                        `${title.value === '' ? 'Untitled term' : title.value}`,
                        description.value,
                        currentStatus.value,
                        ownerUsers?.value?.value?.join(),
                        ownerGroups?.value?.value?.join()
                    )
                } else console.log('glossary->', props.glossaryId)
                console.log('category->', props.categoryId)
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
                ownerUsers.value = updatedOwners.ownerUsers
                ownerGroups.value = updatedOwners.ownerGroups
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
                parent,
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
            @apply shadow-none outline-none border-0 !important;
        }
    }
</style>
