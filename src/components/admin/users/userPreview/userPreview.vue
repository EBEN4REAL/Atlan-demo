<template>
    <div class="h-full pb-6">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanButton icon="Loader" class="h-5 animate-spin" />
        </div>
        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <AtlanButton
                        color="secondary"
                        @click="
                            () => {
                                getUserList()
                            }
                        "
                    >
                        <AtlanIcon icon="Reload" />
                        Try again
                    </AtlanButton>
                </div>
            </ErrorView>
        </div>
        <template v-else-if="selectedUser && selectedUser.id">
            <div class="relative flex m-6">
                <Avatar
                    :image-url="imageUrl"
                    :allow-upload="isCurrentUser"
                    :avatar-name="
                        selectedUser.name ||
                        selectedUser.uername ||
                        selectedUser.email
                    "
                    :avatar-size="40"
                    :avatar-shape="'circle'"
                />
                <div class="ml-3">
                    <div class="text-xl capitalize text-gray">
                        {{ selectedUser.name }}
                    </div>
                    <AtlanIcon
                        icon="Cross"
                        class="absolute top-0 right-0 cursor-pointer"
                        @click="$emit('close')"
                    />
                    <div class="text-gray-500">
                        <span class="mr-1">@{{ selectedUser.username }}</span>
                        <span
                            v-if="
                                selectedUser.role_object &&
                                selectedUser.role_object.name
                            "
                        >
                            <span class="text-gray-300">|</span>
                            <span class="ml-1">{{
                                selectedUser.role_object.name
                            }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <a-tabs
                v-model:activeKey="activeKey"
                tab-position="left"
                :class="$style.previewtab"
                class="border-t"
            >
                <a-tab-pane v-for="(tab, index) in tabs" :key="tab.key">
                    <template #tab>
                        <SidePanelTabHeaders
                            :title="tab.name"
                            :icon="tab.icon"
                            :is-active="activeKey === tab.key"
                            :active-icon="tab.activeIcon"
                            :class="index === 0 ? 'mt-1' : ''"
                        />
                    </template>
                    <component
                        :is="tab.component"
                        class="px-6 pt-3 overflow-auto"
                        :class="$style.componentHeight"
                        :is-current-user="isCurrentUser"
                        :selected-user="selectedUser"
                        @updatedUser="handleUserUpdate"
                    />
                </a-tab-pane>
            </a-tabs>
        </template>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, computed, defineAsyncComponent } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import whoami from '~/composables/user/whoami'
    import Avatar from '~/components/common/avatar/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUsers } from '~/composables/user/useUsers'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'UserPreview',
        components: {
            About: defineAsyncComponent(() => import('./about.vue')),
            Groups: defineAsyncComponent(() => import('./groups.vue')),
            AccessLogs: defineAsyncComponent(() => import('./accessLogs.vue')),
            Sessions: defineAsyncComponent(() => import('./sessions.vue')),
            Assets: defineAsyncComponent(() => import('./assets.vue')),
            Avatar,
            ErrorView,
            SidePanelTabHeaders,
            AtlanButton,
        },
        emits: ['close'],
        setup(props, context) {
            const {
                userId,
                username: userUsername,
                uniqueAttribute,
                finalTabs,
                defaultTab,
            } = useUserPreview()
            const activeKey = defaultTab
            let filterObj = {}
            if (uniqueAttribute.value === 'username')
                filterObj = {
                    $and: [
                        { email_verified: true },
                        { username: userUsername.value },
                    ],
                }
            else
                filterObj = {
                    $and: [{ email_verified: true }, { id: userId.value }],
                }
            const { userList, getUserList, isLoading, state, STATES } =
                useUsers(
                    {
                        limit: 1,
                        offset: 0,
                        sort: 'first_name',
                        filter: filterObj,
                    },
                    'USE_USERS_PREVIEW'
                )
            const userObj = computed(() =>
                userList && userList.value && userList.value.length
                    ? userList.value[0]
                    : []
            )
            const { username } = whoami()
            const isCurrentUser = computed(
                () => username.value === userObj.value.username
            )
            const imageUrl = computed(() => {
                if (userObj.value && userObj.value.username)
                    return `${window.location.origin}/api/service/avatars/${userObj.value.id}`
                return ''
            })
            const handleUserUpdate = async () => {
                await getUserList()
            }
            return {
                imageUrl,
                isCurrentUser,
                selectedUser: userObj,
                userId,
                tabs: finalTabs,
                handleUserUpdate,
                isLoading,
                state,
                STATES,
                activeKey,
                getUserList,
            }
        },
    })
</script>

<style lang="less" module>
    .componentHeight {
        max-height: calc(100vh - 7rem) !important;
    }
    .previewtab {
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }

        :global(.ant-tabs-bar) {
            margin-bottom: 0px !important;
        }
        :global(.ant-tabs-nav-container) {
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 48px !important;
            @apply p-0 justify-center !important;
        }

        :global(.ant-tabs-content) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }
</style>
