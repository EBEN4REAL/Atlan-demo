<template>
    <div
        ref="container"
        @focusin="setFoucs"
        @focusout="handleContainerBlur"
        tabindex="0"
        class=""
        v-if="expand"
        :class="[
            cols.length > 0 ? '' : ' justify-center',
            isAreaFocused
                ? ' border-primary-focus border-2 border-shift-minus'
                : 'border-gray-300 border border-shift-plus',
            ,
            'flex flex-wrap items-center  mx-3 mt-1 mb-4  rounded',
        ]"
        @click.stop="() => {}"
    >
        <!-- <p class="text-sm text-gray-500 py-1.5">Add columns to fetch results</p> -->
        <template v-for="(item, index) in cols" :key="item.label + index">
            <Pill :label="item.label" :hasAction="true" class="mr-2"
                ><template #prefix>
                    <component
                        :is="getDataTypeImage(item.type)"
                        class="flex-none w-auto h-4 -mt-0.5"
                    ></component>
                </template>
            </Pill>
        </template>
        <a-dropdown :visible="dropdownState">
            <div class="w-1 h-2"></div>
            <template #overlay>
                <a-menu class="pb-2">
                    <div
                        ref="dropdown"
                        style="width: 330px; height: 250px"
                        class="relative overflow-auto"
                    >
                        <div
                            class="absolute px-1 py-0.5 text-gray-300 border rounded right-4 top-3.5 cursor-pointer"
                            @click="handleClose"
                        >
                            <AtlanIcon icon="Close" class="w-4 h-4" />
                        </div>
                        <TablesTree />
                    </div>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
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
            const isAreaFocused = ref(false)
            const container = ref()
            const dropdown = ref()
            const dropdownState = ref(false)
            const cols = [
                { type: 'string', label: 'customer_name' },
                { type: 'string', label: 'bevrage_name' },
                { type: 'number', label: 'order_number' },
                { type: 'number', label: 'customer_contact' },
            ]
            const setFoucs = () => {
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
                }
            }
            const handleClose = () => {
                console.log('clied')
                isAreaFocused.value = false
                dropdownState.value = false
            }

            return {
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
</style>
