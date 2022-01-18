<template>
    <a-popover
        @visibleChange="handleVisibleChange"
        :placement="placement"
        :mouseEnterDelay="0.5"
    >
        <template #content>
            <div class="relative p-4 user-popover">
                <div class="absolute top-0 left-0 right-0 z-0 user-cover"></div>
                <div
                    class="z-10 flex flex-col"
                    v-if="!isLoading && selectedUser.username === item"
                >
                    <div class="z-10 flex items-center justify-between w-full">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <UserAvatar
                                    :username="item"
                                    style-class="mr-1 border-none bg-primary-light"
                                    className="mb-auto"
                                    :avatarSize="40"
                                ></UserAvatar>

                                <div class="flex flex-col">
                                    <!-- name & basic details -->
                                    <div>
                                        <div
                                            class="flex items-center text-sm font-semibold capitalize"
                                        >
                                            <span>{{
                                                selectedUser?.name
                                            }}</span>
                                            <span
                                                v-if="userProfiles?.slack"
                                                class="ml-1 text-sm font-semibold"
                                            >
                                                <SlackMessageCta
                                                    :slackLink="
                                                        userProfiles.slack
                                                    "
                                                />
                                            </span>
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            @{{ item }}
                                            <span class="text-gray-400">•</span>
                                            {{ selectedUser?.workspaceRole }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-auto">
                            <AtlanBtn
                                class="flex-none px-0"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                style="height: fit-content"
                                @click="handleClickViewUser"
                            >
                                <span class="text-primary whitespace-nowrap">
                                    View Profile</span
                                >
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="text-primary"
                                />
                            </AtlanBtn>
                        </div>
                    </div>

                    <div
                        class="flex gap-2"
                        v-if="selectedUser?.personaList?.length > 0"
                    >
                        <div class="" style="visibility: hidden">
                            <UserAvatar
                                :username="item"
                                className="mb-auto"
                                :avatarSize="40"
                            ></UserAvatar>
                        </div>
                        <div class="z-10 mt-5">
                            <div class="text-sm text-gray-500">Personas</div>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="persona in selectedUser?.personaList"
                                    :key="persona"
                                    class="flex px-2 tracking-wide text-gray-500 border rounded-full"
                                    >{{ persona }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-center w-full px-4"
                    v-else
                >
                    <AtlanLoader v-if="isLoading" class="h-8" />
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

            const userProfiles = computed(() => {
                return getUserProfiles(selectedUser.value)
            })

            return {
                selectedUser,
                isLoading,
                handleClickViewUser,
                handleVisibleChange,
                getUserList,
                getUserProfiles,
                userProfiles,
            }
        },
    }
</script>
<style lang="less" scoped>
    .user-popover {
        width: 370px;
    }
    .user-cover {
        opacity: 0.6;
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
        height: 4rem;
    }
</style>
