<template>
    <span
        class="text-sm cursor-pointer hover:underline text-new-gray-800"
        @click="() => openUserSidebar(username)"
    >
        <AtlanIcon
            v-if="!creatorImageLoaded"
            icon="User"
            class="overflow-hidden text-gray-500 rounded-full"
        />
        <img
            v-if="showImage"
            :src="avatarUrl(username)"
            class="flex-none inline-block h-4 rounded-full"
            :class="{ hidden: !creatorImageLoaded }"
            @error="showImage = false"
            @load="creatorImageLoaded = true"
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
            const creatorImageLoaded = ref(false)
            const showImage = ref(true)

            const { openUserSidebar } = useUserPreview()

            return {
                openUserSidebar,
                creatorImageLoaded,
                avatarUrl,
                showImage,
            }
        },
    })
</script>
