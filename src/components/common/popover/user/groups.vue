<template>
    <a-popover
        :mouse-enter-delay="0.4"
        placement="left"
        @visibleChange="handleVisibleChange"
    >
        <template #content>
            <div class="relative p-4 groups-popover">
                <div
                    class="absolute top-0 left-0 right-0 z-0 group-cover"
                ></div>
                <div
                    v-if="!isLoading && selectedGroup.alias === item"
                    class="z-10 flex flex-col gap-y-4"
                >
                    <div class="z-10 flex items-center justify-between w-full">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center gap-2">
                                <UserAvatar
                                    :username="item"
                                    style-class="mr-1 border-none bg-primary-light"
                                    class-name="mb-auto"
                                    :avatar-size="40"
                                    :is-group="true"
                                ></UserAvatar>
                                <div>
                                    <div
                                        class="flex items-center text-sm font-semibold capitalize"
                                    >
                                        <span>{{ selectedGroup?.name }}</span>
                                        <SlackMessageCta
                                            :entity="selectedGroup"
                                            class="ml-1 text-sm font-semibold"
                                        />
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        @{{ item }}
                                        <span class="text-gray-400">•</span>
                                        {{ selectedGroup?.memberCount }} users
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-auto">
                            <AtlanBtn
                                class="flex-none bg-white text-blueGray p-1.5 border-gray-300 border rounded-md"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                style="height: fit-content"
                                @click="handleClickGroup"
                            >
                                <!-- <span class="text-primary whitespace-nowrap">
                                    View Profile</span
                                >
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="text-primary"
                                /> -->
                                <AtlanIcon icon="OpenPreview" />
                            </AtlanBtn>
                        </div>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <div
                            v-if="selectedGroup?.personas?.length > 0"
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
                                <div class="text-sm text-gray-500">
                                    Personas
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="persona in selectedGroup?.personas"
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
                            v-if="selectedGroup?.purposes?.length > 0"
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
                                <div class="text-sm text-gray-500">
                                    Purposes
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="purpose in selectedGroup?.purposes"
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
                </div>

                <div
                    v-else
                    class="flex items-center justify-center w-full px-4"
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
    import UserPill from '@/common/pills/user.vue'
    import { useGroup } from '~/composables/group/useGroups'
    import useGroupMembers from '~/composables/group/useGroupMembers'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import useUserPopover from './composables/useUserPopover'
    import AtlanBtn from '@/UI/button.vue'
    import UserAvatar from '@/common/avatar/user.vue'
    import SlackMessageCta from './slackMessageCta.vue'

    export default {
        name: 'PopoverGroup',
        components: {
            UserPill,
            AtlanBtn,
            UserAvatar,
            SlackMessageCta,
        },
        props: {
            item: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)

            const params = {
                limit: 1,
                offset: 0,
                filter: {
                    $and: [{ name: item.value }],
                },
            }

            const { groupList, isLoading, getGroupList } = useGroup(
                params,
                false
            )

            const selectedGroup = computed(() =>
                groupList && groupList.value && groupList.value.length
                    ? groupList.value[0]
                    : {}
            )

            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickGroup = () => {
                setGroupUniqueAttribute(item.value, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            const handleVisibleChange = (state) => {
                if (state) {
                    getGroupList()
                }
            }

            return {
                selectedGroup,
                handleClickGroup,
                isLoading,
                handleVisibleChange,
                getGroupList,
            }
        },
    }
</script>
<style lang="less" scoped>
    .groups-popover {
        width: 370px;
    }
    .group-cover {
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
