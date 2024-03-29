<template>
    <section>
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" class="">
            <template #label="t">
                {{ t?.data?.label }}
            </template>
        </MinimalTab>
        <template v-if="activeTabKey === 'configuration'">
            <section class="grid items-center grid-cols-2 p-6 gap-y-3">
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
                        :defaultSelect="true"
                        @change="handleProjectChange"
                    />
                </div>
            </section>
        </template>
        <template v-if="activeTabKey === 'overview'">
            <JiraOverview
                :avatar-u-r-l="avatarURL"
                :issueCount="count"
                :user="userList?.length && userList[0]"
                :created-at="tenantJiraStatus.createdAt"
            />
        </template>

        <Footer
            v-model:unsavedChanges="unsavedChanges"
            :default-project="defaultProject"
        />
    </section>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        onMounted,
        reactive,
        ref,
        toRefs,
    } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'

    import integrationStore from '~/store/integrations/index'
    import { integrations } from '~/constant/integrations/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import MinimalTab from '@/UI/minimalTab.vue'
    import JiraOverview from '@/admin/integrations/jira/overview.vue'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'
    import Footer from '@/admin/integrations/jira/integrationCardFooter.vue'
    import { issuesCount } from '~/composables/integrations/jira/useJiraTickets'

    export default defineComponent({
        name: 'JiraIntegrationCard',
        components: {
            JiraOverview,
            ProjectSelector,
            MinimalTab,
            Footer,
        },
        setup() {
            const store = integrationStore()
            const { tenantJiraStatus } = toRefs(store)

            const { project_description } = integrations.jira

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

            const avatarURL = computed(
                () =>
                    `${window.location.origin}/api/service/avatars/${tenantJiraStatus.value.createdBy}`
            )

            const unsavedChanges = ref(false)
            const defaultProject = ref({})

            const handleProjectChange = (value, option, isDefautSet) => {
                if (!value) defaultProject.value = {}
                else {
                    defaultProject.value.id = value
                    defaultProject.value.name = option.label
                }
                if (!isDefautSet) unsavedChanges.value = true
            }

            const activeTabKey = ref()
            const tabConfig = [
                { key: 'configuration', label: 'Configurations' },
                { key: 'overview', label: 'Overview' },
            ]

            const { count } = issuesCount(true, true)

            onMounted(() => {
                activeTabKey.value = 'configuration'
            })

            return {
                count,
                activeTabKey,
                tabConfig,
                unsavedChanges,
                project_description,
                defaultProject,
                handleProjectChange,
                avatarURL,
                useTimeAgo,
                userList,
                tenantJiraStatus,
            }
        },
    })
</script>
