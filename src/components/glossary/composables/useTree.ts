import { watch, ref, Ref, computed, ComputedRef, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { useRouter, useRoute } from 'vue-router'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'

import useUpdateGtcEntity from '~/components/glossary/composables/useUpdateGtcEntity'

import { Glossary as GlossaryApi } from '~/api/atlas/glossary'
import store from '~/utils/storage'

// composables
import useGTCEntity from '~/components/glossary/composables/useGtcEntity'

const useTree = (
    emit: any,
    optimisticUpdate?: boolean,
    cacheKey?: string,
    isAccordion?: boolean
) => {
    const route = useRoute()
    const router = useRouter()

    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, 'root' | string> = {}

    const categoryMap: {
        [key: string]: Components.Schemas.AtlasGlossaryCategory[]
    } = {}
    const treeData = ref<TreeDataItem[]>([])
    const parentGlossary = ref<Glossary>()
    const isInitingTree = ref(false)
    const loadedKeys = ref<string[]>([])
    const selectedCacheKey = `${cacheKey}_selected`
    const expandedCacheKey = `${cacheKey}_expanded`
    const selectedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])

    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const currentGuid = ref<string>(route.params.id as string)
    const fetchGuid = ref<string>(currentGuid.value)
    const currentType = ref(
        router.currentRoute.value.fullPath.split('/')[
            router.currentRoute.value.fullPath.split('/').length - 2
        ] as 'glossary' | 'category' | 'term'
    )
    const fetchType = ref(currentType.value)

    const currentEntity = ref<Glossary | Category | Term>()
    const {
        entity: fetchedEntity,
        referredEntities,
        error,
        isLoading,
        refetch,
    } = useGTCEntity<Glossary | Term | Category>(
        // type,
        // currentGuid,
        fetchType,
        fetchGuid,
        true,
        false
    )

    const returnTreeDataItemAttributes = (item:  Components.Schemas.AtlasGlossaryCategory | Components.Schemas.AtlasGlossaryTerm, type: 'term' | 'category', parentGlossaryGuid: string, isRoot?: Boolean, parentCategoryId?: string) => {
        return {
                ...item,
                title: item.name,
                key: item.guid,
                glossaryID: parentGlossaryGuid,
                parentCategoryId: parentCategoryId,
                type,
                isRoot,
                isLeaf: type === 'term' ? true : false
            }
    }

    /** *
     * @param targetGuid - guid / key of the node whose path needs to be found
     *
     * Given the guid of a child node, finds and return the path to that node.
     * The last element of the returned array is the top parent of the node
     *
     * [ targetNode, ....., child2, child1, topParent ]
     */
    const recursivelyFindPath = (
        targetGuid: string,
        initialStack?: string[]
    ) => {
        const parentStack = initialStack?.length ? initialStack : [targetGuid]

        const findPath = (currGuid: string) => {
            if (
                nodeToParentKeyMap[currGuid] &&
                nodeToParentKeyMap[currGuid] !== 'root'
            ) {
                parentStack.push(nodeToParentKeyMap[currGuid])
                findPath(nodeToParentKeyMap[currGuid])
            }
        }

        findPath(targetGuid)

        return parentStack
    }

    /**
     * Reinitializes the entire tree while and **loses the expanded state of the tree**
     * @param guid - Guid of the parent Glossary
     */
    const initTreeData = async (guid: string) => {
        const categoryList = await GlossaryApi.ListCategoryForGlossary(guid, {}) // all categories in a glossary
        const termsList = await GlossaryApi.ListTermsForGlossary(guid, {}) // root level terms

        categoryMap[guid] = categoryList
        treeData.value = []

        categoryList.forEach((element) => {
            // if category is root level, i.e `categoryGuid` does not exist
            if (!element.parentCategory?.categoryGuid) {
                if (element.guid) nodeToParentKeyMap[element.guid] = 'root'
                treeData.value.push(returnTreeDataItemAttributes(element, 'category', guid))
            }
        })
        termsList.forEach((element) => {
            if (element.guid) nodeToParentKeyMap[element.guid] = 'root'
            treeData.value.push(returnTreeDataItemAttributes(element, 'term', guid))        
        })
        isInitingTree.value = false
        // selectedKeys.value.push(guid)
        // Logic to expand tree
        // if(currentEntity.value?.typeName === 'AtlasGlossaryCategory'){
        //     loadedKeys.value.push(currentEntity.value?.attributes?.parentCategory?.guid)

        // }
    }

    /**
     * Asynchronously fetches children of a node and appends them
     */
    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isOpen = true

        if (treeNode.dataRef.children) {
        } else if (treeNode.dataRef.type === 'glossary') {
            try {
                const response = await GlossaryApi.ListCategoryForGlossary(
                    treeNode.dataRef.key,
                    {},
                    { cache: true }
                )
                const termsList = await GlossaryApi.ListTermsForGlossary(
                    treeNode.dataRef.key,
                    {},
                    { cache: true }
                )
                categoryMap[treeNode.dataRef.key] = response
                response.forEach((element) => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    if (!element.parentCategory?.categoryGuid) {
                        treeNode.dataRef.children.push(returnTreeDataItemAttributes(element, 'category', treeNode.dataRef.key, true))
                    }
                })
                termsList.forEach((element) => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    treeNode.dataRef.children.push(returnTreeDataItemAttributes(element, 'term', treeNode.dataRef.key))
                })
                treeData.value = [...treeData.value]
                loadedKeys.value.push(treeNode.dataRef.key)
            } catch (error) {
                console.log(error)
            }
        } else if (treeNode.dataRef.type === 'category') {
            // find all categories which are children
            const children = categoryMap[treeNode.dataRef.glossaryID]?.filter(
                (item) =>
                    item.parentCategory?.categoryGuid === treeNode.dataRef.key
            )

            children?.forEach((child) => {
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = []
                }
                if (child.guid) {
                    nodeToParentKeyMap[child.guid] = treeNode.dataRef.key
                }
                treeNode.dataRef.children.push(returnTreeDataItemAttributes(child, 'category', treeNode.dataRef.glossaryID, true, treeNode.dataRef.key))
            })
            try {
                const termsList = await GlossaryApi.ListTermsForCategory(
                    treeNode.dataRef.key,
                    {},
                    { cache: true }
                )
                termsList.forEach((element) => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    if (element.guid) {
                        nodeToParentKeyMap[element.guid] = treeNode.dataRef.key
                    }
                    treeNode.dataRef.children.push(returnTreeDataItemAttributes(element, 'term', treeNode.dataRef.key, false, treeNode.dataRef.key))
                })
                loadedKeys.value.push(treeNode.dataRef.key)
            } catch (err) {
                console.log(err)
            }
            treeData.value = [...treeData.value]
        }
    }

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        if (!event.node.isLeaf) {
            const key: string = event.node.eventKey
            const isExpanded = expandedKeys.value?.includes(key)
            if (!isExpanded) {
                if (isAccordion && event.node.dataRef.isRoot) {
                    expandedKeys.value = []
                }
                expandedKeys.value?.push(key)
            } else if (isExpanded) {
                const index = expandedKeys.value?.indexOf(key)
                expandedKeys.value?.splice(index, 1)
            }
            expandedKeys.value = [...expandedKeys.value]
        }
        store.set(expandedCacheKey, expandedKeys.value)
    }

    const selectNode = (selected: any, event: any) => {
        if (!event.node.isLeaf) {
            expandNode([], event)
            // selectedKeys.value = []
        } else {
            if (selectedKeys.value.includes(selected)) {
                // selectedKeys.value = []
            } else {
                // selectedKeys.value = [...selected]
            }
            emit('select', event.node.eventKey)
        }
        store.set(selectedCacheKey, selectedKeys.value)
    }

    /**
     * Locally updates the attributes of a node inside the tree
     *
     * @param guid - guid/key of the node that needs to be updated
     * @param entity - The entire updated entity
     * @param name - new name
     * @param assetStatus - new status
     */
    const updateNode = ({
        guid,
        entity,
        name,
        assetStatus,
    }: {
        guid: string
        entity?: Glossary | Category | Term
        name?: string
        assetStatus?: string
    }) => {
        if (nodeToParentKeyMap[guid] === 'root') {
            // if the node is at the root level, just loop through the treeData linearly
            treeData.value = treeData.value.map((treeNode) => {
                if (treeNode.key === guid)
                    return {
                        ...treeNode,
                        assetStatus:
                            entity?.attributes?.assetStatus ??
                            assetStatus ??
                            treeNode.assetStatus,
                        name: entity?.attributes?.name ?? name ?? treeNode.name,
                        title:
                            entity?.attributes?.name ?? name ?? treeNode.title,
                    }
                return treeNode
            })
        } else {
            let parentStack: string[]

            const updateNodeNested = (node: TreeDataItem): TreeDataItem => {
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    return {
                        ...node,
                        assetStatus:
                            entity?.attributes?.assetStatus ??
                            assetStatus ??
                            node.assetStatus,
                        name: entity?.attributes?.name ?? name ?? node.name,
                        title: entity?.attributes?.name ?? name ?? node.title,
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((childNode: TreeDataItem) => {
                        // if the current element is in the path that is needed to reach the target node
                        if (childNode.key === currentPath) {
                            return updateNodeNested(childNode)
                        }
                        return childNode
                    }),
                }
            }

            // find the path to the node
            parentStack = recursivelyFindPath(guid)
            const parent = parentStack.pop()

            treeData.value = treeData.value.map((node: TreeDataItem) => {
                if (node.key === parent) return updateNodeNested(node)
                return node
            })
        }
    }

    /**
     * Refreshes a node via API ( All attributes and new children ) while maintaining the state
     *
     * @param guid - guid/key of the node that needs to be refetched
     */
    const refetchNode = async (guid: string | 'root') => {
        // if the root level of the tree needs a refetch
        if (guid === 'root' && parentGlossary.value?.guid) {
            const categoryList = await GlossaryApi.ListCategoryForGlossary(
                parentGlossary.value?.guid,
                {},
                {}
            )
            const termsList = await GlossaryApi.ListTermsForGlossary(
                parentGlossary.value?.guid,
                {},
                {}
            )
            categoryMap[parentGlossary.value?.guid] = categoryList

            const updatedTreeData: TreeDataItem[] = []

            categoryList.forEach((category) => {
                const existingCategory = treeData.value.find(
                    (entity) => entity.guid === category.guid
                )
                // if the category already exists,ignore it so as to maintain the expanded state
                if (existingCategory) {
                    updatedTreeData.push(existingCategory)
                } else if (!category.parentCategory?.categoryGuid) {
                    // if a new category is found at the root level, append it

                    nodeToParentKeyMap[category.guid] = 'root';
                    updatedTreeData.push(returnTreeDataItemAttributes(category, 'category', parentGlossary.value?.guid ?? '', true))
                }
            })
            termsList.forEach((term) => {
                const existingTerm = treeData.value.find(
                    (entity) => entity.guid === term.guid
                )
                // if term already exists, append the existing one
                if (existingTerm) {
                    updatedTreeData.push(existingTerm)
                } else {
                    nodeToParentKeyMap[term.guid] = 'root'
                    updatedTreeData.push(returnTreeDataItemAttributes(term, 'term', parentGlossary.value?.guid ?? ''))
                }
            })

            treeData.value = updatedTreeData
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: TreeDataItem) => {
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    const categoryList =
                        await GlossaryApi.ListCategoryForGlossary(
                            parentGlossary.value?.guid ?? '',
                            {},
                            {}
                        )
                    const termsList = await GlossaryApi.ListTermsForCategory(
                        guid,
                        {},
                        {}
                    )
                    categoryMap[parentGlossary.value?.guid ?? ''] = categoryList
                    const updatedChildren: TreeDataItem[] = []

                    categoryList.forEach((category) => {
                        const existingCategory = node.children?.find(
                            (entity) => entity.guid === category.guid
                        )
                        // if current category already exists, append the existing one to maintain expanded state
                        // else append the new one
                        if (existingCategory) {
                            updatedChildren.push(existingCategory)
                        } else if (
                            category.parentCategory?.categoryGuid === node.key
                        ) {
                            nodeToParentKeyMap[category?.guid ?? ''] =
                                node.key as string
                            updatedChildren.push(returnTreeDataItemAttributes(category, 'category', parentGlossary.value?.guid ?? '', true, node.key))
                        }
                    })

                    termsList.forEach((term) => {
                        const existingTerm = node.children?.find(
                            (entity) => entity.guid === term.guid
                        )
                        if (existingTerm) {
                            updatedChildren.push(existingTerm)
                        } else {
                            nodeToParentKeyMap[term?.guid ?? ''] =
                                node.key as string
                            updatedChildren.push(returnTreeDataItemAttributes(term, 'term', parentGlossary.value?.guid, false, node.key))
                        }
                    })

                    return {
                        ...node,
                        children: updatedChildren,
                    }
                }
                const updatedChildren: TreeDataItem[] = []

                // eslint-disable-next-line no-restricted-syntax
                for (const childNode of node?.children ?? []) {
                    // if the current node is in the path that is needed to reach the target node
                    if (childNode.key === currentPath) {
                        const updatedNode = await updateNodeNested(childNode)
                        updatedChildren.push(updatedNode)
                    } else {
                        updatedChildren.push(childNode)
                    }
                }
                return {
                    ...node,
                    children: updatedChildren,
                }
            }

            // find the path to the node
            parentStack = recursivelyFindPath(guid)
            const parent = parentStack.pop()

            const updatedTreeData: TreeDataItem[] = []

            // eslint-disable-next-line no-restricted-syntax
            for (const node of treeData.value) {
                if (node.key === parent) {
                    const updatedNode = await updateNodeNested(node)
                    updatedTreeData.push(updatedNode)
                } else {
                    updatedTreeData.push(node)
                }
            }

            treeData.value = updatedTreeData
        }
    }

    const reOrderNodes = (
        nodeKey: string,
        fromGuid: string,
        toGuid: string,
        updatedCategories: any
    ) => {
        let parentStack: string[]
        let nodeToReorder: TreeDataItem

        const removeNode = (node: TreeDataItem): TreeDataItem => {
            const currentPath = parentStack.pop()
            if (node.key === fromGuid && !currentPath) {
                nodeToReorder = node.children?.find(
                    (childNode) => childNode.key === nodeKey
                )
                return {
                    ...node,
                    children: node.children?.filter(
                        (childNode) => childNode.key !== nodeKey
                    ),
                }
            }
            return {
                ...node,
                children: node.children?.map((childNode: TreeDataItem) => {
                    if (childNode.key === currentPath) {
                        return removeNode(childNode) ?? childNode
                    }
                    return childNode
                }),
            }
        }
        const addNode = (node: TreeDataItem): TreeDataItem => {
            const currentPath = parentStack.pop()
            const newChildren: TreeDataItem[] = []

            node.children?.forEach((childNode: TreeDataItem) => {
                if (childNode.key === currentPath) {
                    newChildren.push(addNode(childNode) ?? childNode)
                } else {
                    newChildren.push(childNode)
                }
            })
            if (node.key === toGuid && (!currentPath && nodeToReorder)) {
                nodeToReorder.parentCategoryId = toGuid
                nodeToReorder.parentCategory = toGuid
                nodeToReorder.categories = updatedCategories
                newChildren.push(nodeToReorder)
            }
            return {
                ...node,
                children: newChildren,
            }
        }

        // remove
        if(fromGuid === 'root') {
            treeData.value = treeData.value.filter((node) => {
                if(node.key === nodeKey) {
                    nodeToReorder = node;
                    return false
                }
                return true
            })
        } else {
            parentStack = recursivelyFindPath(fromGuid)
            const parent = parentStack.pop()
    
            treeData.value = treeData.value.map((node: TreeDataItem) => {
                if (node.key === parent) return removeNode(node)
                return node
            })
        }


        parentStack = recursivelyFindPath(toGuid)
        const toParent = parentStack.pop()
        treeData.value = treeData.value.map((node: TreeDataItem) => {
            if (node.key === toParent) return addNode(node)
            return node
        })

        nodeToParentKeyMap[nodeKey] = toGuid
    }

    const dragAndDropNode = async ({ dragNode, node }) => {
        // const { data: updatedEntity, updateEntity } = useUpdateGtcEntity()
        if (node.dataRef.type === 'category') {
            if (dragNode.dataRef.type === 'term') {
                if (dragNode.dataRef.categories?.length) {
                    const orignalCategories = dragNode.dataRef.categories
                    const fromGuid = dragNode.dataRef.parentCategoryId
                    const toGuid = node.dataRef.guid

                    const newCategories = dragNode.dataRef.categories?.filter(
                        (category: any) =>
                            category.categoryGuid !==
                            dragNode.dataRef.parentCategoryId
                    )
                    newCategories.push({
                        categoryGuid: node.dataRef.guid,
                    })
                    if (optimisticUpdate) {
                        reOrderNodes(
                            dragNode.dataRef.guid,
                            fromGuid,
                            toGuid,
                            newCategories
                        )

                        const { data, error: dropError } =
                            GlossaryApi.UpdateGlossaryTerm(
                                dragNode.dataRef.guid,
                                {
                                    ...dragNode.dataRef,
                                    categories: newCategories,
                                }
                            )
                        watch(dropError, (err) => {
                            setTimeout(() => {
                                reOrderNodes(
                                    dragNode.dataRef.guid,
                                    toGuid,
                                    fromGuid,
                                    orignalCategories
                                )
                            }, 1500)
                        })
                    } else {
                        const { data, error: dropError } =
                            GlossaryApi.UpdateGlossaryTerm(
                                dragNode.dataRef.guid,
                                {
                                    ...dragNode.dataRef,
                                    categories: newCategories,
                                }
                            )

                        watch(data, async (newData) => {
                            if (newData.guid) {
                                // await refetchNode(node.dataRef.guid)
                                // refetchNode(dragNode.dataRef.parentCategoryId)
                                reOrderNodes(
                                    dragNode.dataRef.guid,
                                    dragNode.dataRef.parentCategoryId,
                                    node.dataRef.guid,
                                    newCategories
                                )
                            }
                        })
                    }
                } else {
                    const newCategories = [
                        {
                            categoryGuid: node.dataRef.guid,
                        },
                    ]

                    if (optimisticUpdate) {
                        const toGuid = node.dataRef.guid
                        
                        reOrderNodes(
                            dragNode.dataRef.guid,
                            'root',
                            toGuid,
                            newCategories
                        )

                        const { data, error: dropError } =
                        GlossaryApi.UpdateGlossaryTerm(
                            dragNode.dataRef.guid,
                            {
                                ...dragNode.dataRef,
                                categories: newCategories,
                            }
                        )
                        watch(dropError, (err) => {
                            setTimeout(() => {
                                reOrderNodes(
                                    dragNode.dataRef.guid,
                                    toGuid,
                                    'root',
                                    []
                                )
                            }, 1500)
                        })
                    } else {
                        const { data } = GlossaryApi.UpdateGlossaryTerm(
                            dragNode.dataRef.guid,
                            {
                                ...dragNode.dataRef,
                                categories: newCategories,
                            }
                        )
    
                        watch(data, async (newData) => {
                            if (newData?.guid) {
                                await refetchNode('root')
                                refetchNode(node.dataRef.guid)
                            }
                        })
                    }
                    // updateEntity('term', dragNode.dataRef.guid, {
                    //     categories: newCategories,
                    // })
                }
            }
        }
    }

    const reInitTree = () => {
        fetchGuid.value = currentGuid.value
        refetch()
    }

    watch(fetchGuid, (newGuid) => {
        if (
            fetchType.value === 'glossary' &&
            parentGlossary.value?.guid !== newGuid
        ) {
            isInitingTree.value = true
            expandedKeys.value = []
            loadedKeys.value = []
        }
    })

    watch(fetchedEntity, (newEntity) => {
        if (newEntity?.typeName === 'AtlasGlossary') {
            if (parentGlossary.value?.guid !== newEntity.guid) {
                parentGlossary.value = newEntity
                treeData.value = []
                initTreeData(fetchGuid.value)
                // refetchGlossary('root')
            }
        } else if (
            newEntity?.typeName === 'AtlasGlossaryCategory' ||
            newEntity?.typeName === 'AtlasGlossaryTerm'
        ) {
            if (!treeData.value?.length) {
                if (
                    referredEntities.value[newEntity?.attributes?.anchor?.guid]
                        ?.guid
                ) {
                    parentGlossary.value =
                        referredEntities.value[newEntity.attributes.anchor.guid]

                    if (parentGlossary.value?.guid)
                        initTreeData(parentGlossary.value.guid)
                } else {
                    fetchType.value = 'glossary'
                    fetchGuid.value = newEntity?.attributes?.anchor?.guid
                    refetch()
                }
                currentEntity.value = fetchedEntity.value
            }
        }
    })

    watch(
        () => route.params.id,
        (newId) => {
            currentGuid.value = newId as string
            currentType.value = router.currentRoute.value.fullPath.split('/')[
                router.currentRoute.value.fullPath.split('/').length - 2
            ] as 'glossary' | 'category' | 'term'

            fetchType.value = currentType.value
            fetchGuid.value = currentGuid.value

            if (
                !treeData.value?.length ||
                !parentGlossary.value?.guid ||
                (parentGlossary.value?.guid !== currentGuid.value &&
                    currentType.value === 'glossary')
            ) {
                refetch()
            }

            selectedKeys.value = [currentGuid.value]
        }
    )
    onMounted(() => {
        isInitingTree.value = true
    })

    return {
        treeData,
        loadedKeys,
        currentGuid,
        currentType,
        parentGlossary,
        isInitingTree,
        selectedKeys,
        expandedKeys,
        selectedCache,
        expandedCache,
        reInitTree,
        onLoadData,
        expandNode,
        selectNode,
        dragAndDropNode,
        updateNode,
        refetchNode,
    }
}

export default useTree
