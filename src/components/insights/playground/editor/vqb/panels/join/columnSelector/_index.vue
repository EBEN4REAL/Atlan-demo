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
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'

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
            specifiedBodyWidth: {
                type: Number,
                required: false,
            },
            panelIndex: {
                type: Number,
                required: true,
            },
            rowIndex: {
                type: Number,
                required: true,
            },
            subIndex: {
                type: Number,
                required: true,
            },
        },

        setup(props, { emit }) {
            const {
                disabled,
                specifiedBodyWidth,
                panelIndex,
                subIndex,
                rowIndex,
            } = toRefs(props)
            const { allowedTablesInJoinSelector } = useJoin()
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

            const tableQualifiedNamesContraint: Ref<{
                allowed: string[]
                notAllowed: string[]
            }> = computed(() => {
                return allowedTablesInJoinSelector(
                    panelIndex.value,
                    rowIndex.value,
                    subIndex.value,
                    activeInlineTab.value
                )
            })
            const isAreaFocused = ref(false)

            const tableSelected = ref(null)
            const dirtyTableSelected = ref(null)
            const selectedColumn = ref(null)
            const isTableSelected = ref(false)
            const dirtyIsTableSelected = ref(false)
            const columnQueryText = ref('')
            const tableQueryText = ref('')
            const TotalTablesCount = computed(
                () => tablesData.value?.approximateCount || 0
            )
            const TotalColumnsCount = computed(
                () => ColumnsData.value?.approximateCount || 0
            )

            const {
                list: TableList,
                replaceBody: replaceTableBody,
                data: tablesData,
                isLoading: isTableLoading,
            } = useAssetListing('', false)
            const {
                list: ColumnList,
                replaceBody: replaceColumnBody,
                data: ColumnsData,
                isLoading: isColumnLoading,
            } = useAssetListing('', false)

            const getColumnInitialBody = (item) => {
                let data = {}
                if (item.typeName === 'Table') {
                    data = {
                        tableQualifiedName: item?.qualifiedName,
                        searchText: columnQueryText.value,
                        context:
                            activeInlineTab.value.playground.editor.context,
                    }
                } else if (item.typeName === 'View') {
                    data = {
                        viewQualifiedName: item?.qualifiedName,
                        searchText: columnQueryText.value,
                        context:
                            activeInlineTab.value.playground.editor.context,
                    }
                }
                return {
                    dsl: useBody(data),
                    attributes: attributes,
                    suppressLogs: true,
                }
            }

            const getTableInitialBody = () => {
                return {
                    dsl: useBody({
                        schemaQualifiedName:
                            activeInlineTab.value.playground.editor.context
                                .attributeValue,
                        context:
                            activeInlineTab.value.playground.editor.context,

                        searchText: tableQueryText.value,
                        tableQualifiedNamesContraint:
                            tableQualifiedNamesContraint.value,
                    }),
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
            replaceTableBody(getTableInitialBody())

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
                getTableInitialBody: getTableInitialBody,
                getColumnInitialBody: getColumnInitialBody,
                replaceTableBody: replaceTableBody,
                replaceColumnBody: replaceColumnBody,
                columnQueryText: columnQueryText,
                tableQueryText: tableQueryText,
                TableList: TableList,
                ColumnList: ColumnList,
                isAreaFocused: isAreaFocused,
                isTableSelected: isTableSelected,
                totalTablesCount: TotalTablesCount,
                totalColumnsCount: TotalColumnsCount,
                isTableLoading: isTableLoading,
                isColumnLoading: isColumnLoading,
                tableSelected: tableSelected,
                dirtyIsTableSelected: dirtyIsTableSelected,
                dirtyTableSelected: dirtyTableSelected,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            return {
                toggleFocus,
                specifiedBodyWidth,
                disabled,
                container,
                isAreaFocused,
                containerPosition,
                tableQualifiedNamesContraint,
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
