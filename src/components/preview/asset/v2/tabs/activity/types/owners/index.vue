<template>
    <span
        >Say 👋 Hello, to the newly added
        <b>{{ data.value.length > 1 ? 'Owners' : 'Owner' }}</b></span
    >
    <ul v-for="(user, index) in data.value" :key="index" class="my-1">
        <li
            class="flex items-center cursor-pointer"
            @click.stop="() => handleClickUser(user)"
        >
            <avatar
                :avatar-name="user"
                avatar-shape="circle"
                :avatar-size="28"
                class="mx-2"
            /><span class="font-bold">{{ user }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import Avatar from '~/components/common/avatar.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'

    export default defineComponent({
        components: { Avatar },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup() {
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }
            return { handleClickUser }
        },
    })
</script>
