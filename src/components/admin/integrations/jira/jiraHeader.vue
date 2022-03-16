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
                    <AtlanIcon icon="Jira" class="h-8" />
                </div>
                <div>
                    <div class="flex items-center mb-1 gap-x-2">
                        <h2 class="text-lg font-bold">Jira</h2>
                    </div>
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
                    <AtlanIcon icon="ArrowRight" />
                </AtlanButton>
            </div>
        </template>
        <div v-if="tenantJiraStatus.created && !jiraAppInstalled" class="">
            <AtlanButton
                v-auth="access.DELETE_INTEGRATION"
                color="minimal"
                class="text-red-500"
                :is-loading="disconnectLoading"
                size="lg"
                @click="
                    (e) => {
                        e.stopPropagation()
                        handleDisconnect()
                    }
                "
            >
                Disconnect
            </AtlanButton>
        </div>
        <div
            v-if="tenantJiraStatus.configured && !jiraAppInstalled"
            class="flex items-center justify-center px-3 py-2 text-white rounded w-26 gap-x-1 bg-primary"
        >
            <a
                class="flex items-center hover:underline hover:text-white gap-x-1"
                href="https://marketplace.atlassian.com/apps/1225577/atlan?hosting=cloud&tab=overview"
                target="_blank"
                @click="
                    (e) => {
                        e.stopPropagation()
                        handleDisconnect()
                    }
                "
            >
                <div class="">
                    <AtlanIcon icon="External" />
                </div>
                Add to Jira
            </a>
        </div>
        <div
            v-else-if="tenantJiraStatus.configured"
            class="px-3 py-1.5 space-y-2 text-primary bg-primary-light rounded"
        >
            <div
                class="flex items-center justify-center text-sm rounded gap-x-1"
            >
                <img
                    v-if="tenantJiraStatus.avatar"
                    :src="tenantJiraStatus.avatar"
                    class="w-4 h-4 rounded-full"
                />
                <AtlanIcon v-else icon="Check" />
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
    import { computed, h, toRefs, watch } from 'vue'
    import { Modal } from 'ant-design-vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import { integrations } from '~/constant/integrations/integrations'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import {
        archiveJira,
        connectJira,
    } from '~/composables/integrations/jira/useJira'
    import { issuesCount } from '~/composables/integrations/jira/useJiraTickets'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    const props = defineProps({
        isOpen: { type: Boolean, required: true },
        jiraAppInstalled: { type: Boolean, required: true },
    })

    const emit = defineEmits(['disconnect'])

    const store = integrationStore()
    const { tenantJiraStatus } = toRefs(store)

    const { description } = integrations.jira

    const { isLoading, connect: handleConnect } = connectJira({
        tenant: true,
    })

    const pV = computed(() => ({
        alias: 'jira',
        id: tenantJiraStatus.value.id,
    }))

    const { isLoading: disconnectLoading, disconnect } = archiveJira(pV)
    // ? TODO refactor DRY refactor DRY refactor DRY  @samiran
    const handleDisconnect = () => {
        Modal.confirm({
            class: '',
            icon: null,
            content: () =>
                h('div', { class: [''] }, [
                    h(
                        'h1',
                        {
                            class: ['font-bold -mt-4 mb-2'],
                        },
                        ['Disconnect Jira']
                    ),

                    h(
                        'div',
                        {
                            class: ['font-normal'],
                        },
                        [
                            'Are you sure you want to disconnect ',
                            h(
                                'b',
                                {
                                    class: [''],
                                },
                                'Jira'
                            ),
                            ' integration?',
                        ]
                    ),
                    h(
                        'div',
                        {
                            class: ['font-normal', 'mb-2'],
                        },
                        [
                            'This will also disconnect Jira integration for other users.',
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
                useAddEvent('admin', 'integration', 'removed', {
                    integration: 'jira',
                    level: 'tenant',
                })
            },
        })
    }
</script>

<style scoped></style>
