import { Ref, ref, watch } from 'vue'
import { IPersona, IGroup } from '~/types/accessPolicies/personas'
import useGroups from '~/composables/group/useGroups'

function usePersonaGroupList(persona: Ref<IPersona>, cancelToken) {
    const params = ref(new URLSearchParams())
    // this is needed as there are multiple keys with the same param name
    params.value.append('limit', '20')
    params.value.append('sort', 'name')
    params.value.append('columns', 'name')
    params.value.append('columns', 'userCount')
    params.value.append('columns', 'id')
    params.value.append('columns', 'attributes')

    const {
        groupList: data,
        getGroupList,
        isLoading,
        error,
    } = useGroups(params.value, '', {}, cancelToken, { immediate: false })
    watch(
        () => persona.value.id,
        () => {
            const groupFilter = { $or: [] }
            persona.value.groups?.forEach((id) => groupFilter.$or.push({ id }))
            params.value.delete('filter')
            params.value.append('filter', JSON.stringify(groupFilter))
            getGroupList()
        },
        { immediate: true }
    )
    watch(
        () => persona.value.groups,
        () => {
            const groupFilter = { $or: [] }
            persona.value.groups?.forEach((id) => groupFilter.$or.push({ id }))
            params.value.delete('filter')
            params.value.append('filter', JSON.stringify(groupFilter))
            getGroupList()
        },
        { deep: true }
    )
    const groupList: Ref<IGroup[]> = ref([])
    watch(
        data,
        () => {
            // console.log(data.value, 'data edit first')
            groupList.value = []
            persona.value.groups?.forEach((grpid) => {
                data?.value?.forEach((t) => {
                    if (t.id === grpid) {
                        groupList.value.push(t)
                    }
                })
            })
            // console.log(data.value, 'data edit end')
        },
        { immediate: true }
    )

    return {
        list: data,
        getGroupList,
        groupList,
        isLoading,
        error,
    }
}

const groupColumns = [
    {
        title: 'Groups',
        key: 'group',
        sorter: true,
        width: 220,
        slots: { customRender: 'group' },
        sortKey: 'alias',
    },
    {
        title: 'Members',
        key: 'member',
        slots: { customRender: 'member' },
        filterMultiple: false,
        width: 150,
        dataIndex: 'memberCountString',
    },

    {
        title: 'Actions',
        slots: { customRender: 'actions' },
    },
]

export default {
    groupColumns,
    usePersonaGroupList,
}
