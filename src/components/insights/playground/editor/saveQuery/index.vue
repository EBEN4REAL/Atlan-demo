<template>
    <AtlanModal
        v-model:title="title"
        v-model:description="description"
        :modal-visible="showSaveQueryModal"
        :title-placeholder="`Query name`"
        description-placeholder="Query description..."
        :description-word-limit="140"
        :show-description-limit="true"
        :destroy-on-close="true"
    >
        <template #leftHeader>
            <div class="flex items-center mr-1 cursor-pointer">
                <QueryFolderSelector
                    :connector="currentConnector"
                    :saved-query-type="queryType"
                    :parent-folder="parentFolder"
                    class=""
                    @folderChange="setSelectedFolder"
                />
            </div>
        </template>

        <template #rightHeader>
            <div class="text-xs">
                <!-- <a-dropdown
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
                    </template> -->
                <div class="flex flex-row-reverse" style="width: 140px">
                    <!-- <AtlanIcon
                            icon="CaretDown"
                            class="w-4 h-4 ml-1"
                        ></AtlanIcon> -->
                    <!-- <StatusBadge
                            :status-id="currentStatus"
                            :show-chip-style-status="false"
                            :show-no-status="true"
                            :show-label="true"
                            :is-tree="false"
                            class="p-0 cursor-pointer"
                        ></StatusBadge> -->
                </div>
                <!-- </a-dropdown> -->
            </div>
        </template>

        <template #footerLeft>
            <div class="flex items-center cursor-pointer gap-x-2">
                <!-- <AddClassification
                    @save-classifications="saveClassifications"
                    :selectedClassifications="selectedClassifications"
                /> -->
                <a-dropdown
                    placement="bottomLeft"
                    :trigger="['click']"
                    @click.stop="() => {}"
                >
                    <template #overlay>
                        <a-menu class="w-48">
                            <a-menu-item
                                v-for="(item, index) in List"
                                :key="item.id"
                                class="w-full p-2"
                                :class="[
                                    currentStatus === item.id
                                        ? 'bg-primary-light'
                                        : '',
                                    index === List.length - 1
                                        ? 'rounded-b-lg'
                                        : '',
                                ]"
                                @click="handleMenuClick(item)"
                            >
                                <div class="flex justify-between w-full">
                                    <div class="flex justify-between w-full">
                                        <div
                                            class="flex items-center w-full space-x-2"
                                        >
                                            <component
                                                :is="item.icon"
                                                class="w-auto h-4 ml-1 mr-2 pushtop"
                                            />
                                            {{ item.label }}
                                        </div>
                                        <AtlanIcon
                                            v-if="currentStatus === item.id"
                                            icon="Check"
                                            class="w-4 h-4 pr-4 mb-0.5 text-primary"
                                        />
                                    </div>
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <StatusBadge
                        :status-id="currentStatus"
                        :show-chip-style-status="false"
                        :show-no-status="true"
                        :show-label="true"
                        :is-tree="false"
                        class="px-2 py-1 leading-5 border rounded cursor-pointer btn-shadow min-w-max"
                    ></StatusBadge>
                </a-dropdown>
                <AddTerms
                    :selected-terms="selectedTerms"
                    class="px-2 py-1 leading-5 border rounded cursor-pointer"
                    @save-terms="saveTerms"
                />
            </div>
        </template>

        <template #actionButtons>
            <AtlanBtn
                size="sm"
                color="secondary"
                padding="compact"
                class="flex items-center justify-between h-6 py-1 ml-3 border-none cursor-pointer hover:text-primary"
                @click="closeModal"
            >
                <span>Cancel</span>
            </AtlanBtn>

            <AtlanBtn
                size="sm"
                color="primary"
                padding="compact"
                class="flex items-center justify-between h-6 py-1 ml-2 border-none cursor-pointer"
                :disabled="title.length == 0"
                @click="createSaveQuery"
            >
                <div class="flex items-center text-white rounded">
                    <AtlanIcon
                        v-if="saveQueryLoading"
                        icon="CircleLoader"
                        style="margin-right: 4px"
                        class="w-4 h-4 text-white animate-spin"
                    ></AtlanIcon>

                    <span>Save Query</span>
                </div>
            </AtlanBtn>
        </template>
    </AtlanModal>
</template>

<script lang="ts">
    import {
        onUnmounted,
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
        toRaw,
    } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { message } from 'ant-design-vue'
    import { List } from '~/constant/status'
    import QueryFolderSelector from '@/insights/explorers/queries/queryFolderSelector.vue'
    import { Folder } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import AtlanModal from '~/components/common/modal/modal.vue'
    import AddTerms from './addTerms.vue'
    import AddClassification from './addClassification.vue'

    export default defineComponent({
        name: 'SavedQueryModal',
        components: {
            AddTerms,
            AddClassification,
            StatusBadge,
            QueryFolderSelector,
            AtlanBtn,
            AtlanModal,
        },
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

            const selectedParentFolder = ref<Folder | null>(null)

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
            }

            let assetTerms = []
            const selectedTerms = ref([])
            const selectedClassifications = ref([])
            let assetClassification = []

            const saveTerms = (terms: any) => {
                selectedTerms.value = terms.value
                assetTerms = terms.value.map((el) => el?.guid)

                console.log('assetTerms save query: ', { terms, assetTerms })
            }

            const saveClassifications = (classifications: any) => {
                selectedClassifications.value = classifications.value

                assetClassification = classifications.value.classifications

                console.log('asset classifications save query: ', {
                    classifications,
                    assetClassification,
                })
            }

            const createSaveQuery = () => {
                // let terms = assetTerms
                // let classifications = assetClassification

                // console.log('hello: ', selectedParentFolder.value)

                if (Object.keys(toRaw(selectedParentFolder.value)).length) {
                    const saveQueryData = {
                        title:
                            title.value !== ''
                                ? title.value
                                : `Untitled ${getLastUntitledNumber()}`,
                        description: description.value,
                        isSQLSnippet: isSQLSnippet.value,
                        certificateStatus: currentStatus.value,
                        parentQF:
                            selectedParentFolder.value?.attributes
                                ?.qualifiedName,
                        parentGuid: selectedParentFolder.value?.guid,
                        collection:
                            selectedParentFolder.value?.typeName ===
                            'Collection'
                                ? selectedParentFolder.value?.attributes
                                      ?.qualifiedName
                                : selectedParentFolder.value?.attributes
                                      ?.collectionQualifiedName,
                    }
                    emit(
                        'onSaveQuery',
                        saveQueryData,
                        assetTerms,
                        assetClassification
                    )

                    assetClassification = []
                    assetTerms = []
                    selectedClassifications.value = {}
                    selectedTerms.value = []
                } else {
                    message.error('No collection selected')
                }
            }
            watch(showSaveQueryModal, () => {
                if (!showSaveQueryModal.value) {
                    title.value = ''
                    description.value = ''
                    selectedTerms.value = []
                    currentStatus.value = 'is_null'
                }
            })
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

                selectedTerms,
                saveClassifications,
                selectedClassifications,
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
<style lang="less" scoped>
    .btn-shadow {
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);
    }
    // .input {
    //     :global(.ant-input:focus
    //             .ant-input:hover
    //             .ant-input::selection
    //             .focus-visible) {
    //         @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
    //     }
    //     :global(.ant-input) {
    //         @apply shadow-none outline-none border-0 px-0 !important;
    //     }
    // }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
