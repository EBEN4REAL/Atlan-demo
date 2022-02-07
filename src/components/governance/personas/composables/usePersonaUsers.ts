import { computed, ComputedRef, Ref, watch, reactive, ref } from 'vue'
import { getFormattedUser, useUsers } from '~/composables/user/useUsers'
import { IPersona, IUser } from '~/types/accessPolicies/personas'

function usePersonaUserList(persona: Ref<IPersona>, cancelToken) {
    const userListAPIParams: any = {
        sort: 'firstName',
        filter: { $or: [] },
    }

    const {
        error,
        isLoading,
        userList: data,
        state,
        STATES,
        getUserList,
    } = useUsers(userListAPIParams, false, cancelToken)

    const list: ComputedRef<IUser[]> = computed(() =>
        data.value.map((usr) => getFormattedUser(usr))
    )
    const userList: Ref<IUser[]> = ref([])

    const fetchUsers = () => {
        userListAPIParams.filter.$or = []
        persona.value.users?.forEach((id) =>
            userListAPIParams.filter.$or.push({ id })
        )
        getUserList()
    }
    /* Fetching user subjects of the persona if there are any. */
    const fetchPersonaUserSubjects = () => {
        if (persona?.value?.users?.length) fetchUsers()
        else userList.value = []
    }

    watch(
        data,
        () => {
            userList.value = []
            const data: IUser[] = []
            list.value.forEach((t) => {
                persona.value.users?.forEach((userIds) => {
                    if (t.id === userIds) {
                        data.push(t)
                    }
                })
            })
            userList.value = data
        },
        { immediate: true }
    )
    watch(
        () => [persona?.value?.id, persona?.value?.users],
        fetchPersonaUserSubjects,
        { immediate: true }
    )
    return {
        state,
        STATES,
        error,
        isLoading,
        list: data,
        userListAPIParams,
        fetchPersonaUserSubjects,
        userList,
    }
}

const userColumns = [
    {
        title: 'User',
        key: 'user',
        sorter: true,
        width: 220,
        slots: { customRender: 'name' },
        sortKey: 'firstName',
    },
    {
        title: 'Role',
        key: 'role',
        slots: { customRender: 'role' },
        filterMultiple: false,
        width: 150,
    },
    {
        title: 'Groups',
        key: 'group',
        sorter: true,
        width: 150,
        slots: { customRender: 'group' },
        sortKey: 'groupCount',
        dataIndex: 'group_count_string',
    },

    {
        title: 'Actions',
        slots: { customRender: 'actions' },
    },
]

export default {
    userColumns,
    usePersonaUserList,
}
