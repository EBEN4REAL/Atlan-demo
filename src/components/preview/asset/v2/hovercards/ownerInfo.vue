<template>
    <a-popover :class="$style.popover" placement="top">
        <template #content>
            <div class="w-36">
                <p class="mb-0 text-gray-500 uppercase">{{ type }}</p>
                <div class="my-2 text-gray-500">
                    <div
                        class="flex items-center mb-1 overflow-hidden font-bold text-gray-700 "
                    >
                        <img
                            src="https://picsum.photos/id/237/50/50"
                            alt="profile_pic"
                            class="mr-2 rounded-full w-7 h-7"
                        />
                        <span
                            v-if="user?.first_name && user?.last_name"
                            class="text-sm font-bold"
                            >{{ user?.first_name }}&nbsp;{{
                                user?.last_name
                            }}</span
                        >
                        <span v-else>{{ username }}</span>
                    </div>
                    <p class="mb-0">test@atlan.com</p>
                </div>
                <div
                    class="
                        inline-flex
                        px-3
                        py-1.5
                        mt-2
                        font-bold
                        rounded-full
                        bg-gray-light
                        text-gray-700
                        hover:bg-primary hover:text-white
                    "
                >
                    Admin
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    // import { userInterface } from '~/types/users/user.interface'

    export default defineComponent({
        name: 'UserInfoHoverCard',
        props: {
            username: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { username, type } = toRefs(props)
            const user = undefined

            return {
                type,
                username,
                user,
            }
        },
    })
</script>

<style scoped>
    .hovercard {
        max-width: 226px;
    }
</style>
<style lang="less" module>
    .popover {
        :global(.ant-popover-inner) {
            border-radius: 8px !important;
        }
        :global(.ant-popover-inner-content) {
            @apply p-4 !important;
        }
    }
</style>
