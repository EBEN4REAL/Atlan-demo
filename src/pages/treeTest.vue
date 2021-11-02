<template>
    <div class="z-20">
        <glossaryTree
            :glossary-list="glossaryList"
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
    import { useRouter, useRoute } from 'vue-router'

    // components
    import glossaryTree from '@/glossary/tree/glossaryTree.vue'

    // composables
    import useGlossaryTree from '~/composables/glossary/useGlossaryTree'
    // import useBusinessMetadata from '~/components/admin/custom-metadata/composables/useBusinessMetadata'

    // store
    // import useBusinessMetadataStore from '~/store/businessMetadata/index'

    // types
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            glossaryTree,
        },
        props: ['id', 'class'],
        setup(props, { emit }) {
            useHead({
                title: 'Glossary',
            })


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
                glossaryList
            } = useGlossaryTree({
                emit,
                filterMode: true,
                parentGlossaryGuid: ref(''),
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
                glossaryList
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
