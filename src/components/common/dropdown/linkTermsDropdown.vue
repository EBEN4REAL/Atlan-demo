<template>
    <div class="flex flex-col overflow-y-auto w-72">
        <p class="mb-2 text-sm text-gray-700">Link Terms</p>
        <a-select
            v-model:value="selectedClassificationForLink"
            mode="multiple"
            :allow-clear="true"
            :autofocus="true"
            :show-search="true"
            placeholder="Search for terms"
            :loading="searchLoading"
            @change="handleSelectedClassificationForLink"
        >
            <template v-for="term in availableTerms" :key="term.guid">
                <a-select-option :value="term.guid">{{
                    term.displayText
                }}</a-select-option>
            </template>
        </a-select>

        <template v-else>
            <p v-if="searchLoading">loading</p>

            <p v-else class="mb-2 text-sm text-gray-700">No data</p>
            <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
                {{ createErrorText }}
            </p>
        </template>
        <div class="flex items-center justify-end w-full mt-4">
            <div class="space-x-4">
                <a-button class="px-4" @click="handleCancel">Cancel</a-button>
                <a-button
                    type="primary"
                    class="px-4"
                    :loading="
                        createClassificationStatus === 'loading' ? true : false
                    "
                    @click="createTerm"
                    >Link</a-button
                >
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, PropType, toRefs, computed } from 'vue'
import { useClassificationStore } from '~/components/admin/classifications/_store'
import { Components } from '~/api/atlas/client'

export default defineComponent({
    name: 'LinkTermsDropdown',
    props: {
        // if not provided it shows all the classifications in the store
        availableTermsList: {
            type: Array as unknown as PropType<
                Components.Schemas.AtlasClassification[]
            >,
            default: () => [],
        },
        selectedTermsList: {
            type: Array as unknown as PropType<
                Components.Schemas.AtlasClassification[]
            >,
            default: () => [],
        },
    },
    emits: ['changeTerms'],
    setup(props, { emit }) {
        const { availableTermsList, selectedTermsList } = toRefs(props)
        const termsList = ref(
            availableTermsList?.value.length
                ? [...availableTermsList.value]
                : [...classificationsStore.classifications]
        )

        const selectedClassificationsNames: Ref<string[]> = ref([])
        const classificationNameMap = computed(() => {
            const clsfMap: Record<
                string,
                Components.Schemas.AtlasClassification[]
            > = {}
            classificationsList.value?.forEach((clsf) => {
                clsfMap[clsf.name] = clsf
            })
            return clsfMap
        })
        const selectedClassifications: Ref<
            Components.Schemas.AtlasClassification[]
        > = ref([])
        // initialise with selcted classifcations from props, if present
        selectedClassificationsNames.value = [
            ...selectedTermsList.value.map(
                (clsf) => clsf?.typeName || clsf?.name
            ),
        ]
        const linkClassificationData = ref({
            propagate: false,
            removePropagationsOnEntityDelete: false,
        })
        const emitClassificationData = () => {
            selectedClassifications.value = [
                ...selectedClassificationsNames.value.map(
                    (clsf) => classificationNameMap.value[clsf]
                ),
            ]
            emit(
                'changeClassifications',
                selectedClassifications,
                linkClassificationData
            )
        }
        const clearSelection = () => {
            selectedClassificationsNames.value = []
            selectedClassifications.value = []
        }
        return {
            selectedClassificationsNames,
            linkClassificationData,
            emitClassificationData,
            classificationsList,
            classificationNameMap,
            selectedClassifications,
            clearSelection,
        }
    },
})
</script>

<style>
</style>