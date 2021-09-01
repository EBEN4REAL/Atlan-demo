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
            class="bg-white"
        >
            <div>
                <glossaryTree
                    :glossary-list="glossaryList"
                    :is-home="isHome"
                    :tree-data="treeData"
                    :on-load-data="onLoadData"
                    :select-node="selectNode"
                    :expand-node="expandNode"
                    :parent-glossary="parentGlossary"
                    :is-loading="isInitingTree"
                    :current-guid="currentGuid"
                    :loaded-keys="loadedKeys"
                    :selected-keys="selectedKeys"
                    :expanded-keys="expandedKeys"
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
    import { defineComponent, ref, watch, computed, provide} from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRouter } from 'vue-router'

    // components
    import GlossaryTree from '@common/tree/glossary/index.vue'
    import CreateGlossaryModal from '@common/tree/glossary/createGlossaryModal.vue'
    import UpdateGlossaryModal from '@common/tree/glossary/updateGlossaryModal.vue'
    import glossaryTree from '@/glossary/tree/glossaryTree.vue'

    // composables
    import useGlossaryList from '~/composables/glossary/useGlossaryList'
    import useTree from '~/composables/glossary/useTree'

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

            const { glossaryList, refetch: refetchGlossaryList } =
                useGlossaryList()

            const { 
                treeData,
                loadedKeys, 
                currentGuid, 
                onLoadData, 
                parentGlossary, 
                isInitingTree,
                selectedKeys, 
                expandedKeys, 
                expandNode, 
                selectNode,
                updateNode,
                refetchGlossary
            } = useTree(emit)
                
            // computed
            const isHome = computed(
                () =>
                    router.currentRoute.value.path.split('/')[
                        router.currentRoute.value.path.split('/').length - 1
                    ] === 'glossary'
            )

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

            // router updates
            const backToHome = () => router.push('/glossary')
            const backToGlossary = () =>
                router.push(`/glossary/${parentGlossary.value?.guid}`)

            // watchers
            watch(isHome, (newIsHome) => {
                if (newIsHome) {
                    refetchGlossaryList()
                }
            });

            provide('updateTreeNode', updateNode)
            provide('refetchGlossaryTree', refetchGlossary);
            
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
    // fetch current guid element
    // if glossary, fetch cat and term (call loadData once)
    // if not glossary, fetch parent glossary and call loadData
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
