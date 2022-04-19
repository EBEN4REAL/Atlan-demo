<template>
    <div>
        <a-popover
            v-model:visible="isEdit"
            placement="leftTop"
            :overlay-class-name="$style.termPopover"
            :trigger="['click']"
            @visibleChange="onPopoverClose"
        >
            <template #content>
                <div
                    v-if="!editPermission && role !== 'Guest'"
                    class="px-3 py-2 mx-4 mb-3 bg-gray-100"
                >
                    You don't have edit access. Suggest Terms and
                    <span class="text-primary cursor-pointer">
                        <a-popover placement="rightBottom">
                            <template #content>
                                <AdminList></AdminList>
                            </template>
                            <span>Admins</span>
                        </a-popover>
                    </span>
                    can review your request.
                </div>
                <GlossaryTree
                    v-model:checkedGuids="checkedGuids"
                    :checkable="true"
                    @check="onCheck"
                    @searchItemCheck="onSearchItemCheck"
                    v-model:disabledGuids="disabledGuids"
                />
                <div
                    v-if="!editPermission && role !== 'Guest'"
                    class="flex items-center justify-end mx-2 space-x-2"
                >
                    <a-button @click="handleCancelRequest">Cancel</a-button>
                    <a-button
                        type="primary"
                        :loading="requestLoading"
                        @click="handleRequest"
                        class="bg-primary"
                        >Submit Request</a-button
                    >
                </div>
            </template>
        </a-popover>
        <div class="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <a-tooltip
                placement="left"
                :title="
                    !editPermission && role === 'Guest'
                        ? `You don't have permission to add owners to this asset`
                        : ''
                "
                :mouse-enter-delay="0.5"
            >
                <a-button
                    shape="circle"
                    :disabled="role === 'Guest' && !editPermission"
                    size="small"
                    class="text-center shadow"
                    :class="{
                        editPermission:
                            'hover:bg-primary-light hover:border-primary',
                    }"
                    @click="() => (isEdit = true)"
                >
                    <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
                ></a-button>
            </a-tooltip>
            <template v-for="term in list" :key="term.guid">
                <TermPopover
                    :term="term"
                    :passing-fetched-term="true"
                    :is-fetched-term-loading="termLoading"
                    :fetched-term="getFetchedTerm(term.guid)"
                    trigger="hover"
                    :mouse-enter-delay="termMouseEnterDelay"
                    @visible="
                        () => {
                            handleTermPopoverVisibility(true, term)
                        }
                    "
                >
                    <TermPill
                        :term="term"
                        :allow-delete="allowDelete"
                        @delete="handleDeleteTerm"
                        @toggle-drawer="handleDrawerVisible(term)"
                        @mouseenter="termEnteredPill"
                        @mouseleave="termLeftPill"
                    />
                </TermPopover>
            </template>
        </div>
        <AssetDrawer
            :data="drawerAsset"
            :show-drawer="isTermDrawerVisible"
            @closeDrawer="handleCloseDrawer"
            @update="handleListUpdate"
            :show-close-btn="isTermDrawerVisible"
        />
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
        defineAsyncComponent,
        inject,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { useVModels, whenever } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useCreateRequests } from '~/composables/requests/useCreateRequests'
    import whoami from '~/composables/user/whoami.ts'

    import GlossaryTree from '~/components/glossary/index.vue'
    import TermPill from '@/common/pills/term.vue'
    import TermPopover from '@/common/popover/glossary/index.vue'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'

    export default defineComponent({
        name: 'TermsWidget',
        components: {
            GlossaryTree,
            TermPill,
            TermPopover,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
            AssetDrawer: defineAsyncComponent(
                () => import('@/common/assets/preview/drawer.vue')
            ),
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
                required: false,
            },
            allowDelete: {
                type: Boolean,
                required: false,
                default: null,
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        // emits: ['update:selectedAsset'],
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const checkedGuids = ref(modelValue.value.map((term) => term.guid))
            const disabledGuids = computed(() =>
                props.editPermission ? [] : checkedGuids.value
            )
            const hasBeenEdited = ref(false)
            const isEdit = ref(false)
            const isTermDrawerVisible = ref(false)
            const drawerAsset = ref()
            const list = computed(() =>
                localValue.value.filter(
                    (term) => term.attributes?.__state === 'ACTIVE'
                )
            )

            const existingTerms = computed(() => selectedAsset.value?.meanings)
            const requestLoading = ref()
            const newTerms = ref([])
            const { role } = whoami()
            const onPopoverClose = (visible) => {
                if (!visible && hasBeenEdited.value) {
                    modelValue.value = localValue.value
                    if (props.editPermission) emit('change', localValue.value)
                    hasBeenEdited.value = false
                }
            }

            const onCheck = (checkedNodes) => {
                if (props.editPermission) {
                    checkedNodes.forEach((term) => {
                        if (
                            !localValue.value.find(
                                (localTerm) =>
                                    (localTerm.guid ?? localTerm.termGuid) ===
                                    term.guid
                            )
                        )
                            localValue.value.push(term)
                    })
                    localValue.value = localValue.value.filter((term) =>
                        checkedGuids.value.includes(term.termGuid ?? term.guid)
                    )
                } else {
                    checkedNodes.forEach((term) => {
                        if (
                            !newTerms.value.find(
                                (localTerm) =>
                                    (localTerm.guid ?? localTerm.termGuid) ===
                                    term.guid
                            )
                        )
                            newTerms.value.push(term)
                    })
                    newTerms.value = newTerms.value.filter((term) =>
                        checkedGuids.value.includes(term.termGuid ?? term.guid)
                    )
                }
                hasBeenEdited.value = true
            }

            const onSearchItemCheck = (checkedNode, checked) => {
                if (checked) {
                    if (props.editPermission) localValue.value.push(checkedNode)
                    else newTerms.value.push(checkedNode)
                } else {
                    if (props.editPermission) {
                        localValue.value = localValue.value?.filter(
                            (localTerm) =>
                                (localTerm.guid ?? localTerm.termGuid) !==
                                checkedNode.guid
                        )
                    } else {
                        newTerms.value = newTerms.value?.filter(
                            (localTerm) =>
                                (localTerm.guid ?? localTerm.termGuid) !==
                                checkedNode.guid
                        )
                    }
                }
                hasBeenEdited.value = true
            }

            const handleDeleteTerm = (term) => {
                localValue.value = localValue.value?.filter(
                    (localTerm) =>
                        (localTerm.guid ?? localTerm.termGuid) !==
                        (term.guid ?? term.termGuid)
                )

                modelValue.value = localValue.value
                checkedGuids.value = checkedGuids.value.filter(
                    (guid) => guid !== term.guid
                )
                emit('change', localValue.value)
            }
            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                checkedGuids.value = modelValue.value.map(
                    (term) => term.termGuid ?? term.guid
                )
            })

            const {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
            } = useTermPopover()

            const handleCloseDrawer = () => {
                isTermDrawerVisible.value = false
            }
            const handleDrawerVisible = (term) => {
                isTermDrawerVisible.value = true
                if (term) {
                    handleTermPopoverVisibility(true, term)
                    drawerAsset.value = getFetchedTerm(term.guid)
                }
            }
            const handleListUpdate = (asset) => {
                drawerAsset.value = asset
                if (drawerAsset.value) {
                    const temp = list.value.map((el) => {
                        if (el?.guid === drawerAsset.value?.guid) {
                            console.log(el)
                            return drawerAsset.value
                        }
                        return el
                    })
                    localValue.value = temp
                    console.log(localValue.value)
                }
            }

            const handleOpenPopover = () => {
                isEdit.value = true
                requestLoading.value = false
            }
            const handleRequest = () => {
                newTerms.value = newTerms.value?.filter((el) => {
                    if (
                        !existingTerms.value?.find(
                            (i) => (i?.guid ?? i?.termGuid) === el?.guid
                        )
                    ) {
                        return el
                    }
                })
                const {
                    error: requestError,
                    isLoading: isRequestLoading,
                    isReady: requestReady,
                } = useCreateRequests({
                    assetGuid: selectedAsset.value?.guid,
                    assetQf: selectedAsset.value?.attributes?.qualifiedName,
                    assetType: selectedAsset.value?.typeName,
                    terms: newTerms.value,
                })
                whenever(requestError, () => {
                    if (requestError.value) {
                        message.error(`Request failed`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                whenever(requestReady, () => {
                    if (requestReady.value) {
                        message.success(`Request raised`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                requestLoading.value = isRequestLoading.value
            }
            const handleCancelRequest = () => {
                isEdit.value = false
                requestLoading.value = false
            }

            const {
                mouseEnterDelay: termMouseEnterDelay,
                enteredPill: termEnteredPill,
                leftPill: termLeftPill,
            } = useMouseEnterDelay()

            return {
                getFetchedTerm,
                isReady,
                termError,
                termLoading,
                handleTermPopoverVisibility,
                list,
                onCheck,
                onPopoverClose,
                localValue,
                checkedGuids,
                onSearchItemCheck,
                handleDeleteTerm,
                isEdit,
                handleDrawerVisible,
                isTermDrawerVisible,
                handleCloseDrawer,
                drawerAsset,
                handleListUpdate,
                handleRequest,
                requestLoading,
                handleOpenPopover,
                handleCancelRequest,
                role,
                disabledGuids,
                termMouseEnterDelay,
                termLeftPill,
                termEnteredPill,
            }
        },
    })
</script>
<style lang="less" module>
    .termPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 350px !important;
        }
        height: 300px !important;
    }
</style>
