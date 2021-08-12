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
                                getUser();
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <div v-else-if="selectedUser && selectedUser.id">
            <div class="flex px-6 mb-3">
                <avatar
                    :image-url="imageUrl"
                    :allow-upload="isCurrentUser"
                    :avatar-name="
                        selectedUser.name ||
                            selectedUser.uername ||
                            selectedUser.email
                    "
                    :avatar-size="48"
                    class="mr-2"
                />
                <div class="ml-3">
                    <div class="text-lg font-bold capitalize text-gray">
                        {{ selectedUser.name }}
                    </div>
                    <div class="text-gray">
                        <span class="mr-0.25"
                            >@{{ selectedUser.username }}</span
                        >
                        <span v-if="selectedUser.created_at_time_ago">
                            |
                            <span class="ml-0.25"
                                >Created
                                {{ selectedUser.created_at_time_ago }}</span
                            >
                        </span>
                    </div>
                </div>
            </div>
            <a-tabs
                :default-active-key="activeKey"
                :tab-bar-style="{ paddingLeft: '1rem', paddingRight: '1rem' }"
            >
                <a-tab-pane v-for="tab in tabs" :key="tab.name">
                    <template #tab>
                        <span class="mb-0">{{ tab.name }}</span>
                    </template>
                    <component
                        :is="tab.component"
                        class="px-6 overflow-auto component-height"
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
    import { defineComponent, ref, computed } from 'vue';
    import ErrorView from '@common/error/index.vue';
    import {
        getNameInitials,
        getNameInTitleCase,
    } from '~/composables/utils/string-operations';
    import About from './about.vue';
    import Groups from './groups.vue';
    import AccessLogs from './accessLogs.vue';
    import Sessions from './sessions.vue';
    import Assets from './assets.vue';
    import whoami from '~/composables/user/whoami';
    import Avatar from '~/components/common/avatar.vue';
    import { useUserPreview } from '~/composables/user/showUserPreview';
    import { useUser } from '~/composables/user/useUsers';

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
        },
        setup(props, context) {
            const {
                userId,
                username: userUsername,
                uniqueAttribute,
                finalTabs,
                defaultTab,
            } = useUserPreview();
            const activeKey = defaultTab;
            let filterObj = {};
            if (uniqueAttribute.value === 'username')
                filterObj = {
                    $and: [
                        { email_verified: true },
                        { username: userUsername.value },
                    ],
                };
            else
                filterObj = {
                    $and: [{ email_verified: true }, { id: userId.value }],
                };
            const { userList, getUser, isLoading, state, STATES } = useUser({
                limit: 1,
                offset: 0,
                sort: 'first_name',
                filter: filterObj,
            });
            const userObj = computed(() => userList && userList.value && userList.value.length
                    ? userList.value[0]
                    : []);
            const { username } = whoami();
            const isCurrentUser = computed(() => username.value === userObj.value.username);
            const imageUrl = computed(() => {
                if (userObj.value && userObj.value.username)
                    return `http://localhost:3333/api/auth/tenants/default/avatars/${userObj.value.username}`;
                return '';
            });
            const handleUserUpdate = async () => {
                await getUser();
            };
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
            };
        },
    });
</script>

<style lang="less" scoped>
    .component-height {
        max-height: calc(100vh - 12rem);
    }
</style>
