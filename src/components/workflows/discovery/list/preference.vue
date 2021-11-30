<template>
    <div class="flex flex-col w-auto p-4 rounded gap-y-3 preference-container">
        <div class="flex items-center justify-between text-gray">
            <span class="mr-6 text-sm text-gray">Order By</span>
            <a-select
                v-model:value="sorting"
                class="text-gray-500"
                style="width: 135px"
                @change="handeChangeSorting"
            >
                <!-- <a-select-option value="default">Relevance</a-select-option>
                <a-select-option value="Catalog.popularityScore|descending"
                    >Most popular</a-select-option
                >
                <a-select-option value="Catalog.popularityScore|ascending"
                    >Least popular</a-select-option
                > -->
                <a-select-option value="name">A-Z</a-select-option>
                <a-select-option value="-name">Z-A</a-select-option>
            </a-select>
        </div>
        <!-- <div class="pt-4">
            <p class="mb-3 text-sm text-gray">Display Properties</p>
            <div class="flex flex-wrap">
                <template v-for="item in properties" :key="item.id">
                    <div
                        class="px-2 py-1 mb-1 mr-1 border rounded cursor-pointer "
                        @click="() => togglePropertySelect(item)"
                        :class="
                            isProjectionSelected(item)
                                ? 'bg-primary-light border-white hover:bg-primary-light text-gray'
                                : ' text-gray-500'
                        "
                    >
                        {{ item.label }}
                    </div>
                </template>
            </div>
        </div>
        <div class="pt-4">
            <p class="mb-3 text-sm text-gray">State</p>
            <div class="">
             
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, ref } from 'vue'

    export default defineComponent({
        components: {},
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
            const totalFiltersApplied = ref(0)
            const selectedAssetType = ref('all')
            if (props.defaultProjection?.length > 0) {
                projection.value = props.defaultProjection || []
            }
            // const { projection } = useDiscoveryPreferences();
            const handleChange = () => {
                emit('change', projection.value)
            }
            const isProjectionSelected = (property) =>
                projection.value.includes(property.id)
            const togglePropertySelect = (property) => {
                if (projection.value.includes(property.id)) {
                    const index = projection.value.indexOf(property.id)
                    projection.value.splice(index, 1)
                } else {
                    projection.value.push(property.id)
                }
                // trigger change
                handleChange()
            }

            const sorting = ref('')

            sorting.value = props.defaultSorting || 'default'
            const handeChangeSorting = () => {
                emit('sort', sorting.value)
            }

            const state = ref('')
            state.value = props.defaultState || 'active'
            const handleChangeState = () => {
                emit('state', state.value)
            }

            const properties = [
                {
                    id: 'description',
                    label: 'Description',
                },
                {
                    id: 'classifications',
                    label: 'Classifications',
                },
                {
                    id: 'hierarchy',
                    label: 'Hierarchy',
                },
                {
                    id: 'popularity',
                    label: 'Popularity',
                },
                {
                    id: 'searchscore',
                    label: 'Relevance',
                },
            ]

            const radioButtonData = [
                {
                    id: 'active',
                    label: 'Active',
                },
                {
                    id: 'archived',
                    label: 'Archived',
                },
                {
                    id: 'all',
                    label: 'All',
                },
            ]

            return {
                radioButtonData,
                togglePropertySelect,
                isProjectionSelected,
                properties,
                projection,
                sorting,
                state,
                handleChange,
                handeChangeSorting,
                handleChangeState,
            }
        },
    })
</script>
<style lang="less" scoped>
    .preference-container {
        width: 240px;
    }
</style>
