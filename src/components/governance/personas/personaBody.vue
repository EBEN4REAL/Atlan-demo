<template>
    <template v-if="selectedPersonaDirty">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig">
            <template #label="t">
                <div class="flex items-center">
                    <span
                        class="text-base"
                        :class="
                            activeTabKey === t?.data?.key
                                ? 'text-gray-700'
                                : 'text-gray-500'
                        "
                        >{{ t?.data?.label }}</span
                    >
                    <div
                        class="px-1 py-0.5 ml-2 text-sm font-bold rounded"
                        v-if="t?.data?.key === 'policies'"
                        :class="
                            activeTabKey === t?.data?.key
                                ? 'text-primary bg-primary-light'
                                : 'text-gray-500 bg-gray-100'
                        "
                    >
                        {{
                            selectedPersonaDirty?.metadataPolicies?.length +
                            selectedPersonaDirty?.dataPolicies?.length
                        }}
                    </div>
                    <div
                        class="px-1 py-0.5 ml-2 text-sm font-bold rounded"
                        v-if="t?.data?.key === 'users'"
                        :class="
                            activeTabKey === t?.data?.key
                                ? 'text-primary bg-primary-light'
                                : 'text-gray-500 bg-gray-100'
                        "
                    >
                        {{
                            selectedPersonaDirty?.users?.length +
                            selectedPersonaDirty?.groups?.length
                        }}
                    </div>
                </div>
            </template>
        </MinimalTab>

        <div class="px-4 overflow-y-auto">
            <div>
                {{ selectedPersonaDirty?.datapolicies?.length }}
            </div>
            <PersonaMeta
                v-if="activeTabKey === 'details'"
                class="pb-2"
                :persona="persona"
            />
            <div v-else-if="activeTabKey === 'policies'" class="mt-2">
                <template
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the policy is being edited -->
                    <MetadataPolicy
                        v-if="policyEditMap.metadataPolicies[policy.id!]"
                        class="px-5"
                        :policy="policy"
                        @delete="deletePolicyUI('meta', policy.id!)"
                        @save="savePolicyUI('meta', policy.id!)"
                        @cancel="discardPolicy('meta', policy.id!)"
                    />

                    <PolicyCard
                        v-else
                        class="px-5"
                        :policy="policy"
                        type="meta"
                        @edit="setEditFlag('meta', policy.id!)"
                    />
                </template>

                <template
                    v-for="(policy, idx) in selectedPersonaDirty.dataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the policy is being edited -->
                    <DataPolicy
                        v-if="policyEditMap.dataPolicies[policy.id!]"
                        class="px-5"
                        :policy="policy"
                        @delete="deletePolicyUI('data', policy.id!)"
                        @save="savePolicyUI('data', policy.id!)"
                        @cancel="discardPolicy('data', policy.id!)"
                    />
                    <!-- ^^^ FIXME: Add implemmentation for @save and @cancel ^^^-->
                    <PolicyCard
                        v-else
                        class="px-5"
                        :policy="policy"
                        type="data"
                        @edit="setEditFlag('data', policy.id!)"
                    />
                </template>
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
                <a-dropdown trigger="click">
                    <AtlanBtn
                        class="flex-none mx-auto mt-6"
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
            <PersonaUsersGroups
                v-else-if="activeTabKey === 'users'"
                class="pt-6 pb-2"
                v-model:persona="persona"
            />
        </div>
    </template>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch } from 'vue'
    import { message } from 'ant-design-vue'

    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'

    import NewPolicyIllustration from '~/assets/images/illustrations/new_policy.svg'

    import PolicyCard from './policies/collapsedPolicyCard.vue'
    import PersonaUsersGroups from './users/personaUsersGroups.vue'
    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './overview/personaMeta.vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import {
        selectedPersonaDirty,
        addPolicy,
        savePolicyLocally,
        deletePolicy,
        deletePolicyLocally,
        policyEditMap,
        setEditFlag,
        removeEditFlag,
        savePolicy,
        discardPolicy,
        PolicyType,
    } from './composables/useEditPersona'
    import { activeTabKey, tabConfig } from './composables/usePersonaTabs'

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
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        setup() {
            const addPolicyDropdownConfig = [
                {
                    title: 'Metadata Policy',
                    icon: 'Settings',
                    handleClick: () => addPolicy('meta'),
                },
                {
                    title: 'Data Policy',
                    icon: 'Queries',
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
                    await savePolicy()
                    savePolicyLocally(type, id)
                    message.success({
                        content: 'Policy saved',
                        duration: 1.5,
                        key: messageKey,
                    })
                } catch (error) {
                    message.error({
                        content: 'Failed to save policy',
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
                    await deletePolicy()
                    deletePolicyLocally(type, id)
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

            return {
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
            }
        },
    })
</script>
