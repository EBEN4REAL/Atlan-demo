<template>
    <div class="flex">
        <div class="px-3 border-r border-gray-200 border-dashed">
            <p class="mb-1 text-gray-500">Show/Hide</p>
            <a-checkbox-group
                v-model:value="assetTypesSelected"
                @change="updateFilters"
            >
                <div class="flex flex-col space-y-1">
                    <a-checkbox
                        v-for="(type, index) in assetTypesFiltered"
                        :key="index"
                        :value="type"
                        >{{ type }} ({{
                            assetTypesLengthMapInjection[type] || 0
                        }})</a-checkbox
                    >
                </div>
            </a-checkbox-group>
        </div>
        <div class="pl-3">
            <p class="mb-1 text-gray-500">Depth</p>
            <a-radio-group v-model:value="level" @change="updateDepth">
                <div class="flex flex-col space-y-1">
                    <a-radio :value="1">Level 1</a-radio>
                    <a-radio :value="2">Level 2</a-radio>
                    <a-radio :value="3">Level 3</a-radio>
                    <a-radio :value="4">Max</a-radio>
                </div>
            </a-radio-group>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref, computed } from 'vue'

    export default defineComponent({
        setup() {
            /** DATA */
            const level = ref(1)
            const assetTypes = ['Table', 'View', 'Column', 'Bi Dashboard']
            const assetTypesSelected = ref([])

            /** INJECTIONS */
            const assetTypesLengthMapInjection = inject('assetTypesLengthMap')
            const depthInjection = inject('updateDepth')
            const filterInjection = inject('updateFilters')

            /** COMPUTED */
            const assetTypesLengthMap = computed(
                () => assetTypesLengthMapInjection.value
            )
            const assetTypesFiltered = computed(() =>
                assetTypes.filter((type) => assetTypesLengthMap.value?.[type])
            )
            assetTypesSelected.value = assetTypesFiltered.value

            /** METHODS */
            const updateDepth = () => {
                depthInjection(level.value)
            }
            const updateFilters = (e: []) => {
                assetTypesSelected.value = e
                filterInjection(e)
            }

            return {
                assetTypesSelected,
                assetTypesLengthMapInjection,
                assetTypesFiltered,
                level,
                updateDepth,
                updateFilters,
            }
        },
    })
</script>
