<template>
    <div class="flex flex-col py-1 rounded gap-y-3 preference-container">
        <div class="pt-3">
            <p class="mb-2 text-sm text-gray-500">Asset Category</p>
            <div class="flex flex-wrap">
                <template v-for="item in assetCategoryList" :key="item.id">
                    <div
                        class="px-2 py-1 mb-1 mr-1 border rounded cursor-pointer "
                        :class="
                            isAssetStatusSelected(item)
                                ? 'bg-primary-light border-white hover:bg-primary-light text-gray'
                                : ' text-gray-500'
                        "
                        @click="() => toggleStatusSelect(item)"
                    >
                        {{ item.label }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, ref } from 'vue'

    import { assetCategoryList } from '~/constant/assetCategory'

    export default defineComponent({
        props: {
            defaultProjection: {
                type: Array,
            },
            defaultSorting: {
                type: String,
                default() {
                    return 'default'
                },
            },
            defaultState: {
                type: String,
                default() {
                    return 'active'
                },
            },
        },
        emits: ['change', 'sort', 'state'],
        setup(props, { emit }) {
            const assetCategory: Ref<string[]> = ref([])
            // const totalFiltersApplied = ref(0)
            // const selectedAssetType = ref('all')
            // if (props.defaultProjection?.length > 0) {
            //     projection.value = props.defaultProjection || []
            // }
            // const { projection } = useDiscoveryPreferences();
            // const handleChange = () => {
            //     emit('change', projection.value)
            // }

            const isAssetStatusSelected = (property) =>
                assetCategory.value.includes(property.id)

            const toggleStatusSelect = (property) => {
                if (assetCategory.value.includes(property.id)) {
                    const index = assetCategory.value.indexOf(property.id)
                    assetCategory.value.splice(index, 1)
                } else {
                    assetCategory.value.push(property.id)
                }
            }

            // const sorting = ref('')

            // sorting.value = props.defaultSorting || 'default'
            const handeChangeSorting = () => {
                // emit('sort', sorting.value)
            }

            // const state = ref('')
            // state.value = props.defaultState || 'active'
            // const handleChangeState = () => {
            //     emit('state', state.value)
            // }

            // const radioButtonData = [
            //     {
            //         id: 'active',
            //         label: 'Active',
            //     },
            //     {
            //         id: 'archived',
            //         label: 'Archived',
            //     },
            //     {
            //         id: 'all',
            //         label: 'All',
            //     },
            // ]

            return {
                handeChangeSorting,

                assetCategoryList,
                isAssetStatusSelected,
                toggleStatusSelect,
            }
        },
    })
</script>
<style lang="less" scoped>
    .preference-container {
        width: 240px;
    }
    .custom-icon-drop {
        transform: translateY(-2px);
    }
</style>
