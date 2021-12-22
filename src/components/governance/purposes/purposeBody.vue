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

        <div class="p-6 overflow-y-auto" v-if="activeTabKey === 'details'">
            <PurposeMeta
                class="flex flex-col"
                :persona="persona"
                @editDetails="$emit('editDetails')"
            />
        </div>
        <div
            class="flex flex-col px-6 pt-6"
            v-if="activeTabKey === 'policies'"
            style="height: calc(100% - 155px)"
        >
            <div class="flex items-center justify-between mb-3">
                <div class="w-1/2">
                    <div class="container-tabs">
                        <a-radio-group
                            v-model:value="activeTabFilter"
                            class="flex flex-grow"
                        >
                            <a-radio-button value="all Persona"
                                >All</a-radio-button
                            >
                            <a-radio-button value="metaData"
                                >Metadata</a-radio-button
                            >
                            <a-radio-button value="data">Data</a-radio-button>
                        </a-radio-group>
                    </div>
                </div>
                <a-dropdown trigger="click">
                    <a-button type="primary">
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
            </div>
            <div class="flex flex-col flex-grow overflow-y-auto gap-y-3">
                <template v-for="(policy, idx) in metaDataComputed" :key="idx">
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
                    metaDataComputed.length === 0 &&
                    dataPolicyComputed.length === 0 &&
                    searchPersona
                "
                class="flex flex-col items-center justify-center mt-8"
            >
                <component :is="NoResultIllustration"></component>
                <span class="text-sm font-bold text-gray">
                    Sorry, we couldn’t find the policy you were looking
                    for</span
                >
            </div>
            <div
                v-if="
                    !selectedPersonaDirty.metadataPolicies?.length &&
                    !selectedPersonaDirty.dataPolicies?.length
                "
                class="flex flex-col items-center justify-center mt-8"
            >
                <component :is="NewPolicyIllustration"></component>
                <span class="text-2xl font-bold text-gray">
                    Create Policies</span
                >
            </div>
        </div>

        <div v-else-if="activeTabKey === 'linked_assets'" class="bg-white">
            <div class="wrapper-height">
                <AssetsWrapper
                    :initial-filters="filterConfig"
                    :show-filters="false"
                    page="purposes"
                    :enable-sidebar-drawer="true"
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
        :visible="addpolicyVisible"
        :width="450"
        :mask="false"
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
    } from 'vue'
    import { message } from 'ant-design-vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'
    import Addpolicy from './addpolicy.vue'
    import PolicyCard from './policies/collapsedPolicyCard.vue'
    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PurposeMeta from './overview/purposeMeta.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { filterMethod } from '~/utils/helper/search'
    import {
        newIdTag,
        selectedPersonaDirty,
        addPolicy,
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
    import { selectedPersona } from './composables/usePurposeList'
    import AssetsWrapper from '@/assets/index.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'PurposeBody',
        components: {
            MinimalTab,
            PolicyCard,
            MetadataPolicy,
            DataPolicy,
            AtlanBtn,
            PurposeMeta,
            AssetsWrapper,
            SearchAndFilter,
            AggregationTabs,
            Addpolicy,
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
            const activeTabFilter = ref('')
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
                    icon: 'Settings',
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
                console.log('savePolicyUI', { type, id, isEditMode })
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

                    // savePolicyLocally(type, id)
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
            return {
                filterConfig,
                newIdTag,
                userId,
                selectedPersona,
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
                NewPolicyIllustration,
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
            }
        },
    })
</script>

<style lang="less" module>
    .container-tabs {
        .assetbar {
            :global(.ant-tabs-tab:first-child) {
                border-top-left-radius: 24px !important;
            }
        }
    }
</style>
<style scoped lang="less">
    .content-wrapper {
        height: inherit;
    }
    .wrapper-height {
        height: 660px;
        overflow: auto;
        padding-bottom: 20px;
    }
</style>
