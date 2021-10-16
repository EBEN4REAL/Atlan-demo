<template>
    <ExplorerLayout title="Integrations" sub-title="Manage your integrations">
        <template #sidebar>
            <ExplorerList
                v-model:selected="selectedIntegrationId"
                :list="integrationsList"
                data-key="id"
            >
                <template #default="{ item, isSelected }">
                    <span
                        class="text-sm truncate"
                        :class="
                            isSelected ? 'text-primary font-bold' : 'text-gray'
                        "
                    >
                        {{ item.name }}
                    </span>
                </template>
            </ExplorerList>
        </template>
        <!--TODO:Pass integration object if reqd instead of just id-->
        <IntegrationPreview
            v-if="selectedIntegrationId"
            :selected-integration-id="selectedIntegrationId"
            class="h-full"
        />
    </ExplorerLayout>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import ExplorerLayout from '@/admin/explorerLayout.vue'
import ExplorerList from '@/admin/common/explorerList.vue'
import IntegrationPreview from '@/admin/integrations/integrationPreview.vue'

interface IntegrationItem {
    name: string
    id: string
}
export default defineComponent({
    name: 'IntegrationsView',
    components: {
        ExplorerLayout,
        ExplorerList,
        IntegrationPreview,
    },
    setup() {
        // Move this hardcoded list to JSON when more integrations come
        const integrationsList: Ref<Array<IntegrationItem>> = ref([
            {
                name: 'Slack',
                id: 'slack',
            },
        ])
        // Add logic to change integration preview when more integrations come
        const selectedIntegrationId = 'slack'
        return {
            integrationsList,
            selectedIntegrationId,
        }
    },
})
</script>

<style>
</style>