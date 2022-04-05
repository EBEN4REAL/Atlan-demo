<template>
    <span
        class="cursor-pointer hover:underline text-gray"
        @click="() => openUserSidebar(username)"
    >
        <img
            v-if="showCreatorImage"
            :src="avatarUrl(username)"
            class="flex-none inline-block h-4 rounded-full mb-0.5"
            @error="showCreatorImage = false"
        />
        <AtlanIcon
            v-else
            icon="User"
            class="mb-0.5 rounded-full overflow-hidden"
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
