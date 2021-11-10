import { ref, computed } from 'vue'

const showPreview = ref(false)
const groupId = ref('')
const groupAlias = ref('')
const uniqueAttribute = ref('')
const defaultTab = ref('about')
const allTabs = [
    {
        // tab name
        name: 'About',
        // tab icon
        iconClass: '',
        // component name in groupPreview.vue
        component: 'About',
        // unique id for tab - the one that'll get passed from different components
        key: 'about',
        icon: 'Overview',
        tooltip: 'User Info',
        activeIcon: 'InfoActive',
    },
    {
        name: 'Assets',
        iconClass: '',
        component: 'Assets',
        key: 'assets',
        icon: 'AssetsInactiveLight',
        tooltip: 'Assets',
        activeIcon: 'AssetsActiveLight',
    },
    {
        name: 'Members',
        iconClass: '',
        component: 'Members',
        key: 'members',
        icon: 'UserLight',
        tooltip: 'Members',
        activeIcon: 'UserLightActive',
    },
]

const blacklistedTabs = ref([])
const allowedTabs = ref([])
const finalTabs = computed(() => {
    if (allowedTabs.value && allowedTabs.value.length)
        return allTabs.filter((tab) => allowedTabs.value.includes(tab.key))
    return allTabs.filter((tab) => !blacklistedTabs.value.includes(tab.key))
})

export function useGroupPreview() {
    const showGroupPreview = (config?: {
        allowed?: any
        blacklisted?: any
    }) => {
        blacklistedTabs.value = [...(config?.blacklisted || [])]
        allowedTabs.value = [...(config?.allowed || [])]
        showPreview.value = true
    }
    const closePreview = () => {
        blacklistedTabs.value = []
        allowedTabs.value = []
        showPreview.value = false
    }
    const setGroupUniqueAttribute = (value, key = 'id') => {
        if (key === 'groupAlias') {
            setGroupAlias(value)
        } else setGroupId(value)
        uniqueAttribute.value = key
    }
    const setGroupId = (id: string) => {
        console.log('setting user id', id)
        groupId.value = id
        console.log('done', groupId.value)
    }
    const setGroupAlias = (id: string) => {
        console.log('setting user id', id)
        groupAlias.value = id
        console.log('done', groupAlias.value)
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
    }
}
