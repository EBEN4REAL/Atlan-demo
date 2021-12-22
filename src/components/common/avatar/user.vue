<template>
    <div :class="`flex items-center ${className}`">
        <avatar
            :image-url="avatarURL"
            :allow-upload="false"
            :avatar-size="avatarSize"
            :avatar-shape="'circle'"
            :isGroup="isGroup"
            :isAtlan="isAtlan"
            class="mr-1"
        >
        </avatar>
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
            const isAtlan = computed(() => {
                return username.value === 'service-account-atlan-argo'
            })
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
