<template>
    <ExplorerLayout
        title="Purpose"
        sub-title=""
        :sidebar-visibility="Boolean(selectedPersonaId)"
    >
        <template #sidebar>
            <div class="flex items-center px-4 mb-3">
                <SearchAndFilter
                    v-model:value="searchTerm"
                    :placeholder="`Search ${
                        filteredPersonas?.length ?? 0
                    } purposes`"
                    class="mt-0 bg-white"
                    :autofocus="true"
                    size="minimal"
                >
                </SearchAndFilter>
                <a-tooltip>
                    <template #title>New Purpose</template>
                    <AtlanBtn
                        :disabled="isEditing"
                        class="flex-none px-2 ml-4"
                        size="sm"
                        color="secondary"
                        padding="compact"
                        data-test-id="add-purpose"
                        @click="() => (modalVisible = true)"
                    >
                        <AtlanIcon icon="Add" /> </AtlanBtn
                ></a-tooltip>
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
                        @click="handleSelectPurpose(item)"
                    >
                        <div
                            class="flex flex-col"
                            :data-test-id="item.displayName"
                        >
                            <span
                                class="text-sm capitalize truncate"
                                :class="
                                    isSelected
                                        ? 'text-primary font-semibold'
                                        : 'text-gray-700 hover:text-primary hover:font-semibold'
                                "
                            >
                                {{ item.displayName }}
                            </span>
                            <div class="flex gap-x-1">
                                <span
                                    v-if="item.tags.length > 0"
                                    class="text-sm text-gray-500"
                                >
                                    {{ item.tags.length }}
                                    classifications</span
                                >

                                <span
                                    v-if="
                                        item.dataPolicies.length > 0 ||
                                        item.metadataPolicies.length > 0
                                    "
                                    class="text-sm text-gray-500"
                                >
                                    {{
                                        item.metadataPolicies.length +
                                        item.dataPolicies.length
                                    }}
                                    policies</span
                                >
                            </div>

                            <!-- <div class="w-1.5 h-1.5 rounded-full success"></div> -->
                        </div>
                        <a-tooltip
                            v-if="item.description"
                            tabindex="-1"
                            :title="item.description"
                            placement="right"
                        >
                            <span
                                ><AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                            ></span>
                        </a-tooltip>
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
            <PurposeHeader
                v-model:openEditModal="openEditModal"
                :persona="selectedPersona"
            />
            <PurposeBody
                v-model:persona="selectedPersona"
                :whitelisted-connection-ids="whitelistedConnectionIds"
                @selectPolicy="handleSelectPolicy"
                @editDetails="openEditModal = true"
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
    import { defineComponent, ref, watch, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
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
        name: 'PurposeView',
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
            const router = useRouter()
            const route = useRoute()
            const modalVisible = ref(false)
            const modalDetailPolicyVisible = ref(false)
            const selectedPolicy = ref({})
            const authStore = useAuthStore()
            const { roles } = storeToRefs(authStore)
            const openEditModal = ref(false)

            const handleCloseModalDetailPolicy = () => {
                modalDetailPolicyVisible.value = false
            }
            const handleSelectPolicy = (policy) => {
                selectedPolicy.value = policy
                modalDetailPolicyVisible.value = true
            }
            const whitelistedConnectionIds = ref([])

            const handleSelectPurpose = (purpose) => {
                router.replace(`/governance/purposes/${purpose.id}`)
            }
            watch(isPersonaListReady, () => {
                if(personaList.value.length)
              {  const findedPurpose = personaList.value.find(
                    (el) => el.id === route.params.id
                )
                if (findedPurpose) {
                    selectedPersonaId.value = findedPurpose.id
                } else {
                    selectedPersonaId.value = personaList.value[0].id
                    router.replace(
                        `/governance/purposes/${personaList.value[0].id}`
                    )
                }}
            })
            onMounted(() => {
                if (isPersonaListReady.value) {
                    selectedPersonaId.value = personaList.value[0].id
                    router.replace(
                        `/governance/purposes/${personaList.value[0].id}`
                    )
                }
            })
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
                openEditModal,
                handleSelectPurpose,
            }
        },
    })
</script>
<style lang="less" scoped>
    .success {
        background: #00a680;
    }
</style>
