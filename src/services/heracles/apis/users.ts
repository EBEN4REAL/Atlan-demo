import { computed, Ref, ref } from 'vue'
import { useAPIAsyncState } from '~/services/api/useAPI'
import { heracles_keymap } from '../heracles_keymap'

const getUsersBulk = (userNames: Ref<string[]> = ref([])) => {
    const body = computed(() => ({
        method: 'in',
        usernames: userNames.value,
    }))

    return useAPIAsyncState(heracles_keymap.users.LIST_USERS_BULK, 'POST', {
        body,
        initialState: [],
    })
}

export default {
    getUsersBulk,
}
