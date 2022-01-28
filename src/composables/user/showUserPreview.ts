import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { allTabs } from '~/constant/users'
import { useAuthStore } from '~/store/auth'

const showPreview = ref(false)
const userId = ref('')
const username = ref('')
const uniqueAttribute = ref('')
const defaultTab = ref('about')
const blacklistedTabs = ref<string[]>([])
const allowedTabs = ref([])
const finalTabs = computed(() => {
    if (allowedTabs.value && allowedTabs.value.length) {
        if (blacklistedTabs.value.length)
            return allTabs.filter((tab) => allowedTabs.value.includes(tab.key) && !blacklistedTabs.value.includes(tab.key))
        else return allTabs.filter((tab) => allowedTabs.value.includes(tab.key))
    }
    return allTabs.filter((tab) => !blacklistedTabs.value.includes(tab.key))
})
const userUpdated = ref(false)

const isPreviewUserMyself = computed(() => {
    const authStore = useAuthStore()
    return (userId.value === authStore.id) || (username.value === authStore.username)
})

export function useUserPreview() {

    const showUserPreview = (config?: { allowed?: any; blacklisted?: any }, activeTab?: String) => {
        defaultTab.value = activeTab || 'about'
        blacklistedTabs.value = [...(config?.blacklisted || [])]
        //?  hide Integrations tab if preview user is not me
        if (!isPreviewUserMyself.value)
            blacklistedTabs.value.push('Integrations')
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
        userId.value = id
    }
    const setUserUsername = (id: string) => {
        username.value = id
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

    const getUserProfiles = (user: any) => {
        const profile = user?.attributes?.profiles
        let profileObj = {}
        if (profile && profile.length) {
            const profileJsonStr = profile[0]
            try {
                profileObj = JSON.parse(profileJsonStr)[0]
                console.log('profileObj', profileObj)
            } catch (error) {
                console.error('error parsing user profile json', error)
            }
        }
        return profileObj
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
        userUpdated,
        getUserProfiles,
    }
}
