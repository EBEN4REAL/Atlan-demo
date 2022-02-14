<template>
    <ExplorerLayout
        title="Purpose"
        sub-title=""
        :sidebar-visibility="Boolean(selectedPurposeId)"
    >
        <template #sidebar>
            <div class="flex items-center px-4 mb-3">
                <SearchAndFilter
                    v-model:value="searchTerm"
                    :placeholder="`Search ${
                        filteredPurposes?.length ?? 0
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
                v-model:selected="selectedPurposeId"
                type="purposes"
                :disabled="isEditing"
                :list="filteredPurposes"
                data-key="id"
            >
                <template #default="{ item, isSelected }">
                    <div
                        class="flex items-center justify-between w-full"
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
                                style="max-width: 190px"
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
            v-model:persona="selectedPurpose"
            :persona-list="purposeList"
        />

        <a-spin v-if="isPurposeLoading" class="mx-auto my-auto" size="large" />
        <template v-else-if="selectedPurpose">
            <PurposeHeader
                v-model:openEditModal="openEditModal"
                :persona="selectedPurpose"
            />
            <PurposeBody
                v-model:persona="selectedPurpose"
                :whitelisted-connection-ids="whitelistedConnectionIds"
                @selectPolicy="handleSelectPolicy"
                @editDetails="openEditModal = true"
            />
        </template>
        <div
            v-else-if="
                filteredPurposes?.length == 0 && isPurposeError === undefined
            "
            class="flex flex-col items-center justify-center h-full"
        >
            <component :is="AddPersonaIllustration"></component>
            <div class="text-2xl font-bold">Start Creating Purposes</div>
            <span class="mx-auto text-base text-gray-500 sub-title-empty-state"
                >Purposes will control permissions based on which users and
                groups can view, edit or query assets tagged with that
                Classification.</span
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
                Get started
            </AtlanBtn>
            <div class="mt-6 cursor-pointer text-primary">
                Learn More <AtlanIcon icon="ArrowRight" />
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
        purposeList,
        filteredPurposes,
        searchTerm,
        selectedPurpose,
        selectedPurposeId,
        isPurposeListReady,
        isPurposeLoading,
        isPurposeError,
    } from './composables/usePurposeList'
    import { isEditing } from './composables/useEditPurpose'
    import AddPersonaIllustration from '~/assets/images/empty_state_policyV2.svg'
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
            watch(
                isPurposeListReady,
                () => {
                    if (purposeList?.value?.length) {
                        const findedPurpose = purposeList.value.find(
                            (el) => el.id === route.params.id
                        )
                        if (findedPurpose) {
                            selectedPurposeId.value = findedPurpose.id
                        } else {
                            selectedPurposeId.value = purposeList.value[0].id
                            router.replace(
                                `/governance/purposes/${purposeList.value[0].id}`
                            )
                        }
                    }
                },
                { immediate: true }
            )

            onMounted(() => {
                if (isPurposeListReady.value) {
                    selectedPurposeId.value = purposeList.value[0].id
                    router.replace(
                        `/governance/purposes/${purposeList.value[0].id}`
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
                handleSelectPurpose,
            }
        },
    })
</script>
<style lang="less" scoped>
    .success {
        background: #00a680;
    }
    .sub-title-empty-state {
        max-width: 550px;
        text-align: center;
        margin-top: 16px !important;
    }
</style>
