<template>
    <ExplorerLayout
        title="Personas"
        subTitle="Access controls for user personas"
    >
        <template #action>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="toggleModal"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
        </template>
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
                        {{ item.displayName }}
                    </span>
                </template>
            </ExplorerList>
        </template>

        <CreationModal
            v-model:visible="modalVisible"
            title="New Persona"
            @cancel="() => (modalVisible = false)"
            @ok="handleCreation"
        >
        </CreationModal>
        <PersonaHeader
            :persona="selectedPersona"
            v-model:isEditMode="isEditMode"
        />
        <PersonaDetails
            v-if="selectedPersona"
            v-model:isEditMode="isEditMode"
            v-model:persona="selectedPersona"
        />
    </ExplorerLayout>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import usePersonaService from '~/services/heracles/composables/personas'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PersonaDetails from './personaDetails.vue'
    import PersonaHeader from './personaHeader.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import CreationModal from '@/admin/common/addModal.vue'
    import { until, invoke } from '@vueuse/core'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            AtlanBtn,
            CreationModal,
            SearchAndFilter,
            PersonaDetails,
            PersonaHeader,
            ExplorerLayout,
            ExplorerList,
        },
        setup() {
            const isEditMode = ref(false)
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

            const modalVisible = ref(false)

            function toggleModal() {
                modalVisible.value = !modalVisible.value
            }

            function handleCreation() {}

            return {
                filteredPersonas,
                selectedPersona,
                selectedPersonaId,
                searchTerm,
                toggleModal,
                modalVisible,
                handleCreation,
                isEditMode,
            }
        },
    })
</script>
