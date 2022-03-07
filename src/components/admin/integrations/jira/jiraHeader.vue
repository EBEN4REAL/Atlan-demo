<template>
    <section
        class="flex items-center h-20 p-6 bg-gray-100 rounded-t-lg gap-x-3"
    >
        <div class="flex-grow">
            <div class="flex items-center gap-x-3">
                <div
                    class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                >
                    <AtlanIcon icon="Jira" class="h-8" />
                </div>
                <div class="">
                    <h2 class="text-lg font-bold">Jira</h2>
                    <span class="text-gray-500">{{ description }}</span>
                </div>
            </div>
        </div>
        <template v-if="!tenantJiraStatus.configured">
            <div class="">
                <AtlanButton
                    v-auth="access.CREATE_INTEGRATION"
                    :loading="isLoading"
                    size="sm"
                    padding="compact"
                    class="px-5"
                    @click="
                        (e) => {
                            e.stopPropagation()
                            handleConnect()
                        }
                    "
                >
                    Connect
                </AtlanButton>
            </div>
        </template>
        <div
            v-else
            class="px-3 py-1.5 space-y-2 text-primary bg-primary-light rounded"
        >
            <div
                class="flex items-center justify-center text-sm rounded gap-x-1"
            >
                <AtlanIcon icon="Check" />
                {{ tenantJiraStatus.orgName }} workspace connected
            </div>
        </div>
        <div class="">
            <AtlanIcon
                icon="CaretDown"
                class="transition duration-100"
                :style="isOpen ? 'transform: rotate(180deg)' : ''"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { toRefs } from 'vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import { integrations } from '~/constant/integrations/integrations'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import { connectJira } from '~/composables/integrations/jira/useJira'

    const props = defineProps({
        isOpen: { type: Boolean, required: true },
    })

    const { name: tenantName } = useTenantData()
    const store = integrationStore()
    const { tenantJiraStatus } = toRefs(store)

    const { description } = integrations.jira

    const { isLoading, connect: handleConnect } = connectJira({
        tenant: true,
    })
</script>

<style scoped></style>
