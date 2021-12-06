<template>
    <div
        ref="container"
        @click="setFoucs"
        @focusout="handleContainerBlur"
        tabindex="0"
        class="relative"
        v-if="expand"
        :class="[
            cols.length > 0 ? '' : ' justify-center',
            isAreaFocused
                ? ' border-primary-focus border-2 border-shift-minus'
                : 'border-gray-300 border border-shift-plus',
            ,
            'flex flex-wrap items-center  mx-3 mt-1 mb-4  rounded  ',
        ]"
        @click.stop="() => {}"
    >
        <p class="text-sm text-gray-500 py-1.5" v-if="cols.length == 0">
            Add columns to fetch results
        </p>
        <template
            v-else
            v-for="(item, index) in cols"
            :key="item.label + index"
        >
            <Pill
                :label="item.label"
                @action="() => handleDeleteColumn(index)"
                :hasAction="true"
                class="my-1 mr-2"
                @click.stop="() => {}"
                ><template #prefix>
                    <component
                        :is="getDataTypeImage(item.type)"
                        class="flex-none w-auto h-4 -mt-0.5"
                    ></component>
                </template>
            </Pill>
        </template>
        <div
            v-if="dropdownState"
            class="absolute pb-2 overflow-auto rounded shadow"
            :style="`left:${clickPos.left}px;top:${clickPos.top}px`"
            ref="dropdown"
            style="width: 330px; height: 250px"
        >
            <div
                class="absolute px-1 py-0.5 text-gray-300 border rounded right-4 top-3.5 cursor-pointer"
                @click.stop="handleClose"
            >
                <AtlanIcon icon="Close" class="w-4 h-4" />
            </div>
            <TablesTree @selectedColumn="onSelectedColumn" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TablesTree,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
        },

        setup(props, { emit }) {
            const { getDataTypeImage } = useColumn()
            const { expand } = toRefs(props)
            const isAreaFocused = ref(false)
            const container = ref()
            const dropdown = ref()
            const dropdownState = ref(false)
            const clickPos = ref({ left: 0, top: 0 })
            const cols = ref([{ type: 'string', label: 'customer_name' }])
            const setFoucs = (e) => {
                const rect = e.target.getBoundingClientRect()
                let x = e.clientX - rect.left //x position within the element.
                if (e.clientX + 330 > rect.right) {
                    x = x - (e.clientX + 330 - rect.right + 10)
                }
                const y = e.clientY - rect.top //y position within the element.
                clickPos.value = {
                    left: x,
                    top: y,
                }
                isAreaFocused.value = true
                dropdownState.value = true
            }
            const onBlur = () => {
                isAreaFocused.value = false
            }
            const handleContainerBlur = (event) => {
                // if the blur was because of outside focus
                // currentTarget is the parent element, relatedTarget is the clicked element
                if (!container.value.contains(event.relatedTarget)) {
                    isAreaFocused.value = false
                    // dropdownState.value = false
                }
            }
            const handleClose = () => {
                console.log('clied')
                isAreaFocused.value = false
                dropdownState.value = false
            }
            const handleDeleteColumn = (index: any) => {
                cols.value.splice(index, 1)
            }

            const onSelectedColumn = (node: any) => {
                console.log(node, 'node')
                const label = node?.dataRef?.name
                const type = node?.dataRef?.dataType?.toLowerCase()
                cols.value.push({ type, label })
            }
            watch(expand, () => {
                if (!expand.value) {
                    dropdownState.value = false
                }
            })

            return {
                clickPos,
                handleDeleteColumn,
                onSelectedColumn,
                handleClose,
                dropdownState,
                dropdown,
                container,
                handleContainerBlur,
                onBlur,
                setFoucs,
                isAreaFocused,
                getDataTypeImage,
                cols,
            }
        },
    })
</script>
<style lang="less" scoped>
    .border-shift-plus {
        padding: 13px;
    }
    .border-shift-minus {
        padding: 12px;
    }
    .custom-shadow {
        box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    }
</style>
