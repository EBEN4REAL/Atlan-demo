<template>
    <a-popover
        @visibleChange="handleVisibleChange"
        placement="left"
        :mouseEnterDelay="0.2"
        :mouseLeaveDelay="0.2"
    >
        <template #content>
            <div class="user-popover">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 mt-2">
                        <UserAvatar
                            :username="item"
                            style-class="mr-1 border-none bg-primary-light "
                            :avatarSize="40"
                        ></UserAvatar>
                        <div>
                            <div
                                class="flex items-center text-sm font-semibold capitalize"
                            >
                                <span>{{ selectedUser.name }}</span>
                                <span
                                    v-if="userProfiles?.slack"
                                    class="ml-2 text-sm font-semibold"
                                >
                                    <SlackMessageCta
                                        :slackLink="userProfiles.slack"
                                    />
                                </span>
                            </div>
                            <div class="text-xs text-gray-500">
                                {{ selectedUser.username }}
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex px-2 py-1 tracking-wide text-gray-500 bg-gray-100 border rounded"
                    >
                        {{ selectedUser.workspaceRole }}
                    </div>
                </div>

                <div v-if="selectedUser.personaList?.length > 0" class="mt-3">
                    <div class="text-xs text-gray-500">Personas</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            v-for="persona in selectedUser.personaList"
                            :key="persona"
                            class="flex px-2 py-1 tracking-wide text-gray-500 bg-gray-100 border rounded"
                            >{{ persona }}</span
                        >
                    </div>
                </div>
                <a-button class="mt-3" block @click="handleClickViewUser">
                    View Profile
                    <AtlanIcon icon="Enter" class="ml-1 mb-0.5" />
                </a-button>
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

    export default {
        name: 'PopoverUser',
        components: { AtlanIcon, SlackMessageCta, UserAvatar },
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
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)

            const { setUserUniqueAttribute, showUserPreview } = useUserPreview()
            const params = {
                limit: 1,
                offset: 0,
                filter: {
                    $and: [{ username: item.value }],
                },
            }
            const { userList, isLoading, getUserList } = useUsers(params, '')
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

            const { getUserProfiles } = useUserPopover('user', item.value)
            const userProfiles = computed(() => {
                console.log(
                    'selectedUser',
                    selectedUser.value.attributes?.profiles
                )
                if (selectedUser.value.attributes?.profiles) {
                    console.log(
                        'parsed json',
                        JSON.parse(selectedUser.value.attributes?.profiles)[0]
                    )
                }
                return getUserProfiles(selectedUser?.value)
            })

            return {
                selectedUser,
                isLoading,
                handleClickViewUser,
                handleVisibleChange,
                getUserList,
                userProfiles,
            }
        },
    }
</script>
<style lang="less" scoped>
    .user-popover {
        width: 370px;
        padding: 16px;
    }
</style>
