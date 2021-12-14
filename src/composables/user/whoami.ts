import { computed, getCurrentInstance } from 'vue'
import { roleMap } from '~/constant/role'

export default function whoami() {
    const app = getCurrentInstance()
    const name = computed(
        () =>
            app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
                ?.name
    )
    const username = computed(
        () =>
            app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
                ?.username
    )
    const email = computed(
        () =>
            app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
                ?.email
    )
    const groups = computed(
        () =>
            app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
                ?.groups ?? []
    )
    const role = computed(() => {
        const allRoles =
            app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
                ?.realm_access?.roles ?? []
        let atlanRole = null
        if (allRoles?.length) {
            // eslint-disable-next-line no-restricted-syntax
            for (const code in roleMap)
                if (allRoles.includes(code)) {
                    atlanRole = roleMap[code]
                    break
                }
        }
        return atlanRole
    })
    const user =
        app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
    return {
        groups,
        name,
        username,
        role,
        user,
        email,
    }
}
