<template>
    <div class="p-4">
        <p class="mb-0 text-gray-500">USER</p>
        <div class="my-4 text-gray-500">
            <div class="font-bold text-gray-700">
                <img
                    src="https://picsum.photos/id/237/50/50"
                    alt="profile_pic"
                    class="w-28 h-28"
                />
                <span v-if="user.first_name && user.last_name"
                    >{{ user.first_name }}&nbsp;{{ user.last_name }}</span
                >
                <span v-else>{{ user.username }}</span>
            </div>
            <p class="mb-0">test@atlan.com</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { userInterface } from '~/types/users/user.interface'

    export default defineComponent({
        name: 'UserInfoHoverCard',
        props: {
            user: {
                type: Object as PropType<userInterface>,
                required: true,
            },
        },
        setup(props) {
            const { user } = toRefs(props)
            return {
                user,
            }
        },
    })
</script>
