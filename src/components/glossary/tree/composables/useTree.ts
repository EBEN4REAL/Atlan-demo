import { watch, ref, Ref, computed, ComputedRef, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'

import useUpdateGtcEntity from '~/components/glossary/composables/useUpdateGtcEntity'
import useGlossaryList from '~/components/glossary/tree/composables/useGlossaryList'

import { Glossary as GlossaryApi } from '~/services/atlas/glossary/glossary_api'
import store from '~/utils/storage'

// composables
import useGTCEntity from '~/components/glossary/composables/useGtcEntity'

const useTree = (
    emit: any,
    optimisticUpdate?: boolean,
    isHome?: ComputedRef<boolean>,
    filterMode?: boolean,
    cacheKey?: string,
    isAccordion?: boolean
) => {
    const route = useRoute()
    const router = useRouter()
    const defaultLimit = 5

    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    // categories will map to strings since categories can only have one parent ( they only belong to 1 category )
    // terms will map to string[] as a term can be inside multiple categories ( they can belong to multiple categories )
    const nodeToParentKeyMap: Record<string, 'root' | string | string[]> = {}

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

    const { glossaryList, refetch: refetchGlossaryList, updateGlossaryStatusInList } = useGlossaryList()

    const returnTreeDataItemAttributes = (
        item:
            | Components.Schemas.AtlasGlossaryCategory
            | Components.Schemas.AtlasGlossaryTerm,
        type: 'term' | 'category',
        parentGlossaryGuid: string,
        isRoot?: Boolean,
        parentCategoryId?: string
    ) => {
        return {
            ...item,
            title: item.name,
            key: item.guid,
            glossaryID: parentGlossaryGuid,
            parentCategoryId: parentCategoryId,
            type,
            isRoot,
            isLeaf: type === 'term' ? true : false,
            checkable: type === 'term' ? true : false,
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
        let parentStack = initialStack?.length ? initialStack : [targetGuid]

        const findPath = (currGuid: string) => {
            if (
                nodeToParentKeyMap[currGuid] &&
                nodeToParentKeyMap[currGuid] !== 'root'
            ) {
                const current = nodeToParentKeyMap[currGuid]
                if (typeof current === 'string') {
                    parentStack.push(current)
                    findPath(current)
                }
            }
        }
        const allPaths: string[][] = []

        const firstParent = nodeToParentKeyMap[targetGuid]

        if (typeof firstParent === 'string') {
            parentStack = initialStack?.length ? initialStack : [targetGuid]
            findPath(targetGuid)
            allPaths.push(parentStack)
        } else {
            firstParent?.forEach((guid) => {
                parentStack = initialStack?.length
                    ? initialStack
                    : [targetGuid, guid]
                findPath(guid)
                allPaths.push(parentStack)
            })
        }

        return allPaths
    }

    /**
     * Reinitializes the entire tree while and **loses the expanded state of the tree**
     * @param guid - Guid of the parent Glossary
     */
    const initTreeData = async (guid?: string) => {
        if (guid) {
            let categoryList;
            try{
                categoryList = await GlossaryApi.ListCategoryForGlossary(
                    guid,
                    {}
                ) // all categories in a glossary
            } catch {
                categoryList = []
            }
            let termsList;
            try {
                termsList = await GlossaryApi.ListTermsForGlossary(guid, {
                    limit: defaultLimit,
                }) // root level terms
            } catch {
                termsList = []
            }

            categoryMap[guid] = categoryList
            treeData.value = []

            categoryList?.forEach((element) => {
                // if category is root level, i.e `categoryGuid` does not exist
                if (!element.parentCategory?.categoryGuid) {
                    if (element.guid) nodeToParentKeyMap[element.guid] = 'root'
                    treeData.value.push(
                        returnTreeDataItemAttributes(element, 'category', guid)
                    )
                }
            })
            termsList?.forEach((element) => {
                if (element.guid) nodeToParentKeyMap[element.guid] = 'root'
                treeData.value.push(
                    returnTreeDataItemAttributes(element, 'term', guid)
                )
            })
            checkAndAddLoadMoreNode(termsList, defaultLimit, 'root', 'root')

            isInitingTree.value = false
            // selectedKeys.value.push(guid)
            // Logic to expand tree
            // if(currentEntity.value?.typeName === 'AtlasGlossaryCategory'){
            //     loadedKeys.value.push(currentEntity.value?.attributes?.parentCategory?.guid)

            // }
        } else {
            treeData.value = []
            if (glossaryList.value?.length) {
                glossaryList.value?.forEach((glossary) => {
                    treeData.value.push({
                        ...glossary.attributes,
                        title: glossary.displayText,
                        key: glossary.guid,
                        glossaryID: glossary.guid,
                        type: 'glossary',
                        selectable: false,
                    })
                })
            }
            watch(glossaryList, (newList) => {
                if (newList?.length) {
                    treeData.value = []
                    newList?.forEach((glossary) => {
                        treeData.value.push({
                            ...glossary.attributes,
                            title: glossary.displayText,
                            key: glossary.guid,
                            glossaryID: glossary.guid,
                            type: 'glossary',
                            checkable: false,
                        })
                    })
                    isInitingTree.value = false
                }
            })
        }
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
                    {}
                )
                const termsList = await GlossaryApi.ListTermsForGlossary(
                    treeNode.dataRef.key
                )
                categoryMap[treeNode.dataRef.key] = response
                response.forEach((element) => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    if (!element.parentCategory?.categoryGuid) {
                        treeNode.dataRef.children.push(
                            returnTreeDataItemAttributes(
                                element,
                                'category',
                                treeNode.dataRef.key,
                                true
                            )
                        )
                    }
                })
                termsList.forEach((element) => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    treeNode.dataRef.children.push(
                        returnTreeDataItemAttributes(
                            element,
                            'term',
                            treeNode.dataRef.key
                        )
                    )
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
                treeNode.dataRef.children.push(
                    returnTreeDataItemAttributes(
                        child,
                        'category',
                        treeNode.dataRef.glossaryID,
                        true,
                        treeNode.dataRef.key
                    )
                )
            })
            try {
                const termsList = await GlossaryApi.ListTermsForCategory(
                    treeNode.dataRef.key,
                    {
                        limit: defaultLimit,
                    }
                )
                termsList.forEach((element) => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    if (element.guid) {
                        const currentParentList =
                            nodeToParentKeyMap[element.guid]
                        if (
                            currentParentList &&
                            currentParentList.length &&
                            typeof currentParentList !== 'string'
                        ) {
                            currentParentList.push(treeNode.dataRef.key)
                            nodeToParentKeyMap[element.guid] = currentParentList
                        } else {
                            nodeToParentKeyMap[element.guid] = [
                                treeNode.dataRef.key,
                            ]
                        }
                    }
                    treeNode.dataRef.children.push(
                        returnTreeDataItemAttributes(
                            element,
                            'term',
                            treeNode.dataRef.key,
                            false,
                            treeNode.dataRef.key
                        )
                    )
                })

                checkAndAddLoadMoreNode(
                    termsList,
                    defaultLimit,
                    treeNode.dataRef.key,
                    treeNode.dataRef.key
                )
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
     * @param certificateStatus - new status
     */
    const updateNode = ({
        guid,
        entity,
        name,
        certificateStatus,
        ownerGroups,
        ownerUsers,
        shortDescription,
    }: {
        guid: string
        entity?: Glossary | Category | Term
        name?: string
        certificateStatus?: "DRAFT" | "VERIFIED" | "ISSUE"
        ownerGroups: string
        ownerUsers?: string
        shortDescription?: string
    }) => {
        const currentParents = nodeToParentKeyMap[guid]
        updateGlossaryStatusInList(guid, certificateStatus ?? entity?.attributes?.certificateStatus)
        if (
            currentParents === 'root' ||
            (typeof currentParents !== 'string' &&
                currentParents?.find((parent) => parent === 'root'))
        ) {
            // if the node is at the root level, just loop through the treeData linearly
            treeData.value = treeData.value.map((treeNode) => {
                if (treeNode.key === guid)
                    return {
                        ...treeNode,
                        certificateStatus:
                            entity?.attributes?.certificateStatus ??
                            certificateStatus ??
                            treeNode.certificateStatus,
                        name: entity?.attributes?.name ?? name ?? treeNode.name,
                        title:
                            entity?.attributes?.name ?? name ?? treeNode.title,
                        ownerUsers:
                            entity?.attributes?.ownerUsers ??
                            ownerUsers ??
                            treeNode.ownerUsers,
                        ownerGroups:
                            entity?.attributes?.ownerGroups ??
                            ownerGroups ??
                            treeNode.ownerGroups,
                        shortDescription:
                            entity?.attributes?.shortDescription ??
                            shortDescription ??
                            treeNode.shortDescription,
                    }
                return treeNode
            })
        } else {
            let parentStack: string[][]

            const updateNodeNested = (
                node: TreeDataItem,
                path: string[]
            ): TreeDataItem => {
                const currentPath = path.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    console.log(node, entity)
                    return {
                        ...node,
                        certificateStatus:
                            entity?.attributes?.certificateStatus ??
                            certificateStatus ??
                            node.certificateStatus,
                        name: entity?.attributes?.name ?? name ?? node.name,
                        title: entity?.attributes?.name ?? name ?? node.title,
                        ownerGroups:
                            entity?.attributes?.ownerGroups ??
                            ownerGroups ??
                            node.ownerGroups,
                        ownerUsers:
                            entity?.attributes?.ownerUsers ??
                            ownerUsers ??
                            node.ownerUsers,
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((childNode: TreeDataItem) => {
                        // if the current element is in the path that is needed to reach the target node
                        if (childNode.key === currentPath) {
                            return updateNodeNested(childNode, path)
                        }
                        return childNode
                    }),
                }
            }

            // find the path to the node
            parentStack = recursivelyFindPath(guid)
            parentStack.forEach((path) => {
                const parent = path.pop()

                treeData.value = treeData.value.map((node: TreeDataItem) => {
                    if (node.key === parent) return updateNodeNested(node, path)
                    return node
                })
            })
        }
    }

    /**
     * Refreshes a node via API ( All attributes and new children ) while maintaining the state
     *
     * @param guid - guid/key of the node that needs to be refetched
     */
    const refetchNode = async (
        guid: string | 'root',
        refetchEntityType?: 'category' | 'term'
    ) => {
        // if the root level of the tree needs a refetch
        if (guid === 'root' && parentGlossary.value?.guid) {
            let categoryList:
                | Components.Schemas.AtlasGlossaryCategory[]
                | null = null
            let termsList: Components.Schemas.AtlasGlossaryTerm[] | null = null

            if (refetchEntityType === 'category' || !refetchEntityType) {
                categoryList = await GlossaryApi.ListCategoryForGlossary(
                    parentGlossary.value?.guid
                )
            }
            if (refetchEntityType === 'term' || !refetchEntityType) {
                termsList = await GlossaryApi.ListTermsForGlossary(
                    parentGlossary.value?.guid
                )
            }

            categoryMap[parentGlossary.value?.guid] = categoryList

            const updatedTreeData: TreeDataItem[] = []
            if (categoryList !== null) {
                categoryList.forEach((category) => {
                    const existingCategory = treeData.value.find(
                        (entity) => entity.guid === category.guid
                    )
                    // if the category already exists,ignore it so as to maintain the expanded state
                    if (existingCategory) {
                        updatedTreeData.push(existingCategory)
                    } else if (!category.parentCategory?.categoryGuid) {
                        // if a new category is found at the root level, append it

                        nodeToParentKeyMap[category.guid] = 'root'
                        updatedTreeData.push(
                            returnTreeDataItemAttributes(
                                category,
                                'category',
                                parentGlossary.value?.guid ?? '',
                                true
                            )
                        )
                    }
                })
            } else {
                treeData.value.forEach((item) => {
                    if (item.type === 'category') updatedTreeData.push(item)
                })
            }
            if (termsList !== null) {
                termsList.forEach((term) => {
                    const existingTerm = treeData.value.find(
                        (entity) => entity.guid === term.guid
                    )
                    // if term already exists, append the existing one
                    if (existingTerm) {
                        updatedTreeData.push(existingTerm)
                    } else {
                        nodeToParentKeyMap[term.guid] = ['root']
                        updatedTreeData.push(
                            returnTreeDataItemAttributes(
                                term,
                                'term',
                                parentGlossary.value?.guid ?? ''
                            )
                        )
                    }
                })
            } else {
                treeData.value.forEach((item) => {
                    if (item.type === 'term') updatedTreeData.push(item)
                })
            }

            treeData.value.forEach((item) => {
                if (item.title === 'Load more') updatedTreeData.push(item)
            })

            treeData.value = updatedTreeData
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: TreeDataItem) => {
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    let categoryList:
                        | Components.Schemas.AtlasGlossaryCategory[]
                        | null = null
                    let termsList:
                        | Components.Schemas.AtlasGlossaryTerm[]
                        | null = null

                    if (
                        refetchEntityType === 'category' ||
                        !refetchEntityType
                    ) {
                        categoryList =
                            await GlossaryApi.ListCategoryForGlossary(
                                parentGlossary.value?.guid ?? ''
                            )
                    }
                    if (refetchEntityType === 'term' || !refetchEntityType) {
                        termsList = await GlossaryApi.ListTermsForCategory(guid)
                    }
                    categoryMap[parentGlossary.value?.guid ?? ''] = categoryList
                    const updatedChildren: TreeDataItem[] = []

                    if (categoryList !== null) {
                        categoryList.forEach((category) => {
                            const existingCategory = node.children?.find(
                                (entity) => entity.guid === category.guid
                            )
                            // if current category already exists, append the existing one to maintain expanded state
                            // else append the new one
                            if (existingCategory) {
                                updatedChildren.push(existingCategory)
                            } else if (
                                category.parentCategory?.categoryGuid ===
                                node.key
                            ) {
                                nodeToParentKeyMap[category?.guid ?? ''] =
                                    node.key as string
                                updatedChildren.push(
                                    returnTreeDataItemAttributes(
                                        category,
                                        'category',
                                        parentGlossary.value?.guid ?? '',
                                        true,
                                        node.key
                                    )
                                )
                            }
                        })
                    } else {
                        node.children?.forEach((item) => {
                            if (item.type === 'category')
                                updatedChildren.push(item)
                        })
                    }

                    if (termsList !== null) {
                        termsList.forEach((term) => {
                            const existingTerm = node.children?.find(
                                (entity) => entity.guid === term.guid
                            )
                            if (existingTerm) {
                                updatedChildren.push(existingTerm)
                            } else {
                                nodeToParentKeyMap[term?.guid ?? ''] = [
                                    node.key as string,
                                ]
                                updatedChildren.push(
                                    returnTreeDataItemAttributes(
                                        term,
                                        'term',
                                        parentGlossary.value?.guid,
                                        false,
                                        node.key
                                    )
                                )
                            }
                        })
                    } else {
                        node.children?.forEach((item) => {
                            if (item.type === 'term') updatedChildren.push(item)
                        })
                    }

                    node.children?.forEach((item) => {
                        if (item.title === 'Load more')
                            updatedChildren.push(item)
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
            parentStack = recursivelyFindPath(guid)[0]
            const parent = parentStack?.pop()

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
        fromGuid?: string,
        toGuid?: string,
        updatedCategories?: any
    ) => {
        let parentStack: string[]
        let nodeToReorder: TreeDataItem
        let _fromGuid = fromGuid
        if (!_fromGuid && nodeToParentKeyMap[nodeKey]) {
            _fromGuid = nodeToParentKeyMap[nodeKey][0]
        }

        const removeNode = (node: TreeDataItem): TreeDataItem => {
            const currentPath = parentStack.pop()
            if (node.key === _fromGuid && !currentPath) {
                nodeToReorder = node.children?.find(
                    (childNode) => childNode.key === nodeKey
                )
                if (fromGuid)
                    return {
                        ...node,
                        children: node.children?.filter(
                            (childNode) => childNode.key !== nodeKey
                        ),
                    }
                else return node
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
            if (node.key === toGuid && !currentPath && nodeToReorder) {
                nodeToReorder.parentCategoryId = toGuid
                nodeToReorder.parentCategory = toGuid
                nodeToReorder.categories = updatedCategories
                newChildren.push(nodeToReorder)
            }

            if (loadedKeys.value.find((key) => node.key === key)) {
                return {
                    ...node,
                    children: newChildren,
                }
            }
            return node
        }

        // remove
        if (_fromGuid === 'root') {
            treeData.value = treeData.value.filter((node) => {
                if (node.key === nodeKey) {
                    nodeToReorder = node
                    return false
                }
                return true
            })
        } else {
            parentStack = recursivelyFindPath(_fromGuid)[0]
            const parent = parentStack?.pop()

            treeData.value = treeData.value.map((node: TreeDataItem) => {
                if (node.key === parent) return removeNode(node)
                return node
            })
        }
        console.log(toGuid, nodeToReorder)
        // add
        if (toGuid) {
            if (toGuid === 'root') {
                nodeToReorder.parentCategoryId = undefined
                nodeToReorder.parentCategory = undefined
                nodeToReorder.isRoot = true
                nodeToReorder.categories = updatedCategories

                treeData.value.push(nodeToReorder)
            } else {
                parentStack = recursivelyFindPath(toGuid)[0]
                const toParent = parentStack?.pop()
                treeData.value = treeData.value.map((node: TreeDataItem) => {
                    if (node.key === toParent) return addNode(node)
                    return node
                })
            }
        }

        let currentParent = nodeToParentKeyMap[nodeKey]
        if (currentParent && typeof currentParent !== 'string') {
            currentParent = currentParent.filter((guid) => guid !== fromGuid)
            if (!currentParent.includes(toGuid)) {
                currentParent.push(toGuid)
            }
        } else {
            currentParent = [toGuid]
        }
        nodeToParentKeyMap[nodeKey] = currentParent
    }

    const dragAndDropNode = async ({ dragNode, node, event }) => {
        // const { data: updatedEntity, updateEntity } = useUpdateGtcEntity()
        if (node.dataRef.type === 'category') {
            if (dragNode.dataRef.type === 'term') {
                console.log(node.dataRef.children, dragNode.dataRef.guid)
                if (
                    !node.dataRef.children?.find(
                        (child) => child.guid === dragNode.dataRef.guid
                    )
                ) {
                    if (dragNode.dataRef.categories?.length) {
                        const orignalCategories = dragNode.dataRef.categories
                        const fromGuid = dragNode.dataRef.parentCategoryId
                        const toGuid = node.dataRef.guid

                        const newCategories =
                            dragNode.dataRef.categories?.filter(
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
                } else {
                    message.error({
                        content: `${dragNode.dataRef.title} is already a part of ${node.dataRef.title}!`,
                        duration: 3,
                    })
                }
            }
        }
    }

    const reInitTree = () => {
        fetchGuid.value = currentGuid.value
        refetch()
    }

    const loadMore = async (
        offset: number,
        parentNodeId: string,
        parentGuid: string
    ) => {
        if (parentNodeId === 'root') {
            triggerLoadingState(parentNodeId)

            const termsList = await GlossaryApi.ListTermsForGlossary(
                parentGuid,
                { limit: defaultLimit, offset }
            ) // root level terms

            treeData.value = treeData.value.filter(
                (node) => node.title !== 'Load more'
            )
            termsList?.forEach((term) => {
                let currentParent = nodeToParentKeyMap[term?.guid ?? '']

                if (typeof currentParent !== 'string') {
                    if (currentParent && currentParent.length) {
                        currentParent.push('root')
                    } else if (!currentParent) {
                        currentParent = ['root']
                    }
                }
                nodeToParentKeyMap[term?.guid ?? ''] = currentParent
                treeData.value.push(
                    returnTreeDataItemAttributes(term, 'term', parentGuid)
                )
            })
            checkAndAddLoadMoreNode(
                termsList,
                offset + defaultLimit,
                'root',
                'root'
            )
        } else {
            triggerLoadingState(parentGuid)
            const termsList = await GlossaryApi.ListTermsForCategory(
                parentGuid,
                { limit: defaultLimit, offset }
            ) // root level terms

            const path = recursivelyFindPath(parentGuid)[0]

            const appendNewNodes = (node: TreeDataItem) => {
                const currentPath = path.pop()

                if (node.guid === parentGuid && !currentPath) {
                    const newChildren = node.children?.filter(
                        (child) => child.title !== 'Load more'
                    )
                    termsList?.forEach((term) => {
                        newChildren?.push(
                            returnTreeDataItemAttributes(
                                term,
                                'term',
                                parentGlossary.value?.guid ?? '',
                                false,
                                parentGuid
                            )
                        )
                        let currentParent = nodeToParentKeyMap[term?.guid ?? '']

                        if (typeof currentParent !== 'string') {
                            if (currentParent && currentParent.length) {
                                currentParent.push(parentGuid)
                            } else if (!currentParent) {
                                currentParent = [parentGuid]
                            }
                        }
                        nodeToParentKeyMap[term?.guid ?? ''] = currentParent
                    })

                    // Load More Node
                    if (termsList.length === defaultLimit) {
                        newChildren?.push({
                            key: parentGuid + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            click: () =>
                                loadMore(
                                    offset + defaultLimit,
                                    parentGuid,
                                    parentGuid
                                ),
                            typeName: 'LoadMore',
                            guid: 'LoadMore',
                        })
                    }

                    return {
                        ...node,
                        children: newChildren,
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((child) => {
                        if (child.guid === currentPath)
                            return appendNewNodes(child)
                        return child
                    }),
                }
            }

            const parent = path?.pop()
            treeData.value = treeData.value.map((node) => {
                if (node.guid === parent) return appendNewNodes(node)
                return node
            })
        }
    }

    const checkAndAddLoadMoreNode = (
        response: Components.Schemas.AtlasGlossaryTerm[],
        offset: number,
        parentGuid: string,
        key?: string
    ) => {
        if (response.length === defaultLimit) {
            if (key === 'root') {
                treeData.value.push({
                    key: (key ?? parentGuid) + '_Load_More',
                    title: 'Load more',
                    isLeaf: true,
                    isLoading: false,
                    click: () => {
                        loadMore(offset, 'root', parentGlossary.value?.guid)
                    },
                    typeName: 'LoadMore',
                    guid: 'LoadMore',
                })
            } else {
                const path = recursivelyFindPath(parentGuid)[0] // parentGuid will always be a guid of a category (since terms cannot be parents). Hence there will always be atmost 1 path

                const addLoadMoreInNestedNode = (node: TreeDataItem) => {
                    const currentPath = path.pop()
                    if (node.guid === parentGuid && !currentPath) {
                        node.children?.push({
                            key: (key ?? parentGuid) + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            isLoading: false,
                            click: () =>
                                loadMore(offset, parentGuid, parentGuid),
                            typeName: 'LoadMore',
                            guid: 'LoadMore',
                        })
                        return node
                    }
                    return {
                        ...node,
                        children: node.children?.map((child) => {
                            if (child.guid === currentPath)
                                return addLoadMoreInNestedNode(child)
                            return child
                        }),
                    }
                }
                const parent = path?.pop()

                treeData.value = treeData.value.map((node) => {
                    if (node.guid === parent)
                        return addLoadMoreInNestedNode(node)
                    return node
                })
            }
        }
    }

    const triggerLoadingState = (parentNodeId: string) => {
        if (parentNodeId === 'root') {
            treeData.value = treeData.value.map((node) => {
                if (node.title === 'Load more') {
                    return {
                        ...node,
                        isLoading: true,
                    }
                }
                return node
            })
        } else {
            const path = recursivelyFindPath(parentNodeId)[0]

            const trigger = (node: TreeDataItem) => {
                const currentPath = path.pop()

                if (node.guid === parentNodeId && !currentPath) {
                    return {
                        ...node,
                        children: node.children?.map((child) => {
                            if (child.title === 'Load more')
                                return { ...child, isLoading: true }
                            return child
                        }),
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((child) => {
                        if (child.guid === currentPath) return trigger(child)
                        return child
                    }),
                }
            }

            const parent = path.pop()
            treeData.value = treeData.value.map((node) => {
                if (node.guid === parent) return trigger(node)
                return node
            })
        }
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
                // if (
                //     referredEntities?.value[newEntity?.attributes?.anchor?.guid]
                //         ?.guid
                // ) {
                //     parentGlossary.value =
                //         referredEntities.value[newEntity.attributes.anchor.guid]

                //     if (parentGlossary.value?.guid)
                //         initTreeData(parentGlossary.value.guid)
                // } else {
                    fetchType.value = 'glossary'
                    fetchGuid.value = newEntity?.attributes?.anchor?.guid
                    refetch()
                // }
                currentEntity.value = fetchedEntity.value
            }
        }
    })

    const collapseAll = () => {
        expandedKeys.value = []
    }

    watch(
        () => route.params.id,
        (newId) => {
            if (!filterMode) {
                currentGuid.value = newId as string
                currentType.value = router.currentRoute.value.fullPath.split(
                    '/'
                )[router.currentRoute.value.fullPath.split('/').length - 2] as
                    | 'glossary'
                    | 'category'
                    | 'term'

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
        }
    )
    onMounted(() => {
        isInitingTree.value = true
        if (filterMode) {
            initTreeData()
        }
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
        glossaryList,
        reInitTree,
        onLoadData,
        expandNode,
        selectNode,
        dragAndDropNode,
        updateNode,
        refetchNode,
        refetchGlossaryList,
        collapseAll,
        reOrderNodes,
    }
}

export default useTree
