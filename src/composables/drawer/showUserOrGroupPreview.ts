import { computed, unref, watch, ref } from 'vue'
import { useUserPreview } from '~/composables/user/showUserPreview'
import { useUsers } from '~/composables/user/useUsers'
import whoami from '~/composables/user/whoami'

import { useGroupPreview } from '~/composables/group/showGroupPreview'
import useGroups from '~/composables/group/useGroups'
import bodybuilder from 'bodybuilder'
import { Search } from '~/services/meta/search'

/**
 * A composable for driving the userOrGroupPreview component. Under the hood,
 * it utilises the useUserPreview and useGroupPreview composables. Takes as
 * argument the preview type, which can either be 'user' or 'group'. Any other
 * argument will not be yield any results.
 * @param previewType The type of preview 'group' or 'user'
 * @param userNameProp The user name
 */
// type TypeUserProp = ? String;
export function useUserOrGroupPreview(previewType: string, userNameProp = '') {
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
                              { emailVerified: true },
                              { username: userNameUser },
                          ],
                      }
                    : {
                          $and: [{ emailVerified: true }, { id: userId.value }],
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

        const query = bodybuilder()
            .filter('term', 'ownerUsers', selectedUser)
            .aggregation('terms', '__typeName.keyword', {}, 'group_by_typeName')
            .size(10)
            .build()
        const { data } = Search.IndexSearch({ dsl: query }, {})
        const businessCount = computed(() => {
            const terms = [
                'atlasglossary',
                'atlasglossarycategory',
                'atlasglossaryterm',
            ]
            const aggs =
                data?.value?.aggregations?.group_by_typeName?.buckets || []
            let count = 0
            aggs.forEach((el) => {
                if (terms.includes(el.key.toLowerCase())) {
                    count += el.doc_count
                }
            })
            return count
        })
        const assetCount = computed(() => {
            const aggs =
                data?.value?.aggregations?.group_by_typeName?.buckets || []
            let count = 0
            aggs.forEach((el) => {
                count += el.doc_count
            })
            return count
        })

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
    }
    if (previewType === 'group') {
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
        const { groupList, getGroupList, isLoading, error } = useGroups(
            params,
            'USE_GROUPS_PREVIEW'
        )
        const selectedGroup = computed(() =>
            groupList && groupList.value && groupList.value.length
                ? groupList.value[0]
                : []
        )

        // If the group alias or the group ID changes, refresh the list.
        watch([groupAlias, groupId], () => {
            getGroupList()
        })

        return {
            isLoading,
            error,
            reload: getGroupList,
            selectedGroup,
            defaultTab,
            tabs: finalTabs,
        }
    }
    return {
        isLoading: false,
    }
}
