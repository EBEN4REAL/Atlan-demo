import { computed, Ref } from 'vue'
import { useUsers } from '~/composables/user/useUsers'

interface UseLinkedByUserReturn {
    user: Ref<Object>
    isLoading: Ref<boolean>
    error: any | undefined
}

/**
 * A composable for getting the user who attached the classification to the
 * given entity. Accepts a username, but can be modified according to
 * individual needs.
 * @param username
 */
export function useLinkedByUser(username: Ref<string>): UseLinkedByUserReturn {
    // The parameters for the API request.
    const params = {
        limit: 1,
        offset: 0,
        filter: {
            $and: [{ username: username.value }],
        },
    }

    // Fetching the user list satisfying the given parameters.
    const { userList, isLoading, error } = useUsers(params)

    const user = computed(() =>
        !isLoading.value && userList.value.length > 0
            ? { ...userList.value[0] }
            : {}
    )

    return {
        user,
        isLoading,
        error,
    }
}
