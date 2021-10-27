<template>
    <splitpanes class="w-full h-full default-theme" v-if="!isHome">
        <!-- glossary sidebar -->
        <pane
            min-size="12"
            max-size="50"
            :size="12"
            style="min-width: 264px"
            class="relative z-20 bg-white"
            id="filterPane"
        >
            <div class="z-20">
                <glossaryTree
                    :glossary-list="glossaryList"
                    :is-home="isHome"
                    :tree-data="treeData"
                    :on-load-data="onLoadData"
                    :select-node="selectNode"
                    :expand-node="expandNode"
                    :drag-and-drop="dragAndDropNode"
                    :parent-glossary="parentGlossary"
                    :is-loading="isInitingTree"
                    :current-guid="guid"
                    :loaded-keys="loadedKeys"
                    :selected-keys="selectedKeys"
                    :expanded-keys="expandedKeys"
                    :collapse-all="collapseAll"
                />
            </div>
        </pane>
        <!-- glossary profile -->
        <pane :size="82" class="bg-white w-ful">
            <router-view />
        </pane>
    </splitpanes>
    <div v-else>
        <router-view />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, provide, toRef } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRouter, useRoute } from 'vue-router'

    // components
    import glossaryTree from '@/glossary/tree/glossaryTree.vue'

    // composables
    import useTree from '~/components/glossary/tree/composables/useTree'
    import useBusinessMetadata from '~/components/admin/custom-metadata/composables/useBusinessMetadata'
    import useGTCEntity from '~/components/glossary/composables/useGtcEntity'

    // store
    import useBusinessMetadataStore from '~/store/businessMetadata/index'

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

            // data
            const router = useRouter()
            const route = useRoute()

            // computed
            const isHome = computed(
                () =>
                    router.currentRoute.value.path.split('/')[
                        router.currentRoute.value.path.split('/').length - 1
                    ] === 'glossary'
            )
            const guid = toRef(props, 'id')
            // const currentGuid = ref(router.currentRoute.params?.id)
            const currentType = ref(
                router.currentRoute.value.fullPath.split('/')[
                    router.currentRoute.value.fullPath.split('/').length - 2
                ] as 'glossary' | 'category' | 'term'
            )
            const {
                entity,
                title,
                shortDescription,
                qualifiedName,
                statusObject,
                error,
                statusMessage,
                isLoading,
                refetch,
                parentGlossaryGuid
            } = useGTCEntity<Glossary | Term| Category>(
                currentType.value,
                guid,
                false,
                true
            )

            const {
                treeData,
                loadedKeys,
                glossaryList,
                onLoadData,
                parentGlossary,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                expandNode,
                selectNode,
                dragAndDropNode,
                updateNode,
                refetchNode,
                reInitTree,
                refetchGlossaryList,
                collapseAll,
                reOrderNodes,
            } = useTree({emit, optimisticUpdate: true, parentGlossaryGuid})

            // * Get all available BMs and save on storez
            const store = useBusinessMetadataStore()
            const { fetchBMonStore } = useBusinessMetadata()
            if (!store.businessMetadataListLoaded) fetchBMonStore()

            // router updates
            const backToHome = () => router.push('/glossary')
            const backToGlossary = () =>
                router.push(`/glossary/${parentGlossary.value?.guid}`)

            // watchers
            watch(isHome, (newIsHome) => {
                if (newIsHome) {
                    refetchGlossaryList()
                }
            })
            watch(router.currentRoute, (newRoute) => {
            guid.value = newRoute.params.id as string
            currentType.value = 
                newRoute.fullPath.split('/')[
                    router.currentRoute.value.fullPath.split('/').length - 2
                ] as 'glossary' | 'category' | 'term'
            

            })

            provide('refetchGlossaryList', refetchGlossaryList)
            provide('glossaryList', glossaryList)

            provide('updateTreeNode', updateNode)
            provide('refetchGlossaryTree', refetchNode)
            provide('reInitTree', reInitTree)
            provide('reorderTreeNodes', reOrderNodes)

            provide('currentEntity', entity)
            provide('currentTitle', title)
            provide('currentShortDescription', shortDescription)
            provide('currentQualifiedName', qualifiedName)
            provide('statusObject', statusObject)
            provide('profileError', error)
            provide('statusMessage', statusMessage)
            provide('profileIsLoading', isLoading)
            provide('refreshEntity', refetch)

            return {
                backToHome,
                backToGlossary,
                onLoadData,
                expandNode,
                selectNode,
                dragAndDropNode,
                collapseAll,
                glossaryList,
                treeData,
                loadedKeys,
                selectedKeys,
                expandedKeys,
                parentGlossary,
                isInitingTree,
                isHome,
                guid,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
