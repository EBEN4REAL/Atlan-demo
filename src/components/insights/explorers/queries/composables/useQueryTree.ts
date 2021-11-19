import { watch, ref, Ref, computed, ComputedRef, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

import {
    Attributes,
    Folder,
    SavedQuery,
} from '~/types/insights/savedQuery.interface'
import {
    BasicSearchResponse,
    RelationshipSearchResponse,
} from '~/types/common/atlasSearch.interface'

import { Components } from '~/types/atlas/client'

import store from '~/utils/storage'

// composables
import useLoadQueryData from './useLoadQueryData'

type CustomTreeDataItem =
    | (Omit<TreeDataItem, 'children'> &
          Attributes & {
              children?: CustomTreeDataItem[]
              typeName: string
              guid: string
              classifications?: Components.Schemas.AtlasClassification[]
          })
    | {
          key: string
          title: string
          isLeaf: Boolean
          click: any
          children?: CustomTreeDataItem[]
          qualifiedName: string
          guid: string
          typeName: string
          parentTitle: string
      }

interface useSavedQueriesTreeProps {
    emit: any
    openSavedQueryInNewTab: Function
    pushGuidToURL?: Function
    cacheKey?: string
    isAccordion?: boolean
    connector: Ref<string | undefined>
    savedQueryType: Ref<'personal' | 'all'>
    queryFolderNamespace: Ref<Folder>
    permissions: { [index: string]: string | undefined }
}

const useTree = ({
    emit,
    openSavedQueryInNewTab,
    cacheKey,
    isAccordion,
    pushGuidToURL,
    connector,
    savedQueryType,
    queryFolderNamespace,
    permissions,
}: useSavedQueriesTreeProps) => {
    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, string> = {}
    const nodeToParentNameMap: Record<string, string> = {}

    const treeData = ref<CustomTreeDataItem[]>([])

    const isInitingTree = ref(false)

    const loadedKeys = ref<string[]>([])
    const selectedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])

    const selectedCacheKey = `${cacheKey ?? 'queryTree'}_selected`
    const expandedCacheKey = `${cacheKey ?? 'queryTree'}_expanded`
    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const immediateParentFolderQF = ref<string>(
        queryFolderNamespace.value?.attributes?.qualifiedName
    )
    const immediateParentGuid = ref<string>(queryFolderNamespace.value?.guid)

    const { getQueryFolders, getQueries, getSubFolders, getFolderQueries } =
        useLoadQueryData({ connector, savedQueryType, queryFolderNamespace })

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
                nodeToParentKeyMap[currGuid] !==
                    queryFolderNamespace.value?.guid
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
    const initTreeData = async () => {
        treeData.value = []

        const queries = await getQueries()
        const folders = await getQueryFolders()

        console.log('permission_tree: ', permissions)

        console.log('tree data query: ', queries)
        console.log('tree data folder: ', folders)

        if (permissions?.readFolders) {
            folders.entities?.forEach((folder) => {
                if (!folder.attributes.parentFolder) {
                    treeData.value.push({
                        ...returnTreeDataItemAttributes(folder),
                        parentTitle: 'root',
                    })
                    nodeToParentKeyMap[folder.guid] =
                        queryFolderNamespace.value?.guid
                    nodeToParentNameMap[folder.guid] = 'root'
                }
            })
        }
        if (permissions?.readQueries) {
            queries.entities?.forEach((query) => {
                if (!query.attributes.folder) {
                    treeData.value.push({
                        ...returnTreeDataItemAttributes(query),
                        parentTitle: 'root',
                    })
                    nodeToParentKeyMap[query.guid] =
                        queryFolderNamespace.value?.guid
                    nodeToParentNameMap[query.guid] = 'root'
                }
            })
        }

        console.log('tree data init:', treeData.value)
        isInitingTree.value = false
    }

    /**
     * Asynchronously fetches children of a node and appends them
     */
    const onLoadData = async (treeNode: {
        [key: string]: any
        dataRef: CustomTreeDataItem
    }) => {
        if (!treeNode.dataRef.children) {
            treeNode.dataRef.children = []
        }

        if (treeNode.dataRef.typeName === 'QueryFolder') {
            const subFoldersResponse = await getSubFolders(
                treeNode.dataRef.qualifiedName
            )
            const subQueriesResponse = await getFolderQueries(
                treeNode.dataRef.qualifiedName
            )
            if (permissions?.readFolders) {
                subFoldersResponse.entities?.forEach((folder) => {
                    if (!loadedKeys.value.find((key) => folder.guid === key)) {
                        treeNode.dataRef.children?.push({
                            ...returnTreeDataItemAttributes(folder),
                            parentTitle: treeNode.dataRef.title
                                ? treeNode.dataRef.title
                                : 'root',
                        })
                        nodeToParentKeyMap[folder.guid] = treeNode.dataRef.guid
                        nodeToParentNameMap[folder.guid] =
                            treeNode.dataRef.title
                    }
                })
            }
            if (permissions?.readQueries) {
                subQueriesResponse.entities?.forEach((query) => {
                    treeNode.dataRef.children?.push({
                        ...returnTreeDataItemAttributes(query),
                        parentTitle: treeNode.dataRef.title
                            ? treeNode.dataRef.title
                            : 'root',
                    })
                    nodeToParentKeyMap[query.guid] = treeNode.dataRef.guid
                    nodeToParentNameMap[query.guid] = treeNode.dataRef.title
                })
            }

            if (
                !subQueriesResponse.entities?.length &&
                !subFoldersResponse.entities?.length
            ) {
                // TODO: not push anything in array to avoid the empty expansion and title
                // treeNode.dataRef.children.push({
                //     attributes: {},
                //     key: 'Empty',
                //     qualifiedName: "Empty",
                //     guid: 'Empty',
                //     title: 'This Folder is Empty',
                //     typeName: 'Empty',
                //     // ...item.attributes,
                //     isLeaf: true,
                //     entity: {},
                // } as any)
            }

            // checkAndAddLoadMoreNode(schemaResponse, 'Database', treeNode.dataRef.qualifiedName)
        }

        loadedKeys.value.push(treeNode.dataRef.key)
    }

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        // const item = event.node.dataRef.entity as Folder | SavedQuery

        // if (item.typeName === 'Query') {
        //     immediateParentFolderQF.value = item.attributes.parentFolderQualifiedName;
        //     immediateParentGuid.value = nodeToParentKeyMap[item.guid];

        // } else if(item.typeName === 'QueryFolder') {
        //     immediateParentFolderQF.value = item.attributes.qualifiedName;
        //     immediateParentGuid.value = item.guid;
        // }

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
        const item = event.node.dataRef.entity as Folder | SavedQuery
        console.log('opened query: ', event.node)
        const parentTitle = event.node.dataRef?.parentTitle;

        if (item.typeName === 'Query') {
            immediateParentFolderQF.value =
                item.attributes.parentFolderQualifiedName
            immediateParentGuid.value = nodeToParentKeyMap[item.guid]

            openSavedQueryInNewTab({...item, parentTitle: parentTitle})
            
            selectedKeys.value.push(item.guid)
            if (pushGuidToURL) {
                pushGuidToURL(item.guid)
            }
        } else if (item.typeName === 'QueryFolder') {
            immediateParentFolderQF.value = item.attributes.qualifiedName
            immediateParentGuid.value = item.guid
        }

        // if (!event.node.isLeaf) {
        //     expandNode([], event)
        //     // selectedKeys.value = []
        // } else {
        //     if (selectedKeys.value.includes(selected)) {
        //         // selectedKeys.value = []
        //     } else {
        //         // selectedKeys.value = [...selected]
        //     }
        //     emit('select', event.node.eventKey)
        // }
        // store.set(selectedCacheKey, selectedKeys.value)

        /* New Logic */
        if (!event.node.isLeaf) {
            expandNode([], event)
        }
        if (selectedKeys.value.includes(selected)) {
            selectedKeys.value = []
        } else {
            selectedKeys.value = [...selected]
        }
        if (!selectedKeys.value.length) {
            immediateParentFolderQF.value =
                queryFolderNamespace.value?.attributes?.qualifiedName
            immediateParentGuid.value = queryFolderNamespace.value?.guid
        }
        emit('select', event.node.eventKey)
        store.set(selectedCacheKey, selectedKeys.value)
    }

    /**
     * Refreshes a node via API ( All attributes and new children ) while maintaining the state
     *
     * @param guid - guid/key of the node that needs to be refetched
     */
    const refetchNode = async (
        guid: string,
        refetchEntityType?: 'query' | 'queryFolder'
    ) => {
        // if the root level of the tree needs a refetch
        if (guid === queryFolderNamespace.value?.guid) {
            let folderResponse: BasicSearchResponse<Folder> | null = null
            let queryResponse: BasicSearchResponse<SavedQuery> | null = null

            if (refetchEntityType === 'queryFolder' || !refetchEntityType) {
                folderResponse = await getQueryFolders()
            }

            if (refetchEntityType === 'query' || !refetchEntityType) {
                queryResponse = await getQueries()
            }

            const updatedFolders = checkAndAppendNewNodes(
                folderResponse,
                'QueryFolder',
                true
            )
            const updatedQueries = checkAndAppendNewNodes(
                queryResponse,
                'Query',
                true
            )

            const updatedTreeData: CustomTreeDataItem[] = [
                ...updatedFolders,
                ...updatedQueries,
            ]

            treeData.value.forEach((item) => {
                if (item.title === 'Load more') updatedTreeData.push(item)
            })

            treeData.value = updatedTreeData
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: CustomTreeDataItem) => {
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    let folderResponse: BasicSearchResponse<Folder> | null =
                        null
                    let queryResponse: BasicSearchResponse<SavedQuery> | null =
                        null

                    if (
                        refetchEntityType === 'queryFolder' ||
                        !refetchEntityType
                    ) {
                        folderResponse = await getSubFolders(node.qualifiedName)
                    }
                    if (refetchEntityType === 'query' || !refetchEntityType) {
                        queryResponse = await getFolderQueries(
                            node.qualifiedName
                        )
                    }

                    const updatedFolders = checkAndAppendNewNodes(
                        folderResponse,
                        'QueryFolder',
                        false,
                        node
                    )
                    const updatedQueries = checkAndAppendNewNodes(
                        queryResponse,
                        'Query',
                        false,
                        node
                    )

                    const updatedChildren: CustomTreeDataItem[] = [
                        ...updatedFolders,
                        ...updatedQueries,
                    ]

                    node.children?.forEach((item) => {
                        if (item.title === 'Load more')
                            updatedChildren.push(item)
                    })

                    return {
                        ...node,
                        children: updatedChildren,
                    }
                }
                const updatedChildren: CustomTreeDataItem[] = []

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

            const updatedTreeData: CustomTreeDataItem[] = []

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
    /**
     * Locally updates the attributes of a node inside the tree
     *
     * @param qualifiedName  - guid/key of the node that needs to be updated
     * @param entity - The entire updated entity
     */
    const updateNode = ({
        qualifiedName,
        entity,
    }: {
        qualifiedName: string
        entity: Database | Schema | Table | Column | View
    }) => {
        const currentParents = nodeToParentKeyMap[qualifiedName]
        if (currentParents === 'root') {
            // if the node is at the root level, just loop through the treeData linearly
            treeData.value = treeData.value.map((treeNode) => {
                if (treeNode.key === qualifiedName)
                    return {
                        ...treeNode,
                        ...entity.attributes,
                    }
                return treeNode
            })
        } else {
            let parentStack: string[]

            const updateNodeNested = (
                node: CustomTreeDataItem,
                path: string[]
            ): CustomTreeDataItem => {
                const currentPath = path.pop()

                // if the target node is reached
                if (node.key === qualifiedName || !currentPath) {
                    return {
                        ...node,
                        ...entity.attributes,
                    }
                }
                return {
                    ...node,
                    children: node.children?.map(
                        (childNode: CustomTreeDataItem) => {
                            // if the current element is in the path that is needed to reach the target node
                            if (childNode.key === currentPath) {
                                return updateNodeNested(childNode, path)
                            }
                            return childNode
                        }
                    ),
                }
            }

            // find the path to the node
            parentStack = recursivelyFindPath(qualifiedName)
            const parent = parentStack.pop()

            treeData.value = treeData.value.map((node: CustomTreeDataItem) => {
                if (node.key === parent)
                    return updateNodeNested(node, parentStack)
                return node
            })
        }
    }

    const checkAndAppendNewNodes = (
        response: BasicSearchResponse<SavedQuery | Folder> | null,
        typeName: 'Query' | 'QueryFolder',
        isRoot: boolean,
        node?: CustomTreeDataItem
    ) => {
        const updatedTreeData: CustomTreeDataItem[] = []

        const parent = isRoot ? treeData.value : node?.children
        if (response !== null) {
            response?.entities?.forEach((entity) => {
                const existingEntity = parent?.find(
                    (item) => item.guid === entity.guid
                )
                // if the entity already exists,ignore it so as to maintain the expanded state
                if (existingEntity) {
                    updatedTreeData.push(existingEntity)
                } else {
                    // if a new folder is found at the root level, append it
                    nodeToParentKeyMap[entity.guid] = isRoot
                        ? queryFolderNamespace.value?.guid
                        : node?.key
                    nodeToParentNameMap[entity.guid] = isRoot
                        ? queryFolderNamespace.value?.guid
                        : node?.title
                    updatedTreeData.push(returnTreeDataItemAttributes(entity))
                }
            })
        } else {
            parent?.forEach((item) => {
                if (item.typeName === typeName) updatedTreeData.push(item)
            })
        }

        return updatedTreeData
    }

    const returnTreeDataItemAttributes = (item: SavedQuery | Folder) => {
        return {
            attributes: item.attributes,
            key: item.guid,
            qualifiedName: item.attributes.qualifiedName,
            class: item.guid,
            guid: item.guid,
            title: item.attributes.name,
            typeName: item.typeName,
            classifications: item.classifications,
            // ...item.attributes,
            isLeaf: item.typeName === 'Query' ? true : false,
            entity: item,
        }
    }

    const onLoadFolderData = async (treeNode: {
        [key: string]: any
        dataRef: CustomTreeDataItem
    }) => {
        if (!treeNode.dataRef.children) {
            treeNode.dataRef.children = []
        }

        if (treeNode.dataRef.typeName === 'QueryFolder') {
            const subFoldersResponse = await getSubFolders(
                treeNode.dataRef.qualifiedName
            )
            subFoldersResponse.entities?.forEach((folder) => {
                if (!loadedKeys.value.find((key) => folder.guid === key)) {
                    treeNode.dataRef.children?.push({
                        ...returnTreeDataItemAttributes(folder),
                        parentTitle: treeNode.dataRef.title
                            ? treeNode.dataRef.title
                            : 'root',
                    })
                    nodeToParentKeyMap[folder.guid] = treeNode.dataRef.guid
                    nodeToParentNameMap[folder.guid] = treeNode.dataRef.title
                }
            })

            if (!subFoldersResponse.entities?.length) {
                // TODO: not push anything in array to avoid the empty expansion and title
            }
        }
        loadedKeys.value.push(treeNode.dataRef.key)
    }

    watch([connector, savedQueryType], () => {
        isInitingTree.value = true
        loadedKeys.value = []
        expandedKeys.value = []
        initTreeData()
    })
    onMounted(() => {
        isInitingTree.value = true
        if (queryFolderNamespace.value?.guid) initTreeData()
    })
    watch(queryFolderNamespace, (newQueryFolderNamespace) => {
        isInitingTree.value = true
        if (newQueryFolderNamespace?.guid) {
            immediateParentFolderQF.value =
                newQueryFolderNamespace.attributes?.qualifiedName
            immediateParentGuid.value = newQueryFolderNamespace.guid
            initTreeData()
        }
    })

    return {
        treeData,
        loadedKeys,
        isInitingTree,
        selectedKeys,
        expandedKeys,
        selectedCache,
        expandedCache,
        immediateParentFolderQF,
        immediateParentGuid,
        nodeToParentKeyMap,
        nodeToParentNameMap,
        updateNode,
        onLoadData,
        onLoadFolderData,
        expandNode,
        selectNode,
        refetchNode
    }
}

export default useTree
