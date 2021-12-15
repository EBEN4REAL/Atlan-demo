<template>
    <div class="flex items-center justify-between h-10">
        <div class="flex items-center">
            <Avatar
                avatar-shape="circle"
                :image-url="imageUrl(user)"
                :allow-upload="false"
                :avatar-name="user"
                :avatar-size="30"
                class="mr-2"
            />
            <div class="ml-2">
                <div class="text-gray">
                    <div class="mr-2 text-gray">@{{ user }}</div>
                </div>
            </div>
        </div>
        <!-- <div>
            {{ permission }}
        </div> -->
    </div>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed, PropType } from 'vue'
    import { useVModels } from '@vueuse/core'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'userItem',
        components: {
            Avatar,
        },
        props: {
            user: {
                type: String,
                required: true,
            },
            permission: {
                type: String,
                required: true,
            },
        },

        setup(props, context) {
            const imageUrl = (user: any) =>
                `${window.location.origin}/api/service/avatars/${user}`

            console.log('url: ', imageUrl)

            return { imageUrl }
        },
    })
</script>

<style lang="less" scoped></style>
<style lang="less" module></style>
