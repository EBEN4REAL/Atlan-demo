<template>
    <div class="h-full py-6">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <a-spin />
        </div>
        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        ghost
                        @click="
                            () => {
                                getUser()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <div v-else-if="selectedUser && selectedUser.id">
            <div class="flex px-6 pb-6 border-b">
                <avatar
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
            >
                <a-tab-pane v-for="(tab, index) in tabs" :key="tab.key">
                    <template #tab>
                        <SidePanelTabHeaders
                            :title="tab.name"
                            :icon="tab.icon"
                            :isActive="activeKey === tab.key"
                            :activeIcon="tab.activeIcon"
                            :class="index === 0 ? 'mt-1' : ''"
                        />
                    </template>
                    <component
                        :is="tab.component"
                        class="px-6 pt-3 overflow-auto component-height"
                        :is-current-user="isCurrentUser"
                        :selected-user="selectedUser"
                        @updatedUser="handleUserUpdate"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import ErrorView from '@common/error/index.vue'
import {
    getNameInitials,
    getNameInTitleCase,
} from '~/composables/utils/string-operations'
import About from './about.vue'
import Groups from './groups.vue'
import AccessLogs from './accessLogs.vue'
import Sessions from './sessions.vue'
import Assets from './assets.vue'
import whoami from '~/composables/user/whoami'
import Avatar from '~/components/common/avatar.vue'
import { useUserPreview } from '~/composables/user/showUserPreview'
import { useUser } from '~/composables/user/useUsers'
import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'

export default defineComponent({
    name: 'UserPreview',
    components: {
        About,
        Groups,
        AccessLogs,
        Sessions,
        Assets,
        Avatar,
        ErrorView,
        SidePanelTabHeaders,
    },
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
        const { userList, getUser, isLoading, state, STATES } = useUser({
            limit: 1,
            offset: 0,
            sort: 'first_name',
            filter: filterObj,
        })
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
            await getUser()
        }
        return {
            getNameInitials,
            getNameInTitleCase,
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
            getUser,
        }
    },
})
</script>

<style lang="less" module>
.component-height {
    max-height: calc(100vh - 12rem);
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
        @apply p-0 !important;
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
