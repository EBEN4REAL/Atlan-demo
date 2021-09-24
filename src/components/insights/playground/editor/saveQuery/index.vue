<template>
    <a-modal
        :visible="showSaveQueryModal"
        :closable="false"
        :class="$style.input"
        :footer="null"
        width="632px"
    >
        <div class="w-full p-4 text-gray-500 bg-white rounded">
            <div class="flex w-full text-xs">
                <div class="flex items-center flex-1 mr-5">
                    <div class="flex items-center mr-1">
                        <AtlanIcon
                            icon="PublicFolder"
                            class="h-4 m-0 mr-2 -ml-0.5 -mt-0.5"
                        />
                        <span>Folder</span>
                    </div>
                    <AtlanIcon icon="ChevronRight" class="h-5 m-0 -mb-0.5" />
                    <div class="flex items-center ml-1">
                        <span>New query</span>
                    </div>
                </div>
                <div>
                    <a-dropdown
                        placement="bottomLeft"
                        :trigger="['click']"
                        @click.stop="() => {}"
                    >
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    v-for="item in List"
                                    :key="item.id"
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
                    </a-dropdown>
                </div>
            </div>
            <div>
                <div class="my-2">
                    <a-input
                        :ref="titleBarRef"
                        v-model:value="title"
                        placeholder="Untitled query"
                        class="text-lg font-bold text-gray-500 border-0 shadow-none outline-none "
                    />
                </div>
                <a-textarea
                    v-model:value="description"
                    placeholder="Add Description"
                    class="text-sm text-gray-500 border-0 shadow-none outline-none "
                    :rows="4"
                />
            </div>
            <div class="flex items-center w-full">
                <div class="flex items-center border rounded px-2 py-0.5 mr-3">
                    <AtlanIcon
                        icon="Term"
                        class="h-4 m-0 mr-1.5 -mt-0.5 text-purple-500"
                    />
                    <span>Terms</span>
                </div>
                <div>
                    <a-checkbox v-model:checked="isSQLSnippet"
                        >Make SQL snippet</a-checkbox
                    >
                </div>
                <div class="flex justify-end flex-1">
                    <a-button class="" @click="closeModal">Cancel</a-button>
                    <a-button
                        type="primary"
                        class="flex items-center justify-between ml-4"
                    >
                        Create
                    </a-button>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        ref,
        onMounted,
        nextTick,
        PropType,
        toRefs,
    } from 'vue'
    import { List } from '~/constant/status'
    import StatusBadge from '@common/badge/status/index.vue'

    export default defineComponent({
        components: { StatusBadge },
        props: {
            showSaveQueryModal: {
                type: Object as PropType<boolean>,
                required: true,
            },
        },
        emits: ['update:showSaveQueryModal'],
        setup(props, { emit }) {
            const { showSaveQueryModal } = toRefs(props)
            const currentStatus: Ref<string> = ref('draft')
            const title: Ref<string> = ref('Untitled Query')
            const description: Ref<string> = ref('')
            const isSQLSnippet: Ref<boolean> = ref(false)
            const titleBarRef: Ref<null | HTMLInputElement> = ref(null)
            const handleMenuClick = (status) => {
                currentStatus.value = status.id
            }
            const closeModal = () => {
                emit('update:showSaveQueryModal', false)
            }
            onMounted(async () => {
                await nextTick()
                titleBarRef.value?.focus()
            })
            return {
                title,
                description,
                isSQLSnippet,
                titleBarRef,
                showSaveQueryModal,
                currentStatus,
                List,
                closeModal,
                handleMenuClick,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>
<style lang="less" module>
    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none border-0 px-0 !important;
        }
        :global(.ant-modal-body) {
            @apply p-0 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
