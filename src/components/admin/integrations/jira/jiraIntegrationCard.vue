<template>
    <div class="overflow-hidden border border-gray-300 rounded-lg customShadow">
        <a-menu v-model:openKeys="openKeys" mode="inline" :class="$style.menu">
            <a-sub-menu key="jira">
                <template #expandIcon> <AtlanIcon icon="CaretDown" /></template>
                <template #title>
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
                                    <span class="text-gray-500">{{
                                        description
                                    }}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="px-3 py-1.5 space-y-2 text-primary bg-primary-light rounded"
                        >
                            <div
                                class="flex items-center justify-center text-sm rounded gap-x-1"
                            >
                                <AtlanIcon icon="Check" />
                                {{ tenantJiraStatus.orgName }} workspace
                                connected
                            </div>
                        </div>
                        <div class="">
                            <AtlanIcon
                                icon="CaretDown"
                                class="transition duration-100"
                                :style="
                                    openKeys.includes('jira')
                                        ? 'transform: rotate(180deg)'
                                        : ''
                                "
                            />
                        </div>
                    </section>
                </template>
                <div class="">
                    <MinimalTab
                        v-model:active="activeTabKey"
                        :data="tabConfig"
                        class=""
                    >
                        <template #label="t">
                            {{ t?.data?.label }}
                        </template>
                    </MinimalTab>
                    <template v-if="activeTabKey === 'configuration'">
                        <section
                            class="grid items-center grid-cols-2 p-6 gap-y-3"
                        >
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
                    </template>
                    <template v-if="activeTabKey === 'overview'">
                        <JiraOverview
                            :avatar-u-r-l="avatarURL"
                            :user="userList?.length && userList[0]"
                            :created-at="tenantJiraStatus.createdAt"
                        />
                    </template>

                    <Footer
                        v-model:unsavedChanges="unsavedChanges"
                        :default-project="defaultProject"
                    />
                </div>
            </a-sub-menu>
        </a-menu>
    </div>
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
    import access from '~/constant/accessControl/map'

    import integrationStore from '~/store/integrations/index'
    import { integrations } from '~/constant/integrations/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import MinimalTab from '@/UI/minimalTab.vue'
    import JiraOverview from '@/admin/integrations/jira/overview.vue'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'
    import Footer from '@/admin/integrations/jira/integrationCardFooter.vue'

    export default defineComponent({
        name: 'JiraIntegrationCard',
        components: {
            AtlanButton,
            JiraOverview,
            ProjectSelector,
            MinimalTab,
            Footer,
        },
        setup() {
            const openKeys = ref(['jira'])
            const activeTabKey = ref()
            const tabConfig = [
                { key: 'configuration', label: 'Configurations' },
                { key: 'overview', label: 'Overview' },
            ]
            const { name: tenantName } = useTenantData()
            const store = integrationStore()
            const { tenantJiraStatus } = toRefs(store)

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

            const avatarURL = computed(
                () =>
                    `${window.location.origin}/api/service/avatars/${tenantJiraStatus.value.createdBy}`
            )

            const unsavedChanges = ref(false)
            const defaultProject = ref({ name: '', id: '' })

            const handleProjectChange = (value, option) => {
                defaultProject.value.id = value
                defaultProject.value.name = option.label
                unsavedChanges.value = true
            }

            onMounted(() => {
                activeTabKey.value = 'configuration'

                const {
                    config: { defaultProject: _defaultProject },
                } = tenantJiraStatus.value

                if (_defaultProject) {
                    defaultProject.value.id = _defaultProject.id
                    defaultProject.value.name = _defaultProject.name
                }
            })

            return {
                unsavedChanges,
                project_description,
                defaultProject,
                handleProjectChange,
                avatarURL,
                activeTabKey,
                tabConfig,
                openKeys,
                useTimeAgo,
                userList,
                description,
                tenantJiraStatus,
                tenantName,
            }
        },
    })
</script>

<style lang="less" module>
    .menu {
        div {
            line-height: normal;
        }
        @apply border-none  !important;
        :global(.ant-menu-submenu-title) {
            @apply h-full p-0 m-0 !important;
            :global(.ant-menu-title-content + svg) {
                @apply hidden !important;
            }
        }

        :global(.ant-menu) {
        }

        :global(.ant-menu-inline) {
            @apply bg-white !important;
        }
    }
</style>
