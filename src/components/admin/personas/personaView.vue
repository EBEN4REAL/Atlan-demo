<template>
    <ExplorerLayout
        title="Personas"
        sub-title="Access controls for user personas"
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
                v-model:value="searchTerm"
                placeholder="Search for personas"
                class="mx-4 mt-6 mb-4 bg-white"
                :autofocus="true"
            />

            <ExplorerList
                v-model:selected="selectedPersonaId"
                :disabled="isEditing"
                :list="filteredPersonas"
                data-key="id"
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
        <PersonaBody v-if="selectedPersona" v-model:persona="selectedPersona" />
    </ExplorerLayout>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PersonaBody from './personaBody.vue'
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
            PersonaBody,
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
