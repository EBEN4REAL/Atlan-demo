<template>
    <section
        class="flex items-center h-20 p-6 rounded-t-lg gap-x-3"
        :class="isOpen ? 'bg-gray-100' : ''"
    >
        <div class="flex-grow">
            <div class="flex items-center gap-x-3">
                <div
                    class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                >
                    <AtlanIcon icon="Slack" class="h-8" />
                </div>
                <div class="">
                    <h2 class="text-lg font-bold">Slack</h2>
                    <span class="text-gray-500">{{ description }}</span>
                </div>
            </div>
        </div>
        <template v-if="!tenantSlackStatus.configured">
            <div class="">
                <AtlanButton
                    v-if="
                        tenantSlackStatus.created &&
                        !tenantSlackStatus.configured
                    "
                    v-auth="access.DELETE_INTEGRATION"
                    color="minimal"
                    class="text-red-500"
                    :is-loading="isLoading"
                    size="lg"
                    @click="handleDisconnect"
                >
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
                    @click="() => openSlackOAuth({ tenant: true })"
                >
                    <AtlanButton
                        v-auth="access.CREATE_INTEGRATION"
                        size="sm"
                        padding="compact"
                    >
                        Add to Slack <AtlanIcon icon="ArrowRight" />
                    </AtlanButton>
                </div>
                <AtlanButton
                    v-else
                    v-auth="access.CREATE_INTEGRATION"
                    size="sm"
                    padding="compact"
                    @click="$emit('openConfig')"
                >
                    Connect
                    <AtlanIcon icon="ArrowRight" />
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
                <img
                    v-if="tenantSlackStatus.avatar"
                    :src="tenantSlackStatus.avatar"
                    class="w-4 h-4 rounded-full"
                />
                <AtlanIcon v-else icon="Check" />
                {{ tenantSlackStatus.teamName }} workspace connected
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
    import { computed, h, toRefs } from 'vue'
    import { Modal } from 'ant-design-vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import { integrations } from '~/constant/integrations/integrations'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import {
        tenantLevelOauthUrl,
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/slack/useSlack'

    const props = defineProps({
        isOpen: { type: Boolean, required: true },
    })

    const store = integrationStore()
    const { tenantSlackStatus } = toRefs(store)

    const { description } = integrations.slack
    const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

    const { data, isLoading, error, disconnect } = archiveSlack(pV)

    const handleDisconnect = () => {
        Modal.confirm({
            class: '',
            icon: null,
            content: () =>
                h('div', { class: [''] }, [
                    h(
                        'h1',
                        {
                            class: ['font-bold -mt-4 mb-3'],
                        },
                        ['Disconnect Slack']
                    ),
                    h(
                        'div',
                        {
                            class: ['font-normal', 'mb-3'],
                        },
                        [
                            'Are you sure you want to disconnect ',
                            h(
                                'b',
                                {
                                    class: [''],
                                },
                                'Slack'
                            ),
                            ' integration?',
                        ]
                    ),
                ]),
            okType: 'danger',
            autoFocusButton: null,
            okButtonProps: {
                type: 'primary',
            },
            okText: 'Disconnect',
            cancelText: 'Cancel',
            async onOk() {
                await disconnect()
            },
        })
    }
</script>

<style scoped></style>
