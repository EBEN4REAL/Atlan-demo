import { computed, getCurrentInstance } from "vue";

export default function whoami() {
    const app = getCurrentInstance();
    const name = computed(() => {
        return app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed?.name;
    });
    const username = computed(() => {
        return app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed?.username;
    });

    return {
        name,
        username
    }
}