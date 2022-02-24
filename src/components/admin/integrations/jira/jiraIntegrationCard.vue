<template>
    <div class="border rounded-lg shadow drop-shadow wrapper">
        <section
            class="flex items-center h-24 p-6 bg-gray-100 border-b rounded-t-lg bg-slack gap-x-3"
        >
            <div class="flex-grow">
                <div class="flex items-center gap-x-3">
                    <div
                        class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded"
                    >
                        <AtlanIcon icon="Jira" class="h-8" />
                    </div>
                    <div class="">
                        <h2 class="text-lg font-bold">Jira</h2>
                        <span class="text-gray-500">{{ description }}</span>
                    </div>
                </div>
            </div>
            <div
                :style="{
                    color: '#00a680',
                    background:
                        'linear-gradient(90deg,#fafafa 0%,#fafafa 65.62%,rgba(250, 250, 250, 0) 95.54%)',
                }"
                class="px-3 py-1.5 space-y-2"
            >
                <div class="flex items-center justify-center rounded gap-x-1">
                    <AtlanIcon icon="Check" />
                    {{ tenantJiraStatus.orgName }} workspace connected
                </div>
                <div
                    class="flex items-center text-xs text-gray-500 gap-x-1.5 justify-center"
                >
                    <template v-if="userList[0]">
                        Added by
                        <div class="flex justify-center text-xs">
                            <div class="self-center text-gray-700">
                                {{ userList[0]?.name }}
                            </div>
                        </div>
                    </template>
                    <span>{{
                        useTimeAgo(tenantJiraStatus.createdAt).value
                    }}</span>
                </div>
            </div>
        </section>
        <section class="flex flex-col p-6 border-b gap-y-3">
            <div class="">
                <h2 class="text-lg font-bold">Projects</h2>
                <span class="text-gray-500">
                    {{ project_description }}
                </span>
            </div>
            <div class="flex flex-wrap items-center h-12 gap-2 rounded">
                <ProjectSelector
                    v-model="defaultProject.id"
                    class="w-1/3"
                    @change="handleProjectChange"
                />
            </div>
        </section>
        <section class="flex items-center justify-between p-6 gap-x-3">
            <AtlanButton
                v-auth="access.DELETE_INTEGRATION"
                color="minimal"
                class="px-0 text-red-500"
                :is-loading="isLoading"
                @click="handleDisconnect"
            >
                Disconnect
            </AtlanButton>
            <!-- v-auth="access.UPDATE_INTEGRATIONS" -->
            <AtlanButton
                :is-loading="updateLoading"
                class="w-16"
                :disabled="!unsavedChanges"
                @click="update"
            >
                Save
            </AtlanButton>
        </section>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        h,
        inject,
        onMounted,
        reactive,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import { useTimeAgo } from '@vueuse/core'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import {
        UpdateIntegration,
        archiveIntegration,
        getIntegrationById,
        refetchIntegration,
    } from '~/composables/integrations/useIntegrations'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import {
        archiveJira,
        listProjects,
    } from '~/composables/integrations/useJira'
    import { integrations } from '~/constant/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'

    export default defineComponent({
        name: 'JiraIntegrationCard',
        components: { AtlanButton, ProjectSelector },
        setup() {
            const { name: tenantName } = useTenantData()

            const store = integrationStore()
            const { updateIntegration: updateStore } = store

            const { tenantJiraStatus } = toRefs(store)

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
                    const errMsg =
                        updateError.value?.response?.data?.errorMessage || ''
                    const generalError = 'Network error'
                    const e = errMsg || generalError
                    message.error({
                        content: e,
                        key: 'save',
                        duration: 2,
                    })
                } else {
                    if (data.value?.id) updateStore(data.value)
                    useAddEvent(
                        'integration',
                        'jira',
                        'default_project_updated'
                    )

                    message.success({
                        content: 'Default project saved.',
                        key: 'save',
                        duration: 2,
                    })
                    unsavedChanges.value = false
                }
            })

            const { description, project_description } = integrations.jira

            const userListAPIParams: any = reactive({
                limit: 1,
                offset: 0,
                sort: 'firstName',
                filter: {
                    $and: [
                        {
                            emailVerified: true,
                        },
                        {
                            username: tenantJiraStatus.value.createdBy,
                        },
                    ],
                },
            })

            const {
                userList,
                isLoading: uLoading,
                error: uError,
            } = useUsers(userListAPIParams, true)

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

            return {
                handleProjectChange,
                defaultProject,
                handleDisconnect,
                useTimeAgo,
                userList,
                project_description,
                description,
                tenantJiraStatus,
                isLoading,
                tenantName,
                updateLoading,
                disconnect,
                update,
                unsavedChanges,
                access,
            }
        },
    })
</script>

<style module lang="less">
    .bg-slack {
        /* background: url('~/assets/images/admin/integrations/add-slack-bg.svg')
            no-repeat;
        background-size: contain;
        background-position-x: right; */
    }
</style>
