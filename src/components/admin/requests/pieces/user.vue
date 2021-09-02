<template>
    <a-popover :mouseEnterDelay="0.3" placement="leftTop" trigger="hover">
        <template #content>
            <UserInfo :user="user" />
        </template>
        <Pill :label="user.username">
            <template #prefix>
                <AtlanIcon icon="AddUser" />
            </template>
        </Pill>
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
        },
        components: { UserInfo, Pill },
        setup(props) {
            return {}
        },
    })
</script>
