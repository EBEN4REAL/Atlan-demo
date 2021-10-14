<template>
    <template v-if="persona">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />
        <div class="px-5 pt-4 pb-2 overflow-y-auto">
            <a-form
                :key="persona.id"
                layout="vertical"
                :wrapper-col="{ span: 12 }"
                :model="persona"
            >
                <a-form-item label="Name" name="displayName" required>
                    <a-input
                        v-model:value="persona.displayName"
                        placeholder="Persona Name"
                    />
                </a-form-item>
                <a-form-item label="Description" name="description">
                    <a-textarea
                        v-model:value="persona.description"
                        showCount
                        :maxlength="140"
                        :auto-size="{ minRows: 1, maxRows: 3 }"
                    />
                </a-form-item>
                <a-form-item label="Admins" name="admins">
                    {{ persona.admins }}
                </a-form-item>
                <a-form-item label="Created On" name="createdAt">
                    {{ persona.createdAt }}
                </a-form-item>
                <a-divider />

                <a-form-item label="Scopes">
                    <div class="mb-3" v-for="scope in scopeList">
                        <span
                            class="block mb-1 text-sm text-gray-500 capitalize"
                            >{{ scope.type }}</span
                        >
                        <a-checkbox-group
                            :value="persona.metadataPolicies[0]?.actions"
                            :name="scope.type"
                            :options="scope.scopes"
                        />
                    </div>
                </a-form-item>
            </a-form>
            <a-divider />
        </div>
    </template>
    <div v-else class="flex items-center justify-center h-full">
        <span class="mx-auto">Add a new persona or select one to edit it</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, Ref, ref, toRefs, watch } from 'vue'
    import useScopeService from '~/services/heracles/composables/scopes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import { IPersona } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'PersonaScopes',
        components: { SearchAndFilter, MinimalTab },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['update:persona'],
        setup(props, { emit }) {
            // Persona related stuff
            const { persona } = toRefs(props)

            const selectedPersona: Ref<IPersona | undefined> = ref(undefined)

            watch(
                persona,
                () => {
                    selectedPersona.value = { ...persona.value }
                },
                { immediate: true }
            )

            // const selectedPersona = computed({
            //     get: () => localPerson.value,
            //     set: (val) => emit('update:persona', val),
            // })

            const activeTabKey = ref('ov')
            const tabConfig = [
                { key: 'ov', label: 'Overview' },
                { key: 'ug', label: 'Users & Groups' },
            ]

            const { scopeList } = useScopeService().listScopes()

            return {
                scopeList,
                activeTabKey,
                tabConfig,
            }
        },
    })
</script>
