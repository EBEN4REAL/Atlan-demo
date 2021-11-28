<template>
    <div v-if="data.value.length < 1" class="mb-3">All Owners removed</div>
    <div v-else>
        <PillGroup :data="data">
            <template #header
                ><p>
                    Say <span class="mr-2">👋</span>Hello, to the new
                    <b>{{ data.value.length > 1 ? 'Owners' : 'Owner' }}</b>
                </p></template
            >
            <template #pill-content="user">
                <component
                    :is="user.item.type === 'user' ? popovers[0] : popovers[1]"
                    :item="user?.item?.name"
                >
                    <Pill
                        v-if="user.item.name !== ''"
                        :label="user.item.name"
                        @click.stop="
                            user.item.type === 'user'
                                ? handleClickUser(user.item.name)
                                : handleClickGroup(user.item.name)
                        "
                        ><template #prefix>
                            <avatar
                                v-if="
                                    user.item.name && user.item.type === 'user'
                                "
                                class="-ml-2.5"
                                :image-url="
                                    map.GET_AVATAR({
                                        username: user.item.name,
                                    })
                                "
                                :allow-upload="false"
                                :avatar-name="user.item.name"
                                avatar-size="small"
                                :avatar-shape="'circle'"
                            />
                            <AtlanIcon
                                v-else-if="
                                    user.item.name && user.item.type === 'group'
                                "
                                icon="Group"
                                class="
                                    h-4
                                    -ml-0.5
                                    text-primary
                                    group-hover:text-white
                                "
                            /> </template
                    ></Pill>
                </component>
            </template>
        </PillGroup>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, defineAsyncComponent, ref } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    import PillGroup from '../activityPillGroup/index.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { map } from '~/services/service/avatar/key'

    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'OwnersActivity',
        components: {
            PillGroup,
            Pill,
            Avatar,
            PopOverUser: defineAsyncComponent(
                () => import('@/common/popover/user/user.vue')
            ),
            PopOverGroup: defineAsyncComponent(
                () => import('@/common/popover/user/groups.vue')
            ),
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup() {
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            const handleClickGroup = (groupAlias: string) => {
                setGroupUniqueAttribute(groupAlias, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            const popovers = ref(['PopOverUser', 'PopOverGroup'])

            return {
                handleClickUser,
                handleClickGroup,
                map,
                popovers,
            }
        },
    })
</script>
