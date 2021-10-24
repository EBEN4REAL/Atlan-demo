<template>
    <a-form
        v-if="selectedPersonaDirty"
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
                show-count
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
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        selectedPersonaDirty,
    } from './composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaMeta',
        components: {},
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup(props, { emit }) {
            return { isEditing, selectedPersonaDirty }
        },
    })
</script>
