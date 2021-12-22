<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer"
        :data-test-id="username"
        :class="
            enableHover
                ? ' hover:bg-primary group hover:border-primary hover:text-white'
                : ''
        "
        @click.stop="() => {}"
    >
        <UserAvatar
            :username="username"
            style-class="border border-primary bg-primary-light "
        ></UserAvatar>
        <div class="">
            {{ getUserName() }}
        </div>
        <div v-if="allowDelete" class="flex" @click.prevent.stop="handleDelete">
            <AtlanIcon
                icon="Cross"
                class="h-3 ml-2 text-gray-500"
                :class="enableHover ? ' group-hover:text-white' : ''"
            ></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'

    import UserAvatar from '@/common/avatar/user.vue'
    import AtlanIcon from '../icon/atlanIcon.vue'

    export default {
        name: 'Avatar',
        components: {
            UserAvatar,
            AtlanIcon,
        },
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
            enableHover: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { username, enableHover } = toRefs(props)

            const handleDelete = () => {
                emit('delete', username.value)
            }

            const getUserName = () => {
                if (username.value === 'service-account-atlan-argo') {
                    return 'Atlan'
                }
                return username.value
            }

            /* const handleClick = () => {
                emit('click', username.value)
            } */

            return { username, handleDelete, getUserName }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
