<template>
    <div
        v-if="slackEnabled"
        class="flex items-center  overflow-hidden rounded-full cursor-pointer   "
        :class="{'hover:scale-125 px-1 slack-cta hover:bg-primary-light':ctaText?.length}"
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
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/slack/useSlack'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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
                useAddEvent('integration', 'slack', 'message_cta_clicked', {
                    type:
                        entity.value.username || !entity.value.alias // logic to check if entity is user or group
                            ? 'user'
                            : 'group',
                })
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
