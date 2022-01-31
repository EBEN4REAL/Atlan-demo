<template>
    <div
        v-if="slackEnabled"
        class="flex items-center px-1 overflow-hidden rounded-full cursor-pointer hover:scale-125 slack-cta hover:bg-primary-light"
        @click="handleClick"
    >
        <AtlanIcon
            :icon="'Slack'"
            class="overflow-visible slack-icon"
        ></AtlanIcon>
        <span class="pr-1 ml-1 text-sm text-gray-600 cta-text">{{
            ctaText
        }}</span>
    </div>
</template>

<script lang="ts">
    import { toRefs, computed, ref } from 'vue'
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/useSlack'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default {
        name: 'PopoverUser',
        components: { AtlanIcon },
        props: {
            ctaText: {
                type: String,
                default: 'Say Hi 👋',
                required: false,
            },
            entity: {
                type: Object,
                default: () => {},
                required: true,
            },
        },
        emits: [],
        setup(props) {
            const { entity } = toRefs(props)
            const type = ref('')
            if (entity.value.username) type.value = 'user'
            else if (entity.value.alias) type.value = 'group'

            // const userProfiles = computed(() => {
            //     if (entity.value && type.value === 'user') {
            //         return entity.value?.attributes?.profiles
            //     }
            //     return []
            // })
            const groupChannels = computed(() => {
                if (entity.value && type.value === 'group') {
                    return (
                        entity.value?.attributes?.channels ||
                        entity.value?.attributes?.profiles
                    )
                }
                return []
            })
            const slackMemberID = computed(() => {
                if (
                    entity.value?.attributes?.slack?.length &&
                    type.value === 'user'
                ) {
                    const memberID = JSON.parse(
                        entity.value.attributes.slack[0]
                    )?.userId
                    return memberID
                }
                return ''
            })
            const slackChannel = computed(() => {
                if (groupChannels.value?.length > 0) {
                    const firstChannel = JSON.parse(groupChannels.value[0])
                    if (
                        firstChannel &&
                        firstChannel.length > 0 &&
                        firstChannel[0].hasOwnProperty('slack')
                    ) {
                        return firstChannel[0].slack
                    }
                }
                return ''
            })
            const slackEnabled = computed(
                () => slackMemberID.value || slackChannel.value
            )
            const slackUrl = computed(() =>
                slackEnabled.value
                    ? getDeepLinkFromUserDmLink(slackEnabled.value)
                    : '#'
            )
            const handleClick = () => {
                window.open(slackUrl.value)
            }
            return {
                slackEnabled,
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
