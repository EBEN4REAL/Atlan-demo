<template>
    <template v-if="selectedPersonaDirty">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />

        <div class="px-5 pt-4 pb-2 overflow-y-auto">
            <a-form
                :key="selectedPersonaDirty.id"
                layout="vertical"
                :wrapper-col="{ span: 12 }"
                :model="selectedPersonaDirty"
            >
                <a-form-item label="Name" name="displayName" required>
                    <a-input
                        v-if="isEditing"
                        v-model:value="selectedPersonaDirty.displayName"
                        placeholder="Persona Name"
                    />
                    <span v-else>{{ persona.displayName }}</span>
                </a-form-item>
                <a-form-item label="Description" name="description">
                    <a-textarea
                        v-if="isEditing"
                        v-model:value="selectedPersonaDirty.description"
                        showCount
                        :maxlength="140"
                        :auto-size="{ minRows: 1, maxRows: 3 }"
                    />
                    <span v-else>{{ persona.description }}</span>
                </a-form-item>
                <a-form-item
                    v-if="selectedPersonaDirty.createdAt"
                    label="Created On"
                    name="createdAt"
                >
                    {{ selectedPersonaDirty.createdAt }}
                </a-form-item>
            </a-form>
            <a-divider />
            <PersonaPolicy
                v-for="(policy, idx) in selectedPersonaDirty.metadataPolicies"
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

    import PersonaPolicy from './policies/policy.vue'
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

            const activeTabKey = ref('ov')
            const tabConfig = [
                { key: 'ov', label: 'Overview' },
                { key: 'ug', label: 'Users & Groups' },
            ]

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
