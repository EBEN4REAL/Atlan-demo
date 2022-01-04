<template>
    <div class="flex items-center justify-center">
        <div class="w-full h-full">
            <div class="mx-4 border-b">
                <SearchAdvanced
                    v-model="searchTerm"
                    :allow-clear="true"
                    :autofocus="true"
                    :placeholder="`Search ${
                        totalPersonasCount ? totalPersonasCount : ''
                    } personas`"
                ></SearchAdvanced>
            </div>
            <div
                v-if="isLoading && !filteredPersonas.length"
                class="flex items-center justify-center w-full h-full"
            >
                <AtlanIcon
                    icon="Loader"
                    class="mr-1 animate-spin text-primary"
                ></AtlanIcon
                >Fetching personas...
            </div>
            <div
                v-else-if="!totalPersonasCount"
                class="flex items-center justify-center mt-4 persona-list-wrapper"
            >
                No personas exist.
            </div>
            <div
                v-else-if="!filteredPersonas.length && searchTerm"
                class="flex items-center justify-center mt-4 truncate persona-list-wrapper"
            >
                <span class=""
                    >No personas found with
                    <span class="italic">{{ searchTerm }}</span></span
                >
            </div>
            <div
                v-else-if="filteredPersonas.length"
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
                <div v-if="showLoadMore" class="flex justify-center w-full">
                    <button
                        :disabled="isLoading"
                        class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                        @click="handleLoadMore"
                    >
                        <template v-if="!isLoading">
                            <p
                                class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                            >
                                Load more
                            </p>
                            <AtlanIcon icon="ArrowDown" />
                        </template>
                        <AtlanIcon
                            v-else
                            icon="Loader"
                            class="animate-spin"
                        ></AtlanIcon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed } from 'vue'
    import { useDebounceFn, useVModels } from '@vueuse/core'
    import usePersonaList from './usePersonaList'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import { getIsLoadMore } from '~/utils/isLoadMore'

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
            const personaParams = ref({ limit: 20, offset: 0, filter: {} })
            const {
                filteredPersonas,
                isLoading,
                filteredPersonasCount,
                totalPersonasCount,
                reFetchList,
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

            const searchPersonas = useDebounceFn((searchText: string) => {
                personaParams.value.offset = 0
                personaParams.value.filter = searchText.length
                    ? { displayName: { $ilike: `${searchText}%` } }
                    : {}
                reFetchList()
            }, 200)

            watch(searchTerm, () => {
                searchPersonas(searchTerm.value)
            })
            const handleLoadMore = () => {
                personaParams.value.offset += personaParams.value.limit
                reFetchList()
            }
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    filteredPersonas.value.length,
                    personaParams.value.offset,
                    personaParams.value.limit,
                    searchTerm.value.length
                        ? filteredPersonasCount.value
                        : totalPersonasCount.value
                )
            )
            return {
                filteredPersonas,
                updateSelectedPersonas,
                personaParams,
                isLoading,
                filteredPersonasCount,
                totalPersonasCount,
                searchTerm,
                showLoadMore,
                handleLoadMore,
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
