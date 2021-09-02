<template>
    <a-checkbox-group
        v-model:value="data.checked"
        class="w-full px-4 py-1 pb-3 bg-gray-100"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="(item, index) in list" :key="item.id">
                <!-- <div class="pb-2.5 mb-3 border-b" v-if="index == 0">
                    <a-checkbox :value="item.id" class="w-full">
                        <span class="mb-0 ml-1 text-gray">
                            {{ item.label }}
                        </span>
                    </a-checkbox>
                </div> -->
                <div class="mb-3 status">
                    <a-checkbox
                        :value="item.id"
                        class="flex items-center w-full"
                    >
                        <div class="flex items-center">
                            <a-tooltip>
                                <span class="mb-0 ml-1 text-gray">
                                    {{ item.label }}
                                </span>
                                <template #title>
                                    {{ item.include.join(', ') }}</template
                                >
                            </a-tooltip>
                        </div>
                    </a-checkbox>
                </div>
            </template>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/assetCategory'
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
                const selectedIds = []
                data.value.checked.forEach((assetTypeId) => {
                    selectedIds.push(assetTypeId)
                    const includedAssetTypes = list.value.find(
                        (asset) => asset.id === assetTypeId
                    ).include
                    includedAssetTypes.forEach((assetType) => {
                        criterion.push({
                            attributeName: '__typeName',
                            attributeValue: assetType,
                            operator: 'eq',
                        })
                    })
                })
                console.log('criterion', criterion)

                emit('change', {
                    id: props.item.id,
                    selectedIds,
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
