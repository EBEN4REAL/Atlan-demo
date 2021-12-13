<template>
    <template v-if="selectedPersonaDirty">
        <div class="bg-white">
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

        <div
            class="overflow-y-auto content-wrapper"
            :class="
                activeTabKey === 'policies'
                    ? 'bg-white pt-0 pb-0 pr-3 pl-3'
                    : 'px-5'
            "
        >
            <div>
                {{ selectedPersonaDirty?.datapolicies?.length }}
            </div>
            <PersonaMeta
                v-if="activeTabKey === 'details'"
                class="pt-3 pb-0"
                :persona="persona"
            />
            <div v-else-if="activeTabKey === 'policies'">
                <div class="sticky top-0 bg-white">
                    <div class="flex items-center pt-3 pr-4">
                        <SearchAndFilter
                            v-model:value="searchPersona"
                            :placeholder="`Search from ${totalPolicy} policies`"
                            class="bg-white"
                            :autofocus="true"
                            size="minimal"
                        />
                        <a-dropdown trigger="click">
                            <AtlanBtn
                                class="flex-none mx-auto ml-5"
                                color="primary"
                                padding="compact"
                                size="sm"
                                @click.prevent
                            >
                                <template #prefix>
                                    <AtlanIcon icon="Add" />
                                </template>
                                Add new policy
                                <template #suffix>
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="text-white"
                                    />
                                </template>
                            </AtlanBtn>

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
                        v-if="totalPolicy !== 0"
                        class="px-3 py-4 container-tabs"
                    >
                        <AggregationTabs
                            v-model="activeTabFilter"
                            :list="tabFilterList"
                            :no-all="true"
                        />
                    </div>
                </div>
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
                        class="px-3 bg-white"
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
                        class="px-3 bg-white"
                        :policy="policy"
                        type="data"
                        :selected-policy="selectedPolicy"
                        @edit="setEditFlag('data', policy.id!)"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                        @clickCard="handleSelectPolicy"
                    />
                </template>
                <!-- For pusing the new edit policy to bottom -->
                <!-- <template
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :key="idx"
                >
                    <MetadataPolicy
                        v-if="policyEditMap.metadataPolicies[policy.id!] && policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @save="savePolicyUI('meta', policy.id!)"
                        @delete="deletePolicyUI('meta', policy.id!)"
                        @cancel="discardPolicy('meta', policy.id!)"
                    />
                </template> -->

                <!-- <template
                    v-for="(policy, idx) in selectedPersonaDirty.dataPolicies"
                    :key="idx"
                >
                    <DataPolicy
                        v-if="policyEditMap.dataPolicies[policy.id!] &&  policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @save="savePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                    />
                </template> -->

                <!-- ------------------ -->
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
            <PersonaUsersGroups
                v-else-if="activeTabKey === 'users'"
                v-model:persona="persona"
                class="pt-6 pb-2"
            />
        </div>
    </template>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import PolicyCard from './policies/policyCard.vue'
    import PersonaUsersGroups from './users/personaUsersGroups.vue'
    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './overview/personaMeta.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { filterMethod } from '~/utils/helper/search'

    import { activeTabKey, tabConfig } from './composables/usePersonaTabs'
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
    } from './composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaBody',
        components: {
            MinimalTab,
            PolicyCard,
            MetadataPolicy,
            DataPolicy,
            AtlanBtn,
            PersonaMeta,
            PersonaUsersGroups,
            SearchAndFilter,
            AggregationTabs,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        setup() {
            const searchPersona = ref('')
            const activeTabFilter = ref('')
            const selectedPolicy = ref({})
            const addPolicyDropdownConfig = [
                {
                    title: 'Metadata Policy',
                    icon: 'Settings',
                    handleClick: () => addPolicy('meta'),
                },
                {
                    title: 'Data Policy',
                    icon: 'Query',
                    handleClick: () => addPolicy('data'),
                },
            ]

            watch(selectedPersonaDirty, () => {
                activeTabFilter.value = ''
            })
            async function savePolicyUI(type: PolicyType, id: string) {
                const messageKey = Date.now()
                message.loading({
                    content: 'Saving policy',
                    duration: 0,
                    key: messageKey,
                })
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
                } catch (error: any) {
                    console.log(error?.response?.data, 'error')
                    message.error({
                        content: error?.response?.data?.message,
                        duration: 1.5,
                        key: messageKey,
                    })
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
                } catch (error) {
                    message.error({
                        content: 'Failed to delete policy',
                        duration: 1.5,
                        key: messageKey,
                    })
                }
            }
            const tabFilterList = computed(() => {
                const listFilter = [
                    {
                        id: 'all Persona',
                        label: 'All ',
                        count:
                            (selectedPersonaDirty?.value?.metadataPolicies
                                ?.length || 0) +
                            (selectedPersonaDirty?.value?.dataPolicies
                                ?.length || 0),
                    },
                ]
                const lengthMetaData =
                    selectedPersonaDirty?.value?.metadataPolicies?.length || 0
                const lengthDataPolicy =
                    selectedPersonaDirty?.value?.dataPolicies?.length || 0
                if (lengthMetaData > 0) {
                    listFilter.push({
                        id: 'metaData',
                        label: 'MetaData',
                        count: lengthMetaData,
                    })
                }
                if (lengthDataPolicy > 0) {
                    listFilter.push({
                        id: 'data',
                        label: 'data',
                        count: lengthDataPolicy,
                    })
                }
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
            }
            const totalPolicy = computed(
                () =>
                    (selectedPersonaDirty.value?.metadataPolicies?.length ||
                        0) +
                        (selectedPersonaDirty.value?.dataPolicies?.length ||
                            0) ?? 0
            )
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
