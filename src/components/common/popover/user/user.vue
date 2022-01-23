<template>
    <a-popover
        :placement="placement"
        :mouse-enter-delay="0.5"
        @visibleChange="handleVisibleChange"
    >
        <template #content>
            <div class="relative p-4 user-popover">
                <div
                    v-if="
                        !sessionInfoLoading &&
                        !isLoading &&
                        selectedUser.username === item
                    "
                    class="z-10 flex flex-col gap-y-2"
                >
                    <div
                        class="absolute top-0 left-0 right-0 user-cover opacity-60"
                    ></div>
                    <div class="flex justify-between w-full h-16">
                        <div class="z-10 flex justify-between">
                            <div class="flex gap-2">
                                <UserAvatar
                                    :username="item"
                                    style-class="mr-1 border-none bg-primary-light"
                                    class-name="mb-auto"
                                    :avatar-size="40"
                                ></UserAvatar>

                                <div class="flex flex-col">
                                    <!-- name & basic details -->
                                    <div>
                                        <div
                                            class="flex text-sm font-semibold capitalize"
                                        >
                                            <span>{{
                                                selectedUser?.name
                                            }}</span>
                                            <!-- <span
                                                v-if="userProfiles?.slack"
                                                class="ml-1 text-sm font-semibold"
                                            > -->
                                            <SlackMessageCta
                                                :entity="selectedUser"
                                                class="ml-1 text-sm font-semibold"
                                            />
                                            <!-- </span> -->
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            @{{ item }}
                                            <span class="mx-1 text-gray-400"
                                                >•</span
                                            >
                                            {{ selectedUser?.workspaceRole }}
                                        </div>
                                        <span
                                            v-if="lastActiveTime"
                                            class="text-sm text-gray-600"
                                        >
                                            <!-- <span class="mx-1 text-gray-400"
                                                >•</span
                                            > -->
                                            <a-tooltip placement="bottom">
                                                <template #title>
                                                    {{
                                                        lastActiveTime
                                                    }}</template
                                                >
                                                <span class=""
                                                    >Active
                                                    {{
                                                        lastActiveTimeAgo
                                                    }}</span
                                                >
                                            </a-tooltip>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="z-10 mb-auto">
                            <AtlanBtn
                                class="flex-none bg-white text-blueGray p-1.5 border-gray-300 border rounded-md"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                style="height: fit-content"
                                @click="handleClickViewUser"
                            >
                                <!-- <span class="text-primary whitespace-nowrap">
                                    View Profile</span
                                > -->

                                <!-- <AtlanIcon
                                    icon="ArrowRight"
                                    class="text-primary"
                                /> -->
                                <AtlanIcon icon="OpenPreview" />
                            </AtlanBtn>
                        </div>
                    </div>

                    <div
                        v-if="selectedUser?.personaList?.length > 0"
                        class="flex gap-2"
                    >
                        <div class="" style="visibility: hidden">
                            <UserAvatar
                                :username="item"
                                class-name="mb-auto"
                                :avatar-size="40"
                            ></UserAvatar>
                        </div>
                        <div class="z-10">
                            <div class="text-sm text-gray-500">Personas</div>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="persona in selectedUser?.personaList"
                                    :key="persona"
                                    class="flex px-2 tracking-wide text-gray-500 border rounded-full"
                                    >{{
                                        persona?.displayName ||
                                        persona?.name ||
                                        ''
                                    }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-else
                    class="flex items-center justify-center w-full px-4"
                >
                    <AtlanLoader
                        v-if="isLoading || sessionInfoLoading"
                        class="h-8"
                    />
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed, watch, ref } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUsers } from '~/composables/user/useUsers'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import useUserPopover from './composables/useUserPopover'
    import SlackMessageCta from './slackMessageCta.vue'
    import UserAvatar from '@/common/avatar/user.vue'
    import AtlanBtn from '@/UI/button.vue'
    import getUserLastSession from '~/composables/user/getUserLastSession'

    export default {
        name: 'PopoverUser',
        components: { AtlanIcon, SlackMessageCta, UserAvatar, AtlanBtn },
        props: {
            item: {
                type: String,
                required: false,
                default: '',
            },
            visible: {
                type: Boolean,
                required: false,
                default: false,
            },
            placement: {
                type: String,
                required: false,
                default: 'left',
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)

            const { setUserUniqueAttribute, showUserPreview, getUserProfiles } =
                useUserPreview()
            const params = {
                limit: 1,
                offset: 0,
                filter: {
                    $and: [{ username: item.value }],
                },
            }
            const { userList, isLoading, getUserList } = useUsers(params, false)
            const selectedUser = computed(() =>
                userList && userList.value && userList.value.length
                    ? userList.value[0]
                    : {}
            )
            const handleClickViewUser = () => {
                setUserUniqueAttribute(item.value, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            const handleVisibleChange = (state) => {
                if (state) {
                    getUserList()
                }
            }
            const userProfiles = computed(() =>
                getUserProfiles(selectedUser.value)
            )

            const userID = computed(() => selectedUser?.value?.id ?? '')
            const {
                lastActiveTime,
                lastActiveTimeAgo,
                fetchUserSessions: getLastSession,
                isLoading: sessionInfoLoading,
            } = getUserLastSession(userID)
            watch(
                selectedUser,
                () => {
                    if (selectedUser?.value?.id) getLastSession()
                },
                { deep: true, immediate: true }
            )
            return {
                selectedUser,
                isLoading,
                handleClickViewUser,
                handleVisibleChange,
                getUserList,
                getUserProfiles,
                userProfiles,
                lastActiveTime,
                lastActiveTimeAgo,
                sessionInfoLoading,
            }
        },
    }
</script>
<style lang="less" scoped>
    .user-popover {
        width: 370px;
    }
    .user-cover {
        // curved lines
        background: url('https://storage.googleapis.com/subtlepatterns-production/designers/subtlepatterns/uploads/round.png');

        // gray lines
        // background: url(https://storage.googleapis.com/subtlepatterns-production/designers/subtlepatterns/uploads/memphis-mini.png);

        // dark blue
        // background: url("https://storage.googleapis.com/subtlepatterns-production/designers/subtlepatterns/uploads/circle-blues.png");

        // dark blue 2
        // background: url("https://storage.googleapis.com/subtlepatterns-production/designers/subtlepatterns/uploads/dark-paths.png");

        // black
        // background: url("https://storage.googleapis.com/subtlepatterns-production/designers/subtlepatterns/uploads/fancy-cushion.png");

        background-repeat: no-repeat;
        background-size: cover;
        height: 5rem;
    }
</style>
