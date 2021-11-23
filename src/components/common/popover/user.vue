<template>
    <a-popover :trigger="trigger" class="user-popover" :placement="placement">
        <template #content>
            <div class="flex flex-col rounded gap-y-2" style="min-width: 10rem">
                <section
                    v-if="
                        image ||
                        user?.first_name ||
                        user?.username ||
                        user?.email
                    "
                    class=""
                >
                    <Avatar
                        :image-url="image"
                        :allow-upload="false"
                        :avatar-name="
                            user?.first_name || user?.username || user?.email
                        "
                        :avatar-size="40"
                        class="mr-2"
                    />
                </section>
                <section v-if="user?.username" class="">
                    <div class="text-gray-500">Username:</div>
                    <div class="text-gray-700">{{ user.username }}</div>
                </section>
                <section v-if="user?.first_name" class="">
                    <div class="text-gray-500">First Name:</div>
                    <div class="text-gray-700">{{ user.first_name }}</div>
                </section>
                <section v-if="user?.last_name" class="">
                    <div class="text-gray-500">Last Name:</div>
                    <div class="text-gray-700">{{ user.last_name }}</div>
                </section>
                <section v-if="user?.email" class="">
                    <div class="text-gray-500">Email:</div>
                    <div v-linkified class="text-gray-700">
                        {{ user.email }}
                    </div>
                </section>
                <section v-if="user?.role" class="">
                    <div class="text-gray-500">Role:</div>
                    <div class="text-gray-700">{{ user.role }}</div>
                </section>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import Avatar from '~/components/common/avatar/index.vue'
    import { userInterface } from '~/types/users/user.interface'

    export default defineComponent({
        name: 'UserPopover',
        components: { Avatar },
        props: {
            user: { type: Object as PropType<userInterface>, required: true },
            trigger: { type: String, required: false, default: 'hover' },
            placement: { type: String, required: false, default: 'top' },
            image: { type: String, required: false, default: '' },
        },
        setup() {
            return {}
        },
    })
</script>

