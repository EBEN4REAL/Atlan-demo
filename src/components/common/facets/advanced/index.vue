<template>
    <div class="flex flex-col">
        <template v-for="(item, index) in list" :key="item.id">
            <div class="flex flex-col space-y-1 border-b border-gray-200">
                <div class="flex items-center mb-1">
                    <a-cascader
                        v-model:value="item.operator"
                        :options="options"
                        placeholder="Please select"
                        @change="handleOperatorChange(index)"
                    />
                    <div
                        class="ml-2 leading-none hover:text-red-500"
                        @click="handleRemove(index)"
                    >
                        <fa icon="fal times-circle"></fa>
                    </div>
                </div>
                <DynamicInput
                    v-if="item.isInput"
                    v-model="item.operand"
                    :data-type="item.type"
                    @change="handleOperandChange(index)"
                ></DynamicInput>
            </div>
        </template>
    </div>
    <a-button block size="small" class="mt-2" @click="handleAdd"
        ><fa icon="fal plus"></fa
    ></a-button>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'

    import DynamicInput from '@common/input/dynamic.vue'

    import {
        AdvancedAttributeList,
        OperatorList,
    } from '~/constant/advancedAttributes'
    import { Collapse } from '~/types'
    import { Components } from '~/api/atlas/client'

    export default defineComponent({
        components: {
            DynamicInput,
        },
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
                    return []
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
            const list = ref([...props.data.list])

            const options = ref([])
            AdvancedAttributeList.forEach((item) => {
                const temp = item
                temp.children = OperatorList.filter((op) =>
                    op.allowedType.includes(item.type)
                )
                options.value.push(temp)
            })
            const handleAdd = () => {
                list.value.push({
                    id: Date.now(),
                })
            }
            const handleRemove = (index) => {
                list.value.splice(index, 1)
                handleChange()
            }

            const handleOperatorChange = (index) => {
                const selected = list.value[index].operator

                if (selected?.length > 0) {
                    const found = options.value.find(
                        (op) => op.value === selected[0]
                    )
                    list.value[index].type = found?.type
                    const foundOperator = OperatorList.find(
                        (op) => op.value === selected[1]
                    )
                    list.value[index].isInput = foundOperator?.isInput
                    if (!list.value[index].isInput) {
                        handleChange()
                    }
                }
            }

            const handleOperandChange = (index) => {
                console.log(list.value[index])
                const selected = list.value[index].operand
                console.log(selected)
                handleChange()
            }

            const handleChange = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []
                console.log(list.value, 'listt')

                list.value.forEach((element) => {
                    console.log(element)
                    if (!element.isInput) {
                        criterion.push({
                            attributeName: element.operator[0],
                            operator: element.operator[1],
                        })
                    } else if (element.operand !== '') {
                        criterion.push({
                            attributeName: element.operator[0],
                            operator: element.operator[1],
                            attributeValue: element.operand,
                        })
                    }
                })

                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'AND',
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }

            const clear = () => {
                list.value = []
                handleChange()
            }

            return {
                options,
                list,
                handleAdd,
                handleRemove,
                handleOperatorChange,
                handleOperandChange,
                clear,
            }
        },
    })
</script>
