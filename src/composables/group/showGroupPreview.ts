import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { allTabs } from '~/constant/groups'

const showPreview = ref(false)
const groupId = ref('')
const groupAlias = ref('')
const uniqueAttribute = ref('')
const defaultTab = ref('about')
const toogleEdit = ref(false)
const lastUpdate = ref(new Date())
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
        groupAlias.value = id
    }

    const setGroupId = (id: string) => {
        groupId.value = id
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
        toogleEdit,
        lastUpdate
    }
}
