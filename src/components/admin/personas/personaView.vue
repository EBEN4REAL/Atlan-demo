<template>
    <ExplorerLayout
        title="Personas"
        subTitle="Access controls for user personas"
    >
        <template #sidebar>
            <SearchAndFilter
                placeholder="Search for personas"
                v-model:value="searchTerm"
                class="mx-4 mt-6 mb-4 bg-white"
                size="minimal"
            />

            <ExplorerList
                :list="filteredPersonas"
                v-model:selected="selectedPersonaId"
                dataKey="id"
            >
                <template #default="{ item, isSelected }">
                    <span
                        class="text-sm truncate"
                        :class="
                            isSelected ? 'text-primary font-bold' : 'text-gray'
                        "
                    >
                        {{ item.personaName }}
                    </span>
                </template>
            </ExplorerList>
        </template>

        <PersonaScopes :selectedPersona="selectedPersona" />
    </ExplorerLayout>
    <!-- <div class="flex scroll-container">
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
    </div> -->
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import usePersonaService from '~/services/heracles/composables/personas'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PersonaScopes from './personaScopes.vue'
    import ExplorerList from '../common/explorerList.vue'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            SearchAndFilter,
            PersonaScopes,
            ExplorerLayout,
            ExplorerList,
        },
        setup() {
            const selectedPersonaId = ref('')
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
                if (selectedPersonaId.value)
                    return personaList.value.find(
                        (ps) => ps.id === selectedPersonaId.value
                    )
                else return undefined
            })

            return {
                filteredPersonas,
                selectedPersona,
                selectedPersonaId,
                searchTerm,
            }
        },
    })
</script>

<style lang="less" module>
    .sidebar {
        &:global(.ant-menu-root) {
            @apply bg-transparent;
        }

        &:global(.ant-menu-inline) {
            @apply border-none !important;
        }

        :global(.ant-menu-item-group-title) {
            @apply px-0;
        }

        :global(.ant-menu-item) {
            height: 32px;
            line-height: 32px;
            @apply my-1 text-gray !important;
        }

        :global(.ant-menu-item-active) {
            @apply bg-gray-light !important;
        }

        :global(.ant-menu-item::after) {
            @apply border-none !important;
        }

        :global(.ant-menu-item-selected) {
            @apply rounded !important;
            @apply bg-gray-200 !important;
            @apply font-bold;
        }
    }
</style>
