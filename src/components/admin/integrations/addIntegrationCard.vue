<template>
    <section
        class="flex items-center h-32 p-6 border rounded shadow gap-x-5 addCard"
    >
        <div class="">
            <AtlanIcon icon="Slack" class="h-12 bg-white" />
        </div>
        <div class="flex-grow">
            <h2 class="mb-2 text-xl font-bold">
                Connect {{ integrationData.name }} with {{ tenantName }}
            </h2>
            <p class="font-lg tex-gray-500">
                {{ integrationData.description }}
            </p>
        </div>
        <div class="">
            <router-link :to="`//${integrationData.link}`" target="_blank">
                <AtlanButton v-auth="access.CREATE_INTEGRATION">
                    Add to Slack <AtlanIcon icon="ArrowRight" />
                </AtlanButton>
            </router-link>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AtlanButton from '@/UI/button.vue'
import useTenantData from '~/composables/tenant/useTenantData'
import access from '~/constant/accessControl/map'

export default defineComponent({
    name: 'AddIntegrationCard',
    components: { AtlanButton },
    props: {
        integration: { type: Object, required: true },
        integrationData: { type: Object, required: true },
    },
    setup() {
        const { name: tenantName } = useTenantData()
        return { tenantName, access }
    },
})
</script>

<style scoped>
.addCard {
    background: url('~/assets/images/integrations/add-slack-bg.svg') no-repeat;
    background-size: contain;
}
</style>
