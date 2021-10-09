<template>
    <CreateGlossaryModal
        :event-context="eventContext"
        :visible="createGlossaryModalVisble"
        @success="handleSuccess"
        @closeModal="handleCloseModal"
    />
    <UpdateGlossaryModal
        :event-context="eventContext"
        :visible="updateGlossaryModalVisble"
        @success="handleSuccess"
        @closeModal="handleCloseModal"
    />
    <splitpanes class="h-full default-theme">
        <!-- glossary sidebar -->
        <pane
            min-size="12"
            max-size="50"
            style="min-width: 264px"
            class="z-20 bg-white"
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
                    :current-guid="currentGuid"
                    :loaded-keys="loadedKeys"
                    :selected-keys="selectedKeys"
                    :expanded-keys="expandedKeys"
                    :collapse-all="collapseAll"
                />
            </div>
        </pane>
        <!-- glossary profile -->
        <pane :size="82" class="bg-white">
            <router-view />
        </pane>
    </splitpanes>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, provide } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRouter } from 'vue-router'

    // components
    import GlossaryTree from '@common/tree/glossary/index.vue'
    import CreateGlossaryModal from '@common/tree/glossary/createGlossaryModal.vue'
    import UpdateGlossaryModal from '@common/tree/glossary/updateGlossaryModal.vue'
    import glossaryTree from '@/glossary/tree/glossaryTree.vue'

    // composables
    import useTree from '~/components/glossary/tree/composables/useTree'
    import useBusinessMetadata from '~/components/admin/custom-metadata/composables/useBusinessMetadata'

    // store
    import { useBusinessMetadataStore } from '~/store/businessMetadata/index'

    // types
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            GlossaryTree,
            glossaryTree,
            CreateGlossaryModal,
            UpdateGlossaryModal,
        },
        props: ['id', 'class'],
        setup(props, { emit }) {
            useHead({
                title: 'Glossary',
            })

            // data
            const router = useRouter()

            const parentGlossaryGuid = ref<string | undefined>('')

            const createGlossaryModalVisble = ref(false)
            const updateGlossaryModalVisble = ref(false)
            const glossaryTreeRef = ref()
            const eventContext = ref({})

            // computed
            const isHome = computed(
                () =>
                    router.currentRoute.value.path.split('/')[
                        router.currentRoute.value.path.split('/').length - 1
                    ] === 'glossary'
            )

            const {
                treeData,
                loadedKeys,
                currentGuid,
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
            } = useTree(emit, true, isHome)

            // methods
            const handleOpenModal = (context: Record<string, string>) => {
                createGlossaryModalVisble.value = true
                eventContext.value = context
            }

            const handleOpenUpdateModal = (context: Record<string, string>) => {
                updateGlossaryModalVisble.value = true
                eventContext.value = context
            }

            const handleCloseModal = () => {
                createGlossaryModalVisble.value = false
                updateGlossaryModalVisble.value = false
                eventContext.value = {}
            }

            const handleSuccess = () => {
                setTimeout(() => {
                    glossaryTreeRef.value.refreshTree()
                }, 2000)
            }

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

            provide('updateTreeNode', updateNode)
            provide('refetchGlossaryTree', refetchNode)
            provide('reInitTree', reInitTree)
            provide('refetchGlossaryList', refetchGlossaryList)
            provide('reorderTreeNodes', reOrderNodes)
            return {
                handleOpenModal,
                handleCloseModal,
                handleOpenUpdateModal,
                handleSuccess,
                backToHome,
                backToGlossary,
                onLoadData,
                expandNode,
                selectNode,
                dragAndDropNode,
                collapseAll,
                createGlossaryModalVisble,
                updateGlossaryModalVisble,
                eventContext,
                glossaryTreeRef,
                currentGuid,
                parentGlossaryGuid,
                glossaryList,
                treeData,
                loadedKeys,
                selectedKeys,
                expandedKeys,
                parentGlossary,
                isInitingTree,
                isHome,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
