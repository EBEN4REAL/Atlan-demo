<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
        placement="bottomRight"
    >
        <slot></slot>
        <template #overlay>
            <a-menu class="" style="min-width: 200px" mode="vertical">
                <a-menu-item
                    v-if="editPermission"
                    key="announcement"
                    class="px-4 py-2"
                    @click="closeMenu"
                    ><AnnouncementModal
                        :updating="announcementTitle(asset) ? true : false"
                        :asset="asset"
                        ><template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon icon="Megaphone" />
                                <span class="pl-2 text-sm"
                                    >{{
                                        announcementTitle(asset)
                                            ? 'Edit'
                                            : 'Add'
                                    }}
                                    Announcement</span
                                >
                            </div></template
                        ></AnnouncementModal
                    ></a-menu-item
                >
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'

    import AnnouncementModal from '@common/widgets/announcement/addAnnouncementModal.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'KebabMenu',
        components: { AnnouncementModal },
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
        setup() {
            const isVisible = ref(false)
            const { announcementTitle } = useAssetInfo()

            const closeMenu = () => {
                isVisible.value = false
            }

            return {
                announcementTitle,
                isVisible,
                closeMenu,
            }
        },
    })
</script>
