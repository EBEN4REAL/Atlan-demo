<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
        placement="bottomRight"
    >
        <slot></slot>
        <template #overlay>
            <a-menu mode="vertical">
                <a-menu-item key="copyLink" @click="handleCopyProfileLink">
                    <div class="flex items-center">
                        <AtlanIcon icon="CopyOutlined" />
                        <span class="pl-2 text-sm">
                            Copy asset profile link
                        </span>
                    </div>
                </a-menu-item>

                <a-menu-item
                    v-if="intStore.integrationStatus['slack'].tenant"
                    key="slack"
                    v-auth="access.USE_INTEGRATION_ACTION"
                    class="flex items-center"
                    @click="closeMenu"
                >
                    <SlackModal :link="link" @closeParent="closeMenu">
                        <div class="flex items-center">
                            <AtlanIcon icon="Slack" />
                            <span class="pl-2 text-sm">Slack</span>
                        </div>
                    </SlackModal>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import { defineComponent, ref, PropType, toRefs, computed } from 'vue'

    // utils
    import { message } from 'ant-design-vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SlackModal from './slackModal.vue'
    import access from '~/constant/accessControl/map'
    import integrationStore from '~/store/integrations/index'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'ShareMenu',
        components: { SlackModal },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: true,
            },
        },
        setup(props, context) {
            // data
            const isVisible = ref(false)
            const { getProfilePath } = useAssetInfo()

            const intStore = integrationStore()

            const { asset } = toRefs(props)
            const closeMenu = () => {
                isVisible.value = false
            }
            const link = computed(() => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}${getProfilePath(asset.value)}`
                return text
            })
            async function handleCopyProfileLink() {
                await copyToClipboard(link.value)
                message.success('Link copied!')
                closeMenu()
            }

            return {
                intStore,
                access,
                link,
                handleCopyProfileLink,
                isVisible,
                closeMenu,
            }
        },
    })
</script>
