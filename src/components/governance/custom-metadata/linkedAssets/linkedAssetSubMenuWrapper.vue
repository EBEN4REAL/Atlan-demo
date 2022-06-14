<template>
    <a-sub-menu
        v-for="(asset, x) in linkedAssets"
        :key="asset.guid"
        class="border border-transparent"
        :class="{
            [$style.openBorder]: openKeys.includes(asset.guid),
        }"
    >
        <template #title>
            <!-- <LinkedAssetsOwnerPopover
                v-if="isScrubbed(asset) && ownerUsers(asset).length && false"
                :asset="asset"
            >
                <SubMenuTitle
                    class="rounded-lg cursor-not-allowed bg-new-gray-100"
                    :open-keys="openKeys"
                    :count="$refs?.LinkedAssetItem?.[x]?.count"
                    :asset="asset"
                    @handleClear="handleClear(asset)"
                />
            </LinkedAssetsOwnerPopover> -->

            <SubMenuTitle
                :class="{
                    ' border-transparent':
                        openKeys.includes(asset.guid) ||
                        openKeys.includes(linkedAssets[x + 1]?.guid) ||
                        linkedAssets.length - 1 === x,
                    ' cursor-not-allowed ': isScrubbed(asset),
                    ' hover:bg-gray-100': !openKeys.includes(asset.guid),
                }"
                :open-keys="openKeys"
                :count="LinkedAssetItemRef?.[x]?.count"
                :asset="asset"
                class="cursor-pointer"
                @handleClear="handleClear(asset)"
            />
        </template>

        <a-menu-item>
            <div class="p-3 pt-0">
                <LinkedAssetItem
                    :ref="
                        (el) => {
                            LinkedAssetItemRef[x] = el
                        }
                    "
                    :asset="asset"
                    :metadata="metadata"
                />
            </div>
        </a-menu-item>
    </a-sub-menu>
</template>

<script setup lang="ts">
    import { onMounted, PropType, ref, toRefs } from 'vue'

    import { message } from 'ant-design-vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    import LinkedAssetItem from '@/governance/custom-metadata/linkedAssets/linkedAssetItem.vue'
    import { removeProperty } from '@/governance/custom-metadata/linkedAssets/removeProperty'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import LinkedAssetsOwnerPopover from '@/governance/custom-metadata/linkedAssets/linkedAssetsOwnerPopover.vue'
    import SubMenuTitle from '@/governance/custom-metadata/linkedAssets/subMenuTitle.vue'

    const props = defineProps({
        linkedAssets: {
            type: Object as PropType<assetInterface[]>,
            required: true,
        },
        metadata: {
            type: Object,
            required: true,
        },
        openKeys: {
            type: Array,
            required: true,
        },
    })
    const { metadata } = toRefs(props)
    const LinkedAssetItemRef = ref([])
    const emit = defineEmits(['success', 'error', 'metadataRemove'])

    const { isScrubbed, ownerUsers } = useAssetInfo()

    const handleClear = async (asset) => {
        const { error, isReady, isLoading, mutate } = removeProperty(
            asset,
            metadata.value
        )
        try {
            message.loading({
                key: 'clear',
                content: 'Clearing Custom Metadata ...',
            })
            await mutate()
            emit('metadataRemove', asset.guid)
            message.success({
                key: 'clear',
                content: 'Custom Metadata has been cleared.',
            })
        } catch (e) {
            emit('error')
            message.error({
                key: 'clear',
                content: 'Errror clearing Custom Metadata.',
            })
        }
    }
</script>

<style scoped></style>

<style lang="less" module>
    .openBorder {
        @apply border rounded-lg border-new-gray-200 overflow-hidden mt-1 !important;
        margin-bottom: 2px !important;
    }

    :global(.ant-menu-item::after) {
        @apply border-r-0 !important;
    }
</style>
