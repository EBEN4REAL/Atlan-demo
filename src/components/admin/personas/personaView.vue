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
                <a-menu v-model:selectedKeys="selectedPersona" mode="inline">
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
            <template v-if="selectedPersona">
                <span class="pb-2 text-xl pt-7 text-gray">Scopes</span>
                <div class="py-2 overflow-y-auto">
                    <div class="mb-3" v-for="scope in scopeList">
                        <span
                            class="block mb-1 text-base text-gray-500 capitalize "
                            >{{ scope.type }}</span
                        >
                        <a-checkbox-group
                            :name="scope.type"
                            :options="scope.scopes"
                        />
                    </div>
                </div>
            </template>
            <div v-else class="flex items-center justify-center h-full">
                <a-spin v-if="scopeListLoading" />
                <span v-else class="mx-auto"
                    >Add a new persona or select one to edit it</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import usePersonaService from '~/services/heracles/composables/personas'
    import useScopeService from '~/services/heracles/composables/scopes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'RequestList',
        components: { SearchAndFilter },
        setup() {
            const selectedPersona = ref('')
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

            const {
                scopeList,
                error,
                isLoading: scopeListLoading,
            } = useScopeService().listScopes()

            return {
                filteredPersonas,
                selectedPersona,
                searchTerm,
                scopeList,
                scopeListLoading,
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
