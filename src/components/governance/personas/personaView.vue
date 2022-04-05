<template>
    <div class="flex flex-col h-full px-6 py-7">
        <a-drawer
            :visible="drawerFilter"
            :mask="false"
            :placement="'left'"
            :closable="false"
            :width="250"
        >
            <div
                class="relative h-full pb-10 overflow-scroll bg-gray-50"
                :class="$style['request-filter-wrapper']"
            >
                <div
                    v-if="drawerFilter"
                    class="close-btn-sidebar button-close-drawer-persona"
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
        <AddPersona v-model:visible="modalVisible" />
        <a-modal
            v-model:visible="personaViewModalVisible"
            :destroy-on-close="true"
            :closable="false"
            width="80%"
            wrap-class-name="persona-modal"
            :centered="true"
            :mask-closable="true"
            :footer="null"
            @cancel="closePersonaViewModal"
        >
            <template #title>
                <PersonaHeader
                    v-model:openEditModal="openEditModal"
                    :persona="selectedPersona"
                    @updateStatus="handleEnableDisablePersona"
                />
            </template>
            <!-- <template #footer>
                <div style="display: none">
                    <div class="flex items-center justify-between pb-1">
                        <slot name="footerLeft"></slot>
                        <div
                            class="flex items-center justify-end w-full space-x-3"
                        >
                        </div>
                    </div>
                </div>
            </template> -->
            <div class="h-full bg-primary-light">
                <PersonaBody
                    v-model:persona="selectedPersona"
                    :whitelisted-connection-ids="whitelistedConnectionIds"
                    @selectPolicy="handleSelectPolicy"
                    @editDetails="openEditModal = true"
                />
            </div>
        </a-modal>

        <a-spin v-if="isPersonaLoading" class="mx-auto my-auto" size="large" />
        <div v-else-if="personaList && personaList.length" class="h-full">
            <span class="text-xl">Personas</span>
            <!-- search & filter -->
            <div class="flex justify-between">
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
                        <template #categoryFilterRight>
                            <div class="relative flex items-center">
                                <AtlanBtn
                                    color="secondary"
                                    class="px-2 border-l rounded-tl-none rounded-bl-none cursor-pointer filter-button"
                                    :class="{
                                        'text-primary border rounded py-1 border-primary':
                                            drawerFilter,
                                    }"
                                    @click="handleClickFilter"
                                >
                                    <AtlanIcon
                                        icon="FilterFunnel"
                                        class="w-4 h-4"
                                    />
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
                <a-button
                    padding="compact"
                    size="sm"
                    type="primary"
                    :disabled="isEditing"
                    data-test-id="add-persona"
                    @click="() => (modalVisible = true)"
                >
                    <AtlanIcon icon="Add" class="mr-1" />New Persona
                </a-button>
            </div>
            <!-- persona cards -->
            <div
                v-if="filteredPersonas && filteredPersonas.length"
                class="grid grid-cols-4 gap-4 gap-y-6 mt-7 pb-7"
            >
                <PersonaCard
                    v-for="persona in filteredPersonas"
                    :key="persona.id"
                    :persona="persona"
                    @select="selectPersona"
                ></PersonaCard>
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center h-full"
            >
                <component :is="NewPolicyIllustration"></component>
                <span class="mt-3 text-lg">No personas found</span>
                <!-- <a-button type="primary" class="mt-2" @click="handleResetEvent"
                    >Clear filters</a-button
                > -->
            </div>
        </div>

        <div
            v-else-if="
                (personaList === null || personaList?.length == 0) &&
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
            <a-button
                class="flex-none mx-auto mt-8"
                type="primary"
                data-test-id="add-new-persona"
                @click.prevent="() => (modalVisible = true)"
            >
                <template #prefix>
                    <AtlanIcon icon="Add" />
                </template>
                Get started
            </a-button>
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, onMounted, h } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
    import { message, Modal } from 'ant-design-vue'
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
        facets,
    } from './composables/usePersonaList'
    import { isEditing, enablePersona } from './composables/useEditPersona'
    import AddPersonaIllustration from '~/assets/images/empty_state_personaV2.svg'
    import DetailPolicy from './overview/detailPolicy.vue'
    import usePermissions from '~/composables/auth/usePermissions'
    import { useAuthStore } from '~/store/auth'
    import PersonaCard from '@/governance/personas/discovery/personaCard.vue'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import { personaFilter } from '~/constant/filters/logsFilter'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'PersonaView',
        components: {
            // AtlanBtn,
            ErrorView,
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
                selectedPersonaId.value = persona.id
            }

            const closePersonaViewModal = () => {
                selectedPersonaId.value = ''
            }

            // eslint-disable-next-line arrow-body-style
            const personaViewModalVisible = ref(false)
            const handleClickFilter = () => {
                drawerFilter.value = !drawerFilter.value
            }

            const handleFilterChange = () => {
                console.log('facets.value', facets.value)
            }
            const handleResetEvent = () => {
                facets.value = {}
                searchTerm.value = ''
            }

            onMounted(() => {
                if (personaList?.value?.length) {
                    if (route.params.id) {
                        const find = personaList.value.find(
                            (el) => el.id === route.params.id
                        )
                        if (find) {
                            selectedPersonaId.value = route.params.id
                        }
                    }
                }
            })

            watch(
                isPersonaListReady,
                () => {
                    if (personaList?.value?.length) {
                        if (route.params.id) {
                            const find = personaList.value.find(
                                (el) => el.id === route.params.id
                            )
                            if (find) {
                                selectedPersonaId.value = route.params.id
                            }
                        }
                    }
                },
                { immediate: false }
            )

            watch(selectedPersonaId, () => {
                router.replace(
                    `/governance/personas/${selectedPersonaId.value}`
                )
                if (selectedPersonaId.value) {
                    personaViewModalVisible.value = true
                } else {
                    personaViewModalVisible.value = false
                }
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
            const enableDisablePersona = async (val) => {
                const messageKey = Date.now()
                // enableDisableLoading.value = true
                message.loading({
                    content: `${val ? 'Enabling' : 'Disabling'} persona ${
                        selectedPersona.value.displayName
                    }`,
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await enablePersona(selectedPersona.value.id, val)
                    selectedPersona.value.enabled = val
                    message.success({
                        content: `Persona ${
                            selectedPersona.value.displayName
                        } ${val ? 'Enabled' : 'Disabled'} `,
                        duration: 1.5,
                        key: messageKey,
                    })
                    const keyObj = val ? 'persona_enable' : 'persona_disable'
                    useAddEvent('governance', 'persona', keyObj)
                    // enableDisableLoading.value = false
                } catch (e) {
                    message.error({
                        content: `Failed to ${
                            val ? 'enable' : 'disable'
                        } persona ${selectedPersona.value.displayName}`,
                        duration: 1.5,
                        key: messageKey,
                    })
                    // enableDisableLoading.value = false
                }
            }
            const handleEnableDisablePersona = (val) => {
                selectedPersona.value.enabled = !val
                if (!selectedPersona.value.enabled) enableDisablePersona(val)
                else
                    Modal.confirm({
                        title: 'Disable persona',
                        class: 'disable-persona-modal',
                        content: () =>
                            h('div', [
                                'Are you sure you want to disable persona',
                                h('span', [' ']),
                                h(
                                    'span',
                                    {
                                        class: ['font-bold'],
                                    },
                                    [`${selectedPersona.value.displayName}`]
                                ),
                                h('span', '?'),
                            ]),
                        okType: 'danger',
                        autoFocusButton: null,
                        okButtonProps: {
                            type: 'primary',
                        },
                        okText: 'Disable',
                        cancelText: 'Cancel',
                        async onOk() {
                            enableDisablePersona(val)
                        },
                    })
            }
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
                NewPolicyIllustration,
                personaList,
                handleEnableDisablePersona,
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
            height: calc(100% - 66px);
            overflow-y: hidden;
            border-radius: 4px;
        }
        .ant-modal-content {
            height: calc(100%);
            @apply bg-primary-light;
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
    .button-close-drawer-persona {
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
