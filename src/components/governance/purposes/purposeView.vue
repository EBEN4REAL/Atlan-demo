<template>
    <ExplorerLayout
        title="Purpose"
        sub-title=""
        :sidebar-visibility="Boolean(selectedPersonaId)"
    >
        <template #action>
            <AtlanBtn
                :disabled="isEditing"
                class="flex-none"
                size="sm"
                color="primary"
                padding="compact"
                data-test-id="add-purpose"
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
                v-model:selected="selectedPersonaId"
                type="purposes"
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

        <AddPurpose
            v-model:visible="modalVisible"
            v-model:persona="selectedPersona"
            :persona-list="personaList"
        />

        <a-spin v-if="isPersonaLoading" class="mx-auto my-auto" size="large" />
        <template v-else-if="selectedPersona">
            <PurposeHeader :persona="selectedPersona" />
            <PurposeBody
                v-model:persona="selectedPersona"
                :whitelisted-connection-ids="whitelistedConnectionIds"
                @selectPolicy="handleSelectPolicy"
            />
        </template>
        <div
            v-else-if="
                filteredPersonas?.length == 0 && isPersonaError === undefined
            "
            class="flex flex-col items-center justify-center h-full"
        >
            <component :is="AddPersonaIllustration"></component>
            <span class="mx-auto text-base text-gray"
                >You don't have any purposes</span
            >
            <AtlanBtn
                class="flex-none mx-auto mt-6"
                color="primary"
                padding="compact"
                data-test-id="add-new-purpose"
                size="sm"
                @click.prevent="() => (modalVisible = true)"
            >
                <template #prefix>
                    <AtlanIcon icon="Add" />
                </template>
                Add new purpose
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
    import ErrorView from '@common/error/index.vue'
    import { storeToRefs } from 'pinia'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import PurposeBody from './purposeBody.vue'
    import PurposeHeader from './purposeHeader.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import AddPurpose from './addPurpose.vue'
    import {
        reFetchList,
        personaList,
        filteredPersonas,
        searchTerm,
        selectedPersona,
        selectedPersonaId,
        isPersonaListReady,
        isPersonaLoading,
        isPersonaError,
    } from './composables/usePurposeList'
    import { isEditing } from './composables/useEditPurpose'
    import AddPersonaIllustration from '~/assets/images/illustrations/add_user.svg'
    import ErrorIllustration from '~/assets/images/error.svg'
    import { useAuthStore } from '~/store/auth'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            ErrorView,
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
            const modalDetailPolicyVisible = ref(false)
            const selectedPolicy = ref({})
            const authStore = useAuthStore()
            const { roles } = storeToRefs(authStore)
            watch(searchTerm, () => {
                console.log(searchTerm.value, 'searched')
            })

            const handleCloseModalDetailPolicy = () => {
                modalDetailPolicyVisible.value = false
            }
            const handleSelectPolicy = (policy) => {
                selectedPolicy.value = policy
                modalDetailPolicyVisible.value = true
            }
            const whitelistedConnectionIds = ref([])
            watch(
                roles,
                () => {
                    const filteredRoles = (roles.value || []).filter((role) =>
                        role.name.startsWith('connection_admins_')
                    )
                    whitelistedConnectionIds.value = filteredRoles.map(
                        (role) => {
                            if (role && role.name)
                                return role.name.split('_')[2]
                            return ''
                        }
                    )
                },
                {
                    immediate: true,
                    deep: true,
                }
            )
            return {
                reFetchList,
                personaList,
                filteredPersonas,
                selectedPersona,
                selectedPersonaId,
                searchTerm,
                modalVisible,
                isPersonaLoading,
                isPersonaError,
                // createNewPersona,
                isEditing,
                AddPersonaIllustration,
                isPersonaListReady,
                ErrorIllustration,
                handleCloseModalDetailPolicy,
                handleSelectPolicy,
                selectedPolicy,
                whitelistedConnectionIds,
            }
        },
    })
</script>
<style lang="less" scoped>
    .success {
        background: #00a680;
    }
</style>
