<template>
    <div class="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <a-popover
            placement="leftTop"
            :overlay-class-name="$style.termPopover"
            :trigger="['click']"
            @visibleChange="onPopoverClose"
        >
            <template #content>
                <GlossaryTree
                    v-model:checkedGuids="checkedGuids"
                    :checkable="true"
                    @check="onCheck"
                    @searchItemCheck="onSearchItemCheck"
                />
            </template>
            <a-button
                v-if="editPermission"
                shape="circle"
                :disabled="disabled"
                size="small"
                class="text-center shadow hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
        <div class="flex flex-wrap gap-1 text-sm">
            <template v-for="term in list" :key="term.guid">
                <TermPopover
                    :term="term"
                    :loading="termLoading"
                    :fetchedTerm="fetchedTerm"
                    :error="termError"
                    trigger="hover"
                    :ready="isReady"
                    @visible="handleTermPopoverVisibility"
                >
                    <teamplate>
                        <TermPill
                            :term="term"
                            :allow-delete="allowDelete"
                            @delete="handleDeleteTerm"
                        />
                    </teamplate>
                </TermPopover>
            </template>
            <span
                v-if="!editPermission && list?.length < 1"
                class="-ml-1 text-gray-500"
                >No linked terms</span
            >
        </div>
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
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'

    import GlossaryTree from '~/components/glossary/index.vue'
    import TermPill from '@/common/pills/term.vue'
    import TermPopover from '@/common/popover/term.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        AssetRelationAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'TermsWidget',
        components: { GlossaryTree, TermPill, TermPopover },
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
            const checkedGuids = ref(
                modelValue.value.map((term) => term.termGuid)
            )
            const hasBeenEdited = ref(false)

            const list = computed(() => localValue.value)

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
                emit('change', localValue.value)
            }
            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                checkedGuids.value = modelValue.value.map(
                    (term) => term.termGuid ?? term.guid
                )
            })

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: '',
            })

            const dependentKey = ref(facets.value.guid)

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...GlossaryAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            const {
                list: fetchTermArr,
                isLoading: termLoading,
                fetch,
                isReady,
                error: termError,
                quickChange,
            } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const fetchedTerm = computed(() => {
                if (fetchTermArr.value.length) return fetchTermArr.value[0]
                return null
            })

            const handleTermPopoverVisibility = (v, term) => {
                if (v) {
                    facets.value.guid = term.termGuid
                    quickChange()
                }
            }

            return {
                isReady,
                termError,
                termLoading,
                fetchedTerm,
                handleTermPopoverVisibility,
                list,
                onCheck,
                onPopoverClose,
                localValue,
                checkedGuids,
                onSearchItemCheck,
                handleDeleteTerm,
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
