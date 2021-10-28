<template>
    <div class="flex items-center">
        <a-avatar
            :shape="avatarShape"
            :size="avatarSize"
            :class="styleClass"
            class="border text-primary border-primary"
            :src="url"
            >{{ getNameInitials(username) }}</a-avatar
        >
    </div>
</template>

<script lang="ts">
    import { ref, watch, PropType, toRefs, computed } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import uploadAvatar from '~/composables/avatar/uploadAvatar'

    export default {
        name: 'Avatar',
        props: {
            styleClass: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: '',
            },
            username: {
                type: String,
                default: '',
            },
            avatarShape: {
                type: String,
                default: 'round',
            },
            avatarSize: {
                type: String as PropType<Number | String>,
                default: 20,
            },
        },
        setup(props, context) {
            const { username, styleClass } = toRefs(props)

            const url = computed(
                () =>
                    `${window.location.origin}/api/services/avatar/${username}`
            )

            return {
                url,
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
