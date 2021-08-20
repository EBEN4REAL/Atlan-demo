<template>
    <div class="flex flex-col px-2 space-y-3">
        <Terms :key="item.guid" :item="item"></Terms>

        <Classifications
            :key="item.guid"
            :item="item"
            :selected-asset-data="selectedAssetData"
        ></Classifications>
        <!-- <StatusBadge :status="status(item)" :key="item.guid"></StatusBadge> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import Classifications from './classifications/index.vue'
    import Terms from './terms.vue'
    import BusinessMetadataContainer from './businessMetadataContainer.vue'

    export default defineComponent({
        components: { Classifications, Terms, BusinessMetadataContainer },
        props: {
            item: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
            selectedAssetData: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            return {}
        },
    })
</script>

<style lang="less" module></style>
