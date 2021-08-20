<template>
    <div class="flex items-start justify-between">
        <div class="flex">
            <AssetLogo class="self-start pt-2" :asset="asset" />

            <div>
                <div
                    class="flex items-center mt-1 mb-2 text-xl font-bold lowercase "
                >
                    <span>{{ assetData.attributes.name }}</span>
                    <atlan-icon icon="Verified" class="w-auto h-4 ml-2" />
                </div>
                <div class="flex text-sm">
                    <div class="flex items-center mr-6 capitalize">
                        <img :src="integrationIcon" class="w-auto h-4 mr-2" />
                        <span>{{ assetData.attributes.integrationName }}</span>
                    </div>
                    <div class="flex items-center mr-6 lowercase">
                        <atlan-icon icon="Database" class="w-auto h-4 mr-2" />
                        <span>{{ assetData.attributes.databaseName }}</span>
                    </div>
                    <div class="flex items-center lowercase">
                        <atlan-icon icon="Schema" class="w-auto h-4 mr-2" />
                        <span class="mt-1">{{
                            assetData.attributes.schemaName
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex">
            <a-button class="px-2 mr-2"
                ><atlan-icon icon="BookmarkOutlined" class="w-auto h-4"
            /></a-button>
            <a-button class="flex items-center"
                ><atlan-icon icon="Share" class="w-auto h-4 mr-2" />
                <span class="mt-1 text-sm">Share</span></a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
        // Vue
    <<<<<<< HEAD
        import { defineComponent, ToRefs, toRefs, computed } from 'vue'
        import AssetLogo from '@/common/icon/assetIcon.vue'
    =======
        import { defineComponent, computed, inject } from 'vue'
    >>>>>>> development

        // Util
        import { SourceList } from '~/constant/source'

        export default defineComponent({
    <<<<<<< HEAD
            props: ['asset'],
            components: { AssetLogo },
            setup(props) {
                /** DATA */
                const { asset }: ToRefs = toRefs(props)
    =======
            setup() {
                /** INJECTIONS */
                const assetDataInjection = inject('assetData')
    >>>>>>> development

                /** COMPUTED */
                const assetData = computed(() => assetDataInjection?.asset)

                const integrationIcon = computed(() => {
                    const item = SourceList.find(
                        (src: { id: string }) =>
                            src.id === assetData.value.attributes.integrationName
                    )
                    return item?.image
                })

                return {
                    assetData,
                    integrationIcon,
                }
            },
        })
</script>
