<template>
    <section
        class="flex items-center h-32 p-6 border shadow rounded-xl gap-x-5"
        :class="$style.addCard"
    >
        <div class="">
            <AtlanIcon icon="Slack" class="h-12 bg-white" />
        </div>
        <div class="flex-grow">
            <h2 class="mb-2 text-xl font-bold">Connect Atlan with Slack</h2>
            <p class="font-lg tex-gray-500">
                🚀 Share asset profile, terms, queries with your team
            </p>
        </div>
        <div class="">
            <AtlanButton
                v-if="
                    tenantSlackStatus.created && !tenantSlackStatus.configured
                "
                v-auth="access.DELETE_INTEGRATION"
                color="minimal"
                class="text-red-500"
                :is-loading="isLoading"
                size="lg"
                @click="disconnect"
            >
                <!-- <AtlanIcon icon="Gear" /> Reconfigure -->
                Disconnect
            </AtlanButton>
        </div>
        <div class="">
            <div
                v-if="
                    tenantSlackStatus.created &&
                    !tenantSlackStatus.configured &&
                    tenantLevelOauthUrl
                "
                @click="() => openSlackOAuth({ tenant: true, emit: $emit })"
            >
                <AtlanButton v-auth="access.CREATE_INTEGRATION">
                    Install now <AtlanIcon icon="ArrowRight" />
                </AtlanButton>
            </div>
            <AtlanButton
                v-else
                v-auth="access.CREATE_INTEGRATION"
                @click="$emit('openConfig')"
            >
                Connect
                <AtlanIcon icon="ArrowRight" />
            </AtlanButton>
        </div>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import access from '~/constant/accessControl/map'
    import integrationStore from '~/store/integrations/index'
    import {
        getSlackInstallUrlState,
        tenantLevelOauthUrl,
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/useSlack'

    export default defineComponent({
        name: 'AddSlackIntegrationCard',
        components: { AtlanButton },
        emits: ['openConfig'],
        setup() {
            // store
            const store = integrationStore()

            const { tenantSlackStatus } = toRefs(store)

            // variables
            const { name: tenantName } = useTenantData()

            const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

            const { data, isLoading, error, disconnect } = archiveSlack(pV)

            return {
                openSlackOAuth,
                disconnect,
                tenantSlackStatus,
                isLoading,
                store,
                tenantName,
                access,
                tenantLevelOauthUrl,
            }
        },
    })
</script>

<style lang="less" module>
    .addCard {
        background: url('~/assets/images/integrations/add-slack-bg.svg')
            no-repeat;
        background-size: contain;
        background-position-x: right;
    }
    .inviteModal {
        :global(.ant-modal-content) {
            @apply rounded-lg;
        }
    }
</style>
