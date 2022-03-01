<template>
    <div v-if="true" class="flex flex-col h-full px-6 py-7">
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
                        :filter-list="purposeFilter"
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
        <AddPurpose
            v-model:visible="modalVisible"
            v-model:persona="selectedPurpose"
            :persona-list="purposeList"
        />
        <a-modal
            v-model:visible="purposeViewModalVisible"
            :destroyOnClose="true"
            :closable="false"
            width="80%"
            wrapClassName="persona-modal"
            :centered="true"
            :maskClosable="true"
            @cancel="closePurposeViewModal"
        >
            <template #title>
                <PurposeHeader
                    v-model:openEditModal="openEditModal"
                    :persona="selectedPurpose"
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
                <PurposeBody
                    v-model:persona="selectedPurpose"
                    :whitelisted-connection-ids="whitelistedConnectionIds"
                    @selectPolicy="handleSelectPolicy"
                    @editDetails="openEditModal = true"
                />
            </div>
        </a-modal>
        <a-spin v-if="isPurposeLoading" class="mx-auto my-auto" size="large" />
        <div v-else-if="purposeList && purposeList.length" class="h-full">
            <span class="text-xl">Purposes</span>

            <!-- search & filter -->
            <div class="flex justify-between">
                <div class="w-1/3 mt-4">
                    <SearchAndFilter
                        v-model:value="searchTerm"
                        :placeholder="`Search ${
                            filteredPurposes?.length ?? 0
                        } purposes`"
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
                    <AtlanIcon icon="Add" class="mr-1" />New Purpose
                </a-button>
            </div>
            <!-- persona cards -->
            <div
                v-if="filteredPurposes && filteredPurposes.length"
                class="grid grid-cols-4 gap-4 gap-y-6 mt-7"
            >
                <PurposeCard
                    v-for="persona in filteredPurposes"
                    :key="persona.id"
                    :purpose="persona"
                    @select="selectPurpose"
                ></PurposeCard>
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center h-full"
            >
                <component :is="NewPolicyIllustration"></component>
                <span class="mt-3 text-lg">No purposes found</span>
                <!-- <a-button type="primary">Clear filters</a-button> -->
            </div>
        </div>

        <div
            v-else-if="
                (purposeList === null || purposeList?.length == 0) &&
                isPurposeError === undefined
            "
            class="flex flex-col items-center h-full"
        >
            <component :is="AddPersonaIllustration" class="mt-7"></component>
            <div class="mt-6 text-2xl font-bold text-gray-700">
                Start Creating Purposes
            </div>
            <span class="mx-auto text-base text-gray-500 sub-title-empty-state"
                >Purposes will control permissions based on which users and
                groups can view, edit or query assets tagged with that
                Classification.</span
            >
            <a-button
                class="flex-none mx-auto mt-8"
                type="primary"
                data-test-id="add-new-purpose"
                size="sm"
                @click.prevent="() => (modalVisible = true)"
            >
                <template #prefix>
                    <AtlanIcon icon="Add" />
                </template>
                Get started
            </a-button>
            <div class="mt-5 cursor-pointer text-primary">
                <a
                    href="https://ask.atlan.com/hc/en-us/articles/4418690792849-What-are-Purposes-in-Atlan-"
                    target="_blank"
                >
                    Learn More <AtlanIcon icon="ArrowRight" />
                </a>
            </div>
        </div>
        <ErrorView v-else :error="isPurposeError">
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
        purposeList,
        filteredPurposes,
        searchTerm,
        selectedPurpose,
        selectedPurposeId,
        isPurposeListReady,
        isPurposeLoading,
        isPurposeError,
        facets,
    } from './composables/usePurposeList'
    import { isEditing } from './composables/useEditPurpose'
    import AddPersonaIllustration from '~/assets/images/empty_state_policyV2.svg'
    import ErrorIllustration from '~/assets/images/error.svg'
    import { useAuthStore } from '~/store/auth'
    import { purposeFilter } from '~/constant/filters/logsFilter'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import PurposeCard from '@/governance/purposes/discovery/purposeCard.vue'
    import AssetFilters from '@/common/assets/filters/index.vue'

    export default defineComponent({
        name: 'PurposeView',
        components: {
            ErrorView,
            // AtlanBtn,
            SearchAndFilter,
            PurposeBody,
            PurposeHeader,
            ExplorerLayout,
            ExplorerList,
            AddPurpose,
            PurposeCard,
            AssetFilters,
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

            const selectPurpose = (purpose) => {
                selectedPurposeId.value = purpose.id
            }

            const closePurposeViewModal = () => {
                selectedPurposeId.value = ''
            }

            // eslint-disable-next-line arrow-body-style
            const purposeViewModalVisible = ref(false)
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

            watch(
                isPurposeListReady,
                () => {
                    if (purposeList?.value?.length) {
                        const findedPurpose = purposeList.value.find(
                            (el) => el.id === route.params.id
                        )
                        if (findedPurpose) {
                            selectedPurposeId.value = findedPurpose.id
                        }
                    }
                },
                { immediate: false }
            )

            onMounted(() => {
                if (purposeList?.value?.length) {
                    const findedPurpose = purposeList.value.find(
                        (el) => el.id === route.params.id
                    )
                    if (findedPurpose) {
                        selectedPurposeId.value = findedPurpose.id
                    }
                }
            })
            watch(selectedPurposeId, () => {
                router.replace(
                    `/governance/purposes/${selectedPurposeId.value}`
                )
                if (selectedPurposeId.value) {
                    purposeViewModalVisible.value = true
                } else {
                    purposeViewModalVisible.value = false
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
                purposeList,
                filteredPurposes,
                selectedPurpose,
                selectedPurposeId,
                searchTerm,
                modalVisible,
                isPurposeLoading,
                isPurposeError,
                // createNewPersona,
                isEditing,
                AddPersonaIllustration,
                isPurposeListReady,
                ErrorIllustration,
                handleCloseModalDetailPolicy,
                handleSelectPolicy,
                selectedPolicy,
                whitelistedConnectionIds,
                openEditModal,
                closePurposeViewModal,
                purposeViewModalVisible,
                handleClickFilter,
                drawerFilter,
                purposeFilter,
                facets,
                connectorsData,
                handleFilterChange,
                handleResetEvent,
                NewPolicyIllustration,
                selectPurpose,
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
            // height: calc(100% - 66px);
            height: calc(100% - 50px);
            overflow-y: hidden;
            border-radius: 4px;
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
    .success {
        background: #00a680;
    }
    .sub-title-empty-state {
        max-width: 550px;
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
