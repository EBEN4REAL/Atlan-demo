<template>
    <div>
        <div class="flex flex-col overflow-y-auto">
            <p class="mb-2 text-sm text-gray-700">Link Classification</p>
            <a-select
                v-model:value="selectedClassificationsNames"
                mode="multiple"
                :allow-clear="true"
                :autofocus="true"
                :show-search="true"
                placeholder="Search for classifications"
                @change="emitClassificationData"
            >
                <template
                    v-for="classification in classificationsList"
                    :key="classification.name"
                >
                    <a-select-option :value="classification.name">{{
                        classification.displayName
                    }}</a-select-option>
                </template>
            </a-select>
            <a-checkbox
                v-model:checked="linkClassificationData.propagate"
                class="mt-2 text-sm text-gray-700"
                @change="emitClassificationData"
                >Propagate classification to related assets
            </a-checkbox>
            <a-checkbox
                v-model:checked="
                    linkClassificationData.removePropagationsOnEntityDelete
                "
                :disabled="!linkClassificationData.propagate"
                class="mt-2 text-sm text-gray"
                @change="emitClassificationData"
                >Remove propagation when related assets are deleted
            </a-checkbox>
        </div>
    </div>
</template>
           


<script lang="ts">
import { defineComponent, ref, Ref, PropType, toRefs, computed } from 'vue'
import { useClassificationStore } from '~/components/admin/classifications/_store'
import { Components } from '~/api/atlas/client'

export default defineComponent({
    name: 'LinkClassificationsDropdown',
    props: {
        // if not provided it shows all the classifications in the store
        availableClassificationsList: {
            type: Array as unknown as PropType<
                Components.Schemas.AtlasClassification[]
            >,
            default: () => [],
        },
        selectedClassificationsList: {
            type: Array as unknown as PropType<
                Components.Schemas.AtlasClassification[]
            >,
            default: () => [],
        },
    },
    emits: ['changeClassifications'],
    setup(props, { emit }) {
        const classificationsStore = useClassificationStore()
        const { availableClassificationsList, selectedClassificationsList } =
            toRefs(props)
        const classificationsList = ref(
            availableClassificationsList?.value.length
                ? [...availableClassificationsList.value]
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
            ...selectedClassificationsList.value.map(
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