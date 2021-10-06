<template>
    <span class="pb-6">
        <div class="overflow-y-auto" style="max-height: 25rem">
            <div
                v-for="(a, x) in finalAttributesList"
                :key="x"
                class="ml-2"
                style="margin-right: 0.5rem"
            >
                <AttributeItem
                    :a="a"
                    :applied="data.applied?.[a.value] || {}"
                    :operators="operatorsMap?.[a.typeName]"
                    @handleAttributeInput="setAdvancefilter"
                />
            </div>
        </div>
    </span>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import AttributeItem from '../common/attributeItems.vue'

    import {
        AdvancedAttributeList,
        operatorsMap,
    } from '~/constant/advancedAttributes'
    import { Collapse } from '~/types'

    export default defineComponent({
        name: 'PropertiesFilterWrapper',
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
                type: Object as PropType<any>,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const isEmptyObject = (obj: Object) =>
                Object.keys(obj).length === 0 && obj.constructor === Object

            const setAdvancefilter = (
                a: { label: string; typeName: string; value: string },
                appliedValueMap: Object
            ) => {
                debugger
                // ? if appliedValueMap === {} i.e all applied filters removed, remove the entry
                const newDataMap = {
                    ...data.value,
                    applied: {
                        ...data.value.applied,
                        [a.value]: appliedValueMap,
                    },
                }
                if (isEmptyObject(appliedValueMap))
                    delete newDataMap.applied[a.value]
                emit('update:data', newDataMap)
                emit('change')
            }
            const finalAttributesList = computed(() =>
                AdvancedAttributeList.filter((attribute) => !attribute.hide)
            )
            return {
                finalAttributesList,
                setAdvancefilter,
                operatorsMap,
            }
        },
    })
</script>

<style scoped>
    :global(.ant-popover-arrow) {
        display: none;
    }
</style>
