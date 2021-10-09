<template>
    <template v-if="selectedPersona">
        <span class="pb-2 text-xl text-gray">Scopes</span>
        <div class="py-2 overflow-y-auto">
            <div class="mb-3" v-for="scope in scopeList">
                <span class="block mb-1 text-base text-gray-500 capitalize">{{
                    scope.type
                }}</span>
                <a-checkbox-group :name="scope.type" :options="scope.scopes" />
            </div>
        </div>
    </template>
    <div v-else class="flex items-center justify-center h-full">
        <a-spin v-if="scopeListLoading" />
        <span v-else class="mx-auto"
            >Add a new persona or select one to edit it</span
        >
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import useScopeService from '~/services/heracles/composables/scopes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { IPersona } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'PersonaScopes',
        components: { SearchAndFilter },
        props: {
            selectedPersona: {
                type: Object as PropType<IPersona>,
                required: false,
            },
        },
        setup() {
            const {
                scopeList,
                error,
                isLoading: scopeListLoading,
            } = useScopeService().listScopes()

            return {
                scopeList,
                scopeListLoading,
            }
        },
    })
</script>
