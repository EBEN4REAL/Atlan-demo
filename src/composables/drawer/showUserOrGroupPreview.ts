import { computed, unref, watch, ref } from 'vue'
import { useUserPreview } from '~/composables/user/showUserPreview'
import { useUsers } from '~/composables/user/useUsers'
import whoami from '~/composables/user/whoami'

import { useGroupPreview } from '~/composables/group/showGroupPreview'
import { useGroup } from '~/composables/group/useGroups'

/**
 * A composable for driving the userOrGroupPreview component. Under the hood,
 * it utilises the useUserPreview and useGroupPreview composables. Takes as
 * argument the preview type, which can either be 'user' or 'group'. Any other
 * argument will not be yield any results.
 * @param {string} previewType
 */
// type TypeUserProp = ? String;
export function useUserOrGroupPreview(previewType: string, userNameProp = "") {
    if (previewType === 'user') {
        // Using the usePreview composable.
        const { userId, uniqueAttribute, username, finalTabs, defaultTab } =
            useUserPreview()
        const userNameUser = userNameProp || username.value

        // Params for obtaining that one user.
        const params = computed(() => ({
            limit: 1,
            offset: 0,
            // sort: "alias",
            filter:
                uniqueAttribute.value === 'username'
                    ? {
                        $and: [
                            { email_verified: true },
                            { username: userNameUser },
                        ],
                    }
                    : {
                        $and: [
                            { email_verified: true },
                            { id: userId.value },
                        ],
                    },
        }))

        const { userList, getUserList, isLoading, error } = useUsers(
            params,
            'USE_USERS_PREVIEW'
        )

        const selectedUser = computed(() =>
            userList && userList.value && userList.value.length
                ? userList.value[0]
                : []
        )

        // Obtaining logged in user.
        const currentUser = whoami()

        // Checking if selected user is the logged in user.
        const isCurrentUser = computed(
            () =>
                selectedUser.value &&
                selectedUser.value.username &&
                currentUser.username.value === selectedUser.value.username
        )
        const imageUrl = computed(() => {
            if (selectedUser.value && selectedUser.value.username)
                return `${window.location.origin}/api/service/avatars/${selectedUser.value.id}`
            return ''
        })

        const activeKey = ref(unref(defaultTab))

        const handleUserUpdate = async () => {
            await getUserList()
        }

        // If the user ID or the username changes, refresh the list.
        watch([userId, username], () => {
            activeKey.value = defaultTab.value
            getUserList()
        })

        return {
            isLoading,
            error,
            reload: getUserList,
            selectedUser,
            imageUrl,
            isCurrentUser,
            defaultTab,
            activeKey,
            tabs: finalTabs,
            handleUpdate: handleUserUpdate,
        }
    } if (previewType === 'group') {
        // Using the useGroupPreview composable.
        const { groupId, uniqueAttribute, groupAlias, finalTabs, defaultTab } =
            useGroupPreview()

        // Params for obtaining the details of the selected group.
        const params = computed(() => ({
            limit: 1,
            offset: 0,
            // sort: "alias",
            filter:
                uniqueAttribute.value === 'groupAlias'
                    ? [{ name: groupAlias.value }]
                    : { $and: [{ id: groupId.value }] },
        }))

        // Obtaining that one group.
        const { groupList, getGroup, state, STATES } = useGroup(params)
        const selectedGroup = computed(() =>
            groupList && groupList.value && groupList.value.length
                ? groupList.value[0]
                : []
        )

        // If the group alias or the group ID changes, refresh the list.
        watch([groupAlias, groupId], () => {
            getGroup()
        })

        return {
            isLoading: [STATES.PENDING].includes(state.value),
            error: [STATES.ERROR, STATES.STALE_IF_ERROR].includes(state.value),
            reload: getGroup,
            selectedGroup,
            defaultTab,
            tabs: finalTabs,
        }
    }
    return {
        isLoading: false,
    }
}
