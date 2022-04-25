<template>
    <a-popover :mouse-enter-delay="0.3" placement="leftTop" trigger="hover">
        <template #content>
            <UserInfo v-if="user" :user="user" />
        </template>
        <Pill v-if="isPill" :label="user?.username || 'Bot'">
            <template #prefix>
                <AtlanIcon icon="AddUser" />
            </template>
        </Pill>
        <span
            v-if="user?.username?.startsWith('service-account-apikey-')"
            class="text-gray-700"
        >
            <AtlanIcon icon="Key" class="h-3" /> API key
        </span>

        <Tooltip :tooltipText="user?.username || defaultName" />
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import UserInfo from '~/components/common/hovercards/ownerInfo.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import Tooltip from '~/components/common/ellipsis/index.vue'

    export default defineComponent({
        components: { UserInfo, Pill, Tooltip },
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
            defaultName: {
                type: String,
                required: false,
                default: () => 'Bot',
            },
        },
        setup(props) {
            return {}
        },
    })
</script>
