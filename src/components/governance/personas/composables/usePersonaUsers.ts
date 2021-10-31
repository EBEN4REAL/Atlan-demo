import { computed, ComputedRef, Ref, watch } from 'vue'
import { getFormattedUser } from '~/composables/user/useUsers'
import { Users, IUser } from '~/services/service/users'
import { IPersona } from '~/types/accessPolicies/personas'

function usePersonaUserList(persona: Ref<IPersona>) {
    const personaUsers = computed(() => persona.value.users!)

    // userNames: Ref<string[]> = ref([])
    const body = computed(() => ({
        method: 'in',
        usernames: personaUsers.value,
    }))

    const {
        data,
        isLoading,
        mutate,
        error: userListError,
    } = Users.ListBulk(body)

    const userList: ComputedRef<IUser[]> = computed(() =>
        data.value.map((usr) => getFormattedUser(usr))
    )

    watch(
        () => persona.value.id,
        () => mutate()
    )

    return {
        userList,
        isLoading,
        userListError,
    }
}

const userColumns = [
    {
        title: 'User',
        key: 'user',
        sorter: true,
        width: 220,
        slots: { customRender: 'name' },
        sortKey: 'first_name',
    },
    {
        title: 'Groups',
        key: 'group',
        sorter: true,
        width: 150,
        slots: { customRender: 'group' },
        sortKey: 'group_count',
        dataIndex: 'group_count_string',
    },
    {
        title: 'Status',
        key: 'status',
        slots: { customRender: 'status' },
        filterMultiple: false,
        width: 150,
    },
    {
        title: 'Actions',
        width: 120,
        slots: { customRender: 'actions' },
    },
]

export default {
    userColumns,
    usePersonaUserList,
}
