<template>
    <template v-if="selectedPersonaDirty">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />

        <div class="overflow-y-auto">
            <PersonaMeta
                v-if="activeTabKey === 'details'"
                class="pt-4 pb-2"
                :persona="persona"
            />
            <div v-else-if="activeTabKey === 'policies'">
                <template
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :key="idx"
                >
                    <!-- Render it if the policy is being edited -->
                    <MetadataPolicy
                        v-if="policyEditMap.metadataPolicies[idx]"
                        class="px-5"
                        :policy="policy"
                        @delete="deletePolicy('meta', idx)"
                        @save="removeEditFlag('meta', idx)"
                        @cancel="removeEditFlag('meta', idx)"
                    />
                    <!-- ^^^ FIXME: Add implemmentation for @save and @cancel ^^^-->
                    <PolicyCard
                        v-else
                        class="px-5"
                        :policy="policy"
                        type="meta"
                        @edit="setEditFlag('meta', idx)"
                    />
                </template>
                <template
                    v-for="(policy, idx) in selectedPersonaDirty.datapolicies"
                    :key="idx"
                >
                    <!-- Render it if the policy is being edited -->
                    <DataPolicy
                        v-if="policyEditMap.dataPolicies[idx]"
                        class="px-5"
                        :policy="policy"
                        @delete="deletePolicy('data', idx)"
                        @save="removeEditFlag('meta', idx)"
                        @cancel="removeEditFlag('meta', idx)"
                    />
                    <!-- ^^^ FIXME: Add implemmentation for @save and @cancel ^^^-->
                    <PolicyCard
                        v-else
                        class="px-5"
                        :policy="policy"
                        type="data"
                        @edit="setEditFlag('data', idx)"
                    />
                </template>

                <a-dropdown trigger="click">
                    <AtlanBtn
                        v-if="isEditing"
                        class="flex-none mx-auto"
                        color="primary"
                        padding="compact"
                        size="sm"
                        @click.prevent
                        >Add new policy</AtlanBtn
                    >

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
                class="px-5 pt-4 pb-2"
                :persona="persona"
            />
        </div>
    </template>
    <div v-else class="flex items-center justify-center h-full">
        <span class="mx-auto">Add a new persona or select one to edit it</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch } from 'vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'

    import PolicyCard from './policies/collapsedPolicyCard.vue'
    import PersonaUsersGroups from './personaUsersGroups.vue'
    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './personaMeta.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        selectedPersonaDirty,
        addPolicy,
        deletePolicy,
        policyEditMap,
        setEditFlag,
        removeEditFlag,
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
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        setup(props) {
            // Persona related stuff
            const { persona } = toRefs(props)

            watch(
                persona,
                () => {
                    selectedPersonaDirty.value = { ...persona.value }
                },
                { immediate: true }
            )

            const addPolicyDropdownConfig = [
                {
                    title: 'Metadata Policy',
                    icon: 'Add',
                    handleClick: () => addPolicy('meta'),
                },
                {
                    title: 'Data Policy',
                    icon: 'Add',
                    handleClick: () => addPolicy('data'),
                },
            ]

            return {
                activeTabKey,
                tabConfig,
                selectedPersonaDirty,
                isEditing,
                deletePolicy,
                addPolicyDropdownConfig,
                policyEditMap,
                setEditFlag,
                removeEditFlag,
            }
        },
    })
</script>
