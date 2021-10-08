<template>
    <template v-if="selectedPersona">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />
        <span class="px-5 pt-3 text-xl text-gray">Scopes</span>
        <div class="px-5 py-2 overflow-y-auto">
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
    import MinimalTab from '@/UI/minimalTab.vue'
    import { IPersona } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'PersonaScopes',
        components: { SearchAndFilter, MinimalTab },
        props: {
            selectedPersona: {
                type: Object as PropType<IPersona>,
                required: false,
            },
        },
        setup() {
            const { scopeList, isLoading: scopeListLoading } =
                useScopeService().listScopes()

            const activeTabKey = ref('ov')
            const tabConfig = [
                { key: 'ov', label: 'Overview' },
                { key: 'ug', label: 'Users & Groups' },
            ]

            return {
                scopeList,
                scopeListLoading,
                activeTabKey,
                tabConfig,
            }
        },
    })
</script>
