<template>
    <ExplorerLayout
        title="Personas"
        subTitle="Access controls for user personas"
    >
        <template #action>
            <AtlanBtn
                :disabled="isEditing"
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="() => (modalVisible = true)"
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
                :disabled="isEditing"
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

        <AddPersona v-model:visible="modalVisible" />
        <PersonaHeader :persona="selectedPersona" />
        <PersonaDetails
            v-if="selectedPersona"
            v-model:persona="selectedPersona"
        />
    </ExplorerLayout>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PersonaDetails from './personaBody.vue'
    import PersonaHeader from './personaHeader.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import AddPersona from './addPersona.vue'
    import {
        filteredPersonas,
        searchTerm,
        selectedPersona,
        selectedPersonaId,
    } from './composables/usePersonaList'
    import { isEditing } from './composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            AtlanBtn,
            SearchAndFilter,
            PersonaDetails,
            PersonaHeader,
            ExplorerLayout,
            ExplorerList,
            AddPersona,
        },
        setup() {
            const modalVisible = ref(false)

            return {
                filteredPersonas,
                selectedPersona,
                selectedPersonaId,
                searchTerm,
                modalVisible,
                // createNewPersona,
                isEditing,
            }
        },
    })
</script>
