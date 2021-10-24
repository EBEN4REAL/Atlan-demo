<template>
    <template v-if="selectedPersonaDirty">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />

        <div class="px-5 pt-4 pb-2 overflow-y-auto">
            <PersonaMeta v-if="activeTabKey === 'details'" :persona="persona" />
            <template v-else-if="activeTabKey === 'policies'">
                <PersonaPolicy
                    v-for="(
                        policy, idx
                    ) in selectedPersonaDirty.metadataPolicies"
                    :policy="policy"
                    @delete="deletePolicy(idx)"
                />
                <AtlanBtn
                    class="ml-auto"
                    v-if="isEditing"
                    size="sm"
                    @click="addPolicy"
                    color="primary"
                    padding="compact"
                    >Add policy</AtlanBtn
                >
            </template>
        </div>
    </template>
    <div v-else class="flex items-center justify-center h-full">
        <span class="mx-auto">Add a new persona or select one to edit it</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, watch } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'

    import PersonaPolicy from './policies/metadataPolicyItem.vue'
    import PersonaMeta from './personaMeta.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        selectedPersonaDirty,
    } from './composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaScopes',
        components: {
            SearchAndFilter,
            MinimalTab,
            PersonaPolicy,
            AtlanBtn,
            PersonaMeta,
        },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup(props, { emit }) {
            // Persona related stuff
            const { persona } = toRefs(props)

            watch(
                persona,
                () => {
                    selectedPersonaDirty.value = { ...persona.value }
                },
                { immediate: true }
            )

            const tabConfig = [
                { key: 'details', label: 'Overview' },
                { key: 'policies', label: 'Policies' },
                { key: 'users', label: 'Users & Groups' },
            ]

            const activeTabKey = ref('details')

            function addPolicy() {
                selectedPersonaDirty.value?.metadataPolicies?.push({
                    actions: [],
                    assets: [],
                    connectionId: '',
                    allow: true,
                    name: '',
                    description: '',
                })
            }

            function deletePolicy(idx: number) {
                selectedPersonaDirty.value?.metadataPolicies?.splice(idx, 1)
            }

            return {
                activeTabKey,
                tabConfig,
                selectedPersonaDirty,
                isEditing,
                addPolicy,
                deletePolicy,
            }
        },
    })
</script>
