<template>
    <a-popover
        @visibleChange="handleVisibleChange"
        :mouseEnterDelay="0.4"
        placement="left"
    >
        <template #content>
            <div class="relative p-4 groups-popover">
                <div
                    class="absolute top-0 left-0 right-0 z-0 group-cover"
                ></div>
                <div
                    class="z-10 flex flex-col"
                    v-if="!isLoading && selectedGroup.alias === item"
                >
                    <div class="z-10 flex items-center justify-between w-full">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center gap-2">
                                <UserAvatar
                                    :username="item"
                                    style-class="mr-1 border-none bg-primary-light"
                                    className="mb-auto"
                                    :avatarSize="40"
                                    :isGroup="true"
                                ></UserAvatar>
                                <div>
                                    <div
                                        class="flex items-center text-sm font-semibold capitalize"
                                    >
                                        <span>{{ selectedGroup?.name }}</span>
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
                                class="flex-none px-0"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                style="height: fit-content"
                                @click="handleClickGroup"
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
                </div>

                <div
                    class="flex items-center justify-center w-full px-4"
                    v-else
                >
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="w-auto h-8 animate-spin"
                    ></AtlanIcon>
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

    export default {
        name: 'PopoverGroup',
        components: {
            UserPill,
            AtlanBtn,
            UserAvatar,
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
