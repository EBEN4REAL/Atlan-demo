<template>
    <div class="flex items-center">
        <a-avatar
            :shape="avatarShape"
            :size="avatarSize"
            :class="styleClass"
            class="text-sm align-middle border text-primary"
            :src="url"
            ><span style="line-height: 16px">{{
                getNameInitials(username)
            }}</span></a-avatar
        >
        <div v-if="showUsername">{{ username }}</div>
    </div>
</template>

<script lang="ts">
    import { ref, watch, PropType, toRefs, computed } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'

    export default {
        name: 'Avatar',
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
                default: 20,
            },
            showUsername: {
                type: Boolean,
            },
        },
        setup(props, context) {
            const { username, styleClass } = toRefs(props)

            const url = computed(
                () =>
                    `${window.location.origin}/api/services/avatar/${username.value}`
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
