<template>
    <div v-if="true" class="flex flex-col px-6 py-7">
        <a-drawer
            :visible="drawerFilter"
            :mask="false"
            :placement="'left'"
            style="width: 17%"
            :closable="false"
            :class="'drawer-filter-request'"
        >
            <div
                class="relative h-full pb-10 overflow-scroll bg-gray-50"
                :class="$style['request-filter-wrapper']"
            >
                <div
                    v-if="drawerFilter"
                    class="close-btn-sidebar button-close-drawer-request"
                    @click="handleClickFilter"
                >
                    <AtlanIcon icon="Add" class="text-white" />
                </div>
                <div class="filter-container">
                    <AssetFilters
                        v-model="facets"
                        :filter-list="personaFilter"
                        :allow-custom-filters="false"
                        :no-filter-title="'No filters applied'"
                        :extra-count-filter="
                            connectorsData.attributeValue ? 1 : 0
                        "
                        class="bg-gray-100 drawer-request"
                        @change="handleFilterChange"
                        @reset="handleResetEvent"
                    >
                    </AssetFilters>
                </div>
            </div>
        </a-drawer>
        <a-modal
            :visible="personaViewModalVisible"
            :destroyOnClose="true"
            :closable="false"
            width="100%"
            wrapClassName="persona-modal"
            :centered="true"
            :maskClosable="true"
            @cancel="closePersonaViewModal"
        >
            <template #title>
                <PersonaHeader
                    v-model:openEditModal="openEditModal"
                    :persona="selectedPersona"
                    class=""
                />
            </template>
            <template #footer>
                <div style="display: none">
                    <div class="flex items-center justify-between pb-1">
                        <slot name="footerLeft"></slot>
                        <div
                            class="flex items-center justify-end w-full space-x-3"
                        >
                            <!-- Hi -->
                        </div>
                    </div>
                </div>
            </template>
            <div class="h-full bg-primary-light">
                <PersonaBody
                    v-model:persona="selectedPersona"
                    :whitelisted-connection-ids="whitelistedConnectionIds"
                    @selectPolicy="handleSelectPolicy"
                    @editDetails="openEditModal = true"
                />
            </div>
        </a-modal>
        <span class="text-xl">Personas</span>
        <!-- search & filter -->
        <div class="w-1/3 mt-4">
            <SearchAndFilter
                v-model:value="searchTerm"
                :placeholder="`Search ${
                    filteredPersonas?.length ?? 0
                } personas`"
                class="max-w-lg shadow-none filter-request"
                :autofocus="true"
                size="default"
            >
                <template #categoryFilter>
                    <div class="relative flex items-center">
                        <AtlanBtn
                            color="secondary"
                            class="px-2 border-r-0 rounded-tr-none rounded-br-none cursor-pointer filter-button"
                            :class="{
                                'text-primary border rounded py-1 border-primary':
                                    drawerFilter,
                            }"
                            @click="handleClickFilter"
                        >
                            <AtlanIcon icon="FilterFunnel" class="w-4 h-4" />
                        </AtlanBtn>
                        <div
                            class="absolute border-r divide-gray-800 divider-filter"
                            :class="{
                                'text-primary border-r rounded border-primary top-0':
                                    drawerFilter,
                            }"
                        />
                    </div>
                </template>
            </SearchAndFilter>
        </div>
        <!-- persona cards -->
        <div class="flex flex-wrap mt-7 gap-x-3 gap-y-6">
            <PersonaCard
                v-for="persona in filteredPersonas"
                :key="persona.id"
                :persona="persona"
                @select="selectPersona"
            ></PersonaCard>
        </div>
    </div>
    <ExplorerLayout
        v-else
        title="Persona"
        :sidebar-visibility="Boolean(selectedPersonaId)"
    >
        <template #action> </template>
        <template #sidebar>
            <div class="flex items-center px-4 mb-3">
                <SearchAndFilter
                    v-model:value="searchTerm"
                    :placeholder="`Search ${
                        filteredPersonas?.length ?? 0
                    } personas`"
                    class="mt-0 bg-white"
                    :autofocus="true"
                    size="minimal"
                >
                </SearchAndFilter>
                <a-tooltip>
                    <template #title>New Persona</template>
                    <AtlanBtn
                        :disabled="isEditing"
                        class="flex-none px-2 ml-4"
                        size="sm"
                        color="secondary"
                        padding="compact"
                        data-test-id="add-persona"
                        @click="() => (modalVisible = true)"
                    >
                        <AtlanIcon icon="Add" /> </AtlanBtn
                ></a-tooltip>
            </div>

            <ExplorerList
                v-model:selected="selectedPersonaId"
                type="personas"
                :disabled="isEditing"
                :list="filteredPersonas"
                data-key="id"
            >
                <template #default="{ item, isSelected }">
                    <div class="flex items-center justify-between w-full">
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
                                style="max-width: 190px"
                            >
                                {{ item.displayName }}
                            </span>
                            <div class="flex gap-x-1">
                                <span
                                    v-if="item.users?.length > 0"
                                    class="text-sm text-gray-500"
                                >
                                    {{ item.users.length }} users
                                </span>
                                <span
                                    v-if="item.groups?.length > 0"
                                    class="text-sm text-gray-500"
                                >
                                    {{ item.groups.length }} groups
                                </span>
                                <span
                                    v-if="
                                        item.metadataPolicies?.length > 0 ||
                                        item.dataPolicies?.length > 0
                                    "
                                    class="text-sm text-gray-500"
                                >
                                    {{
                                        item.metadataPolicies?.length +
                                        item.dataPolicies?.length
                                    }}
                                    policies</span
                                >
                            </div>

                            <!-- <div class="w-1.5 h-1.5 rounded-full" :class="item.isActive ? 'active' : 'inActive'"/> -->
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

        <AddPersona v-model:visible="modalVisible" />
        <a-spin v-if="isPersonaLoading" class="mx-auto my-auto" size="large" />
        <template v-else-if="selectedPersona">
            <div class="bg-white">
                <PersonaHeader
                    v-model:openEditModal="openEditModal"
                    :persona="selectedPersona"
                />
            </div>
            <PersonaBody
                v-model:persona="selectedPersona"
                :whitelisted-connection-ids="whitelistedConnectionIds"
                @selectPolicy="handleSelectPolicy"
                @editDetails="openEditModal = true"
            />
        </template>
        <div
            v-else-if="
                (filteredPersonas === null || filteredPersonas?.length == 0) &&
                isPersonaError === undefined
            "
            class="flex flex-col items-center h-full"
        >
            <component :is="AddPersonaIllustration" class="mt-7"></component>
            <div class="mt-6 text-2xl font-bold text-gray-700">
                Start Creating Personas
            </div>
            <span class="mx-auto text-base text-gray-500 sub-title-empty-state"
                >Persona management keeps your data assets safe by ensuring that
                the right people have access to the right data.</span
            >
            <AtlanBtn
                class="flex-none mx-auto mt-8"
                color="primary"
                data-test-id="add-new-persona"
                padding="compact"
                size="sm"
                @click.prevent="() => (modalVisible = true)"
            >
                <template #prefix>
                    <AtlanIcon icon="Add" />
                </template>
                Get started
            </AtlanBtn>
            <div class="mt-5 cursor-pointer text-primary">
                <a
                    href="https://ask.atlan.com/hc/en-us/articles/4413870860049-What-are-personas-"
                    target="_blank"
                >
                    Learn More <AtlanIcon icon="ArrowRight" />
                </a>
            </div>
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
    import { defineComponent, ref, watch, onMounted, computed } from 'vue'
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
    import AddPersonaIllustration from '~/assets/images/empty_state_personaV2.svg'
    import DetailPolicy from './overview/detailPolicy.vue'
    import usePermissions from '~/composables/auth/usePermissions'
    import { useAuthStore } from '~/store/auth'
    import PersonaCard from '@/governance/personas/discovery/personaCard.vue'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import { personaFilter } from '~/constant/filters/logsFilter'

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
            PersonaCard,
            AssetFilters,
        },
        setup() {
            const router = useRouter()
            const route = useRoute()
            const modalVisible = ref(false)
            const modalDetailPolicyVisible = ref(false)
            const selectedPolicy = ref({})
            usePermissions() // refresh the list of connection user can access
            const authStore = useAuthStore()
            const { decentralizedRoles } = storeToRefs(authStore)
            const openEditModal = ref(false)
            const drawerFilter = ref(false)
            const facets = ref({
                statusRequest: [],
            })
            const connectorsData = ref({
                attributeName: undefined,
                attributeValue: undefined,
            })
            const handleCloseModalDetailPolicy = () => {
                modalDetailPolicyVisible.value = false
            }
            const handleSelectPolicy = (policy) => {
                selectedPolicy.value = policy
                modalDetailPolicyVisible.value = true
            }
            const whitelistedConnectionIds = ref([])

            const selectPersona = (persona) => {
                console.log('selectPersona', persona)
                selectedPersonaId.value = persona.id
            }

            const closePersonaViewModal = () => {
                selectedPersonaId.value = ''
            }

            // eslint-disable-next-line arrow-body-style
            const personaViewModalVisible = computed(() => {
                return !!selectedPersona.value
            })
            const handleClickFilter = () => {
                drawerFilter.value = !drawerFilter.value
            }

            const handleFilterChange = () => {
                console.log('facets.value', facets.value)
            }
            const handleResetEvent = () => {
                // filters.value = {
                //     status: 'active' as RequestStatus,
                //     request_type: [],
                // }
                // connectorsData.value = {
                //     attributeName: undefined,
                //     attributeValue: undefined,
                // }
            }

            // onMounted(() => {
            //     console.log('rohan', filteredPersonas?.value?.length)
            //     if (!route.params.id && filteredPersonas?.value?.length) {
            //         const id = filteredPersonas.value[0].id!
            //         selectedPersonaId.value = id
            //         router.replace(`/governance/personas/${id}`)
            //     }
            // })

            // watch(
            //     isPersonaListReady,
            //     () => {
            //         if (personaList?.value?.length) {
            //             if (route.params.id) {
            //                 const find = personaList.value.find(
            //                     (el) => el.id === route.params.id
            //                 )
            //                 if (find) {
            //                     selectedPersonaId.value = route.params.id
            //                 } else {
            //                     if (filteredPersonas?.value?.length) {
            //                         selectedPersonaId.value =
            //                             filteredPersonas.value[0].id!
            //                     }
            //                 }
            //             } else {
            //                 if (filteredPersonas?.value?.length) {
            //                     selectedPersonaId.value =
            //                         filteredPersonas.value[0].id!
            //                 }
            //             }
            //         }
            //     },
            //     { immediate: true }
            // )

            watch(selectedPersonaId, () => {
                router.replace(
                    `/governance/personas/${selectedPersonaId.value}`
                )
            })
            watch(
                decentralizedRoles,
                () => {
                    const filteredRoles = (
                        decentralizedRoles.value || []
                    ).filter(
                        (role) =>
                            role.level === 'connection' &&
                            role.privelage === 'admin'
                    )
                    whitelistedConnectionIds.value = filteredRoles.map(
                        (role) => {
                            if (role && role.roleId) return role.roleId
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
                openEditModal,
                selectPersona,
                closePersonaViewModal,
                personaViewModalVisible,
                handleClickFilter,
                drawerFilter,
                personaFilter,
                facets,
                connectorsData,
                handleFilterChange,
                handleResetEvent,
            }
        },
    })
</script>
<style lang="less">
    .persona-modal {
        .ant-modal {
            height: calc(100% - 100px);
        }
        .ant-modal-body {
            height: calc(100% - 100px);
            overflow-y: auto;
        }
        .ant-modal-content {
            height: calc(100%);
        }
        .ant-modal-header {
            padding-bottom: 0px;
            padding-left: 0px;
            padding-right: 0px;
        }
        .ant-modal-footer {
            padding: 0px !important;
        }
    }
</style>
<style lang="less" scoped>
    .button-close-drawer-request {
        left: 18% !important;
        top: 5px;
    }
    .filter-request {
        height: 32px !important;
    }
    .active {
        background: #00a680;
    }
    .inActive {
        background: #cf592e;
    }
    .sub-title-empty-state {
        max-width: 540px;
        text-align: center;
        margin-top: 16px !important;
    }
</style>
<style lang="less" module>
    .request-filter-wrapper {
        :global(.filter-head) {
            background: inherit !important;
            height: 52px;
            @apply pt-4 !important;
        }
    }
</style>
