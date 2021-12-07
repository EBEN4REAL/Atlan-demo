<template>
    <div
        @focus="setFoucs"
        @blur="onBlur"
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
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
            const cols = [
                { type: 'string', label: 'customer_name' },
                { type: 'string', label: 'bevrage_name' },
                { type: 'number', label: 'order_number' },
                { type: 'number', label: 'customer_contact' },
            ]
            const setFoucs = () => {
                isAreaFocused.value = true
            }
            const onBlur = () => {
                isAreaFocused.value = false
            }
            return {
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
        padding: 1px;
    }
    .border-shift-minus {
        padding: 0px;
    }
</style>
