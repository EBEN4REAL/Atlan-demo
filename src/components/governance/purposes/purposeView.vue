<template>
    <ExplorerLayout title="Purposes" sub-title="">
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
                    v-model:value="searchTerm"
                    :placeholder="`Search from ${filteredPersonas?.length} purposes`"
                    class="mt-4 mb-2 bg-white"
                    :autofocus="true"
                    size="minimal"
                >
                    <template #filter>
                        <div></div>
                    </template>
                </SearchAndFilter>
            </div>

            <ExplorerList
                v-model:selected="selectedPersonaId"
                :disabled="isEditing"
                :list="filteredPersonas"
                data-key="id"
            >
                <template #default="{ item, isSelected }">
                    <div class="flex items-center justify-between">
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
                        <div class="w-1.5 h-1.5 rounded-full success"></div>
                    </div>
                </template>
            </ExplorerList>
        </template>

        <AddPurpose v-model:visible="modalVisible" />

        <a-spin
            v-if="!isPersonaListReady"
            class="mx-auto my-auto"
            size="large"
        />
        <template v-else-if="selectedPersona">
            <PurposeHeader :persona="selectedPersona" />
            <PurposeBody v-model:persona="selectedPersona" />
        </template>
        <div v-else class="flex flex-col items-center justify-center h-full">
            <component :is="AddPersonaIllustration"></component>
            <span class="mx-auto text-base text-gray"
                >You don't have any purposes</span
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
                Add new purpose
            </AtlanBtn>
        </div>
    </ExplorerLayout>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PurposeBody from './purposeBody.vue'
    import PurposeHeader from './purposeHeader.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import AddPurpose from './addPurpose.vue'
    import {
        filteredPersonas,
        searchTerm,
        selectedPersona,
        selectedPersonaId,
        isPersonaListReady,
    } from './composables/usePurposeList'
    import { isEditing } from './composables/useEditPurpose'
    import AddPersonaIllustration from '~/assets/images/illustrations/add_user.svg'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            AtlanBtn,
            SearchAndFilter,
            PurposeBody,
            PurposeHeader,
            ExplorerLayout,
            ExplorerList,
            AddPurpose,
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
<style lang="less" scoped>
    .success {
        background: #00a680;
    }
</style>
