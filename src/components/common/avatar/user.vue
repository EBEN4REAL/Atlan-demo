<template>
    <div :class="`flex items-center ${className}`">
        <avatar
            v-if="getUserName() !== 'API key' || getUserName() !== 'API token'"
            :image-url="avatarURL"
            :allow-upload="false"
            :avatar-size="avatarSize"
            :avatar-shape="'circle'"
            :is-group="isGroup"
            :is-atlan="isAtlan"
            class="mr-1"
        >
        </avatar>
        <AtlanIcon v-else icon="Key" class="h-3 mr-1" />
        <div v-if="showUsername">{{ getUserName() }}</div>
    </div>
</template>

<script lang="ts">
    import { ref, watch, PropType, toRefs, computed } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import Avatar from '~/components/common/avatar/index.vue'

    export default {
        name: 'UserPill',
        props: {
            styleClass: {
                type: String,
                default: '',
            },
            username: {
                type: String,
                default: '',
            },
            avatarShape: {
                type: String,
                default: 'circle',
            },
            avatarSize: {
                type: Number as PropType<Number | String>,
                default: 16,
            },
            showUsername: {
                type: Boolean,
            },
            className: {
                type: String,
                default: '',
            },
            isGroup: {
                type: Boolean,
                default: false,
            },
        },
        components: { Avatar },
        setup(props, context) {
            const { username, styleClass } = toRefs(props)
            const isAtlan = computed(
                () => username.value === 'service-account-atlan-argo'
            )
            const avatarURL = computed(() => {
                if (username.value === 'service-account-atlan-argo') {
                    return '~/assets/images/source/atlan-logo.jpeg'
                }
                return `${window.location.origin}/api/service/avatars/${username.value}`
            })
            const getUserName = () => {
                if (username.value === 'service-account-atlan-argo') {
                    return 'Atlan'
                }
                if (username.value.startsWith('service-account-apikey-'))
                    return 'API token'
                return username.value
            }

            return {
                avatarURL,
                getNameInitials,
                getNameInTitleCase,
                styleClass,
                username,
                isAtlan,
                getUserName,
            }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
