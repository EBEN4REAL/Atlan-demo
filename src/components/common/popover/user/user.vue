<template>
    <a-popover
        :placement="placement"
        :mouse-enter-delay="0.5"
        @visibleChange="handleVisibleChange"
    >
        <template #content>
            <div
                v-if="
                    item !== 'service-account-atlan-argo' ||
                    !item?.startsWith('service-account-apikey-')
                "
                class="relative p-4 user-popover"
            >
                <div
                    v-if="!isLoading && selectedUser.username === item"
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
                                            <span class="mr-2">{{
                                                selectedUser?.name 
                                            }} 
                                            </span>
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
                                            {{selectedUser.enabled ? selectedUser?.workspaceRole : '' }}
                                            <button class="rounded bg-new-red-100 px-2 text-xs pb-px text-new-red-400 tracking-wider font-bold" v-if="!selectedUser.enabled" style="padding-top: 3px">DISABLED</button>
                                        </div>
                                        <!-- <span
                                            v-if="
                                                selectedUser?.last_active_time
                                            "
                                            class="text-sm text-gray-600"
                                        >
                                            <span class="mx-1 text-gray-400"
                                                >•</span
                                            >
                                            <a-tooltip placement="bottom">
                                                <template #title>
                                                    {{
                                                        selectedUser?.last_active_time
                                                    }}</template
                                                >
                                                <span class=""
                                                    >Active
                                                    {{
                                                        selectedUser?.last_active_time_ago_short_notation
                                                    }}</span
                                                >
                                            </a-tooltip>
                                        </span> -->
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
                    <div
                        v-if="selectedUser?.purposes?.length > 0"
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
                            <div class="text-sm text-gray-500">Purposes</div>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="purpose in selectedUser?.purposes"
                                    :key="purpose"
                                    class="flex px-2 tracking-wide text-gray-500 border rounded-full"
                                    >{{
                                        purpose?.displayName ||
                                        purpose?.name ||
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
                    <AtlanLoader v-if="isLoading" class="h-8" />
                </div>
            </div>
            <div v-else class="relative p-4 user-popover atlan-home-cursor">
                <div class="z-10 flex flex-col gap-y-2">
                    <div
                        class="absolute top-0 left-0 right-0 user-cover-atlan opacity-60"
                    ></div>
                    <div class="flex atlan-home-cursor">
                        <img
                            :src="atlanLogo"
                            class="z-10 h-8 mr-3 rounded-full"
                        />
                        <div class="z-10 flex flex-col">
                            <!-- name & basic details -->
                            <div>
                                <div
                                    class="flex text-sm font-semibold capitalize"
                                >
                                    <span>Atlan</span>
                                </div>
                                <!-- <div class="text-sm text-gray-600">
                                    <span class="mx-1 text-gray-400">•</span>
                                    {{ selectedUser?.workspaceRole }}
                                </div> -->
                                <span class="text-sm text-gray-600">
                                    <!-- <span class="mx-1 text-gray-400"
                                                        >•</span
                                                    > -->
                                    <a-tooltip placement="bottom">
                                        <span class=""
                                            >Home for your data team
                                        </span>
                                    </a-tooltip>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col mt-2">
                        <!-- <span class="font-bold">Hello 👋</span> -->
                        <span class="font-bold">Hello {{ userName }} 👋</span>
                        <span>
                            Looks like you’re curious! If you have questions
                            <span
                                class="cursor-pointer text-primary hover:underline"
                                @click="toggleHelpWidget"
                                >reach out to us</span
                            >
                            or visit our
                            <a
                                class="cursor-pointer text-primary hover:underline"
                                target="_blank"
                                href="https://ask.atlan.com"
                                >documentation</a
                            >.
                        </span>
                        <!-- <span class="mt-2 font-bold text-pink-400"
                            >Or just listen to some music 🎵🎼🎸🎧🎶🎹</span
                        > -->
                        <span class="mt-4 font-bold text-pink-500"
                            >Or just listen to some music 🎵</span
                        >
                        <div>
                            <iframe
                                style="border-radius: 12px"
                                src="https://open.spotify.com/embed/track/1J6bub4kiTe4h0RCo9IszE?utm_source=generator&theme=0"
                                width="100%"
                                height="80"
                                frameBorder="0"
                                allowfullscreen=""
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            ></iframe>
                            <!-- <iframe
                                style="border-radius: 12px"
                                src="https://open.spotify.com/embed/playlist/2ecfGG52m1APXqXaG15muN?utm_source=generator"
                                width="100%"
                                height="80"
                                frameBorder="0"
                                allowfullscreen=""
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            ></iframe> -->
                        </div>
                    </div>
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
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import SlackMessageCta from './slackMessageCta.vue'
    import UserAvatar from '@/common/avatar/user.vue'
    import AtlanBtn from '@/UI/button.vue'
    import atlanLogo from '~/assets/images/source/atlan-logo.jpeg'
    import useHelpWidget from '~/composables/helpCenter/useHelpWidget'
    import useUserData from '~/composables/user/useUserData'

    export default {
        name: 'PopoverUser',
        components: { AtlanIcon, SlackMessageCta, UserAvatar, AtlanBtn },
        props: {
            item: {
                type: String,
                required: true,
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
            const { toggleHelpWidget } = useHelpWidget()
            const { firstName: userName } = useUserData()

            return {
                selectedUser,
                isLoading,
                handleClickViewUser,
                handleVisibleChange,
                getUserList,
                getUserProfiles,
                userProfiles,
                atlanLogo,
                toggleHelpWidget,
                userName,
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
        height: 5rem;
        background-size: cover;
    }

    .user-cover-atlan {
        // curved lines
        background: url('https://storage.googleapis.com/subtlepatterns-production/designers/subtlepatterns/uploads/round.png');
        background-repeat: no-repeat;
        height: 4rem;
        background-size: cover;
    }
    .atlan-home-cursor {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🏡</text></svg>")
                16 0,
            auto;
    }
</style>
