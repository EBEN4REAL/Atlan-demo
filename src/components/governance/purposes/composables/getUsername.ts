import { ref, watch, ComputedRef } from 'vue'
import { useUsers } from '~/composables/user/useUsers'

export function getUsername(id: ComputedRef<string | undefined>) {
    const username = ref()
    if (id) {
        const userListAPIParams: any = ref({
            limit: 1,
            columns: 'username',
            filter: {
                $and: [
                    {
                        id,
                    },
                ],
            },
        })

        const { userList, getUserList } = useUsers(userListAPIParams)
        watch(
            userList,
            () => {
                if (userList.value?.length > 0) {
                    if (userList.value[0] && userList.value[0]?.username) {
                        username.value = userList.value[0].username
                    }
                }
            },
            { immediate: true }
        )
        watch(id, () => {
            getUserList()
        })
    }

    return { username }
}
