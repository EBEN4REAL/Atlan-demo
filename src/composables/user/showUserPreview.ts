import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const showPreview = ref(false)
const userId = ref('')
const username = ref('')
const uniqueAttribute = ref('')
const defaultTab = ref('about')

const allTabs = [
    {
        // tab name
        name: 'About',
        // tab icon
        iconClass: '',
        // component name in userPreview.vue
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
        name: 'Groups',
        iconClass: '',
        component: 'Groups',
        key: 'groups',
        icon: 'GroupLight',
        tooltip: 'Groups',
        activeIcon: 'GroupActive',
    },
    {
        name: 'Sessions',
        iconClass: '',
        component: 'Sessions',
        key: 'sessions',
        icon: 'Hourglass',
        tooltip: 'Sessions',
        activeIcon: 'HourglassActive',
    },
    {
        name: 'Access Logs',
        iconClass: '',
        component: 'AccessLogs',
        key: 'accessLogs',
        icon: 'AccessLogs',
        tooltip: 'Access Logs',
        activeIcon: 'AccessLogsActive',
    },
]

const blacklistedTabs = ref([])
const allowedTabs = ref([])
const finalTabs = computed(() => {
    if (allowedTabs.value && allowedTabs.value.length)
        return allTabs.filter((tab) => allowedTabs.value.includes(tab.key))
    return allTabs.filter((tab) => !blacklistedTabs.value.includes(tab.key))
})

export function useUserPreview() {
    const showUserPreview = (config?: { allowed?: any; blacklisted?: any }) => {
        blacklistedTabs.value = [...(config?.blacklisted || [])]
        allowedTabs.value = [...(config?.allowed || [])]
        showPreview.value = true
    }
    const closePreview = () => {
        blacklistedTabs.value = []
        allowedTabs.value = []
        showPreview.value = false
    }
    const setUserUniqueAttribute = (value, key = 'id') => {
        if (key === 'username') {
            setUserUsername(value)
        } else setUserId(value)
        uniqueAttribute.value = key
    }
    const setUserId = (id: string) => {
        console.log('setting user id', id)
        userId.value = id
        console.log('done', userId.value)
    }
    const setUserUsername = (id: string) => {
        console.log('setting user id', id)
        username.value = id
        console.log('done', username.value)
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
        closePreview()
    })

    return {
        showPreview,
        userId,
        setUserUniqueAttribute,
        setAllowedTabs,
        setBlackListedTabs,
        uniqueAttribute,
        username,
        finalTabs,
        showUserPreview,
        closePreview,
        defaultTab,
        setDefaultTab,
    }
}
