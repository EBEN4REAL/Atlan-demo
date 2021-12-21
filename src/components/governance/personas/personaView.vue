<template>
    <ExplorerLayout
        title="Persona"
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
                />
            </div>

            <ExplorerList
                v-model:selected="selectedPersonaId"
                type="personas"
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
                        <!-- <div class="w-1.5 h-1.5 rounded-full" :class="item.isActive ? 'active' : 'inActive'"/> -->
                    </div>
                </template>
            </ExplorerList>
        </template>

        <AddPersona v-model:visible="modalVisible" />
        <a-spin v-if="isPersonaLoading" class="mx-auto my-auto" size="large" />
        <template v-else-if="selectedPersona">
            <div class="bg-white">
                <PersonaHeader :persona="selectedPersona" class="h-24" />
            </div>
            <PersonaBody
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
        <a-drawer
            placement="right"
            :closable="false"
            :visible="modalDetailPolicyVisible"
            :width="450"
            @close="handleCloseModalDetailPolicy"
        >
            <DetailPolicy :selected-policy="selectedPolicy" />
        </a-drawer>
    </ExplorerLayout>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
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
        isPersonaListReady,
        personaList,
    } from './composables/usePersonaList'
    import { isEditing } from './composables/useEditPersona'
    import AddPersonaIllustration from '~/assets/images/illustrations/add_user.svg'
    import DetailPolicy from './overview/detailPolicy.vue'
    import { useAuthStore } from '~/store/auth'

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
            DetailPolicy,
        },
        setup() {
            const router = useRouter()
            const route = useRoute()
            const modalVisible = ref(false)
            const modalDetailPolicyVisible = ref(false)
            const selectedPolicy = ref({})
            const authStore = useAuthStore()
            const { roles } = storeToRefs(authStore)

            const handleCloseModalDetailPolicy = () => {
                modalDetailPolicyVisible.value = false
            }
            const handleSelectPolicy = (policy) => {
                selectedPolicy.value = policy
                modalDetailPolicyVisible.value = true
            }
            const whitelistedConnectionIds = ref([])
            watch(isPersonaListReady, () => {
                if (personaList.value?.length) {
                    if (route.params.id) {
                        const find = personaList.value.find(
                            (el) => el.id === route.params.id
                        )
                        if (find) {
                            selectedPersonaId.value = route.params.id
                        } else {
                            selectedPersonaId.value =
                                filteredPersonas.value[0].id!
                        }
                    } else {
                        selectedPersonaId.value = filteredPersonas.value[0].id!
                    }
                }
            })
            watch(selectedPersonaId, () => {
                router.replace(
                    `/governance/personas/${selectedPersonaId.value}`
                )
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
                modalDetailPolicyVisible,
                handleCloseModalDetailPolicy,
                handleSelectPolicy,
                selectedPolicy,
                whitelistedConnectionIds,
                roles,
            }
        },
    })
</script>
<style lang="less" scoped>
    .active {
        background: #00a680;
    }
    .inActive {
        background: #cf592e;
    }
</style>
