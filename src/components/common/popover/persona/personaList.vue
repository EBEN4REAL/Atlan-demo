<template>
    <div class="flex items-center justify-center">
        <div v-if="isLoading" class="flex items-center">
            <AtlanIcon
                icon="Loader"
                class="mr-1 animate-spin text-primary"
            ></AtlanIcon
            >Fetching personas...
        </div>
        <div v-else class="w-full h-full">
            <div class="mx-4 border-b">
                <SearchAdvanced
                    v-model="personaParams.searchString"
                    :autofocus="true"
                    :placeholder="`Search ${totalPersonasCount} personas`"
                ></SearchAdvanced>
            </div>
            <div
                v-if="!totalPersonasCount"
                class="flex items-center justify-center mt-4  persona-list-wrapper"
            >
                No personas exist.
            </div>
            <div
                v-if="!filteredPersonas.length && personaParams.searchString"
                class="flex items-center justify-center mt-4  persona-list-wrapper"
            >
                No personas found with
                <span class="italic">{{ personaParams.searchString }}</span>
            </div>
            <div
                v-if="filteredPersonas.length"
                class="mt-2 persona-list-wrapper"
            >
                <div
                    v-for="persona in filteredPersonas"
                    :key="persona.id"
                    class=""
                >
                    <a-popover :trigger="hover" placement="left">
                        <template #content>
                            <div class="max-w-xs p-2">
                                <div class="font-bold">
                                    {{ persona.displayName }}
                                </div>
                                <div v-if="persona.description" class="text-xs">
                                    {{ persona.description }}
                                </div>
                                <div v-else class="text-xs text-gray-500">
                                    No description
                                </div>
                            </div>
                        </template>
                        <a-checkbox
                            class="w-full h-full px-4 py-2 hover:bg-gray-light"
                            :value="persona"
                            :checked="
                                selectedPersonas.find(
                                    (p) => p.id === persona.id
                                )
                            "
                            @change="updateSelectedPersonas"
                            >{{ persona.displayName }}
                        </a-checkbox>
                    </a-popover>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useVModels } from '@vueuse/core'
import usePersonaList from './usePersonaList'
import SearchAdvanced from '@/common/input/searchAdvanced.vue'

export default defineComponent({
    name: 'PersonaList',
    components: { SearchAdvanced },
    props: {
        selectedPersonas: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const searchTerm = ref('')
        const personaParams = ref({ searchString: '' })
        const {
            filteredPersonas,
            isLoading,
            filteredPersonasCount,
            totalPersonasCount,
        } = usePersonaList(personaParams)
        const { selectedPersonas } = useVModels(props, emit)
        const updateSelectedPersonas = (event) => {
            if (
                event.target.checked &&
                !selectedPersonas.value.includes(event.target.value.id)
            )
                selectedPersonas.value.push({
                    name: event.target.value.name,
                    id: event.target.value.id,
                })
            else if (!event.target.checked) {
                const personaIndex = selectedPersonas.value.findIndex(
                    (persona) => persona.id === event.target.value.id
                )
                if (personaIndex > -1)
                    selectedPersonas.value.splice(personaIndex, 1)
            }
        }

        return {
            filteredPersonas,
            updateSelectedPersonas,
            personaParams,
            isLoading,
            filteredPersonasCount,
            totalPersonasCount,
        }
    },
})
</script>
<style lang="less" scoped>
.persona-list-wrapper {
    height: calc(100% - 2rem);
    overflow-y: auto;
}
</style>

