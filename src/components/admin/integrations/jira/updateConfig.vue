<template>
    <section class="flex grid flex-col items-center grid-cols-2 p-6 gap-y-3">
        <div class="">
            <h2 class="mb-1 font-bold">Projects</h2>
            <span class="text-sm text-gray-500">
                {{ project_description }}
            </span>
        </div>
        <div class="w-full">
            <ProjectSelector
                v-model="defaultProject.id"
                class="w-full"
                @change="handleProjectChange"
            />
        </div>
    </section>
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

    const store = integrationStore()
    const { tenantJiraStatus } = toRefs(store)
    const { updateIntegration: updateStore } = store
    const { description, project_description } = integrations.jira

    const pV = computed(() => ({
        alias: 'jira',
        id: tenantJiraStatus.value.id,
    }))
    const unsavedChanges = ref(false)
    const defaultProject = ref({ name: '', id: '' })
    const { isLoading, disconnect } = archiveJira(pV)
    const handleProjectChange = (value, option) => {
        defaultProject.value.id = value
        defaultProject.value.name = option.label
        unsavedChanges.value = true
    }
    const body = computed(() => ({
        config: { defaultProject: defaultProject.value },
    }))

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
            useAddEvent('integration', 'jira', 'default_project_updated')

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

    onMounted(() => {
        const {
            config: { defaultProject: _defaultProject },
        } = tenantJiraStatus.value

        if (_defaultProject) {
            defaultProject.value.id = _defaultProject.id
            defaultProject.value.name = _defaultProject.name
        }
    })
</script>

<style scoped></style>
