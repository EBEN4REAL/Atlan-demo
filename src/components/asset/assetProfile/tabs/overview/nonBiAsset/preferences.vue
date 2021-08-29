<template>
    <div class="flex">
        <div class="px-3">
            <p class="mb-1 text-gray-500">Filter by type</p>
            <a-checkbox-group
                v-model:value="typeFiltersSelected"
                @change="updateType"
            >
                <div class="flex flex-col space-y-1 capitalize">
                    <a-checkbox
                        v-for="(type, index) in typeFilters"
                        :key="index"
                        :value="type"
                        >{{ type }}
                    </a-checkbox>
                </div>
            </a-checkbox-group>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref } from 'vue'

    export default defineComponent({
        setup() {
            /** DATA */
            const typeFilters = ref([])
            const typeFiltersSelected = ref([])

            /** INJECTIONS */
            const handleFilterInj = inject('handleFilter')
            const typeFiltersInj = inject('typeFilters')
            typeFilters.value = typeFiltersInj.value
            typeFiltersSelected.value = typeFiltersInj.value

            /** METHODS */
            const updateType = (e: []) => {
                typeFiltersSelected.value = e
                handleFilterInj(e)
            }

            return {
                typeFilters,
                typeFiltersSelected,
                updateType,
            }
        },
    })
</script>
