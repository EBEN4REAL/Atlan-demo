<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        width="25%"
        :closable="false"
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">Delete Announcement</p>
            <p class="text-md">
                Are you sure you want to delete the announcement for
                <span class="font-bold">{{ title(asset) }}</span>
            </p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <a-button @click="handleCancel">Cancel</a-button>
            <a-button
                type="danger"
                :loading="isLoading"
                @click="handleAnnouncementDelete"
                >Delete</a-button
            >
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        name: 'AnnouncementModal',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)
            const { title } = useAssetInfo()

            const visible = ref<boolean>(false)

            const { isLoading, handleAnnouncementDelete } =
                updateAssetAttributes(asset)

            const handleCancel = () => {
                visible.value = false
            }

            const showModal = async () => {
                visible.value = true
            }

            return {
                showModal,
                handleAnnouncementDelete,
                title,
                isLoading,
                handleCancel,
                visible,
            }
        },
    })
</script>
