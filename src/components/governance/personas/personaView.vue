<template>
    <ExplorerLayout
        title="Persona"
        sub-title=""
        :sidebarVisibility="Boolean(selectedPersonaId)"
    >
        <template #action>
            <AtlanBtn
                :disabled="isEditing"
                class="flex-none"
                size="sm"
                color="primary"
                padding="compact"
                data-test-id="add-persona"
                @click="() => (modalVisible = true)"
            >
                <AtlanIcon icon="Add" class="mr-1 -mx-1 text-white"></AtlanIcon>
                New
            </AtlanBtn>
        </template>
        <template #sidebar>
            <div class="px-4">
                <SearchAndFilter
                    v-model:value="searchTerm"
                    :placeholder="`Search from ${
                        filteredPersonas?.length ?? 0
                    } personas`"
                    class="my-3 bg-white"
                    :autofocus="true"
                    size="minimal"
                >
                </SearchAndFilter>
            </div>

            <ExplorerList
                type="personas"
                v-model:selected="selectedPersonaId"
                :disabled="isEditing"
                :list="filteredPersonas"
                data-key="id"
            >
                <template #default="{ item, isSelected }">
                    <div
                        class="flex items-center justify-between"
                        :data-test-id="item.displayName"
                    >
                        <span
                            style="width: 95%"
                            class="text-sm truncate"
                            :class="
                                isSelected
                                    ? 'text-primary'
                                    : 'text-gray hover:text-primary'
                            "
                        >
                            {{ item.displayName }}
                        </span>
                        <!-- <div class="w-1.5 h-1.5 rounded-full success"></div> -->
                    </div>
                </template>
            </ExplorerList>
        </template>

        <AddPersona v-model:visible="modalVisible" />
        <a-spin v-if="isPersonaLoading" class="mx-auto my-auto" size="large" />
        <template v-else-if="selectedPersona">
            <div class="bg-white">
                <PersonaHeader :persona="selectedPersona" />
            </div>
            <PersonaBody v-model:persona="selectedPersona" />
        </template>
        <div
            v-else-if="
                filteredPersonas?.length == 0 && isPersonaError === undefined
            "
            class="flex flex-col items-center justify-center h-full"
        >
            <component :is="AddPersonaIllustration"></component>
            <span class="mx-auto text-base text-gray"
                >You don't have any personas</span
            >
            <AtlanBtn
                class="flex-none mx-auto mt-6"
                color="primary"
                data-test-id="add-new-persona"
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

        <ErrorView v-else :error="isPersonaError">
            <div class="mt-3">
                <a-button
                    data-test-id="try-again"
                    size="large"
                    type="primary"
                    ghost
                    @click="
                        () => {
                            reFetchList()
                        }
                    "
                >
                    <fa icon="fal sync" class="mr-2"></fa>Try again
                </a-button>
            </div>
        </ErrorView>
    </ExplorerLayout>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PersonaBody from './personaBody.vue'
    import PersonaHeader from './personaHeader.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import AddPersona from './addPersona.vue'
    import {
        reFetchList,
        filteredPersonas,
        searchTerm,
        selectedPersona,
        selectedPersonaId,
        isPersonaLoading,
        isPersonaError,
    } from './composables/usePersonaList'
    import { isEditing } from './composables/useEditPersona'
    import ErrorView from '@common/error/index.vue'
    import AddPersonaIllustration from '~/assets/images/illustrations/add_user.svg'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            ErrorView,
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
            watch(searchTerm, () => {
                console.log(searchTerm.value, 'searched')
            })

            return {
                reFetchList,
                filteredPersonas,
                selectedPersona,
                selectedPersonaId,
                searchTerm,
                modalVisible,
                // createNewPersona,
                isPersonaLoading,
                isPersonaError,
                isEditing,
                AddPersonaIllustration,
            }
        },
    })
</script>
<style lang="less" scoped>
    .success {
        background: #00a680;
    }
</style>
