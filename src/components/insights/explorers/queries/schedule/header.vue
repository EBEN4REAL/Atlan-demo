<template>
    <div
        class="flex justify-between w-full p-6 border-b border-gray-200 rounded-t-lg bg-primary-light"
        style="min-height: 100px"
    >
        <div>
            <p class="mb-1 text-lg font-bold text-gray-700">
                New Schedule Query
            </p>
            <div class="flex items-center text-gray-700">
                <div class="flex items-center text-sm">
                    <img
                        :src="
                            getConnectorImage(item?.attributes?.connectionName)
                        "
                        class="w-4 h-4 mr-1"
                        style="min-width: 1rem"
                    />

                    <span>
                        {{
                            connectionName(item) ? connectionName(item) : '-'
                        }}</span
                    >
                </div>
                <span class="mx-2 text-gray-400 opacity-50">/</span>
                <div class="flex items-center text-sm">
                    <AtlanIcon icon="QueryVerified" class="w-4 h-4 mr-1" />

                    <span class="text-sm">{{ item?.attributes?.name }}</span>
                </div>
            </div>
        </div>
        <div class="flex items-start">
            <div class="flex items-center text-gray-500">
                <AtlanIcon icon="External" class="mr-1 -mt-0.5" />
                <span class="">Learn more</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { useConnectionStore } from '~/store/connection'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'Schedule Query Header',
        components: {},
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const { connectionName } = useAssetInfo()
            const store = useConnectionStore()
            const getConnectorImage = (sourceid) => {
                return store.getConnectorImageMapping[sourceid?.toLowerCase()]
            }

            return {
                item,
                connectionName,
                getConnectorImage,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
