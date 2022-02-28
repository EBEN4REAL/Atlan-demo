<template>
    <div
        v-if="
            data.value.ownerUsers?.length < 1 &&
            data.value.ownerGroups?.length < 1
        "
        class="mb-3"
    >
        All Owners removed
    </div>
    <div>
        <p>
            Say <span class="mr-2">👋</span>Hello, to the new
            <b>{{
                data.value.ownerUsers?.length > 1 ||
                data.value.ownerGroups?.length > 1
                    ? 'Owners'
                    : 'Owner'
            }}</b>
        </p>
        <div class="flex flex-wrap gap-1 my-1">
            <template v-for="user in data.value.ownerUsers" :key="user">
                <UserPill
                    :username="user"
                    @click="handleClickUser(user)"
                ></UserPill>
            </template>
            <template v-for="group in data.value.ownerGroups" :key="group">
                <GroupPill
                    :name="group"
                    @click="handleClickGroup(group)"
                ></GroupPill>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    import UserPill from '~/components/common/pills/user.vue'
    import GroupPill from '~/components/common/pills/group.vue'

    export default defineComponent({
        name: 'OwnersActivity',
        components: {
            UserPill,
            GroupPill,
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

            return {
                handleClickUser,
                handleClickGroup,
            }
        },
    })
</script>
