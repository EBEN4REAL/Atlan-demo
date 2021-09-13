<template>
    <div>
        <a-collapse
            v-if="applicableBMList(infoTabData.typeName).length"
            v-model:activeKey="activeKey"
            :class="$style.collapse"
            :bordered="false"
            class="bg-transparent"
        >
            <template #expandIcon="{ isActive }">
                <div class="">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="ml-1 transition-transform transform"
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>
            <a-collapse-panel
                v-for="item in applicableBMList(infoTabData.typeName)"
                :key="item.id"
                class="bg-transparent"
            >
                <template #header>
                    <div
                        :key="item.id"
                        class="flex text-sm text-gray-700 select-none header"
                    >
                        <img
                            v-if="item.image"
                            :src="item.image"
                            class="w-auto h-5 mr-2"
                        />
                        {{ item.label }}
                    </div>
                </template>
                <BusinessMetadataTabItem
                    :selected-asset="selectedAsset"
                    :item="item"
                />
            </a-collapse-panel>
        </a-collapse>
        <div v-else class="flex flex-col items-center mt-10">
            <img :src="emptyScreen" alt="No logs" class="w-2/5 m-auto mb-4" />
            <span class="text-gray-500">No Metadata Available</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import BusinessMetadataTabItem from './businessMetadataTabItem.vue'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'BusinessMetadataTab',
        components: { BusinessMetadataTabItem },
        props: {
            infoTabData: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
            page: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const activeKey = ref()

            const { getApplicableBmGroups } = useBusinessMetadataHelper()

            const applicableBMList = (typeName: string) =>
                getApplicableBmGroups(typeName)?.map((b) => ({
                    component: 'businessMetadata',
                    id: b.name,
                    label: b.options.displayName,
                    image: b.options.image || '',
                })) || []

            return {
                BusinessMetadataTabItem,
                activeKey,
                applicableBMList,
                emptyScreen,
            }
        },
    })
</script>

<style lang="less" module>
    .collapse {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            @apply px-5 !important;
            @apply py-4 !important;
        }

        :global(.ant-collapse-arrow) {
            left: 90% !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            @apply pb-0 !important;
            @apply border-b;
        }
    }
</style>
