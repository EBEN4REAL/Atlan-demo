<template>
    <div :class="`flex items-center ${className}`">
        <avatar
            :image-url="avatarURL"
            :allow-upload="false"
            :avatar-size="avatarSize"
            :avatar-shape="'circle'"
            :isGroup="isGroup"
            class="mr-1"
        >
        </avatar>
        <div v-if="showUsername">{{ username }}</div>
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

            const avatarURL = computed(
                () =>
                    `${window.location.origin}/api/service/avatars/${username.value}`
            )

            return {
                avatarURL,
                getNameInitials,
                getNameInTitleCase,
                styleClass,
                username,
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
