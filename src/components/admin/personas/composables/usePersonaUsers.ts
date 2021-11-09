import { computed, ComputedRef, Ref, watch, reactive, ref } from 'vue'
import { getFormattedUser } from '~/composables/user/useUsers'
import userAPI, { IUser } from '~/services/heracles/apis/users'
import { IPersona } from '~/types/accessPolicies/personas'
import useUsers from '~/composables/user/useUsers'

function usePersonaUserList(persona: Ref<IPersona>) {
    const userListAPIParams: Ref<any> = ref({
        limit: 15,
        offset: 0,
        sort: 'first_name',
        filter: { $and: [] },
    })

    const {
        userList: data,
        getUserList,
        state,
        STATES,
    } = useUsers(userListAPIParams)

    const list: ComputedRef<IUser[]> = computed(() =>
        data.value.map((usr) => getFormattedUser(usr))
    )
    const userList: Ref<IUser[]> = ref([])

    watch(
        data,
        () => {
            userList.value = []
            let data: IUser[] = []
            list.value.forEach((t) => {
                persona.value.users?.forEach((username) => {
                    if (t.username === username) {
                        data.push(t)
                    }
                })
            })
            console.log(data, 'usrList')

            userList.value = data
        },
        { immediate: true }
    )
    watch(
        () => persona.value.id,
        () => getUserList()
    )

    return {
        userListAPIParams,
        getUserList,
        userList,
        STATES,
        state,
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
        sortKey: 'group_count',
        dataIndex: 'group_count_string',
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
