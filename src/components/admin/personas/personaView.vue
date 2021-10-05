<template>
    <p class="mb-2 text-2xl">Personas</p>
    <p class="mb-0 text-sm text-gray">Access controls for user personas</p>

    <div class="flex scroll-container">
        <div class="w-1/4 h-full overflow-y-hidden">
            <SearchAndFilter
                placeholder="Search for personas"
                v-model:value="searchTerm"
                class="pt-6 mb-4"
            />
            <aside class="overflow-y-auto" style="height: calc(100% - 4.5rem)">
                <a-menu v-model:selectedKeys="selectedPersonaId" mode="inline">
                    <a-menu-item
                        v-for="persona in filteredPersonas"
                        :key="persona.id"
                    >
                        {{ persona.personaName }}
                    </a-menu-item>
                </a-menu>
            </aside>
        </div>

        <div class="flex flex-col w-3/4 h-full px-4 overflow-y-hidden">
            <PersonaScopes :selectedPersona="selectedPersona" />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import usePersonaService from '~/services/heracles/composables/personas'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import PersonaScopes from './personaScopes.vue'

    export default defineComponent({
        name: 'PersonaView',
        components: { SearchAndFilter, PersonaScopes },
        setup() {
            const selectedPersonaId = ref([])
            const searchTerm = ref('')

            const { listPersonas } = usePersonaService()
            const { data: personaList } = listPersonas()

            const filteredPersonas = computed(() => {
                if (searchTerm.value)
                    return personaList.value.filter((ps) =>
                        ps.personaName
                            .toLowerCase()
                            .includes(searchTerm.value.toLowerCase())
                    )
                else return personaList.value
            })

            const selectedPersona = computed(() => {
                if (selectedPersonaId.value[0])
                    return personaList.value.find(
                        (ps) => ps.id === selectedPersonaId.value[0]
                    )
                else return undefined
            })

            return {
                filteredPersonas,
                selectedPersona,
                selectedPersonaId,
                searchTerm,
                personaList,
            }
        },
    })
</script>

<style scoped>
    .scroll-container {
        @apply overflow-y-auto;
        height: calc(100vh - 8.5rem);
    }
</style>
