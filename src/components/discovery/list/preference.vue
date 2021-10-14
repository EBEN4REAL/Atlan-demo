<template>
    <div class="flex flex-col py-1 rounded gap-y-3 preference-container">
        <div class="flex items-center justify-between text-gray">
            <span class="mr-6 text-sm text-gray">Order By</span>
            <a-select
                class="text-gray-500"
                v-model:value="sorting"
                @change="handeChangeSorting"
                style="width: 135px"
            >
                <template #suffixIcon>
                   <AtlanIcon
                      icon="ChevronDown"
                      class="text-gray-500 custom-icon-drop"            
                    />
                </template>
                <a-select-option value="default">Relevance</a-select-option>
                <a-select-option value="Catalog.popularityScore|descending">Most popular</a-select-option>
                <a-select-option value="Catalog.popularityScore|ascending"
                    >
                    Least popular</a-select-option
                >
                <a-select-option value="name|ascending">A-Z</a-select-option>
                <a-select-option value="name|descending">Z-A</a-select-option>
            </a-select>
        </div>
        <div class="pt-4">
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
                <CustomRadioButton
                    class=""
                    :list="radioButtonData"
                    @change="handleChangeState"
                    v-model:data="state"
                />
            </div>
        </div>
        <!-- <div class="px-3 border-r border-gray-200 border-dashed">
            <p class="mb-1 text-gray-500">Show</p>
            <a-checkbox-group v-model:value="projection" @change="handleChange">
                <div class="flex">
                    <div class="flex flex-col space-y-1">
                        <a-checkbox value="description">Description</a-checkbox>
                        <a-checkbox value="owners">Owners</a-checkbox>
                        <a-checkbox value="terms">Business Terms</a-checkbox>
                        <a-checkbox value="classifications"
                            >Classifications</a-checkbox
                        >

                        <a-checkbox value="heirarchy">Hierarchy</a-checkbox>
                        <a-checkbox value="popularity"
                            >Popularity Score</a-checkbox
                        >
                        <a-checkbox value="searchscore"
                            >Relevance Score</a-checkbox
                        >
                    </div>
                </div>
            </a-checkbox-group>
        </div> -->
        <!-- <div class="pl-4">
            <p class="mb-1 text-gray-500">Order</p>
            <a-radio-group v-model:value="sorting" @change="handeChangeSorting">
                <div class="flex flex-col space-y-1">
                    <a-radio value="default">Relevance</a-radio>
                    <a-radio value="Catalog.popularityScore|descending"
                        >Most popular</a-radio
                    >
                    <a-radio value="Catalog.popularityScore|ascending"
                        >Least popular</a-radio
                    >
                    <a-radio value="name|ascending">A-Z</a-radio>
                    <a-radio value="name|descending">Z-A</a-radio>
                </div>
            </a-radio-group>

            <p class="mt-3 mb-1 text-gray-500">State</p>
            <a-radio-group v-model:value="state" @change="handleChangeState">
                <div class="flex flex-col space-y-1">
                    <a-radio value="all">All Assets</a-radio>
                    <a-radio value="active">Active</a-radio>
                    <a-radio value="deleted">Deleted</a-radio>
                </div>
            </a-radio-group>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, ref } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'

    export default defineComponent({
        components: { CustomRadioButton },
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
            const isProjectionSelected = (property) => {
                return projection.value.includes(property.id)
            }
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
                    id: 'terms',
                    label: 'Business Terms',
                },
                {
                    id: 'classifications',
                    label: 'Classifications',
                },
                {
                    id: 'description',
                    label: 'Description',
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
    .custom-icon-drop{
      transform: translateY(-2px);
    }
</style>
