<template>
    <div v-if="isLoading" class="flex items-center justify-center mt-3">
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Fetching Saved Filters</span>
    </div>
    <div v-else>
        <a-select
            v-model:value="selectedFilterName"
            class="mt-2"
            show-search
            placeholder="Choose saved filter"
            style="width: 300px"
            @change="handleChange"
        >
            <a-select-option
                v-for="(filter, index) in list"
                :key="index"
                :value="filter.name"
                >{{ filter.name }}</a-select-option
            >
        </a-select>

        <div v-if="selectedFilterName && selectedFilterName !== ''">
            <div class="mt-2 text-lg font-bold text-gray-700">
                {{ selectedFilterName }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    import { getSavedFilters } from '../useSavedFilters'

    export default defineComponent({
        emits: ['replaceFilter'],
        setup(_, { emit }) {
            const selectedFilterName = ref()
            const selectedFilter = ref()
            const title = ref<string>('')
            const description = ref<string | undefined>('')

            const { data: list, isLoading } = getSavedFilters()

            const handleChange = (value) => {
                selectedFilter.value = list.value.find(
                    (item) => item.name === value
                )
                emit('replaceFilter', selectedFilter.value)
            }

            return {
                selectedFilterName,
                handleChange,
                description,
                title,
                list,
                isLoading,
            }
        },
    })
</script>
