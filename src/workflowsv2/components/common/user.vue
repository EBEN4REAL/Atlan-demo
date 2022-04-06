<template>
    <span
        class="text-sm cursor-pointer hover:underline text-new-gray-800"
        @click="() => openUserSidebar(username)"
    >
        <img
            v-if="showCreatorImage"
            :src="avatarUrl(username)"
            class="flex-none inline-block h-4 rounded-full"
            @error="showCreatorImage = false"
        />
        <AtlanIcon
            v-else
            icon="User"
            class="overflow-hidden text-gray-500 rounded-full"
        />
        {{ username }}
    </span>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { avatarUrl } from '~/composables/user/useUsers'

    export default defineComponent({
        name: 'UserWrapper',
        props: {
            username: {
                type: String,
                default: () => '',
            },
        },
        setup(props) {
            const showCreatorImage = ref(true)

            const { openUserSidebar } = useUserPreview()

            return {
                openUserSidebar,
                showCreatorImage,
                avatarUrl,
            }
        },
    })
</script>
