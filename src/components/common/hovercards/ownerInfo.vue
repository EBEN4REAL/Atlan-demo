<template>
    <div class="w-56">
        <p class="mb-0 text-gray-500 uppercase">{{ user.type }}</p>
        <div class="my-2 text-gray-500">
            <div
                class="flex items-center mb-1 overflow-hidden font-bold text-gray-700 "
            >
                <avatar
                    v-if="user && user.type === 'user'"
                    class="mr-2"
                    :image-url="
                        KeyMaps.GET_AVATAR({
                            username: user.username,
                        })
                    "
                    :allow-upload="false"
                    :avatar-name="user.username"
                    avatar-size="small"
                    :avatar-shape="'circle'"
                />
                <AtlanIcon
                    v-else-if="user && user.type === 'group'"
                    icon="Group"
                    class="h-4 mr-2 text-primary group-hover:text-white"
                />
                <span
                    v-if="user?.firstName && user?.lastName"
                    class="text-sm font-bold"
                    >{{ user?.firstName }}&nbsp;{{ user?.lastName }}</span
                >
                <span v-else>{{ user.username }}</span>
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

<script lang="ts">
    import { defineComponent } from 'vue'
    import Avatar from '@/common/avatar/index.vue'
    import { map as KeyMaps } from '~/services/service/avatar/key'

    export default defineComponent({
        name: 'UserInfoHoverCard',
        components: { Avatar },
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
        setup() {
            return {
                KeyMaps,
            }
        },
    })
</script>
