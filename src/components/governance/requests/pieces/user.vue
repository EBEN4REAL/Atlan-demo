<template>
    <a-popover :mouseEnterDelay="0.3" placement="leftTop" trigger="hover">
        <template #content>
            <UserInfo v-if="user" :user="user" />
        </template>
        <Pill v-if="isPill" :label="user?.username || 'Bot'">
            <template #prefix>
                <AtlanIcon icon="AddUser" />
            </template>
        </Pill>
        <span v-else class="text-gray-700">{{ user?.username || 'Bot' }}</span>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import UserInfo from '~/components/common/hovercards/ownerInfo.vue'
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
