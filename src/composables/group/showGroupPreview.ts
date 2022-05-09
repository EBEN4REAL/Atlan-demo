import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { allTabs } from '~/constant/groups'

const showPreview = ref(false)
const groupId = ref('')
const groupAlias = ref('')
const uniqueAttribute = ref('')
const defaultTab = ref('about')
const toogleEdit = ref(false)

const blacklistedTabs = ref([])
const allowedTabs = ref([])
const finalTabs = computed(() => {
    if (allowedTabs.value && allowedTabs.value.length)
        return allTabs.filter((tab) => allowedTabs.value.includes(tab.key))
    return allTabs.filter((tab) => !blacklistedTabs.value.includes(tab.key))
})

export function useGroupPreview() {

    const closePreview = () => {
        blacklistedTabs.value = []
        allowedTabs.value = []
        showPreview.value = false
    }

    const showGroupPreview = (config?: {
        allowed?: any
        blacklisted?: any
    }) => {
        blacklistedTabs.value = [...(config?.blacklisted || [])]
        allowedTabs.value = [...(config?.allowed || [])]
        showPreview.value = true
    }


    const setGroupAlias = (id: string) => {
        console.log('setting user id', id)
        groupAlias.value = id
        console.log('done', groupAlias.value)
    }

    const setGroupId = (id: string) => {
        console.log('setting user id', id)
        groupId.value = id
        console.log('done', groupId.value)
    }

    const setGroupUniqueAttribute = (value, key = 'id') => {
        if (key === 'groupAlias') {
            setGroupAlias(value)
        } else setGroupId(value)
        uniqueAttribute.value = key
    }


    const setAllowedTabs = (tabs) => {
        allowedTabs.value = [...tabs]
    }
    const setBlackListedTabs = (tabs) => {
        blacklistedTabs.value = [...tabs]
    }

    const setDefaultTab = (tab) => {
        defaultTab.value = tab
    }

    const route = useRoute()

    watch(route, () => {
        blacklistedTabs.value = []
        allowedTabs.value = []
        showPreview.value = false
    })
    const changeTogleEdit = (val) => {
        toogleEdit.value = val
}
    return {
        showPreview,
        groupId,
        setGroupUniqueAttribute,
        setAllowedTabs,
        setBlackListedTabs,
        uniqueAttribute,
        groupAlias,
        finalTabs,
        showGroupPreview,
        closePreview,
        defaultTab,
        setDefaultTab,
        changeTogleEdit,
        toogleEdit
    }
}
