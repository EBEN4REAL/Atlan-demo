<template>
    <template v-if="selectedPersonaDirty">
        <div class="px-3 bg-white">
            <MinimalTab v-model:active="activeTabKey" :data="tabConfig">
                <template #label="t">
                    <div class="flex items-center overflow-hidden">
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
                        <div
                            v-if="t?.data?.key === 'users'"
                            class="px-1 py-0.5 ml-2 text-xs font-bold rounded flex items-center"
                            :class="
                                activeTabKey === t?.data?.key
                                    ? 'text-primary bg-primary-light'
                                    : 'text-gray-500 bg-gray-100'
                            "
                        >
                            <div class="mt-0.5">
                                {{
                                    selectedPersonaDirty?.users?.length +
                                    selectedPersonaDirty?.groups?.length
                                }}
                            </div>
                        </div>
                    </div>
                </template>
            </MinimalTab>
        </div>

        <div class="p-6 overflow-y-auto" v-if="activeTabKey === 'details'">
            <PersonaMeta
                class="pb-0"
                :persona="persona"
                @editDetails="$emit('editDetails')"
            />
        </div>
        <div
            class="flex flex-col px-6 pt-6"
            v-if="activeTabKey === 'policies'"
            style="height: calc(100% - 155px)"
        >
            <div class="mb-3">
                <div class="flex items-center justify-between">
                    <div class="w-1/2 pr-3">
                        <div
                            v-if="totalPolicy !== 0"
                            class="px-1 container-tabs"
                        >
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
                                <a-radio-button value="data"
                                    >Data</a-radio-button
                                >
                            </a-radio-group>
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
                                            class="w-4 h-4 text-gray-700"
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
            </div>
            <div class="flex flex-col flex-grow overflow-y-auto gap-y-3">
                <template v-for="(policy, idx) in metaDataComputed" :key="idx">
                    <PolicyCard
                        :policy="policy"
                        type="meta"
                        :selected-policy="selectedPolicy"
                        :whitelisted-connection-ids="whitelistedConnectionIds"
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
                    <PolicyCard
                        :policy="policy"
                        type="data"
                        :selected-policy="selectedPolicy"
                        :whitelisted-connection-ids="whitelistedConnectionIds"
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
                    !selectedPersonaDirty.dataPolicies?.length &&
                    !searchPersona
                "
                class="flex flex-col items-center justify-center mt-8"
            >
                <component :is="NewPolicyIllustration"></component>
                <span class="text-2xl font-bold text-gray">
                    Create Policies</span
                >
            </div>
        </div>
    </template>
    <a-drawer
        placement="right"
        :closable="false"
        :visible="addpolicyVisible"
        :width="450"
        :mask="false"
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
            @close="handleCloseAdd"
        />
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import PolicyCard from './policies/policyCard.vue'
    import PersonaUsersGroups from './users/personaUsersGroups.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './overview/personaMeta.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { filterMethod, sortMethodArrOfObject } from '~/utils/helper/search'
    import Addpolicy from './addpolicy.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    import { activeTabKey, tabConfig } from './composables/usePersonaTabs'
    import {
        newIdTag,
        selectedPersonaDirty,
        // addPolicy,
        updateSelectedPersona,
        deletePolicy,
        policyEditMap,
        setEditFlag,
        removeEditFlag,
        savePolicy,
        discardPolicy,
        PolicyType,
    } from './composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaBody',
        components: {
            MinimalTab,
            PolicyCard,
            DataPolicy,
            AtlanBtn,
            PersonaMeta,
            PersonaUsersGroups,
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
        emits: ['selectPolicy'],
        setup(prop, { emit }) {
            const searchPersona = ref('')
            const activeTabFilter = ref('')
            const selectedPolicy = ref({})
            const addpolicyVisible = ref(false)
            const isEdit = ref(false)
            const typeAddPolicy = ref('')
            const loadingPolicy = ref(false)
            const handleAddPolicy = (type) => {
                typeAddPolicy.value = type
                addpolicyVisible.value = true
                isEdit.value = false
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

            watch(selectedPersonaDirty, () => {
                activeTabFilter.value = ''
                addpolicyVisible.value = false
            })
            async function savePolicyUI(
                type: PolicyType,
                dataPolicy: Object,
                isEdit: boolean
            ) {
                console.log('savePolicyUI', { dataPolicy, isEdit, type })
                const messageKey = Date.now()
                loadingPolicy.value = true
                message.loading({
                    content: 'Saving policy',
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await savePolicy(type, dataPolicy)
                    updateSelectedPersona()
                    addpolicyVisible.value = false
                    // savePolicyLocally(type, id)
                    message.success({
                        content: 'Policy saved',
                        duration: 1.5,
                        key: messageKey,
                    })
                    loadingPolicy.value = false
                    const eventName = isEdit ? 'policy_updated' : 'policy_added'
                    const eventProperties = {
                        type,
                        masking: dataPolicy.maskType ? dataPolicy.maskType : '',
                        denied: !dataPolicy.allow,
                        asset_count: dataPolicy.assets.length,
                    }
                    useAddEvent(
                        'governance',
                        'persona',
                        eventName,
                        eventProperties
                    )
                } catch (error: any) {
                    message.error({
                        content: error?.response?.data?.message,
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
                    useAddEvent('governance', 'persona', 'policy_deleted')
                } catch (error) {
                    message.error({
                        content: 'Failed to delete policy',
                        duration: 1.5,
                        key: messageKey,
                    })
                }
            }
            const metaDataComputed = computed(() => {
                if (
                    !activeTabFilter.value ||
                    activeTabFilter.value === 'all Persona' ||
                    activeTabFilter.value === 'metaData'
                ) {
                    const deteMeta = sortMethodArrOfObject(
                        selectedPersonaDirty?.value?.metadataPolicies || [],
                        'connectionId'
                    )

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
                    const dataPolicy = sortMethodArrOfObject(
                        selectedPersonaDirty?.value?.dataPolicies || [],
                        'connectionId'
                    )

                    return filterMethod(
                        dataPolicy,
                        searchPersona.value || '',
                        'name'
                    )
                }
                return []
            })
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
            const handleSelectPolicy = (policy) => {
                selectedPolicy.value = policy
                isEdit.value = true
                addpolicyVisible.value = true
                // emit('selectPolicy', policy)
            }
            const totalPolicy = computed(
                () =>
                    (selectedPersonaDirty.value?.metadataPolicies?.length ||
                        0) +
                        (selectedPersonaDirty.value?.dataPolicies?.length ||
                            0) ?? 0
            )
            const handleCloseAddPolicy = () => {
                addpolicyVisible.value = false
            }

            const handleCloseAdd = () => {
                addpolicyVisible.value = false
            }
            return {
                newIdTag,
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
                searchPersona,
                tabFilterList,
                activeTabFilter,
                metaDataComputed,
                dataPolicyComputed,
                handleSelectPolicy,
                selectedPolicy,
                totalPolicy,
                addpolicyVisible,
                handleCloseAddPolicy,
                typeAddPolicy,
                handleCloseAdd,
                isEdit,
                loadingPolicy,
                NoResultIllustration,
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
</style>
