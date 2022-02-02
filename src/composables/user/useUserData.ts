import { computed } from 'vue'
import { useAuthStore } from '~/store/auth'

export default function useUserData() {
    const authStore = useAuthStore()

    const avatarURL = computed(
        () =>
            `${window.location.origin}/api/service/avatars/${authStore.username}`
    )

    return {
        id: authStore.id,
        name: authStore.name,
        username: authStore.username,
        avatar: avatarURL.value,
        firstName: authStore.firstName,
        lastName: authStore.lastName,
        email: authStore.email,
    }
}
