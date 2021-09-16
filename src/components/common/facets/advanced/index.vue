<template>
    <span>
        <div class="mr-2 overflow-y-auto" style="max-height: 25rem">
            <div v-for="(a, x) in finalAttributesList" :key="x" class="mx-5">
                <AttributeItem
                    :a="a"
                    :applied="data.applied[a.value] || {}"
                    :operators="operatorsMap[a.typeName]"
                    @handleAttributeInput="setAdvancefilter"
                />
            </div>
        </div>
    </span>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType } from 'vue'
    import AttributeItem from '../common/attributeItems.vue'

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
                    return {}
                },
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const isEmptyObject = (obj: Object) =>
                Object.keys(obj).length === 0 && obj.constructor === Object

            const setAdvancefilter = (
                a: { name: string },
                appliedValueMap: Object
            ) => {
                // ? if appliedValueMap === {} i.e all applied filters removed, remove the entry
                const newDataMap = {
                    ...props.data,
                    applied: {
                        ...props.data.applied,
                        [a.value]: appliedValueMap,
                    },
                }
                if (isEmptyObject(appliedValueMap))
                    delete newDataMap.applied[a.name]
                emit('update:data', newDataMap)

                const criterion: Components.Schemas.FilterCriteria[] = []

                // ? populate criterion object with filters previously applied
                Object.entries(newDataMap.applied).forEach((attribute) => {
                    Object.entries(attribute[1]).forEach((o) => {
                        criterion.push({
                            attributeName: attribute[0],
                            operator: o[0],
                            attributeValue: o[1],
                        })
                    })
                })

                // ? add new filter to criterion
                Object.keys(appliedValueMap).forEach((key: string) => {
                    const alreadyAppliedIndex = criterion.findIndex(
                        (c) => c.attributeName === a.value && c.operator === key
                    )

                    const filter = {
                        attributeName: a.value,
                        operator: key,
                        attributeValue: appliedValueMap[key],
                    }
                    if (alreadyAppliedIndex > -1)
                        criterion[alreadyAppliedIndex] = filter
                    else criterion.push(filter)
                })

                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'AND',
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }
            const finalAttributesList = computed(() =>
                AdvancedAttributeList.filter(attribute=>!attribute.hide)
            )
            return {
                finalAttributesList,
                setAdvancefilter,
                operatorsMap,
            }
        },
    })
</script>

<style>
    .ant-popover-arrow {
        display: none;
    }
</style>
