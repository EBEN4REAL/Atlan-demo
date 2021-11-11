<template>
    <div>
        <div class="details-section">
            <span class="text-sm text-gray-500">Created By</span>
            <span class="text-sm text-gray">{{ persona.createdBy }}</span>
            <span class="text-sm text-gray-500">on</span>
            <span class="text-sm text-gray">{{ persona.createdAt }}</span>

            <a-switch
                class="ml-auto"
                :class="enablePersonaCheck ? 'btn-checked' : 'btn-unchecked'"
                v-model:checked="enablePersonaCheck"
            />
            <span class="text-sm text-gray">Enable Persona</span>
        </div>

        <div class="details-section group" @click="setActiveTab('policies')">
            <AtlanIcon icon="Policy" class="h-6" />
            <span class="text-sm font-bold">Policies</span>
            <span class="data-policy-pill">
                <b>{{ persona.dataPolicies?.length || 'No' }}</b> Data policies
            </span>
            <span class="metadata-policy-pill">
                <b>{{ persona.metadataPolicies?.length || 'No' }}</b> Metadata
                policies
            </span>
            <AtlanIcon
                icon="ArrowRight"
                class="h-6 ml-auto group-hover:text-primary"
            />
        </div>
        <div class="details-section group" @click="setActiveTab('users')">
            <AtlanIcon icon="GroupStatic" class="h-6" />
            <span class="text-sm font-bold">Users and Groups</span>
            <span class="user-group-pill">
                <b>{{ persona.users?.length || 'No' }}</b> Users
            </span>
            <span class="user-group-pill">
                <b>{{ persona.groups?.length || 'No' }}</b> Groups
            </span>
            <AtlanIcon
                icon="ArrowRight"
                class="h-6 ml-auto group-hover:text-primary"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import { enablePersona } from '../composables/useEditPersona'
    import { setActiveTab } from '../composables/usePersonaTabs'

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
            const enablePersonaCheck = ref(true)
            return {
                enablePersonaCheck,
                enablePersona,
                setActiveTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .details-section {
        @apply flex items-center gap-x-2 py-6 px-5;
        @apply text-gray-500;
        @apply border-b border-gray-300;
        @apply cursor-pointer;
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
    .btn-checked {
        background: #00a680 !important;
    }
</style>
