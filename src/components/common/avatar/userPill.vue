<template>
    <div
        class="flex items-center py-1 pl-1 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer  hover:bg-primary group hover:border-primary"
    >
        <UserAvatar
            :username="username"
            style-class="mr-1 border-none bg-primary-light "
        ></UserAvatar>
        <div class="group-hover:text-white">
            {{ username }}
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'

    import UserAvatar from '@/common/avatar/user.vue'

    export default {
        name: 'Avatar',
        props: {
            username: {
                type: String,
                default: '',
            },
        },
        components: {
            UserAvatar,
        },
        setup(props, context) {
            const { username } = toRefs(props)
            return { username }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
