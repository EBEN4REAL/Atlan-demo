<template>
    <div class="z-20">
        <glossaryContextSwitcher v-model:currentGlossaryGuid="parentGlossaryGuid" />
        <glossaryTree
            :glossaryList="[]"
            :is-home="true"
            :tree-data="treeData"
            :on-load-data="onLoadData"
            :select-node="selectNode"
            :expand-node="expandNode"
            :drag-and-drop="dragAndDropNode"
            :is-loading="isInitingTree"
            :loaded-keys="loadedKeys"
            :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys"
            :collapse-all="collapseAll"
            current-guid=""
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, provide, toRef } from 'vue'
    import { useHead } from '@vueuse/head'

    // components
    import glossaryTree from '@/glossary/tree/glossaryTree.vue'
    import glossaryContextSwitcher from '@/glossary/tree/glossaryContextSwitcher.vue'

    // composables
    import useGlossaryTree from '~/composables/glossary/useGlossaryTree'
    // import useBusinessMetadata from '~/components/admin/custom-metadata/composables/useBusinessMetadata'

    // store
    // import useBusinessMetadataStore from '~/store/businessMetadata/index'

    // types

    export default defineComponent({
        components: {
            glossaryTree,
            glossaryContextSwitcher
        },
        props: ['id', 'class'],
        setup(props, { emit }) {
            useHead({
                title: 'Glossary',
            })
            const parentGlossaryGuid = ref('69e06f30-fb85-44b6-b16e-874814deba79')

            const {
                treeData,
                loadedKeys,
                onLoadData,
                isInitingTree,
                expandedKeys,
                expandNode,
                selectNode,
                dragAndDropNode,
                selectedKeys,
                reInitTree,
                collapseAll,
            } = useGlossaryTree({
                emit,
                filterMode: true,
                parentGlossaryGuid,
            })
         

            return {
                treeData,
                loadedKeys,
                onLoadData,
                isInitingTree,
                expandedKeys,
                expandNode,
                selectNode,
                reInitTree,
                collapseAll,
                dragAndDropNode,
                selectedKeys,
                parentGlossaryGuid
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
