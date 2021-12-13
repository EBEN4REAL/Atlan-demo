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
                            class="px-1 py-0.5 ml-2 text-xs font-bold rounded flex items-center"
                            v-if="t?.data?.key === 'policies'"
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
                            class="px-1 py-0.5 ml-2 text-xs font-bold rounded flex items-center"
                            v-if="t?.data?.key === 'users'"
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

        <div class="overflow-y-auto" :class=" activeTabKey === 'policies' ? 'bg-white' : 'px-5'">
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
                            :placeholder="`Search from ${
                                (
                                    (selectedPersonaDirty?.metadataPolicies?.length || 0) + 
                                    (selectedPersonaDirty?.dataPolicies?.length || 0) 
                                ) ?? 0
                            } personas`"
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
                                    <AtlanIcon icon="ChevronDown" class="text-white" />
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
                    <div class="px-3 py-4 container-tabs">
                        <AggregationTabs :list="tabFilterList"/>
                    </div>
                </div>
                <template
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the policy is being edited -->
                    <MetadataPolicy
                        v-if="policyEditMap.metadataPolicies[policy.id!] && !policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @save="savePolicyUI('meta', policy.id!)"
                        @delete="deletePolicyUI('meta', policy.id!)"
                        @cancel="discardPolicy('meta', policy.id!)"
                    />

                    <PolicyCard
                        v-else-if="!policyEditMap.metadataPolicies[policy.id!] && !policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        type="meta"
                        @edit="setEditFlag('meta', policy.id!)"
                        @delete="deletePolicyUI('meta', policy.id!)"
                        @cancel="discardPolicy('meta', policy.id!)"
                    />
                </template>
                <template
                    v-for="(policy, idx) in selectedPersonaDirty.dataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the policy is being edited -->
                    <DataPolicy
                        v-if="policyEditMap.dataPolicies[policy.id!] &&  !policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @save="savePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                    />
                    <!-- ^^^ FIXME: Add implemmentation for @save and @cancel ^^^-->
                    <PolicyCard
                        v-else-if="!policyEditMap.dataPolicies[policy.id!] &&  !policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        type="data"
                        @edit="setEditFlag('data', policy.id!)"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                    />
                </template>
                <!-- For pusing the new edit policy to bottom -->
                <template
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the new policy is being edited -->
                    <MetadataPolicy
                        v-if="policyEditMap.metadataPolicies[policy.id!] && policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @save="savePolicyUI('meta', policy.id!)"
                        @delete="deletePolicyUI('meta', policy.id!)"
                        @cancel="discardPolicy('meta', policy.id!)"
                    />
                </template>

                <template
                    v-for="(policy, idx) in selectedPersonaDirty.dataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the new data policy is being edited -->
                    <DataPolicy
                        v-if="policyEditMap.dataPolicies[policy.id!] &&  policy?.id?.includes(newIdTag)"
                        class="px-5 bg-white"
                        :policy="policy"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @save="savePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                    />
                </template>

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
                class="pt-6 pb-2"
                v-model:persona="persona"
            />
        </div>
    </template>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import PolicyCard from './policies/collapsedPolicyCard.vue'
    import PersonaUsersGroups from './users/personaUsersGroups.vue'
    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './overview/personaMeta.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

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
            AggregationTabs
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        setup() {
            const searchPersona = ref('')
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
                return [
                    {
                        id: 'allPersona',
                        label: "All ",
                        count: (selectedPersonaDirty?.value?.metadataPolicies?.length || 0) + (selectedPersonaDirty?.value?.dataPolicies?.length || 0)
                    },
                    {
                        id: 'metaData',
                        label: "MetaData",
                        count: selectedPersonaDirty?.value?.metadataPolicies?.length || 0
                    },
                    {
                        id: 'data',
                        label: "Data",
                        count: selectedPersonaDirty?.value?.dataPolicies?.length || 0
                    }
                ]
            })
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
                tabFilterList
            }
        },
    })
</script>

<style lang="less" module>
    .container-tabs{
        .assetbar {
            :global(.ant-tabs-tab:first-child) {
                border-top-left-radius: 24px !important;
            }
    
        }
    }
</style>