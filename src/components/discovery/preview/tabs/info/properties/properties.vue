<template>
    <div class="flex flex-col space-y-3">
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Unique ID (GUID)
            </p>
            <p class="mb-0 text-gray-700">{{ selectedAsset?.guid }}</p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">Last updated</p>
            <p class="mb-0 text-gray-700">
                {{
                    dayjs().from(
                        selectedAsset?.attributes?.__modificationTimestamp,
                        true
                    )
                }}
                ago,
                {{ selectedAsset?.attributes?.__modifiedBy }}
            </p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">Created</p>
            <p class="mb-0 text-gray-700">
                {{ dayjs().from(selectedAsset?.attributes?.__timestamp, true) }}
                ago,
                {{ selectedAsset?.attributes?.__createdBy }}
            </p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Popularity Score
            </p>
            <p class="mb-0 text-gray-700">
                {{ selectedAsset?.attributes?.popularityScore }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import dayjs from 'dayjs'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            return { dayjs }
        },
    })
</script>

<style lang="less" module></style>
