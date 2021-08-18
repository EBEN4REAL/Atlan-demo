<template>
    <div class="px-5 py-11">
        <p class="font-bold">Description</p>
        <DescriptionWidget :asset="asset" />
    </div>
    <a-tabs v-model:activeKey="activeKey" :class="$style.tabClasses">
        <a-tab-pane v-for="(item, index) in relationshipAssets" :key="index">
            <template #tab>
                <!-- <div>{{ item.displayText }}</div> -->
                <div class="flex items-center">
                    <!-- first letter to be uppercase -->
                    <p class="my-0 gray-500">
                        {{ item.displayText.charAt(0).toUpperCase()
                        }}{{ item.displayText.slice(1) }}
                    </p>
                    <div
                        v-if="item.length"
                        class="px-2 mx-2 bg-primary-light text-primary"
                    >
                        {{ item.length }}
                    </div>
                </div>
            </template>

            <BiWidgetTabPanel
                :assetType="item.displayText"
                :assetId="assetId"
            />
        </a-tab-pane>
    </a-tabs>
</template>
<script lang="ts">
    import { defineComponent, watch, onMounted, ref } from 'vue'
    import useEntityRelationships from '~/composables/asset/useEntityRelationships'
    import BiWidgetTabPanel from '@/asset/assetProfile/overview/biWidget/biWidgetTabPanel.vue'
    import DescriptionWidget from '@/asset/assetProfile/overview/descriptionWidget.vue'

    export default defineComponent({
        components: { BiWidgetTabPanel, DescriptionWidget },
        props: ['asset'],
        setup(props) {
            const relationshipAssets = ref([])
            const assetId = ref(props.asset.guid)
            const fetchData = () => {
                const { relationshipAssetTypes, isLoading } =
                    useEntityRelationships(props.asset.guid)

                relationshipAssets.value = relationshipAssetTypes.value
            }

            // filter required data

            onMounted(fetchData)

            return { relationshipAssets, assetId }
        },
    })
</script>

<style lang="less" module>
    .tabClasses {
        :global(.ant-tabs-tab) {
            margin: 0px 20px 0px 0px !important;
            padding: 0px 0px 20px 0px !important;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
    }
</style>
