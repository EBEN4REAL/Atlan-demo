<template>
    <span class="flex justify-between ml-3">
        <div class="flex items-center">
            <Avatar
                avatar-shape="circle"
                :image-url="imageUrl(group.username)"
                :allow-upload="false"
                :avatar-name="group.name"
                :avatar-size="minimal ? 30 : 40"
                class="mr-2"
            />
            <div class="ml-2">
                <div class="text-gray">
                    <div class="mr-2 font-bold">
                        {{ group.name }}
                    </div>
                    <div v-if="!minimal" class="mr-2 text-gray">
                        @{{ group.alias }}
                    </div>
                </div>
            </div>
        </div>
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'UserCard',
        components: { Avatar },
        props: {
            minimal: { type: Boolean, required: false, default: false },
            group: { type: Object, required: true },
        },
        setup() {
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            return { imageUrl }
        },
    })
</script>

<style scoped></style>
