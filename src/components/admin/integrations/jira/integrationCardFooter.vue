<template>
    <section class="flex items-center justify-between px-6 py-4 pt-0 gap-x-3">
        <AtlanButton
            v-auth="access.DELETE_INTEGRATION"
            color="secondary"
            size="sm"
            padding="compact"
            class="text-red-500"
            :is-loading="isLoading"
            @click="handleDisconnect"
        >
            Disconnect
        </AtlanButton>
        <AtlanButton
            :is-loading="updateLoading"
            class="px-6"
            :disabled="!unsavedChanges"
            size="sm"
            padding="compact"
            @click="update"
        >
            Update
        </AtlanButton>
    </section>
</template>

<script setup lang="ts">
    import { message, Modal } from 'ant-design-vue'
    import { computed, ref, watch, h, onMounted, toRefs } from 'vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { archiveJira } from '~/composables/integrations/jira/useJira'
    import { UpdateIntegration } from '~/composables/integrations/useIntegrations'
    import access from '~/constant/accessControl/map'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'
    import integrationStore from '~/store/integrations/index'
    import { integrations } from '~/constant/integrations/integrations'
    import { useVModels } from '@vueuse/core'

    const props = defineProps({
        defaultProject: {
            type: Object,
            required: true,
        },
        unsavedChanges: { type: Boolean, required: true },
    })

    const emit = defineEmits([])

    const { defaultProject } = toRefs(props)
    const { unsavedChanges } = useVModels(props, emit)

    const store = integrationStore()
    const { tenantJiraStatus } = toRefs(store)
    const { updateIntegration: updateStore } = store

    const pV = computed(() => ({
        alias: 'jira',
        id: tenantJiraStatus.value.id,
    }))

    const { isLoading, disconnect } = archiveJira(pV)
    const body = computed(() =>
        defaultProject.value?.name && defaultProject.value?.id
            ? {
                  config: { defaultProject: defaultProject.value },
              }
            : { config: {} }
    )

    const {
        data,
        isLoading: updateLoading,
        error,
        mutate: update,
    } = UpdateIntegration(pV, body, { immediate: false })
    watch([updateLoading, error], () => {
        if (updateLoading.value) {
            message.loading({
                content: 'saving default project ...',
                key: 'save',
                duration: 2,
            })
        } else if (error.value) {
            const errMsg = updateError.value?.response?.data?.errorMessage || ''
            const generalError = 'Network error'
            const e = errMsg || generalError
            message.error({
                content: e,
                key: 'save',
                duration: 2,
            })
        } else {
            if (data.value?.id) updateStore(data.value)
            useAddEvent('integration', 'jira', 'config_updated', {
                default_project_present: !!defaultProject.value.id,
            })

            message.success({
                content: 'Default project saved.',
                key: 'save',
                duration: 2,
            })
            unsavedChanges.value = false
        }
    })

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
