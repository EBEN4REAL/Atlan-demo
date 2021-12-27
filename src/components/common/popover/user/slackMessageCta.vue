<template>
    <div
        @click="handleClick"
        class="flex items-center px-1 overflow-hidden rounded-full cursor-pointer hover:scale-125 slack-cta hover:bg-primary-light"
    >
        <AtlanIcon
            :icon="'Slack'"
            class="overflow-visible slack-icon"
        ></AtlanIcon>
        <span class="pr-1 ml-1 text-sm text-gray-600 cta-text">Say Hi 👋</span>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/useSlack'

    export default {
        name: 'PopoverUser',
        components: { AtlanIcon },
        props: {
            slackLink: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: [],
        setup(props) {
            const { slackLink } = toRefs(props)
            const handleClick = () => {
                window.open(getDeepLinkFromUserDmLink(slackLink.value))
            }
            return {
                getDeepLinkFromUserDmLink,
                handleClick,
            }
        },
    }
</script>
<style lang="less" scoped>
    .slack-cta {
        max-width: 24px;
        height: 22px;
        transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1) 100ms;
        &:hover {
            max-width: 100%;
        }
    }
    .slack-icon {
        margin-left: 3px;
    }
    .cta-text {
        margin-right: 3px;
        white-space: nowrap;
    }
</style>
