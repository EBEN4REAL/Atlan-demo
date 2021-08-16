<template>
    <a-checkbox-group
        v-model:value="checkedValues"
        class="w-full px-4 py-1 pb-3 bg-gray-100"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in list" :key="item.id">
                <div class="mb-3 status">
                    <a-checkbox :value="item.id" class="w-full">
                        <component
                            class="inline-flex self-center w-auto h-4 mb-1"
                            :is="item.icon"
                        />
                        <span class="mb-0 ml-1 text-gray-700">
                            {{ item.label }}
                        </span>
                    </a-checkbox>
                </div>
            </template>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/status'
    import { Collapse } from '~/types'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
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
            const { data, modelValue } = toRefs(props)
            checkedValues.value = [...modelValue.value, ...data.value.checked]
            console.log(checkedValues.value, 'model')
            const handleChange = (checkedValue: string) => {
                data.value.checked = checkedValues.value
                emit('update:modelValue', checkedValues.value, props.item.id)

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
