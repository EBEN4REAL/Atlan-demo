<template>
    <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="(item, index) in relationshipAssets" :key="index">
            <template #tab>
                <div>{{ item.displayText }}</div>
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

    export default defineComponent({
        components: { BiWidgetTabPanel },
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
