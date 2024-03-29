<template>
    <div
        v-if="
            data.value.adminUsers?.length < 1 &&
            data.value.adminGroups?.length < 1
        "
        class="mb-3"
    >
        All {{ typeName === 'Collection' ? 'Editors' : 'Admins' }} removed
    </div>
    <div>
        <p v-if="typeName === 'Collection'">
            Say <span class="mr-2">👋</span>Hello, to the new
            <b>{{
                data.value.adminUsers?.length > 1 ||
                data.value.adminGroups?.length > 1
                    ? 'Editors'
                    : 'Editor'
            }}</b>
        </p>
        <p v-else>
            Say <span class="mr-2">👋</span>Hello, to the new
            <b>{{
                data.value.adminUsers?.length > 1 ||
                data.value.adminGroups?.length > 1
                    ? 'Admins'
                    : 'Admin'
            }}</b>
        </p>
        <div class="flex flex-wrap gap-1 my-1">
            <template v-for="user in data.value.adminUsers" :key="user">
                <UserPill
                    :username="user"
                    @click="handleClickUser(user)"
                ></UserPill>
            </template>
            <template v-for="group in data.value.adminGroups" :key="group">
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
        name: 'AdminsActivity',
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
            typeName: {
                type: String,
                required: false,
                default: () => '',
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
