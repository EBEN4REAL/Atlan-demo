import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { getFormattedGroup } from '~/composables/group/formatGroup'
import { IGroup } from '~/services/heracles/apis/groups'
import { IPersona } from '~/types/accessPolicies/personas'
import fetchGroupList from '~/composables/group/fetchGroupList'

function usePersonaGroupList(persona: Ref<IPersona>) {
    const {
        list: data,
        error: groupListError,
        mutate,
        STATES,
        state,
    } = fetchGroupList()

    const list: ComputedRef<IGroup[]> = computed(() =>
        data.value.map((grp) => getFormattedGroup(grp))
    )

    watch(
        () => persona.value.id,
        () => mutate()
    )
    const groupList: Ref<IGroup[]> = ref([])
    watch(
        data,
        () => {
            groupList.value = []
            persona.value.groups?.forEach((grpname) => {
                list.value.forEach((t) => {
                    if (t.alias === grpname) {
                        groupList.value.push(t)
                    }
                })
            })
        },
        { immediate: true }
    )

    return {
        getGroupsList: mutate,
        state,
        STATES,
        groupList,
        groupListError,
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
        width: 120,
        slots: { customRender: 'actions' },
    },
]

export default {
    groupColumns,
    usePersonaGroupList,
}
