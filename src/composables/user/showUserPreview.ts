import { ref, computed, watch, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { allTabs } from '~/constant/users'
import { useAuthStore } from '~/store/auth'
import integrationStore from '~/store/integrations/index'

const showPreview = ref(false)
const userId = ref('')
const username = ref('')
const uniqueAttribute = ref('')
const defaultTab = ref('about')
const blacklistedTabs = ref<string[]>([])
const allowedTabs = ref([])


// ? TODO - refactor for a scalability
const atleastOneIntegrationConfigured = computed(() => {
    const store = integrationStore()
    const { tenantSlackStatus, tenantJiraStatus } = toRefs(store)
    return tenantSlackStatus.value.configured || tenantJiraStatus.value.configured
})

const finalTabs = computed(() => {

    let allTabsCopy = JSON.parse(JSON.stringify(allTabs))
    if (!atleastOneIntegrationConfigured.value)
        allTabsCopy = allTabsCopy.filter(tab => tab.key !== "Integrations")

    if (allowedTabs.value && allowedTabs.value.length) {
        if (blacklistedTabs.value.length)
            return allTabsCopy.filter(
                (tab) =>
                    allowedTabs.value.includes(tab.key) &&
                    !blacklistedTabs.value.includes(tab.key)
            )
        return allTabsCopy.filter((tab) => allowedTabs.value.includes(tab.key))
    }
    return allTabsCopy.filter((tab) => !blacklistedTabs.value.includes(tab.key))
})
const userUpdated = ref(false)

const isPreviewUserMyself = computed(() => {
    const authStore = useAuthStore()
    return (
        userId.value === authStore.id || username.value === authStore.username
    )
})

export function useUserPreview() {
    const showUserPreview = (
        config?: { allowed?: any; blacklisted?: any },
        activeTab?: String
    ) => {
        defaultTab.value = activeTab || 'about'
        blacklistedTabs.value = [...(config?.blacklisted || [])]
        // ?  hide Integrations tab if preview user is not me
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

    const openUserSidebar = (usrname: string) => {
        setUserUniqueAttribute(usrname, 'username')
        showUserPreview({ allowed: ['about'] })
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
        openUserSidebar,
    }
}
