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
                        <!-- <div class="relative w-4 h-4 mr-2 overflow-hidden">
                            <div class="absolute absolute-center">
                                <AtlanIcon
                                    icon="FolderClosed"
                                    class="h-4 m-0 -ml-0.5 mr-2 -mt-0.5"
                                />
                            </div>
                            <div class="absolute absolute-center">
                                <AtlanIcon
                                    icon="PrivateFolder"
                                    class="h-4 m-0 -ml-0.5 -mt-0.5 absolute"
                                />
                            </div>
                        </div>-->
                        <QueryFolderSelector
                            :connector="currentConnector"
                            :savedQueryType="queryType"
                            :selectedFolderQF="parentFolderQF"
                            @folderChange="selectFolder"
                        />
                    </div>
                    <!-- <AtlanIcon icon="ChevronRight" class="h-5 m-0 -mb-0.5" />
                    <div class="flex items-center ml-1">
                        <span>{{ title }}</span>
                    </div>-->
                </div>
                <div>
                    <a-dropdown placement="bottomLeft" :trigger="['click']" @click.stop="() => { }">
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
            <div class="my-2">
                <div class>
                    <a-input
                        :ref="titleBarRef"
                        v-model:value="title"
                        :placeholder="`Untitled ${getLastUntitledNumber()}`"
                        class="text-lg font-bold text-gray-500 border-0 shadow-none outline-none"
                    />
                </div>
                <a-textarea
                    v-model:value="description"
                    placeholder="Add Description"
                    class="text-sm text-gray-500 border-0 shadow-none outline-none"
                    :rows="3"
                    show-count
                    :maxlength="140"
                />
            </div>
            <div class="flex items-center w-full">
                <div class="flex items-center border rounded px-2 py-0.5 mr-3 text-xs">
                    <AtlanIcon icon="Term" class="h-4 m-0 mr-1.5 -mt-0.5 text-purple-500" />
                    <span>Terms</span>
                </div>
                <!-- <div
                    class="
                        flex
                        items-center
                        border
                        rounded
                        px-2
                        py-0.5
                        mr-3
                        text-xs
                    "
                >
                    <AtlanIcon
                        icon="Shield"
                        class="h-4 m-0 mr-1.5 -mt-0.5 text-pink-400"
                    />
                    <span>Classifications</span>
                </div>-->
                <!-- <div>
                    <a-checkbox
                        v-model:checked="isSQLSnippet"
                        class="text-xs text-gray-500"
                        >Make SQL snippet</a-checkbox
                    >
                </div>-->
                <div class="flex items-center justify-end flex-1 mb-1 text-gray-700 cursor-pointer">
                    <!-- <div @click="closeModal" class="hover:text-primary">
                        Cancel
                    </div>-->

                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-3 border-none hover:text-primary"
                        @click="closeModal"
                    >
                        <span>Cancel</span>
                    </AtlanBtn>

                    <AtlanBtn
                        size="sm"
                        color="primary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-2 border-none"
                        @click="createSaveQuery"
                    >
                        <div class="flex items-center text-white rounded">
                            <AtlanIcon
                                v-if="saveQueryLoading"
                                icon="CircleLoader"
                                style="margin-right: 4px"
                                class="w-4 h-4 text-white animate-spin"
                            ></AtlanIcon>

                            <span>Create</span>
                        </div>
                    </AtlanBtn>

                    <!-- <a-button
                        type="primary border-none"
                        class="flex items-center justify-between ml-4"
                        :loading="saveQueryLoading"
                    ></a-button>-->
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
import {
    ComputedRef,
    defineComponent,
    Ref,
    ref,
    inject,
    onMounted,
    nextTick,
    PropType,
    toRefs,
    watch,
} from 'vue'
import { List } from '~/constant/status'
import StatusBadge from '@common/badge/status/index.vue'
import QueryFolderSelector from '@/insights/explorers/queries/queryFolderSelector.vue'
import { Folder } from '~/types/insights/savedQuery.interface'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import AtlanBtn from '~/components/UI/button.vue'

export default defineComponent({
    components: { StatusBadge, QueryFolderSelector, AtlanBtn },
    props: {
        showSaveQueryModal: {
            type: Object as PropType<boolean>,
            required: true,
        },
        saveQueryLoading: {
            type: Object as PropType<boolean>,
            required: true,
        },
        parentFolderQF: {
            type: String,
            required: true,
            default: 'root',
        },
        connector: {
            type: String as PropType<string | undefined>,
            required: true,
            default: '',
        },
        savedQueryType: {
            type: String as PropType<'personal' | 'all'>,
            required: true,
            default: 'personal',
        },
    },
    emits: ['update:showSaveQueryModal', 'onSaveQuery'],
    setup(props, { emit }) {
        const { showSaveQueryModal, saveQueryLoading } = toRefs(props)
        const currentStatus: Ref<string | undefined> = ref('DRAFT')
        const title: Ref<string> = ref('')
        const description: Ref<string | undefined> = ref('')
        const isSQLSnippet: Ref<boolean | undefined> = ref(false)
        const titleBarRef: Ref<null | HTMLInputElement> = ref(null)
        const selectedParentFolder = ref<Folder | null>(null)
        const untitledRegex = /(?:Untitled )([0-9]+)/gim
        const inlineTabs = inject('inlineTabs') as ComputedRef<
            activeInlineTabInterface[]
        >
        const {
            savedQueryType: queryType,
            connector: currentConnector,
            parentFolderQF,
        } = toRefs(props)
        const handleMenuClick = (status) => {
            currentStatus.value = status.id
            console.log(currentStatus.value)
        }
        const closeModal = () => {
            emit('update:showSaveQueryModal', false)
        }
        const clearData = () => {
            title.value = ''
            description.value = ''
            isSQLSnippet.value = false
            currentStatus.value = 'DRAFT'
        }
        const getLastUntitledNumber = () => {
            let max_number = 1
            const untitledRegex = /(?:Untitled )([0-9]+)/gim
            inlineTabs.value?.forEach((tab) => {
                const d = [...tab.label.matchAll(untitledRegex)]
                if (d.length > 0) {
                    max_number = Number(d[0][1])
                }
            })
            return max_number
        }
        const createSaveQuery = () => {
            const saveQueryData = {
                title:
                    title.value !== ''
                        ? title.value
                        : `Untitled ${getLastUntitledNumber()}`,
                description: description.value,
                isSQLSnippet: isSQLSnippet.value,
                certificateStatus: currentStatus.value,
                parentQF:
                    selectedParentFolder.value?.attributes?.qualifiedName,
                parentGuid: selectedParentFolder.value?.guid,
            }
            emit('onSaveQuery', saveQueryData)
        }
        onMounted(async () => {
            await nextTick()
            titleBarRef.value?.focus()
        })
        const selectFolder = (folder: Folder) => {
            selectedParentFolder.value = folder
        }
        return {
            getLastUntitledNumber,
            parentFolderQF,
            title,
            queryType,
            currentConnector,
            description,
            isSQLSnippet,
            titleBarRef,
            currentStatus,
            List,
            showSaveQueryModal,
            saveQueryLoading,
            clearData,
            closeModal,
            createSaveQuery,
            handleMenuClick,
            selectFolder,
        }
    },
})
</script>
<style lang="less" scoped>
.placeholder {
    background-color: #f4f4f4;
}
.absolute-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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