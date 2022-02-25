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

        <div v-if="activeTabKey === 'details'" class="p-6 overflow-y-auto">
            <PersonaMeta
                class="pb-0"
                :persona="persona"
                @editDetails="$emit('editDetails')"
            />
            <Readme :persona="selectedPersonaDirty" />
            <div class="mt-3 bg-white border border-gray-200 rounded">
                <ResourcesWidget
                    placeholder="Resources is the place to document all knowledge around the persona"
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
            v-if="activeTabKey === 'policies'"
            class="flex flex-col px-6 pt-6"
            style="height: calc(100% - 155px)"
        >
            <div
                :class="
                    metaDataComputed.length > 0 || dataPolicyComputed.length > 0
                        ? 'bg-white rounded-lg'
                        : (activeTabFilter === 'metaData' &&
                              metaDataComputed.length === 0) ||
                          (activeTabFilter === 'data' &&
                              dataPolicyComputed.length === 0)
                        ? 'bg-white rounded-lg pb-14'
                        : ''
                "
            >
                <div class="p-4" :class="!isEmpty && 'border-b'">
                    <div class="flex items-center justify-between">
                        <div class="w-1/2 pr-3">
                            <div
                                v-if="totalPolicy !== 0"
                                class="px-1 container-tabs"
                            >
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
                        <a-dropdown v-if="!isEmpty" trigger="click">
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
                <div
                    v-if="
                        metaDataComputed.length > 0 ||
                        dataPolicyComputed.length > 0
                    "
                    class="flex flex-col flex-grow overflow-y-auto"
                >
                    <template
                        v-for="(policy, idx) in metaDataComputed"
                        :key="idx"
                    >
                        <PolicyCard
                            :policy="policy"
                            type="meta"
                            :selected-policy="selectedPolicy"
                            :whitelisted-connection-ids="
                                whitelistedConnectionIds
                            "
                            @edit="setEditFlag('meta', policy.id!)"
                            @delete="deletePolicyUI(policy.id)"
                            @cancel="discardPolicy('meta', policy.id)"
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
                            :whitelisted-connection-ids="
                                whitelistedConnectionIds
                            "
                            @edit="setEditFlag('data', policy.id!)"
                            @delete="deletePolicyUI(policy.id)"
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

                <div
                    v-if="isEmpty"
                    class="flex flex-col items-center h-full -pt-7"
                >
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
        </div>
    </template>
    <a-drawer
        placement="right"
        :closable="false"
        :visible="addpolicyVisible"
        :width="450"
        class="drawer-add-persona"
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
    import {
        defineComponent,
        PropType,
        ref,
        computed,
        watch,
        toRefs,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import ResourcesWidget from '@common/widgets/resources/resourcesWidget.vue'
    import usePersonaResources from '@/governance/personas/composables/usePersonaResources'

    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import PolicyCard from './policies/policyCard.vue'
    import PersonaUsersGroups from './users/personaUsersGroups.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './overview/personaMeta.vue'
    import Readme from './overview/PersonaReadme.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import EmptyPolicyIllustration from '~/assets/images/empty_policy.svg'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { filterMethod, sortMethodArrOfObject } from '~/utils/helper/search'
    import Addpolicy from './addpolicy.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import { activeTabKey, tabConfig } from './composables/usePersonaTabs'
    import {
        newIdTag,
        selectedPersonaDirty,
        addPolicy,
        updateSelectedPersona,
        // deletePolicy,
        policyEditMap,
        setEditFlag,
        removeEditFlag,
        // savePolicy,
        updatePolicy,
        discardPolicy,
        PolicyType,
        deletePolicyV2,
    } from './composables/useEditPersona'
    import { refetchPersona } from './composables/usePersonaList'
    import RaisedTab from '@/UI/raisedTab.vue'

    export default defineComponent({
        name: 'PersonaBody',
        components: {
            ResourcesWidget,
            MinimalTab,
            PolicyCard,
            DataPolicy,
            AtlanBtn,
            PersonaMeta,
            PersonaUsersGroups,
            SearchAndFilter,
            AggregationTabs,
            Addpolicy,
            Readme,
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
        emits: ['selectPolicy'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            const searchPersona = ref('')
            const activeTabFilter = ref('all Persona')
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
                dataPolicy: Object,
                isEdit: boolean
            ) {
                const messageKey = Date.now()
                loadingPolicy.value = true
                message.loading({
                    content: 'Saving policy',
                    duration: 0,
                    key: messageKey,
                })
                const action = isEdit ? updatePolicy : addPolicy
                try {
                    await action(type, dataPolicy)
                    updateSelectedPersona()
                    refetchPersona(persona.value.id)
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

            async function deletePolicyUI(id: string) {
                const messageKey = Date.now()
                message.loading({
                    content: 'Deleting policy',
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await deletePolicyV2(id)
                    updateSelectedPersona()
                    refetchPersona(persona.value.id)
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
            const handleSelectPolicy = (policy, type) => {
                typeAddPolicy.value = type
                if (type === 'data' && !policy.type) {
                    policy.type = policy.maskType
                    delete policy.maskType
                }
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
            const isEmpty = computed(
                () =>
                    !selectedPersonaDirty.value.metadataPolicies?.length &&
                    !selectedPersonaDirty.value.dataPolicies?.length &&
                    !searchPersona.value
            )
            const {
                addStatus,
                updateStatus,
                removeStatus,
                handleAddResource,
                handleUpdateResource,
                handleRemoveResource,
            } = usePersonaResources(persona)
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
            watch(selectedPersonaDirty, () => {
                if (isEmpty.value) activeTabFilter.value = 'all Persona'
                addpolicyVisible.value = false
            })
            return {
                addStatus,
                updateStatus,
                removeStatus,
                handleAddResource,
                handleUpdateResource,
                handleRemoveResource,
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
                EmptyPolicyIllustration,
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
                isEmpty,
                streams,
                NewPolicyIllustration,
            }
        },
    })
</script>

<style lang="less">
    .drawer-add-persona {
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
        // .ant-radio-button-wrapper {
        //     &::before {
        //         display: none !important;
        //     }
        //     @apply bg-gray-100;
        //     &.ant-radio-button-wrapper-checked {
        //         box-shadow: 0px 1px 4px 0px #0000001f;

        //         @apply bg-white;
        //     }
        //     border: none !important;
        // }
        // .assetbar {
        //     :global(.ant-tabs-tab:first-child) {
        //         border-top-left-radius: 24px !important;
        //     }
        // }
    }
</style>
<style scoped lang="less">
    .sub-title-empty {
        max-width: 250px;
    }
    .content-wrapper {
        height: inherit;
    }
</style>
