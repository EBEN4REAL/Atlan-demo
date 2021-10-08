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
                :autofocus="true"
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

        <PersonaHeader :persona="selectedPersona" />
        <PersonaDetails :selectedPersona="selectedPersona" />
    </ExplorerLayout>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import usePersonaService from '~/services/heracles/composables/personas'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PersonaDetails from './personaDetails.vue'
    import PersonaHeader from './personaHeader.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import { until, invoke } from '@vueuse/core'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            SearchAndFilter,
            PersonaDetails,
            PersonaHeader,
            ExplorerLayout,
            ExplorerList,
        },
        setup() {
            const selectedPersonaId = ref('')
            const searchTerm = ref('')

            const { listPersonas } = usePersonaService()
            const { data: personaList, isReady } = listPersonas()

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

            invoke(async () => {
                await until(isReady).toBe(true)
                if (personaList.value?.length)
                    selectedPersonaId.value = personaList.value[0].id
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
