<template>
    <a-popover :mouseEnterDelay="0.3" placement="leftTop" trigger="hover">
        <template #content>
            <UserInfo :user="user" />
        </template>
        <Pill v-if="isPill" :label="user.username">
            <template #prefix>
                <AtlanIcon icon="AddUser" />
            </template>
        </Pill>
        <span v-else class="text-gray-500">{{ user.username }}</span>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import UserInfo from '@/discovery/preview/hovercards/ownerInfo.vue'
    import Pill from '~/components/UI/pill/pill.vue'

    export default defineComponent({
        props: {
            user: {
                type: Object,
                required: true,
            },
            isPill: {
                type: Boolean,
                required: false,
                default: () => true,
            },
        },
        components: { UserInfo, Pill },
        setup(props) {
            return {}
        },
    })
</script>
