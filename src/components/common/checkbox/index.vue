<template>
    <a-checkbox-group
        v-model:value="localSelected"
        class="w-full"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in list" :key="item.id">
                <a-tooltip placement="right">
                    <template v-if="item.description" #title>{{
                        item.description
                    }}</template>
                    <a-checkbox :value="item.id" class="w-full">
                        <component
                            class="inline-flex self-center w-auto h-4 mb-1"
                            :is="item.icon"
                        />
                        <span class="mb-0 ml-1 text-gray-700">
                            {{ item.label }}
                        </span>
                    </a-checkbox>
                </a-tooltip>
            </template>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { CheckboxArray } from '~/types'

    export default defineComponent({
        props: {
            list: {
                type: Array as PropType<CheckboxArray>,
                required: false,
                default(): CheckboxArray {
                    return []
                },
            },
            defaultSelected: {
                type: Array as PropType<String[]>,
                required: false,
                default(): string[] {
                    return []
                },
            },
        },
        // computed: {
        //   selected: {
        //     get(): string[] {
        //       if (this.localSelected.length > 0) {
        //         return this.localSelected;
        //       }
        //       return this.defaultSelected;
        //     },
        //     // setter
        //     set(newValue: string[]) {
        //       this.localSelected = newValue;
        //     },
        //   },
        emits: ['change', 'clear'],
        data() {
            return {
                localSelected: [],
            }
        },
        mounted() {
            if (this.defaultSelected.length > 0) {
                this.localSelected = this.defaultSelected
            }
        },
        methods: {
            handleChange() {
                this.$emit('change', this.localSelected)
            },
            clear() {
                this.localSelected = []
                this.$emit('clear')
            },
        },
    })
</script>

<style lang="less" module>
    .fullWidth {
        width: 100%;
        :global(.ant-checkbox-wrapper) {
            display: inline-flex !important;
            align-items: center;
            flex-direction: row-reverse;
            justify-content: space-between !important;
            width: 100%;
        }

        :global(.ant-checkbox + span) {
            display: inline-flex !important;
            align-items: center;
            padding-left: 0px;
            line-height: 1;
            width: calc(100% - 20px);
        }
    }
</style>
