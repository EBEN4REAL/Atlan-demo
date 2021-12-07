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
            v-if="isAreaFocused"
            @click.stop="() => {}"
            class="absolute z-10 pb-2 overflow-auto bg-white rounded custom-shadow"
            :style="`left:${clickPos.left}px;top:${clickPos.top}px`"
            style="width: 330px; height: 250px"
        >
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
            }
            const onBlur = () => {
                isAreaFocused.value = false
            }
            const handleContainerBlur = (event) => {
                // if the blur was because of outside focus
                // currentTarget is the parent element, relatedTarget is the clicked element
                if (!container.value.contains(event.relatedTarget)) {
                    isAreaFocused.value = false
                }
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

            return {
                clickPos,
                handleDeleteColumn,
                onSelectedColumn,
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
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }
</style>
