<template>
    <template v-if="selectedPersonaDirty">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />

        <div class="pt-4 pb-2 overflow-y-auto">
            <PersonaMeta v-if="activeTabKey === 'details'" :persona="persona" />
            <div v-else-if="activeTabKey === 'policies'" class="px-5">
                <MetadataPolicy
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :key="idx"
                    :policy="policy"
                    @delete="deletePolicy('meta', idx)"
                />
                <DataPolicy
                    v-for="(policy, idx) in selectedPersonaDirty.datapolicies"
                    :key="idx"
                    :policy="policy"
                    @delete="deletePolicy('data', idx)"
                />

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
        </div>
    </template>
    <div v-else class="flex items-center justify-center h-full">
        <span class="mx-auto">Add a new persona or select one to edit it</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, watch } from 'vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'

    import MetadataPolicy from './policies/metadataPolicyItem.vue'
    import DataPolicy from './policies/dataPolicyItem.vue'
    import PersonaMeta from './personaMeta.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        selectedPersonaDirty,
        addPolicy,
        deletePolicy,
    } from './composables/useEditPersona'
    import { activeTabKey, tabConfig } from './composables/usePersonaTabs'
    export default defineComponent({
        name: 'PersonaBody',
        components: {
            MinimalTab,
            MetadataPolicy,
            DataPolicy,
            AtlanBtn,
            PersonaMeta,
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
            }
        },
    })
</script>
