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
            <section
                class="flex items-center h-12 p-6 rounded-t-lg gap-x-3"
                :class="
                    openKeys.includes(asset.guid) ||
                    openKeys.includes(linkedAssets[x + 1]?.guid) ||
                    linkedAssets.length - 1 === x
                        ? 'border-b border-transparent'
                        : 'border-b'
                "
            >
                <div class="flex justify-between flex-grow gap-x-3">
                    <div class="flex items-center flex-grow">
                        <AssetTitle :asset="asset" />
                    </div>
                    <div class="text-sm text-new-gray-600">
                        <span class="mr-1">
                            {{ $refs?.LinkedAssetItem?.[x]?.count }}
                            properties
                        </span>
                        <AtlanIcon
                            icon="CaretDown"
                            class="transition duration-300 ease"
                            :style="
                                openKeys.includes(asset.guid)
                                    ? 'transform: rotateX(180deg)'
                                    : ''
                            "
                        />
                    </div>
                    <div class="flex mb-2">
                        <div class="">
                            <AtlanIcon
                                icon="TrashAlt"
                                class="text-red-500 cursor-pointer"
                                @click="handleClear(asset)"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </template>
        <a-menu-item>
            <div class="p-3 pt-0">
                <LinkedAssetItem
                    ref="LinkedAssetItem"
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

    import AssetTitle from '@/common/assets/list/assetTitle.vue'
    import LinkedAssetItem from '@/governance/custom-metadata/linkedAssets/linkedAssetItem.vue'
    import { removeProperty } from '@/governance/custom-metadata/linkedAssets/removeProperty'

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

    const emit = defineEmits(['success', 'error', 'metadataRemove'])

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
        @apply border rounded-lg border-new-gray-200 overflow-hidden  !important;
    }

    :global(.ant-menu-item::after) {
        @apply border-r-0 !important;
    }
</style>
