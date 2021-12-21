<template>
    <div class="h-full pb-6">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanIcon icon="Loader" class="h-10 animate-spin" />
        </div>
        <div
            v-if="error"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="absolute top-0 right-0 flex justify-end p-4">
                    <AtlanIcon
                        icon="Cross"
                        class="absolute mt-2 cursor-pointer"
                        @click="$emit('close')"
                    />
                </div>
                <div class="mt-3">
                    <AtlanButton color="secondary" @click="reload">
                        <AtlanIcon icon="Reload" />
                        Try again
                    </AtlanButton>
                </div>
            </ErrorView>
        </div>
        <template v-else-if="isValidEntity">
            <div class="relative flex mx-4 my-5">
                <Avatar
                    v-if="isValidUser"
                    :image-url="updatedImageUrl || imageUrl"
                    :allow-upload="isCurrentUser"
                    :avatar-name="
                        selectedUser.name ||
                        selectedUser.username ||
                        selectedUser.email
                    "
                    :avatar-size="46"
                    :avatar-shape="'square'"
                />
                <div class="w-full ml-4">
                    <div class="flex items-center content-center text-gray-500">
                        <div class="w-4/5">
                            <div
                                class="flex text-base content-center items-center capitalize text-gray-700 font-bold mb-0.5"
                            >
                                <span class="mr-1">{{ title }}</span>
                                <SlackMessageCta
                                    v-if="slackEnabled"
                                    :link="slackUrl"
                                />
                            </div>
                            <span class="text-sm truncate w-28">
                                @{{ name }}
                            </span>
                            <span
                                v-if="details"
                                class="content-center px-2 py-1 ml-2 text-xs text-gray-700 uppercase bg-gray-200 rounded"
                            >
                                {{ details }}
                            </span>
                        </div>
                        <div class="ml-auto">
                            <a-button
                                class="border-0 shadow-none"
                                @click="$emit('close')"
                            >
                                <AtlanIcon icon="Cross" />
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
            <a-tabs
                v-model:activeKey="activeKey"
                tab-position="left"
                class="h-full border-t preview-tab"
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
                        :selected-user="isValidUser ? selectedUser : null"
                        :selected-group="isValidGroup ? selectedGroup : null"
                        @updated-user="() => {
                            userUpdated = true
                        }"
                        @refreshTable="reload"
                        @success="reload"
                        @image-updated="handleImageUpdate"
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
        ref
    } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import Avatar from '@common/avatar/avatar.vue'
    import SidePanelTabHeaders from '@common/tabs/sidePanelTabHeaders.vue'
    import AtlanButton from '@/UI/button.vue'
    import { useUserOrGroupPreview } from '~/composables/drawer/showUserOrGroupPreview'
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/useSlack'
    import SlackMessageCta from '@common/popover/user/slackMessageCta.vue'

    export default defineComponent({
        name: 'UserOrGroupPreview',
        components: {
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
            Avatar,
            ErrorView,
            SidePanelTabHeaders,
            AtlanButton,
            SlackMessageCta,
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
                userUpdated
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
            const userProfiles = computed(() => {
                if (isValidUser.value) {
                    return selectedUser.value?.attributes?.profiles
                }
                return []
            })
            const slackProfile = computed(() => {
                if (userProfiles.value?.length > 0) {
                    const firstProfile = JSON.parse(userProfiles.value[0])
                    if (
                        firstProfile &&
                        firstProfile.length > 0 &&
                        firstProfile[0].hasOwnProperty('slack')
                    ) {
                        return firstProfile[0].slack
                    }
                }
                return ''
            })

            const handleImageUpdate = (newImageUrl) => {
                updatedImageUrl.value = newImageUrl.value
            }

            const slackEnabled = computed(() => slackProfile.value)
            const slackUrl = computed(() =>
                slackEnabled.value
                    ? getDeepLinkFromUserDmLink(slackEnabled.value)
                    : '#'
            )
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
                slackEnabled,
                slackUrl,
                handleImageUpdate,
                updatedImageUrl,
                userUpdated
            }
        },
    })
</script>
