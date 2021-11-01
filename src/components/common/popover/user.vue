<template>
    <a-popover
        :trigger="trigger"
        class="user-popover"
        :placement="placement"
        :get-popup-container="(t) => t.parentNode"
    >
        <template #content>
            <div
                class="flex flex-col w-10 rounded gap-y-2"
                style="min-width: 10rem"
            >
                <section v-if="user.username" class="">
                    <Avatar
                        :image-url="user?.image || ''"
                        :allow-upload="false"
                        :avatar-name="
                            user?.fname || user?.uerName || user?.email
                        "
                        :avatar-size="40"
                        class="mr-2"
                    />
                </section>
                <section v-if="user.username" class="">
                    <div class="text-gray-500">Username:</div>
                    <div class="text-gray-700">{{ user.username }}</div>
                </section>
                <section v-if="user.fname" class="">
                    <div class="text-gray-500">First Name:</div>
                    <div class="text-gray-700">{{ user.fname }}</div>
                </section>
                <section v-if="user.lname" class="">
                    <div class="text-gray-500">Last Name:</div>
                    <div class="text-gray-700">{{ user.lname }}</div>
                </section>
                <section v-if="user.email" class="">
                    <div class="text-gray-500">Email:</div>
                    <div v-linkified class="text-gray-700">
                        {{ user.email }}
                    </div>
                </section>
                <section v-if="user.role" class="">
                    <div class="text-gray-500">Role:</div>
                    <div class="text-gray-700">{{ user.role }}</div>
                </section>
            </div>
        </template>
        <slot name="trigger"></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'UserPopover',
        components: { Avatar },
        props: {
            user: { type: Object, required: true },
            trigger: { type: String, required: false, default: 'hover' },
            placement: { type: String, required: false, default: 'top' },
        },
        setup() {
            return {}
        },
    })
</script>

<style lang="less" scoped>
    .user-popover {
        :global(.ant-popover-content) {
            --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }
        :global(.ant-popover-arrow) {
            display: none;
        }
    }
</style>
