<template>
    <div class="pt-6">
        <div class="flex w-full">
            <a-tabs v-model:activeKey="activeTabKey" class="w-full">
                <a-tab-pane key="1" tab="Linked Assets (56)">
                    <div class="w-full mt-2 border rounded asset-list"></div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Linked Terms (6)">
                    <div class="w-full mt-2 border rounded asset-list"></div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue';
    export default defineComponent({
        name: 'ClassificationHeader',
        components: {},
        props: {},
        setup(props, context) {
            const assetSearchText = ref('');
            const handleAssetSearch = (e) => {
                assetSearchText.value = e.target.value;
            };
            const activeTabKey = ref('1');
            return {
                activeTabKey,
                assetSearchText,
                handleAssetSearch,
            };
        },
    });
</script>
<style lang="less" scoped>
    .three-dots {
        height: fit-content;
        cursor: pointer;
    }
    .search-input {
        max-width: 30%;
    }
    .linked-btn-active {
        background-color: #e9eefa;
        color: #2251cc;
    }
    .asset-list {
        height: calc(100vh - 26rem);
    }
</style>
