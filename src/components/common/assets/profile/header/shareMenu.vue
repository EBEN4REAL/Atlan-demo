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
                    key="slack"
                    class="flex items-center"
                    @click="openSlackModal"
                >
                    <SlackModal @closeParent="closeMenu">
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
    import { defineComponent, ref, PropType, toRefs } from 'vue'

    // utils
    import { message } from 'ant-design-vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SlackModal from './slackModal.vue'

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

            const { asset } = toRefs(props)
            const closeMenu = () => {
                isVisible.value = false
            }
            async function handleCopyProfileLink() {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/assets/${asset.value?.guid}/overview`
                await copyToClipboard(text)
                message.success('Link copied!')
                closeMenu()
            }

            const openSlackModal = () => {}

            return {
                openSlackModal,
                handleCopyProfileLink,
                isVisible,
                closeMenu,
            }
        },
    })
</script>
