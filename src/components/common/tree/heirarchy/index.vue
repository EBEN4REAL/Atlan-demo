<template>
    <a-tree-select
        :block-node="true"
        :tree-data="treeData"
        :load-data="onLoadData"
        tree-data-simple-mode
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
    import { ref, defineComponent } from 'vue'

    import useAssetTree from '~/composables/bots/useAssetTree'
    import {
        BaseAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection'
    import { useConnectionsStore } from '~/store/connections'
    import { SearchParameters } from '~/types/atlas/attributes'

    export default defineComponent({
        components: {},
        setup(props, { emit }) {
            const store = useConnectionsStore()

            const getSourceImage = (id: any) =>
                store.getSourceList?.find((src: any) => src.id == id)?.image

            const now = ref(true)
            const intialBody: SearchParameters = {
                sortBy: 'name',
                sortOrder: 'ASCENDING',
                limit: 10,
                attributes: [...BaseAttributes, ...BasicSearchAttributes],
            }
            const { treeData, onLoadData } = useAssetTree(
                now,
                'Database',
                intialBody,
                'dsasd'
            )
            return { treeData, getSourceImage, onLoadData }
        },
        data() {
            return {}
        },
    })
</script>
