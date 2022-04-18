<template>
    <a-dropdown :trigger="['contextmenu']" v-model:visible="isVisible">
        <slot name="content"></slot>
        <template #overlay>
            <a-menu>
                <a-menu-item
                    key="copyLink"
                    class="px-4 py-2"
                    @click="handleCopyProfileLink"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="CopyOutlined" />
                        <span class="pl-2 text-sm"> Copy link </span>
                    </div>
                </a-menu-item>
                <a-menu-item
                    v-if="
                        tenantSlackStatus.configured &&
                        tenantSlackStatus.channels.length
                    "
                    key="slack"
                    v-auth="access.USE_INTEGRATION_ACTION"
                    class="flex items-center px-4 py-2"
                    @click="closeMenu"
                >
                    <SlackModal
                        :link="link"
                        :asset-i-d="asset.guid"
                        :asset-type="asset.typeName"
                        @closeParent="closeMenu"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Slack" />
                            <span class="pl-2 text-sm">Share on Slack</span>
                        </div>
                    </SlackModal>
                </a-menu-item>
                <a-menu-divider></a-menu-divider>

                <a-menu-item
                    key="question"
                    v-if="
                        tenantSlackStatus.configured &&
                        tenantSlackStatus.channels.length
                    "
                    v-auth="access.USE_INTEGRATION_ACTION"
                    class="flex items-center px-4 py-2"
                    @click="closeMenu"
                >
                    <SlackModal
                        :link="assetLink"
                        :asset-i-d="asset?.guid"
                        :asset-type="asset?.typeName"
                        :ask-question-modal="true"
                        @success="onSlackModalSuccess"
                        @closeParent="closeMenu"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Slack" />
                            <span class="pl-2 text-sm">Ask a Question</span>
                        </div>
                    </SlackModal></a-menu-item
                >
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, toRefs, computed } from 'vue'

    // utils
    import AnnouncementModal from '@common/widgets/announcement/addAnnouncementModal.vue'
    import { message } from 'ant-design-vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { copyToClipboard } from '~/utils/clipboard'
    import SlackModal from './slackModal.vue'
    import access from '~/constant/accessControl/map'
    import integrationStore from '~/store/integrations/index'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import SlackAskButton from '~/components/common/assets/misc/slackAskButton.vue'
    import useAskAQuestion, {
        onSlackModalSuccess,
    } from '~/composables/integrations/slack/useAskAQuestion'

    export default defineComponent({
        name: 'ContextMenu',
        components: {
            SlackModal,
        },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
                default: () => {},
            },
        },

        setup(props) {
            const isVisible = ref(false)
            const { announcementTitle, getProfilePath } = useAssetInfo()

            const store = integrationStore()
            const { tenantSlackStatus } = toRefs(store)

            const closeMenu = () => {
                isVisible.value = false
            }
            const { asset } = toRefs(props)

            const link = computed(() => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}${getProfilePath(asset.value)}`
                return text
            })
            async function handleCopyProfileLink() {
                await copyToClipboard(link.value)
                useAddEvent('discovery', 'cta_action', 'clicked', {
                    action: 'copy_link',
                    asset_type: asset.value.typeName,
                })
                message.success('Link copied!')
                closeMenu()
            }

            return {
                announcementTitle,
                isVisible,
                closeMenu,
                tenantSlackStatus,
                access,
                link,
                handleCopyProfileLink,
            }
        },
    })
</script>
