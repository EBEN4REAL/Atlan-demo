<template>
    <a-checkbox-group
        v-model:value="data.checked"
        class="w-full px-4 py-1 pb-3"
        @change="handleChange"
    >
        <div class="flex flex-col w-full gap-y-3">
            <!-- <div class="pb-2.5 mb-3 border-b" v-if="index == 0">
                    <a-checkbox :value="item.id" class="w-full">
                        <span class="mb-0 ml-1 text-gray">
                            {{ item.label }}
                        </span>
                    </a-checkbox>
                </div> -->
            <div
                v-for="item in list"
                :key="item.id"
                class="flex items-center justify-between"
            >
                <a-checkbox :value="item.id"
                    ><span class="mb-0 ml-1 text-gray">
                        {{ item.label }}
                    </span>
                </a-checkbox>

                <a-tooltip placement="right" color="white">
                    <AtlanIcon
                        icon="Overview"
                        class="opacity-50 hover:opacity-100"
                    />
                    <template #title>
                        <span class="text-gray-500">
                            {{ item.include.join(', ') }}
                        </span>
                    </template>
                </a-tooltip>
            </div>
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
            const generateTabLists = (id: string, includedAssets: string[]) => {
                let includedAssetsTypes = [...includedAssets]
                switch (id) {
                    case 'datasets': {
                        includedAssetsTypes = [
                            'View',
                            'Table',
                            'TablePartition',
                            'MaterialisedView',
                            ...includedAssetsTypes,
                        ]
                        break
                    }
                    case 'fields': {
                        if (includedAssetsTypes.includes('View')) {
                            includedAssetsTypes = [
                                ...includedAssetsTypes,
                                'Column',
                            ]
                        } else {
                            includedAssetsTypes = [
                                'Column',
                                ...includedAssetsTypes,
                            ]
                        }
                        break
                    }
                    case 'visualizations': {
                        includedAssetsTypes = [
                            ...includedAssetsTypes,
                            'TableauSite',
                            'TableauProject',
                            'TableauWorkbook',
                            'TableauWorksheet',
                            'TableauDashboard',
                            'TableauDatasource',
                        ]
                        break
                    }
                }
                return includedAssetsTypes
            }
            console.log(checkedValues.value, 'model')
            const handleChange = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []
                const selectedIds = []
                let includedAssets = []
                data.value.checked.forEach((assetTypeId) => {
                    selectedIds.push(assetTypeId)
                    const includedAsset = list.value.find(
                        (asset) => asset.id === assetTypeId
                    )
                    includedAssets = generateTabLists(
                        includedAsset.id,
                        includedAssets
                    )
                    includedAsset.include.forEach((assetType) => {
                        criterion.push({
                            attributeName: '__typeName',
                            attributeValue: assetType,
                            operator: 'eq',
                        })
                    })
                })
                if (data.value.checked.length < 1) {
                    includedAssets = undefined
                }
                console.log('includedAssets', includedAssets)

                emit(
                    'change',
                    {
                        id: props.item.id,
                        selectedIds,
                        payload: {
                            condition: 'OR',
                            criterion,
                        } as Components.Schemas.FilterCriteria,
                    },
                    includedAssets
                )
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

<style scoped>
    :global(.ant-tooltip-arrow) {
        display: none;
    }
</style>
