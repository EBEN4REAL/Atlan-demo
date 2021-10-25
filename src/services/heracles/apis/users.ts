import { computed, Ref, ref } from 'vue'
import { useAPIAsyncState } from '~/services/api/useAPI'
import { heracles_keymap } from '../heracles_keymap'

export interface IUser {
    email: string
    firstName: string
    lastName: string
    username: string
}

const getUsersBulk = (userNames: Ref<string[]> = ref([])) => {
    const body = computed(() => ({
        method: 'in',
        usernames: userNames.value,
    }))

    return useAPIAsyncState<IUser[]>(
        heracles_keymap.users.LIST_USERS_BULK,
        'POST',
        {
            body,
            initialState: [],
        }
    )
}

export default {
    getUsersBulk,
}
