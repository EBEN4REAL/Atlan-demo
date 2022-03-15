<template>
    <div
        class="flex items-center py-1 pl-1 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-primary group hover:border-primary"
    >
        <UserAvatar
            :username="username"
            style-class="mr-1 border-none bg-primary-light "
        ></UserAvatar>
        <div class="group-hover:text-white">
            {{ username }}
        </div>
        <div
            class="flex group-hover:text-white"
            @click="handleRemove"
            v-if="allowDelete"
        >
            <AtlanIcon icon="Cross" class="h-3 ml-1"></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'

    import UserAvatar from '@/common/avatar/user.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'

    export default {
        name: 'Avatar',
        props: {
            username: {
                type: String,
                default: '',
            },
            allowDelete: {
                type: Boolean,
                default() {
                    return false
                },
            },
        },
        components: {
            UserAvatar,
            AtlanIcon,
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { username } = toRefs(props)

            const handleRemove = () => {
                emit('delete')
            }

            return { username, handleRemove }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
