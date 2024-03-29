<template>
    <div>
        <div v-if="isEdit" class="freeze-clicks-outside-popover"></div>

        <a-popover
            v-if="editPermission"
            v-model:visible="isEdit"
            placement="leftTop"
            :overlay-class-name="$style.termPopover"
            :trigger="['click']"
            @visibleChange="onPopoverClose"
        >
            <template #content>
                <GlossaryTree
                    v-model:checkedGuids="checkedGuids"
                    :checkable="true"
                    :disabledGuids="[selectedAsset.guid]"
                    @check="onCheck"
                    @searchItemCheck="onSearchItemCheck"
                />
            </template>
        </a-popover>
        <div class="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <a-tooltip
                placement="left"
                :title="
                    !editPermission
                        ? `You don't have permission to link terms to this asset`
                        : ''
                "
                :mouse-enter-delay="0.5"
            >
                <a-button
                    shape="circle"
                    :disabled="!editPermission"
                    size="small"
                    class="text-center shadow"
                    :class="{
                        editPermission:
                            'hover:bg-primary-light hover:border-primary',
                    }"
                    @click="() => (isEdit = true)"
                >
                    <span
                        ><AtlanIcon
                            icon="Add"
                            class="h-3"
                        ></AtlanIcon></span></a-button
            ></a-tooltip>

            <template v-for="term in list" :key="term.guid">
                <TermPopover
                    :term="term"
                    trigger="hover"
                    :mouse-enter-delay="termMouseEnterDelay"
                    :passing-fetched-term="true"
                    :fetched-term="getFetchedTerm(term.guid)"
                    :is-fetched-term-loading="termLoading"
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
                        @mouseleave="termLeftPill"
                        @mouseenter="termEnteredPill"
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
    import { useVModels } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import GlossaryTree from '~/components/glossary/index.vue'
    import TermPill from '@/common/pills/term.vue'
    import TermPopover from '@/common/popover/glossary/index.vue'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'

    export default defineComponent({
        name: 'RelatedTerms',
        components: {
            GlossaryTree,
            TermPill,
            TermPopover,
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
            attributeType: {
                type: String,
                required: false,
                default: () => 'seeAlso',
            },
        },
        // emits: ['update:selectedAsset'],
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const { synonyms,seeAlso, preferredTerms, antonyms } = useAssetInfo()
            const localValue = ref(modelValue.value)
            const checkedGuids = ref(modelValue.value.map((term) => term.guid))
            const hasBeenEdited = ref(false)
            const isEdit = ref(false)
            const isTermDrawerVisible = ref(false)
            const drawerAsset = ref()
            const list = computed(() =>
                localValue.value.filter(
                    (term) => term.attributes?.__state === 'ACTIVE'
                )
            )
            const onPopoverClose = (visible) => {
                if (!visible && hasBeenEdited.value) {
                    modelValue.value = localValue.value
                    emit('change', localValue.value)
                    hasBeenEdited.value = false
                }
            }

            const onCheck = (checkedNodes) => {
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
                hasBeenEdited.value = true
            }

            const onSearchItemCheck = (checkedNode, checked) => {
                if (checked) {
                    localValue.value.push(checkedNode)
                } else {
                    localValue.value = localValue.value?.filter(
                        (localTerm) =>
                            (localTerm.guid ?? localTerm.termGuid) !==
                            checkedNode.guid
                    )
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
                }
            }
            const {
                mouseEnterDelay: termMouseEnterDelay,
                enteredPill: termEnteredPill,
                leftPill: termLeftPill,
            } = useMouseEnterDelay()

            watch(selectedAsset, () => {
                const attributeMap = {
                    seeAlso: seeAlso(selectedAsset.value),
                    preferredTerms: preferredTerms(selectedAsset.value),
                    antonyms: antonyms(selectedAsset.value),
                    synonyms:synonyms(selectedAsset.value)
                }
                modelValue.value = attributeMap[props?.attributeType]
            })

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
                termMouseEnterDelay,
                termEnteredPill,
                termLeftPill,
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
