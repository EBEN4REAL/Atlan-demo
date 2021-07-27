<template>
    <a-tree-select
        :blockNode="true"
        :tree-data="treeData"
        :load-data="onLoadData"
        treeDataSimpleMode
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    >
        <template #title="{ key, value, titleText, type, connector }">
            <component :is="type" class="inline w-3 h-auto mr-1"></component>
            <span>{{ titleText }}</span>
            <img
                :src="getSourceImage(connector)"
                style="margin-top: 2px"
                class="inline float-right w-4 h-auto"
            />
        </template>
    </a-tree-select>
</template>

<script lang="ts">
    import { ref } from 'vue';
    import { defineComponent } from 'vue';
    import useAssetTree from '~/composables/bots/useAssetTree';
    import {
        BaseAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection';
    import { useConnectionsStore } from '~/store/connections';
    import { SearchParameters } from '~/types/atlas/attributes';

    export default defineComponent({
        components: {},
        data() {
            return {};
        },
        setup(props, { emit }) {
            const store = useConnectionsStore();

            const getSourceImage = (id: any) => {
                return store.getSourceList?.find((src: any) => src.id == id)
                    ?.image;
            };

            const now = ref(true);
            const intialBody: SearchParameters = {
                sortBy: 'Asset.name.keyword',
                sortOrder: 'ASCENDING',
                limit: 10,
                attributes: [...BaseAttributes, ...BasicSearchAttributes],
            };
            const { treeData, onLoadData } = useAssetTree(
                now,
                'Database',
                intialBody,
                'dsasd'
            );
            return { treeData, getSourceImage, onLoadData };
        },
    });
</script>
