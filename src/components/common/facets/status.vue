<template>
    <a-checkbox-group
        v-model:value="checkedValues"
        class="w-full px-4 py-3 border-b bg-gray-medium"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in list" :key="item.id">
                <div class="mb-3 status">
                    <a-checkbox :value="item.id" class="w-full">
                        <span class="mb-0 ml-1 text-gray-700 truncated">
                            <fa
                                :icon="item.icon"
                                class="mr-2 pushtop"
                                :class="item.iconClass"
                            />{{ item.label }}
                        </span>
                    </a-checkbox>
                </div>
            </template>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/status'
    import { Collapse } from '~/types'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: false,
                default() {
                    return {}
                },
            },
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const list = computed(() => List)
            const checkedValues = ref([])
            checkedValues.value = [...props.modelValue, ...props.data.checked]
            console.log(checkedValues.value, 'model')
            const handleChange = (checkedValue: string) => {
                emit('update:modelValue', checkedValues.value)

                const criterion: Components.Schemas.FilterCriteria[] = []
                checkedValues.value.forEach((val) => {
                    criterion.push({
                        attributeName: 'assetStatus',
                        attributeValue: val,
                        operator: 'eq',
                    })
                })

                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'OR',
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }

            const clear = () => {
                checkedValues.value = []
                handleChange('')
            }

            return {
                handleChange,
                list,
                checkedValues,
                clear,
            }
        },
    })
</script>
<style lang="less" scoped>
    .status:last-child {
        margin-bottom: 0 !important;
    }
</style>
