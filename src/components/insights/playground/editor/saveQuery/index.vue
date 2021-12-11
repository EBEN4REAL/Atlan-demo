<template>
    <a-modal
        :visible="showSaveQueryModal"
        :closable="false"
        :class="$style.input"
        :footer="null"
        width="632px"
        :destroyOnClose="true"
    >
        <div class="w-full p-4 text-gray-500 bg-white rounded">
            <div class="flex w-full text-xs">
                <div class="flex items-center justify-between flex-1">
                    <div class="flex items-center mr-1">
                        <!-- {{ currentConnector }} -->
                        <QueryFolderSelector
                            :connector="currentConnector"
                            :savedQueryType="queryType"
                            :parentFolder="parentFolder"
                            @folderChange="setSelectedFolder"
                        />
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
                                        <div
                                            class="flex items-center space-x-2"
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
                            <div class="button">
                                <StatusBadge
                                    :status-id="currentStatus"
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
                <!-- <AddTerms @saveTerms="saveTerms" /> -->

                <div
                    class="flex items-center justify-end flex-1 mb-1 text-gray-700 cursor-pointer"
                >
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
    import StatusBadge from '@common/badge/status/index.vue'
    import { List } from '~/constant/status'
    import QueryFolderSelector from '@/insights/explorers/queries/queryFolderSelector.vue'
    import { Folder } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import AtlanBtn from '~/components/UI/button.vue'

    import useLinkAssets from '~/components/glossary/composables/useLinkAssets'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    // import AddTerms from './addTerms.vue'

    export default defineComponent({
        name: 'SavedQueryModal',
        components: { StatusBadge, QueryFolderSelector, AtlanBtn },
        props: {
            showSaveQueryModal: {
                type: Boolean as PropType<boolean>,
                required: true,
            },
            saveQueryLoading: {
                type: Boolean as PropType<boolean>,
                required: true,
            },
            parentFolder: {
                type: Object as PropType<object | undefined>,
                required: false,
                default: {},
            },
            connector: {
                type: String as PropType<string | undefined>,
                required: true,
                default: '',
            },
            savedQueryType: {
                type: Object as PropType<object>,
                required: false,
            },
        },
        emits: ['update:showSaveQueryModal', 'onSaveQuery'],
        setup(props, { emit }) {
            const { showSaveQueryModal, saveQueryLoading } = toRefs(props)
            /* Initial status will be null */
            const currentStatus: Ref<string | undefined> = ref('is_null')
            const title: Ref<string> = ref('')
            const description: Ref<string | undefined> = ref('')
            const isSQLSnippet: Ref<boolean | undefined> = ref(false)
            const titleBarRef: Ref<null | HTMLInputElement> = ref(null)
            // const queryFolderNamespace = inject<Ref<Folder>>(
            //     'queryFolderNamespace',
            //     ref({}) as Ref<Folder>
            // )
            const selectedParentFolder = ref<Folder | null>(null)
            const selectedFolderClassification = ref(null)

            const untitledRegex = /(?:Untitled )([0-9]+)/gim
            const inlineTabs = inject('inlineTabs') as ComputedRef<
                activeInlineTabInterface[]
            >
            const {
                savedQueryType: queryType,
                connector: currentConnector,
                parentFolder,
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
            const setSelectedFolder = (folder) => {
                selectedParentFolder.value = folder.dataRef
                selectedFolderClassification.value =
                    folder.selectedFolderClassification
            }

            let assetTerms = []

            const saveTerms = (terms: any) => {
                assetTerms = terms.value.map((el) => el?.props?.guid)

                console.log('assetTerms save query: ', assetTerms)
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
                emit(
                    'onSaveQuery',
                    saveQueryData,
                    assetTerms,
                    selectedFolderClassification.value
                )
            }
            onMounted(async () => {
                await nextTick()
                titleBarRef.value?.focus()
            })

            return {
                getLastUntitledNumber,
                parentFolder,
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
                selectedParentFolder,
                setSelectedFolder,

                saveTerms,
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
    .button {
        --tw-bg-opacity: 1;
        background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
        border-width: 1 px;
        --tw-border-opacity: 1;
        border-color: rgba(230, 230, 235, var(--tw-border-opacity));
        padding: 4 px 8 px !important;
        min-width: 71 px !important;
        height: 22 px !important;
        box-sizing: border-box !important;
        border-radius: 4 px !important;
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
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
