<template>
    <div>
        <a-form
            v-if="selectedPersonaDirty"
            :key="selectedPersonaDirty.id"
            layout="vertical"
            :wrapper-col="{ span: 12 }"
            :model="selectedPersonaDirty"
            class="px-5 border-b border-gray-300"
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
            <a-form-item
                v-if="selectedPersonaDirty.createdBy"
                label="Created By"
                name="createdBy"
            >
                {{ selectedPersonaDirty.createdBy }}
            </a-form-item>
        </a-form>
        <div class="details-section" @click="setActiveTab('policies')">
            <AtlanIcon icon="Policy" class="h-6" />
            <span class="text-sm font-bold">Policies</span>
            <span class="data-policy-pill">
                <b>{{ persona.datapolicies?.length || 'No' }}</b> Data policies
            </span>
            <span class="metadata-policy-pill">
                <b>{{ persona.metadataPolicies?.length || 'No' }}</b> Metadata
                policies
            </span>
            <AtlanIcon icon="ArrowRight" class="h-6 ml-auto" />
        </div>
        <div class="details-section" @click="setActiveTab('users')">
            <AtlanIcon icon="GroupStatic" class="h-6" />
            <span class="text-sm font-bold">Users and Groups</span>
            <span class="user-group-pill">
                <b>{{ persona.users?.length || 'No' }}</b> Users
            </span>
            <span class="user-group-pill">
                <b>{{ persona.groups?.length || 'No' }}</b> Groups
            </span>
            <AtlanIcon icon="ArrowRight" class="h-6 ml-auto" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import {
        isEditing,
        selectedPersonaDirty,
    } from './composables/useEditPersona'
    import { setActiveTab } from './composables/usePersonaTabs'

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
        setup() {
            return { isEditing, selectedPersonaDirty, setActiveTab }
        },
    })
</script>
<style lang="less" scoped>
    .details-section {
        @apply flex items-center gap-x-2 py-6 px-5;
        @apply text-gray-500;
        @apply border-b border-gray-300;
        @apply cursor-pointer;
        &:hover {
            @apply bg-primary-light;
        }
    }
    .user-group-pill {
        @apply rounded-full bg-primary-light text-primary text-sm px-2 py-1;
    }
    .data-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
</style>
