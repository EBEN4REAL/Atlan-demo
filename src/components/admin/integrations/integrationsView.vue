<template>
    <ExplorerLayout title="Integrations">
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
                        <!--FIXME: computed property to add slack icon; wasn't working for some reason-->
                        <div class="flex">
                            <img
                                src="../../../assets/images/integrations/slack.svg"
                                class="self-center mr-2 integration-icon"
                                alt="Slack logo"
                            />
                            <span class="mt-0.5"> {{ item.name }}</span>
                        </div>
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
import { defineComponent, ref, Ref, computed } from 'vue'
import slack from '~/assets/images/integrations/slack.svg'
import ExplorerLayout from '@/admin/explorerLayout.vue'
import ExplorerList from '@/admin/common/explorerList.vue'
import IntegrationPreview from '@/admin/integrations/integrationPreview.vue'

interface IntegrationItem {
    name: string
    id: string
    image: string
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
                image: slack,
            },
        ])
        // Add logic to change integration preview when more integrations come
        const selectedIntegrationId = 'slack'

        return {
            integrationsList,
            selectedIntegrationId,
            slack,
        }
    },
})
</script>

<style lang="less" scoped>
.integration-icon {
    height: 1rem;
}
</style>