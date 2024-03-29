<template>
    <div class="relative h-full pb-6">
        <Shortcut
            shortcut-key="esc"
            action="close"
            placement="left"
            :delay="0.4"
            :edit-permission="true"
        >
            <div class="close-btn-sidebar" @click="$emit('close')">
                <AtlanIcon icon="Add" class="text-white outline-none" />
            </div>
        </Shortcut>

        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-if="error"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <AtlanButton2
                        color="secondary"
                        label="Try again"
                        prefix-icon="Retry"
                        @click="reload"
                    />
                </div>
            </ErrorView>
        </div>
        <template v-else-if="!isLoading && isValidEntity">
            <div class="relative flex items-center py-4">
                <Avatar
                    v-if="isValidUser"
                    :image-url="updatedImageUrl || imageUrl"
                    :allow-upload="false"
                    :avatar-name="
                        selectedUser.name ||
                        selectedUser.username ||
                        selectedUser.email
                    "
                    :avatar-size="40"
                    :avatar-shape="'square'"
                    class="px-3"
                />
                <div
                    v-else-if="isValidGroup"
                    class="p-2 mx-3 rounded bg-primary-light"
                >
                    <AtlanIcon icon="GroupActive" class="h-6" />
                </div>

                <div class="w-full">
                    <div class="flex content-center pr-3 text-gray-500">
                        <div class="">
                            <div
                                class="flex text-base content-center items-center capitalize text-gray-700 mb-0.5"
                            >
                                <span class="mr-1 font-bold">{{ title }}</span>
                                <SlackMessageCta
                                    :entity="selectedGroup || selectedUser"
                                />
                                <span
                                    v-if="
                                        isValidGroup &&
                                        selectedGroup.isDefault === 'true'
                                    "
                                    class="px-2 py-1 ml-1 text-xs rounded-full bg-blue-50 text-gray"
                                >
                                    Default
                                </span>
                            </div>
                            <span class="mr-1 text-sm truncate w-28">
                                {{ name }}
                            </span>

                            <span v-if="details" class="mr-1 text-sm">
                                <span class="text-gray-300">&bull;</span>
                                <span class="ml-1">
                                    {{
                                        previewType === 'user'
                                            ? selectedUser?.enabled
                                                ? details
                                                : ''
                                            : details
                                    }}
                                    <button
                                        v-if="
                                            !selectedUser?.enabled &&
                                            previewType === 'user'
                                        "
                                        class="px-2 pb-px text-xs font-bold tracking-wider rounded bg-new-red-100 text-new-red-400"
                                        style="padding-top: 3px"
                                    >
                                        DISABLED
                                    </button>
                                </span>
                            </span>
                            <span
                                v-if="
                                    previewType === 'user' &&
                                    selectedUser?.emailVerified === false
                                "
                                class="mr-1 text-sm"
                            >
                                <span class="text-gray-300">&bull;</span>
                                <span class="ml-1">Invited</span>
                            </span>
                            <span
                                v-if="
                                    selectedUser?.last_active_time &&
                                    ((selectedUser?.enabled &&
                                        previewType === 'user') ||
                                        previewType === 'group')
                                "
                                class="text-sm"
                            >
                                <span class="text-gray-300">&bull;</span>
                                <a-tooltip placement="bottom">
                                    <template #title>
                                        {{ selectedUser.last_active_time }}
                                    </template>
                                    <span class="ml-1">
                                        Active
                                        {{
                                            selectedUser.last_active_time_ago_short_notation
                                        }}
                                    </span>
                                </a-tooltip>
                            </span>
                        </div>
                        <div v-auth="map.UPDATE_GROUP" class="ml-auto">
                            <a-button-group v-if="previewType === 'group'">
                                <MemberPopover
                                    :selected-group="selectedGroup"
                                    @members-added="handleMemberAdded"
                                >
                                    <template #label>
                                        <AtlanButton2
                                            color="secondary"
                                            prefix-icon="Add"
                                            class="rounded-md rounded-r-none py-2 px-1.5 text-sm"
                                            label="Add Users"
                                        />
                                    </template>
                                </MemberPopover>
                                <AtlanButton2
                                    class="rounded-md border-l-0 rounded-l-none py-2 px-1.5"
                                    color="secondary"
                                    prefix-icon="Edit"
                                    @click="
                                        () => {
                                            handleChangeTab('about')
                                            changeTogleEdit(true)
                                        }
                                    "
                                />
                            </a-button-group>
                        </div>
                        <!-- <div class="ml-auto">
                            <a-button
                                class="border-0 shadow-none"
                                @click="$emit('close')"
                            >
                                <AtlanIcon icon="Cross" />
                            </a-button>
                        </div> -->
                    </div>
                </div>
            </div>
            <a-tabs
                v-model:activeKey="activeKey"
                tab-position="left"
                class="h-full border-t"
                :destroy-inactive-tab-pane="true"
                :class="$style.previewtab"
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
                        class="h-full pt-3"
                        :is-current-user="isValidUser ? isCurrentUser : null"
                        :is-loading="isLoading"
                        :selected-user="isValidUser ? selectedUser : null"
                        :selected-group="isValidGroup ? selectedGroup : null"
                        @updated-user="
                            () => {
                                userUpdated = true
                            }
                        "
                        @refreshTable="reload"
                        @success="reload"
                        @image-updated="handleImageUpdate"
                        @changeTab="handleChangeTab"
                    />
                </a-tab-pane>
            </a-tabs>
        </template>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        computed,
        toRefs,
        ref,
        watch,
    } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import Avatar from '@common/avatar/avatar.vue'
    import SidePanelTabHeaders from '@common/tabs/sidePanelTabHeaders.vue'
    import SlackMessageCta from '@common/popover/user/slackMessageCta.vue'
    import AtlanButton from '@/UI/button.vue'
    import { useUserOrGroupPreview } from '~/composables/drawer/showUserOrGroupPreview'
    import Shortcut from '@/common/popover/shortcut.vue'
    import MemberPopover from '@/admin/groups/groupPreview/memberPopover.vue'
    import map from '~/constant/accessControl/map'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    export default defineComponent({
        name: 'UserOrGroupPreview',
        components: {
            MemberPopover,
            UserAbout: defineAsyncComponent(
                () => import('../users/userPreview/about.vue')
            ),
            Groups: defineAsyncComponent(
                () => import('../users/userPreview/groups.vue')
            ),
            AccessLogs: defineAsyncComponent(
                () => import('../users/userPreview/accessLogs.vue')
            ),
            Sessions: defineAsyncComponent(
                () => import('../users/userPreview/sessions.vue')
            ),
            UserAssets: defineAsyncComponent(
                () => import('../users/userPreview/assets.vue')
            ),
            GroupAbout: defineAsyncComponent(
                () => import('../groups/groupPreview/about.vue')
            ),
            Members: defineAsyncComponent(
                () => import('../groups/groupPreview/members.vue')
            ),
            Assets: defineAsyncComponent(
                () => import('@/admin/users/userPreview/assets.vue')
            ),
            Integrations: defineAsyncComponent(
                () =>
                    import(
                        '@/admin/users/userPreview/integrations/integrations.vue'
                    )
            ),
            Avatar,
            ErrorView,
            SidePanelTabHeaders,
            AtlanButton,
            SlackMessageCta,
            Shortcut,
        },
        props: {
            previewType: {
                type: String,
                required: true,
            },
        },
        emits: ['close'],
        setup(props) {
            // Is it a user preview drawer or a group one.
            const { previewType } = toRefs(props)
            const updatedImageUrl = ref(null)
            const isUserPreview = computed(() => previewType.value === 'user')
            const { changeTogleEdit, lastUpdate } = useGroupPreview()
            const {
                isLoading,
                error,
                selectedUser,
                selectedGroup,
                isCurrentUser,
                reload,
                handleUpdate,
                tabs,
                imageUrl,
                activeKey,
                userUpdated,
            } = useUserOrGroupPreview(previewType.value)

            const isValidUser = computed(() =>
                Boolean(
                    selectedUser && selectedUser.value && selectedUser.value.id
                )
            )
            const isValidGroup = computed(() =>
                Boolean(
                    selectedGroup &&
                        selectedGroup.value &&
                        selectedGroup.value.id
                )
            )
            const isValidEntity = computed(() =>
                isUserPreview.value ? isValidUser.value : isValidGroup.value
            )
            /**
             * A utility function for obtaining a property given a key.
             * @param {string} userKey
             * @param {string} groupKey
             * @return {string}
             */
            const getUserOrGroupValue = (
                userKey: string,
                groupKey: string
            ): string => {
                if (isValidUser.value) {
                    return selectedUser.value[userKey]
                }
                if (isValidGroup.value) {
                    return selectedGroup.value[groupKey]
                }
                return ''
            }

            // The title of the drawer.
            const title = computed(() => getUserOrGroupValue('name', 'name'))

            // The name, maybe a username or a group alias.
            const name = computed(() =>
                getUserOrGroupValue('username', 'alias')
            )

            // The details to be displayed.
            const details = computed(() => {
                if (isValidUser.value) {
                    return selectedUser.value.role_object &&
                        selectedUser.value.role_object.name
                        ? selectedUser.value.role_object.name
                        : ''
                }
                if (isValidGroup.value) {
                    return selectedGroup.value.memberCountString
                        ? selectedGroup.value.memberCountString
                        : ''
                }
                return ''
            })
            const handleImageUpdate = (newImageUrl) => {
                updatedImageUrl.value = newImageUrl.value
            }
            const handleChangeTab = (tabKey) => {
                activeKey.value = tabKey
            }
            const handleMemberAdded = async () => {
                try {
                    await reload()
                    lastUpdate.value = new Date()
                    handleChangeTab('members')
                } catch (er) {
                    console.log(er)
                }
            }
            return {
                tabs,
                isValidEntity,
                isValidUser,
                isValidGroup,
                reload,
                title,
                name,
                details,
                isLoading,
                error,
                selectedUser,
                selectedGroup,
                isCurrentUser,
                handleUpdate,
                activeKey,
                imageUrl,
                handleImageUpdate,
                updatedImageUrl,
                userUpdated,
                handleChangeTab,
                map,
                changeTogleEdit,
                handleMemberAdded,
            }
        },
    })
</script>
<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-left) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                @apply justify-center;
            }

            :global(.ant-tabs-nav-wrap) {
                @apply pt-3;
            }

            :global(.ant-tabs-content) {
                @apply px-0 h-full !important;
            }
            :global(.ant-tabs-ink-bar) {
                @apply rounded-t-sm;
                margin-bottom: 1px;
            }
            :global(.ant-tabs-tabpane) {
                @apply px-0 !important;
                @apply pb-0 !important;
                @apply h-full !important;
            }

            :global(.ant-tabs-content-holder) {
                @apply h-full !important;
            }
        }
    }
</style>
