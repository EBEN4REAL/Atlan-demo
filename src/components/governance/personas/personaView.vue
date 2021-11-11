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
            <div class="px-4">
                <SearchAndFilter
                    v-model:modelValue="searchTerm"
                    placeholder="Search for personas"
                    class="mt-6 mb-4 bg-white"
                    :autofocus="true"
                />
            </div>

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

        <a-spin
            v-if="!isPersonaListReady"
            class="mx-auto my-auto"
            size="large"
        />
        <template v-else-if="selectedPersona">
            <PersonaHeader :persona="selectedPersona" />
            <PersonaBody v-model:persona="selectedPersona" />
        </template>
        <div v-else class="flex flex-col items-center justify-center h-full">
            <component :is="AddPersonaIllustration"></component>
            <span class="mx-auto text-base text-gray"
                >You don't have any personas</span
            >
            <AtlanBtn
                class="flex-none mx-auto mt-6"
                color="primary"
                padding="compact"
                size="sm"
                @click.prevent="() => (modalVisible = true)"
            >
                <template #prefix>
                    <AtlanIcon icon="Add" />
                </template>
                Add new persona
            </AtlanBtn>
        </div>
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
        isPersonaListReady,
    } from './composables/usePersonaList'
    import { isEditing } from './composables/useEditPersona'

    import AddPersonaIllustration from '~/assets/images/illustrations/add_user.svg'

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
                AddPersonaIllustration,
                isPersonaListReady,
            }
        },
    })
</script>
