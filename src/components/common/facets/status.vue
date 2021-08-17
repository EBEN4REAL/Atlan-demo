<template>
    <a-checkbox-group
        v-model:value="data.checked"
        class="w-full px-4 py-1 pb-3 bg-gray-100"
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
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const list = computed(() => List)
            const checkedValues = ref([])
            const { data } = toRefs(props)
            console.log(checkedValues.value, 'model')
            const handleChange = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []
                data.value.checked.forEach((val) => {
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

            return {
                data,
                handleChange,
                list,
                checkedValues,
            }
        },
    })
</script>
<style lang="less" scoped>
    .status:last-child {
        margin-bottom: 0 !important;
    }
</style>
