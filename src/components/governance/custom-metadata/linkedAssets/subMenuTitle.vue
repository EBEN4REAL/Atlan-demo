<template>
    <section
        class="flex items-center h-12 p-6 border-b gap-x-3"
        @click="
            (e) => {
                if (!isScrubbed(asset)) return
                e.preventDefault()
                e.stopPropagation()
            }
        "
    >
        <div class="flex justify-between flex-grow gap-x-3">
            <div class="flex items-center flex-grow">
                <AssetTitle :asset="asset" />
            </div>
            <div class="text-sm text-new-gray-600">
                <span class="mr-1">
                    {{ count }}
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
                        v-if="isScrubbed(asset)"
                        icon="TrashAlt"
                        class="text-red-300 cursor-not-allowed"
                    />
                    <AtlanIcon
                        v-else
                        icon="TrashAlt"
                        class="text-red-500 cursor-pointer"
                        @click="emit('handleClear', asset)"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { PropType } from 'vue'
    import AssetTitle from '@/common/assets/list/assetTitle.vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    const props = defineProps({
        asset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
        count: {
            type: Object,
            required: true,
        },
        openKeys: {
            type: Array,
            required: true,
        },
    })
    const emit = defineEmits(['handleClear'])

    const { isScrubbed, ownerUsers } = useAssetInfo()
</script>

<style scoped></style>
