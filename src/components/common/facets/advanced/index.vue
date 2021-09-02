<template>
    <span>
        <div class="mr-2 overflow-y-auto" style="max-height: 25rem">
            <div
                v-for="(a, x) in AdvancedAttributeList.map((a) => ({
                    ...a,
                    options: { displayName: a.label },
                }))"
                :key="x"
                class="mx-5"
            >
                <AttributeItem
                    :a="a"
                    :applied="{}"
                    @handleAttributeInput="setAdvancefilter"
                    :operators="operatorsMap[a.typeName]"
                />
            </div>
        </div>
    </span>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import AttributeItem from '../common/attributeItems.vue'

    import DynamicInput from '@common/input/dynamic.vue'

    import {
        AdvancedAttributeList,
        operatorsMap,
    } from '~/constant/advancedAttributes'
    import { Collapse } from '~/types'
    import { Components } from '~/api/atlas/client'

    export default defineComponent({
        components: {
            AttributeItem,
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
        emits: ['change'],
        setup(props, { emit }) {
            const list = ref([...props.data.list])

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

            const setAdvancefilter = () => {}

            return {
                AdvancedAttributeList,
                setAdvancefilter,
                operatorsMap,
            }
        },
    })
</script>
