<template>
    <template v-if="selectedPersonaDirty">
        <div class="px-3 bg-white">
            <MinimalTab v-model:active="activeTabKey" :data="tabConfig">
                <template #label="t">
                    <div class="flex items-center">
                        <div
                            class="relative text-sm"
                            :class="
                                activeTabKey === t?.data?.key
                                    ? 'text-primary fake-bold'
                                    : 'text-gray-500'
                            "
                        >
                            {{ t?.data?.label }}
                        </div>
                        <div
                            v-if="t?.data?.key === 'policies'"
                            class="px-1 py-0.5 ml-2 text-xs font-bold rounded flex items-center"
                            :class="
                                activeTabKey === t?.data?.key
                                    ? 'text-primary bg-primary-light'
                                    : 'text-gray-500 bg-gray-100'
                            "
                        >
                            <div class="mt-0.5">
                                {{
                                    selectedPersonaDirty?.metadataPolicies
                                        ?.length +
                                    selectedPersonaDirty?.dataPolicies?.length
                                }}
                            </div>
                        </div>
                    </div>
                </template>
            </MinimalTab>
        </div>

        <div
            v-if="activeTabKey === 'details'"
            class="p-6 overflow-y-auto"
            style="max-height: 91%"
        >
            <PurposeMeta
                class="flex flex-col"
                :persona="persona"
                @editDetails="$emit('editDetails')"
            />
            <PurposeReadme :purpose="selectedPersonaDirty" />
            <div class="pb-3 mt-3 bg-white border border-gray-200 rounded">
                <ResourcesWidget
                    placeholder="Resources is the place to document all knowledge around the purpose"
                    :entity-name="persona.name"
                    :read-only="false"
                    :resources="persona?.resources?.links ?? []"
                    :add-status="addStatus"
                    :update-status="updateStatus"
                    :remove-status="removeStatus"
                    @add="handleAddResource"
                    @update="handleUpdateResource"
                    @remove="handleRemoveResource"
                />
            </div>
        </div>
        <div
            v-else-if="activeTabKey === 'policies'"
            class="flex flex-col px-6 pt-6"
            style="height: calc(100% - 155px)"
        >
            <div
                class="bg-white rounded-lg"
                :class="
                    (activeTabFilter === 'metaData' &&
                        metaDataComputed.length === 0) ||
                    (activeTabFilter === 'data' &&
                        dataPolicyComputed.length === 0)
                        ? 'pb-14'
                        : ''
                "
            >
                <div
                    v-if="!isEmpty"
                    class="flex items-center justify-between p-4 border-b"
                >
                    <div class="w-1/2">
                        <div v-if="totalPolicy !== 0" class="container-tabs">
                            <RaisedTab
                                v-model:active="activeTabFilter"
                                :data="streams"
                            />
                            <!-- <a-radio-group
                                v-model:value="activeTabFilter"
                                class="flex flex-grow"
                            >
                                <a-radio-button value="all Persona"
                                    >All</a-radio-button
                                >
                                <a-radio-button value="metaData"
                                    >Metadata</a-radio-button
                                >
                                <a-radio-button value="data"
                                    >Data</a-radio-button
                                >
                            </a-radio-group> -->
                        </div>
                    </div>
                    <a-dropdown trigger="click">
                        <a-button type="primary">
                            <div class="flex items-center gap-x-1">
                                New Policy

                                <AtlanIcon
                                    icon="ChevronDown"
                                    class="text-white"
                                />
                            </div>
                        </a-button>

                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    v-for="(
                                        option, index
                                    ) in addPolicyDropdownConfig"
                                    :key="index"
                                    @click="option.handleClick()"
                                >
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            v-if="option.icon"
                                            class="w-4 h-4 text-gray-600"
                                            :icon="option.icon"
                                        />
                                        <span class="pl-2 text-sm">{{
                                            option.title
                                        }}</span>
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
                <div
                    v-if="
                        metaDataComputed.length > 0 ||
                        dataPolicyComputed.length > 0
                    "
                    class="flex flex-col flex-grow overflow-y-auto rounded-md container-card-policy"
                >
                    <template
                        v-for="(policy, idx) in metaDataComputed"
                        :key="idx"
                    >
                        <!-- Render it if the policy is being edited -->
                        <!-- <MetadataPolicy
                        v-if="policyEditMap.metadataPolicies[policy.id!] && !policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @save="savePolicyUI('meta', policy.id!)"
                        @delete="deletePolicyUI('meta', policy.id!)"
                        @cancel="discardPolicy('meta', policy.id!)"
                    /> -->

                        <PolicyCard
                            :policy="policy"
                            type="meta"
                            :selected-policy="selectedPolicy"
                            @edit="setEditFlag('meta', policy.id!)"
                            @delete="deletePolicyUI('meta', policy.id!)"
                            @cancel="discardPolicy('meta', policy.id!)"
                            @clickCard="handleSelectPolicy"
                        />
                    </template>
                    <template
                        v-for="(policy, idx) in dataPolicyComputed"
                        :key="idx"
                    >
                        <!-- Render it if the policy is being edited -->
                        <!-- <DataPolicy
                        v-if="policyEditMap.dataPolicies[policy.id!] &&  !policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @save="savePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                    /> -->
                        <!-- ^^^ FIXME: Add implemmentation for @save and @cancel ^^^-->
                        <PolicyCard
                            :policy="policy"
                            type="data"
                            :selected-policy="selectedPolicy"
                            @edit="setEditFlag('data', policy.id!)"
                            @delete="deletePolicyUI('data', policy.id!)"
                            @cancel="discardPolicy('data', policy.id!)"
                            @clickCard="handleSelectPolicy"
                        />
                    </template>
                </div>
                <div
                    v-if="
                        (activeTabFilter === 'metaData' &&
                            metaDataComputed.length === 0) ||
                        (activeTabFilter === 'data' &&
                            dataPolicyComputed.length === 0)
                    "
                    class="flex flex-col items-center justify-center h-full"
                >
                    <component :is="NewPolicyIllustration"></component>
                    <span class="mt-5 text-xl font-bold text-gray">
                        {{
                            `No ${
                                activeTabFilter === 'data' ? 'data' : 'metadata'
                            } policies added`
                        }}
                    </span>
                    <!-- <div
                        class="mt-1 text-base text-center text-gray-500 sub-title-empty"
                    >
                        Create policies to manage access
                    </div> -->
                </div>
            </div>
            <div v-if="isEmpty" class="flex flex-col items-center h-full pt-7">
                <component :is="EmptyPolicyIllustration"></component>
                <span class="mt-10 text-xl font-bold text-gray">
                    Create Policies
                </span>
                <div class="mt-2 text-base text-center text-gray-500 w-60">
                    Create policies to manage metadata and data access
                </div>
                <a-dropdown trigger="click">
                    <a-button type="primary" class="mt-7">
                        <div class="flex items-center gap-x-1">
                            New Policy

                            <AtlanIcon icon="ChevronDown" class="text-white" />
                        </div>
                    </a-button>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                v-for="(
                                    option, index
                                ) in addPolicyDropdownConfig"
                                :key="index"
                                @click="option.handleClick()"
                            >
                                <div class="flex items-center">
                                    <AtlanIcon
                                        v-if="option.icon"
                                        class="w-4 h-4 text-gray-600"
                                        :icon="option.icon"
                                    />
                                    <span class="pl-2 text-sm">{{
                                        option.title
                                    }}</span>
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <div class="mt-6 cursor-pointer text-primary">
                    <a
                        href="https://ask.atlan.com/hc/en-us/articles/4413877880209-How-to-build-access-policies"
                        target="_blank"
                    >
                        Learn More <AtlanIcon icon="ArrowRight" />
                    </a>
                </div>
            </div>
        </div>

        <div
            v-else-if="activeTabKey === 'linked_assets'"
            class="h-full bg-white"
        >
            <div class="wrapper-height">
                <AssetList
                    :filters="filterConfig"
                    :enable-sidebar-drawer="true"
                    :asset-list-style-obj="{ height: 'calc(100% - 9rem)' }"
                    aggregation-tab-class="px-5 my-1"
                    search-bar-class="px-5 my-1"
                    asset-item-class="px-2"
                />
                <!-- <LinkedTerms
                v-else-if="activeTabKey === '2'"
                :selected-classification="selectedClassification?.name"
            /> -->
            </div>
        </div>
    </template>
    <a-drawer
        placement="right"
        :closable="false"
        class="drawer-add-purpose"
        :visible="addpolicyVisible"
        :width="450"
        :destroy-on-close="true"
        @close="handleCloseAddPolicy"
    >
        <Addpolicy
            :type="typeAddPolicy"
            :show-drawer="addpolicyVisible"
            :selected-policy="selectedPolicy"
            :is-edit="isEdit"
            :is-loading="loadingPolicy"
            :persona="persona"
            :whitelisted-connection-ids="whitelistedConnectionIds"
            @save="savePolicyUI"
            @close="handleCloseAddPolicy"
        />
    </a-drawer>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        computed,
        toRefs,
        watch,
        onMounted,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import ResourcesWidget from '@common/widgets/resources/resourcesWidget.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import EmptyPolicyIllustration from '~/assets/images/empty_policy.svg'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'
    import Addpolicy from './addpolicy.vue'
    import PolicyCard from './policies/collapsedPolicyCard.vue'
    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PurposeMeta from './overview/purposeMeta.vue'
    import PurposeReadme from './overview/PurposeReadme.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { filterMethod } from '~/utils/helper/search'
    import {
        newIdTag,
        selectedPersonaDirty,
        updateSelectedPersona,
        deletePolicy,
        policyEditMap,
        setEditFlag,
        removeEditFlag,
        savePolicy,
        discardPolicy,
        PolicyType,
    } from './composables/useEditPurpose'
    import { activeTabKey, tabConfig } from './composables/usePurposeTabs'
    import {
        selectedPurpose,
        refetchPurpose,
    } from './composables/usePurposeList'
    import AssetList from '@/common/assetList/assetList.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import usePurposeResources from '@/governance/purposes/composables/usePurposeResources'
    import RaisedTab from '@/UI/raisedTab.vue'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'

    export default defineComponent({
        name: 'PurposeBody',
        components: {
            ResourcesWidget,
            MinimalTab,
            PolicyCard,
            MetadataPolicy,
            DataPolicy,
            AtlanBtn,
            PurposeMeta,
            SearchAndFilter,
            AggregationTabs,
            Addpolicy,
            AssetList,
            PurposeReadme,
            RaisedTab,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
            whitelistedConnectionIds: {
                type: Array,
                default: () => [],
            },
        },
        setup(props) {
            const { persona } = toRefs(props)
            const userId = computed(() => persona.value.createdBy)
            const searchPersona = ref('')
            const activeTabFilter = ref('all Persona')
            const selectedPolicy = ref({})
            const addpolicyVisible = ref(false)
            const isEdit = ref(false)
            const loadingPolicy = ref(false)
            const typeAddPolicy = ref('')
            const handleAddPolicy = (type) => {
                typeAddPolicy.value = type
                isEdit.value = false
                addpolicyVisible.value = true
            }
            const addPolicyDropdownConfig = [
                {
                    title: 'Metadata Policy',
                    icon: 'Policies',
                    handleClick: () => handleAddPolicy('meta'),
                },
                {
                    title: 'Data Policy',
                    icon: 'QueryGrey',
                    handleClick: () => handleAddPolicy('data'),
                },
            ]

            async function savePolicyUI(
                type: PolicyType,
                id: string,
                isEditMode: boolean
            ) {
                const messageKey = Date.now()
                message.loading({
                    content: 'Saving policy',
                    duration: 0,
                    key: messageKey,
                })
                loadingPolicy.value = true
                try {
                    await savePolicy(type, id)
                    if (type === 'meta')
                        policyEditMap.value.metadataPolicies[id] = false
                    else if (type === 'data')
                        policyEditMap.value.dataPolicies[id] = false
                    updateSelectedPersona()
                    refetchPurpose(persona.value.id)
                    addpolicyVisible.value = false
                    message.success({
                        content: 'Policy saved',
                        duration: 1.5,
                        key: messageKey,
                    })
                    loadingPolicy.value = false
                    const eventName = isEditMode
                        ? 'policy_updated'
                        : 'policy_added'
                    const eventProperties = {
                        type,
                        masking: id.mask ? id.mask : '',
                        denied: !id.allow,
                        user_count: id.users.length,
                        group_count: id.groups.length,
                    }
                    useAddEvent(
                        'governance',
                        'purpose',
                        eventName,
                        eventProperties
                    )
                } catch (error) {
                    message.error({
                        content:
                            error?.response?.data?.message ??
                            'Failed to delete policy',
                        duration: 1.5,
                        key: messageKey,
                    })
                    loadingPolicy.value = false
                }
            }

            async function deletePolicyUI(type: PolicyType, id: string) {
                const messageKey = Date.now()
                message.loading({
                    content: 'Deleting policy',
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await deletePolicy(type, id)
                    updateSelectedPersona()
                    refetchPurpose(persona.value.id)
                    message.success({
                        content: 'Policy deleted',
                        duration: 1.5,
                        key: messageKey,
                    })
                    useAddEvent('governance', 'purpose', 'policy_deleted')
                } catch (error) {
                    message.error({
                        content: 'Failed to delete policy',
                        duration: 1.5,
                        key: messageKey,
                    })
                }
            }
            const filterConfig = computed(() => ({
                __traitNames: {
                    classifications: persona.value.tags,
                },
            }))
            const totalPolicy = computed(
                () =>
                    (selectedPersonaDirty.value?.metadataPolicies?.length ||
                        0) +
                        (selectedPersonaDirty.value?.dataPolicies?.length ||
                            0) ?? 0
            )
            const tabFilterList = computed(() => {
                const dataMeta =
                    selectedPersonaDirty?.value?.metadataPolicies || []
                const lengthMetaData = filterMethod(
                    dataMeta,
                    searchPersona.value || '',
                    'name'
                ).length
                const dataPolicy =
                    selectedPersonaDirty?.value?.dataPolicies || 0
                const lengthDataPolicy = filterMethod(
                    dataPolicy,
                    searchPersona.value || '',
                    'name'
                ).length
                const listFilter = [
                    {
                        id: 'all Persona',
                        label: 'All ',
                        count: lengthMetaData + lengthDataPolicy || '0',
                    },
                ]
                listFilter.push({
                    id: 'metaData',
                    label: 'Metadata',
                    count: lengthMetaData || '0',
                })
                listFilter.push({
                    id: 'data',
                    label: 'Data',
                    count: lengthDataPolicy || '0',
                })
                return listFilter
            })
            const metaDataComputed = computed(() => {
                if (
                    !activeTabFilter.value ||
                    activeTabFilter.value === 'all Persona' ||
                    activeTabFilter.value === 'metaData'
                ) {
                    const deteMeta =
                        selectedPersonaDirty?.value?.metadataPolicies || []
                    return filterMethod(
                        deteMeta,
                        searchPersona.value || '',
                        'name'
                    )
                }
                return []
            })
            const dataPolicyComputed = computed(() => {
                if (
                    !activeTabFilter.value ||
                    activeTabFilter.value === 'all Persona' ||
                    activeTabFilter.value === 'data'
                ) {
                    const dataPolicy =
                        selectedPersonaDirty?.value?.dataPolicies || []
                    return filterMethod(
                        dataPolicy,
                        searchPersona.value || '',
                        'name'
                    )
                }
                return []
            })
            const handleSelectPolicy = (policy) => {
                selectedPolicy.value = policy
                isEdit.value = true
                addpolicyVisible.value = true
                // emit('selectPolicy', policy)
            }
            const handleCloseAddPolicy = () => {
                addpolicyVisible.value = false
            }

            const {
                addStatus,
                updateStatus,
                removeStatus,
                handleAddResource,
                handleUpdateResource,
                handleRemoveResource,
            } = usePurposeResources(persona)
            const streams = computed(() => [
                {
                    key: 'all Persona',
                    label: 'All',
                },
                {
                    key: 'metaData',
                    label: 'Metadata',
                },
                {
                    key: 'data',
                    label: 'Data',
                },
            ])
            const isEmpty = computed(
                () =>
                    !selectedPersonaDirty.value?.metadataPolicies?.length &&
                    !selectedPersonaDirty.value?.dataPolicies?.length
            )
            watch(selectedPersonaDirty, () => {
                if (isEmpty.value) activeTabFilter.value = 'all Persona'
            })

            onMounted(() => {
                activeTabKey.value = 'details'
            })
            return {
                addStatus,
                updateStatus,
                removeStatus,
                handleAddResource,
                handleUpdateResource,
                handleRemoveResource,
                filterConfig,
                newIdTag,
                userId,
                selectedPurpose,
                activeTabKey,
                tabConfig,
                selectedPersonaDirty,
                addPolicyDropdownConfig,
                policyEditMap,
                setEditFlag,
                removeEditFlag,
                savePolicyUI,
                deletePolicyUI,
                discardPolicy,
                EmptyPolicyIllustration,
                totalPolicy,
                searchPersona,
                activeTabFilter,
                tabFilterList,
                metaDataComputed,
                dataPolicyComputed,
                handleSelectPolicy,
                selectedPolicy,
                NoResultIllustration,
                typeAddPolicy,
                handleCloseAddPolicy,
                loadingPolicy,
                addpolicyVisible,
                isEdit,
                streams,
                isEmpty,
                NewPolicyIllustration,
            }
        },
    })
</script>

<style lang="less">
    .drawer-add-purpose {
        .ant-drawer-content {
            overflow: visible !important;
        }
        .close-btn-sidebar {
            position: absolute !important;
            background: white !important;
        }
    }
</style>
<style lang="less">
    .container-tabs {
           width: 200px
        // .assetbar {
        //     :global(.ant-tabs-tab:first-child) {
        //         border-top-left-radius: 24px !important;
        //     }
        // }
    }
</style>
<style scoped lang="less">
    .container-card-policy {
        max-height: 55vh;
    }
    .content-wrapper {
        height: inherit;
    }
    .wrapper-height {
        height: 90%;
        overflow: auto;
        padding-bottom: 20px;
    }
</style>
