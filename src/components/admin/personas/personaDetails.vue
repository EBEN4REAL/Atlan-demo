<template>
    <template v-if="selectedPersona">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />
        <div
            class="flex items-center justify-end flex-grow pt-2 transition-all duration-300  gap-x-4"
            :class="{ 'h-0 opacity-0': !isEditMode }"
        >
            <AtlanBtn @click="handleDiscard" color="secondary" padding="compact"
                >Discard</AtlanBtn
            >
            <AtlanBtn @click="handleSave" color="primary" padding="compact"
                >Save</AtlanBtn
            >
        </div>
        <div class="px-5 pt-4 pb-2 overflow-y-auto">
            <a-form
                :key="selectedPersona.id"
                layout="vertical"
                :wrapper-col="{ span: 12 }"
                :model="selectedPersona"
            >
                <a-form-item label="Name" name="displayName" required>
                    <a-input
                        v-if="isEditMode"
                        v-model:value="selectedPersona.displayName"
                        placeholder="Persona Name"
                    />
                    <span v-else>{{ persona.displayName }}</span>
                </a-form-item>
                <a-form-item label="Description" name="description">
                    <a-textarea
                        v-if="isEditMode"
                        v-model:value="selectedPersona.description"
                        showCount
                        :maxlength="140"
                        :auto-size="{ minRows: 1, maxRows: 3 }"
                    />
                    <span v-else>{{ persona.description }}</span>
                </a-form-item>
                <a-form-item label="Admins" name="admins">
                    {{ selectedPersona.admins }}
                </a-form-item>
                <a-form-item label="Created On" name="createdAt">
                    {{ selectedPersona.createdAt }}
                </a-form-item>
                <a-divider />

                <a-form-item label="Scopes">
                    <div class="mb-3" v-for="scope in scopeList">
                        <span
                            class="block mb-1 text-sm text-gray-500 capitalize"
                            >{{ scope.type }}</span
                        >
                        <a-checkbox-group
                            :value="
                                selectedPersona.metadataPolicies[0]?.actions
                            "
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
    import {
        computed,
        defineComponent,
        PropType,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import useScopeService from '~/services/heracles/composables/scopes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AtlanBtn from '@/UI/button.vue'
    import { IPersona } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'PersonaScopes',
        components: { SearchAndFilter, MinimalTab, AtlanBtn },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
            isEditMode: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
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

            function handleDiscard() {
                emit('update:isEditMode', false)
            }
            function handleSave() {
                emit('update:isEditMode', false)
                emit('update:persona', selectedPersona.value)
            }
            return {
                scopeList,
                activeTabKey,
                tabConfig,
                selectedPersona,
                handleDiscard,
                handleSave,
            }
        },
    })
</script>
