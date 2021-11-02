<template>
    <div class="flex flex-col py-1 rounded gap-y-3 preference-container">
        <div class="flex items-center justify-between">
            <p class="mb-1 text-sm text-gray-500">Sort By</p>
            <Sorting></Sorting>
        </div>
        <div class="pt-3">
            <p class="mb-2 text-sm text-gray-500">Status</p>
            <div class="flex flex-wrap">
                <template v-for="item in assetStatusList" :key="item.id">
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
        <a-divider class="pt-2 my-0"></a-divider>
        <div class="">
            <p class="mb-2 text-sm text-gray-500">Show/Hide</p>
            <div class="flex flex-wrap">
                <template v-for="item in displayProperties" :key="item.id">
                    <div
                        class="px-2 py-1 mb-1 mr-1 border rounded cursor-pointer "
                        :class="
                            isProjectionSelected(item)
                                ? 'bg-primary-light border-white hover:bg-primary-light text-gray'
                                : ' text-gray-500'
                        "
                        @click="() => togglePropertySelect(item)"
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

    import Sorting from '@/common/select/sorting.vue'

    import { sortList } from '~/constant/sorting'

    import { displayProperties } from '~/constant/displayProperties'

    import { assetStatusList } from '~/constant/assetStatus'

    export default defineComponent({
        components: {
            Sorting,
        },
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
            const projection: Ref<any[]> = ref([])
            const assetStatus: Ref<string> = ref('active')
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
                assetStatus.value === property.id

            const isProjectionSelected = (property) =>
                projection.value.includes(property.id)

            const togglePropertySelect = (property) => {
                if (projection.value.includes(property.id)) {
                    const index = projection.value.indexOf(property.id)
                    projection.value.splice(index, 1)
                } else {
                    projection.value.push(property.id)
                }
            }

            const toggleStatusSelect = (property) => {
                if (assetStatus.value !== property.id) {
                    assetStatus.value = property.id
                }
            }

            // const sorting = ref('')

            // sorting.value = props.defaultSorting || 'default'
            const handeChangeSorting = () => {
                emit('sort', sorting.value)
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
                sortList,
                displayProperties,
                isProjectionSelected,
                togglePropertySelect,
                assetStatusList,
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
