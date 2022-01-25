<template>
    <section
        class="flex items-center h-32 p-6 border shadow rounded-xl gap-x-5"
        :class="$style.addCard"
    >
        <div class="flex-grow">
            <div class="flex items-center gap-x-3">
                <div
                    class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded"
                >
                    <AtlanIcon icon="Slack" class="h-8" />
                </div>
                <div class="">
                    <h2 class="text-lg font-bold">Slack</h2>
                    <span class="text-gray-500">{{ description }}</span>
                </div>
            </div>
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
                    Add to slack <AtlanIcon icon="ArrowRight" />
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
    import access from '~/constant/accessControl/map'
    import integrationStore from '~/store/integrations/index'
    import {
        tenantLevelOauthUrl,
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/useSlack'
    import { integrations } from '~/constant/integrations'

    export default defineComponent({
        name: 'AddSlackIntegrationCard',
        components: { AtlanButton },
        emits: ['openConfig'],
        setup() {
            const store = integrationStore()

            const { tenantSlackStatus } = toRefs(store)

            const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

            const { data, isLoading, error, disconnect } = archiveSlack(pV)
            const { description } = integrations.slack

            return {
                description,
                openSlackOAuth,
                disconnect,
                tenantSlackStatus,
                isLoading,
                store,
                access,
                tenantLevelOauthUrl,
            }
        },
    })
</script>

<style lang="less" module>
    .addCard {
        background: url('~/assets/images/admin/integrations/add-slack-bg.svg')
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
