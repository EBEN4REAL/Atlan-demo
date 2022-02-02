<template>
    <div
        ref="container"
        @click="toggleFocus"
        class="relative flex items-center w-full border cursor-pointer group"
        :class="[
            isAreaFocused ? ' container-box-shadow-focus' : 'border-gray-200',
            ,
            'flex flex-wrap items-center  rounded selector-height',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <slot name="head"> </slot>

        <teleport to="body">
            <div
                v-if="isAreaFocused"
                @click.stop="() => {}"
                :style="`${
                    specifiedBodyWidth
                        ? `width:${specifiedBodyWidth}px;`
                        : `width:${containerPosition?.width}px;`
                }top:${
                    containerPosition?.top + containerPosition?.height
                }px;left:${
                    containerPosition?.left
                }px;height:280px;min-height:0`"
                :class="[
                    'absolute z-10 flex flex-col bg-white rounded custom-shadow position',
                ]"
            >
                <slot name="body"> </slot>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        watch,
        inject,
        computed,
        defineComponent,
        ComputedRef,
        PropType,
        ref,
        onMounted,
        onUnmounted,
        toRefs,
    } from 'vue'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { attributes } from '~/components/insights/playground/editor/vqb/composables/VQBattributes'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { useVModels } from '@vueuse/core'

    import useBody from './useBody'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            selectedItems: {
                type: Object as PropType<string[]>,
                required: true,
            },
            selectedTableData: {
                type: Object as PropType<{
                    certificateStatus: string | undefined
                    assetType: string | undefined
                }>,
            },
            tableQualfiedName: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const {
                disabled,
                selectedTablesQualifiedNames,
                selectedItems,
                selectedTableData,
                tableQualfiedName,
            } = toRefs(props)
            const container = ref()
            // const lockVQBScroll = inject('lockVQBScroll') as Ref<Boolean>
            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const isAreaFocused = ref(false)

            const columnQueryText = ref('')
            const map = ref({})
            selectedItems.value?.forEach((selectedItem) => {
                map.value[selectedItem] = true
            })

            const TotalColumnsCount = computed(
                () => ColumnsData.value?.approximateCount || 0
            )

            const {
                list: ColumnList,
                replaceBody: replaceColumnBody,
                data: ColumnsData,
                isLoading: isColumnLoading,
            } = useAssetListing('', false)

            const getColumnInitialBody = () => {
                let data = {
                    searchText: columnQueryText.value,
                    assetType: selectedTableData.value?.assetType,
                }
                if (
                    activeInlineTab.value.playground.vqb?.panels[0]
                        ?.subpanels[0]?.tableData?.assetType === 'View'
                ) {
                    data.viewQualifiedName =
                        selectedTablesQualifiedNames?.length > 0
                            ? selectedTablesQualifiedNames[0].tableQualifiedName
                            : tableQualfiedName.value
                } else {
                    data.tableQualfiedName =
                        selectedTablesQualifiedNames.value?.length > 0
                            ? selectedTablesQualifiedNames.value[0]
                                  .tableQualifiedName
                            : tableQualfiedName.value
                }

                return {
                    dsl: useBody(data),
                    attributes: attributes,
                    suppressLogs: true,
                }
            }

            const setDropDownPosition = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top + 1
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }

            onMounted(() => {
                // const _container = document.getElementById('_container')
                if (container.value) {
                    observer.value = new ResizeObserver(onResize).observe(
                        container.value
                    )

                    setDropDownPosition()
                    document.addEventListener('click', (event) => {
                        const withinBoundaries = event
                            .composedPath()
                            .includes(container.value)

                        if (withinBoundaries) {
                            console.log('inside')
                        } else {
                            isAreaFocused.value = false
                        }
                    })
                }
            })

            const onResize = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top + 1
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }

            // for initial call
            replaceColumnBody(getColumnInitialBody())

            const toggleFocus = () => {
                setDropDownPosition()
                if (!disabled.value) {
                    if (isAreaFocused.value) {
                        isAreaFocused.value = false
                    } else {
                        isAreaFocused.value = true
                    }
                }
            }

            onUnmounted(() => {
                observer?.value?.unobserve(container?.value)
            })

            /* ---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */

            const provideData: provideDataInterface = {
                getColumnInitialBody: getColumnInitialBody,
                replaceColumnBody: replaceColumnBody,
                columnQueryText: columnQueryText,
                ColumnList: ColumnList,
                isAreaFocused: isAreaFocused,
                totalColumnsCount: TotalColumnsCount,
                isColumnLoading: isColumnLoading,
                map: map,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            return {
                toggleFocus,
                disabled,
                container,
                isAreaFocused,
                containerPosition,
            }
        },
    })
</script>
<style lang="less" scoped>
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }

    .container-box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .container-box-shadow-focus {
        box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
    }
    .selector-height {
        min-height: 32px;
    }
    .position {
        @apply right-0;
    }
    .box-shadow {
        box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    }
    .disable-bg {
        background-color: #fbfbfb;
    }
</style>
