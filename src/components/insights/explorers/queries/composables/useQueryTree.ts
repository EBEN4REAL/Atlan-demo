import { watch, ref, Ref, computed, ComputedRef, onMounted, inject } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

import {
    Attributes,
    Folder,
    QueryCollection,
    SavedQuery,
} from '~/types/insights/savedQuery.interface'
import {
    BasicSearchResponse,
    RelationshipSearchResponse,
} from '~/types/common/atlasSearch.interface'
import { decodeQuery as decodeBase64Data } from '~/utils/helper/routerHelper'
import { IndexSearchResponse } from '~/services/meta/search/index'
import { Insights } from '~/services/meta/insights/index'
import { invoke, until } from '@vueuse/core'

import { Components } from '~/types/atlas/client'

import store from '~/utils/storage'

// composables
import useLoadQueryData from './useLoadQueryData'
import { message } from 'ant-design-vue'

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
    // savedQueryType: Ref<'personal' | 'all'>
    savedQueryType: Ref<string>
    queryFolderNamespace: Ref<Folder>
    permissions: { [index: string]: string | undefined }
    collection: ComputedRef<QueryCollection>
    showcustomToolBar: Ref<Boolean>
}

const useQueryTree = ({
    emit,
    openSavedQueryInNewTab,
    cacheKey,
    isAccordion,
    pushGuidToURL,
    connector,
    savedQueryType,
    queryFolderNamespace,
    permissions,
    collection,
    showcustomToolBar,
}: useSavedQueriesTreeProps) => {
    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, string> = {}
    const nodeToParentNameMap: Record<string, string> = {}
    const isLoading = ref(false)

    const treeData = ref<CustomTreeDataItem[]>(undefined)

    const isInitingTree = ref(false)
    const errorReq = ref(undefined)

    const isNodeLoading = ref(false)
    const nodeError = ref(undefined)
    const errorNode = ref(undefined)

    const loadedKeys = ref<string[]>([])
    const selectedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])
    let currentSelectedNode = ref(collection.value)
    const queryCollectionsLoading: Ref<boolean> = inject(
        'queryCollectionsLoading'
    )

    const selectedCacheKey = `${cacheKey ?? 'queryTree'}_selected`
    const expandedCacheKey = `${cacheKey ?? 'queryTree'}_expanded`
    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const queryCollectionQualifiedName = computed(
        () => collection?.value?.attributes.qualifiedName
    )
    const queryCollectionGuid = computed(() => collection?.value?.guid)

    const immediateParentFolderQF = ref<string>(
        queryCollectionQualifiedName.value
    )
    const immediateParentGuid = ref<string>(queryCollectionGuid.value)

    const { getQueryFolders, getQueries, getSubFolders, getFolderQueries } =
        useLoadQueryData({
            collectionQualifiedName: queryCollectionQualifiedName,
        })

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
                nodeToParentKeyMap[currGuid] !== collection.value?.guid
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
        isLoading.value = true
        treeData.value = []
        let queries = []
        let folders = []
        try {
            queries = await getQueries()
            folders = await getQueryFolders()
            console.log('hello')
            errorReq.value = undefined
        } catch (error) {
            const er = Object.getOwnPropertyDescriptor(error, 'message')
            errorReq.value = er.value
            console.log(errorReq.value, 'not allowrf')
            isInitingTree.value = false
            isLoading.value = false
        }

        // console.log('permission_tree: ', permissions)

        // console.log('tree data query: ', queries)
        // console.log('tree data folder: ', folders)

        if (permissions?.readFolders) {
            folders.entities?.forEach((folder) => {
                // TODO:@rohan: fix this
                if (!folder.attributes.parentFolder) {
                    treeData.value.push({
                        ...returnTreeDataItemAttributes(folder),
                        parentTitle: 'root',
                    })
                    nodeToParentKeyMap[folder.guid] = collection.value?.guid
                    nodeToParentNameMap[folder.guid] = 'root'
                }
            })
        }
        if (permissions?.readQueries) {
            queries.entities?.forEach((query) => {
                // TODO:@rohan: fix this
                if (!query.attributes.folder) {
                    treeData.value.push({
                        ...returnTreeDataItemAttributes(query),
                        parentTitle: 'root',
                    })
                    nodeToParentKeyMap[query.guid] = collection.value?.guid
                    nodeToParentNameMap[query.guid] = 'root'
                }
            })
        }

        // console.log('tree data init:', treeData.value)
        isInitingTree.value = false
        isLoading.value = false
    }

    /**
     * Asynchronously fetches children of a node and appends them
     */
    const onLoadData = async (treeNode: {
        [key: string]: any
        dataRef: CustomTreeDataItem
    }) => {
        // debugger
        // console.log('expand node: ', treeNode)

        if (!treeNode.dataRef.children) {
            treeNode.dataRef.children = []
        }

        isNodeLoading.value = true
        nodeError.value = undefined
        errorNode.value = undefined

        if (treeNode.dataRef.typeName === 'Folder') {
            let subFoldersResponse, subQueriesResponse

            // let count = 0;
            // let maxTries = 3;
            // let loop=true
            // while(loop) {

            //     try {
            //         subFoldersResponse = await getSubFolders(
            //             treeNode.dataRef.qualifiedName
            //         )
            //         subQueriesResponse = await getFolderQueries(
            //             treeNode.dataRef.qualifiedName
            //         )

            //         loop=false
            //     } catch (error) {
            //         const er = Object.getOwnPropertyDescriptor(error, 'message')
            //         isNodeLoading.value = false
            //         nodeError.value = er?.value
            //         errorNode.value = treeNode

            //         if(++count == maxTries) {
            //             message.error('folder/query fetch went wrong')
            //             loadedKeys.value.push(treeNode.dataRef.key)
            //             loop=false
            //             throw error
            //         }

            //     }
            // }

            try {
                subFoldersResponse = await getSubFolders(
                    treeNode.dataRef.qualifiedName
                )
                subQueriesResponse = await getFolderQueries(
                    treeNode.dataRef.qualifiedName
                )
            } catch (error) {
                const er = Object.getOwnPropertyDescriptor(error, 'message')
                isNodeLoading.value = false
                nodeError.value = er?.value
                errorNode.value = treeNode
                message.error('folder/query fetch went wrong')

                loadedKeys.value.push(treeNode.dataRef.key)
                return
            }

            if (permissions?.readFolders) {
                if (subFoldersResponse?.entities?.length) {
                    subFoldersResponse.entities?.forEach((folder) => {
                        if (
                            !loadedKeys.value.find((key) => folder.guid === key)
                        ) {
                            treeNode.dataRef.children?.push({
                                ...returnTreeDataItemAttributes(folder),
                                parentTitle: treeNode.dataRef.title
                                    ? treeNode.dataRef.title
                                    : 'root',
                            })
                            nodeToParentKeyMap[folder.guid] =
                                treeNode.dataRef.guid
                            nodeToParentNameMap[folder.guid] =
                                treeNode.dataRef.title
                        }
                    })
                }
            }
            if (permissions?.readQueries) {
                if (subQueriesResponse?.entities?.length) {
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
            }

            if (
                !subQueriesResponse?.entities?.length &&
                !subFoldersResponse?.entities?.length
            ) {
                // TODO: not push anything in array to avoid the empty expansion and title

                // Checking for isCta in queryTreeItem to check for whether to display empty item CTA or not.
                // All other properties of folders are inherited to Cta's as well.
                treeNode.dataRef.children.push({
                    ...treeNode,
                    key: `cta-${treeNode.dataRef.key}`,
                    isLeaf: true,
                    selected: 'false',
                    // typeName: 'cta',
                    selectable: false,
                    checkable: false,
                    isCta: 'cta',
                    class: 'no-hover', // Added to manipulate hover and cursor states
                } as any)
            }

            // checkAndAddLoadMoreNode(schemaResponse, 'Database', treeNode.dataRef.qualifiedName)
        }
        treeData.value = [...treeData.value]
        loadedKeys.value.push(treeNode.dataRef.key)
    }

    const expandNodeManually = (event: any) => {
        // debugger
        if (!event.isLeaf) {
            const key: string = event.guid
            const isExpanded = expandedKeys.value?.includes(key)
            if (!isExpanded) {
                if (isAccordion && event.dataRef.isRoot) {
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

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        // const item = event.node.dataRef.entity as Folder | SavedQuery

        // if (item.typeName === 'Query') {
        //     immediateParentFolderQF.value = item.attributes.parentQualifiedName;
        //     immediateParentGuid.value = nodeToParentKeyMap[item.guid];

        // } else if(item.typeName === 'Folder') {
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
        console.log('select input: ', selected)
        const item = event.node.dataRef.entity as Folder | SavedQuery

        // selectedNodeForFolder.value = event.node.dataRef;

        // console.log('event.node.dataRef: ', event.node.dataRef)
        // console.log('event.selected: ', selected
        // )
        // console.log('opened query: ', event.node)
        const parentTitle = event.node.dataRef?.parentTitle
        currentSelectedNode.value = event.node

        // console.log('query item: ', item)

        if (item.typeName === 'Query') {
            console.log('query item: ', item)
            immediateParentFolderQF.value = item.attributes.parentQualifiedName
            immediateParentGuid.value = nodeToParentKeyMap[item.guid]

            openSavedQueryInNewTab({ ...item, parentTitle })
            let decodedVariables = decodeBase64Data(
                item?.attributes?.variablesSchemaBase64
            )
            if (
                decodedVariables?.length > 0 &&
                !item?.attributes?.isVisualQuery
            ) {
                showcustomToolBar.value = true
            }

            selectedKeys.value.push(item.guid)
            if (pushGuidToURL) {
                pushGuidToURL(item)
            }
        } else if (item.typeName === 'Folder') {
            immediateParentFolderQF.value = item.attributes.qualifiedName
            immediateParentGuid.value = item.guid

            // currentSelectedNode.value = item;
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
                collection.value?.attributes?.qualifiedName
            immediateParentGuid.value = collection.value?.guid

            currentSelectedNode.value = collection.value
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
        refetchEntityType?: 'query' | 'Folder'
    ) => {
        // debugger
        // if the root level of the tree needs a refetch
        console.log('new refetch: ', {
            guid,
            refetchEntityType,
        })
        if (guid === collection?.value?.guid) {
            let folderResponse: IndexSearchResponse<Folder> | null = null
            let queryResponse: IndexSearchResponse<SavedQuery> | null = null

            if (refetchEntityType === 'Folder' || !refetchEntityType) {
                folderResponse = await getQueryFolders()
            }

            if (refetchEntityType === 'query' || !refetchEntityType) {
                queryResponse = await getQueries()
            }

            console.log('collection parent update final api: ', {
                guid,
                folderResponse,
                queryResponse,
            })

            const updatedFolders = checkAndAppendNewNodes(
                folderResponse,
                'Folder',
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
            console.log('parent update final: ', { guid, updatedTreeData })
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: CustomTreeDataItem) => {
                // debugger
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    console.log('parent update start: ', node)
                    let folderResponse: IndexSearchResponse<Folder> | null =
                        null
                    let queryResponse: IndexSearchResponse<SavedQuery> | null =
                        null

                    if (refetchEntityType === 'Folder' || !refetchEntityType) {
                        folderResponse = await getSubFolders(node.qualifiedName)
                    }
                    if (refetchEntityType === 'query' || !refetchEntityType) {
                        queryResponse = await getFolderQueries(
                            node.qualifiedName
                        )
                    }

                    console.log('parent update final api: ', {
                        guid,
                        folderResponse,
                        queryResponse,
                    })

                    //correct till here

                    const updatedFolders = checkAndAppendNewNodes(
                        folderResponse,
                        'Folder',
                        false,
                        node
                    )
                    const updatedQueries = checkAndAppendNewNodes(
                        queryResponse,
                        'Query',
                        false,
                        node
                    )

                    // If the first item in the updatedFolder list is CTA, remove the CTA node
                    if (updatedFolders[0]?.isCta === 'cta') {
                        updatedFolders.shift()
                        console.log('updatedFolders: ', updatedFolders)
                    }

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
            console.log('parent here: ', parent)

            const updatedTreeData: CustomTreeDataItem[] = []

            // eslint-disable-next-line no-restricted-syntax
            for (const node of treeData.value) {
                // debugger
                if (node.key === parent) {
                    // console.log('loaded keys: ', loadedKeys.value)
                    const updatedNode = await updateNodeNested(node)
                    // console.log('parent updated new nodes: ', updatedNode)

                    updatedTreeData.push(updatedNode)
                    const isExpanded = expandedKeys.value?.includes(guid)
                    if (!isExpanded) {
                        expandedKeys.value?.push(guid)
                        expandedKeys.value = [...expandedKeys.value]
                        store.set(expandedCacheKey, expandedKeys.value)
                    }
                    const isLoaded = loadedKeys.value?.includes(guid)
                    if (!isLoaded) {
                        loadedKeys.value.push(guid)
                    }
                } else {
                    updatedTreeData.push(node)
                }
            }
            console.log('parent update final: ', { guid, updatedTreeData })

            treeData.value = [...updatedTreeData]
        }
    }

    const refetchNodeLocally = async (
        guid: string,
        refetchEntityType?: 'query' | 'Folder'
    ) => {
        // debugger
        // if the root level of the tree needs a refetch
        console.log('new refetch: ', {
            guid,
            refetchEntityType,
        })
        if (guid === collection?.value?.guid) {
            let folderResponse: IndexSearchResponse<Folder> | null = null
            let queryResponse: IndexSearchResponse<SavedQuery> | null = null

            if (refetchEntityType === 'Folder' || !refetchEntityType) {
                folderResponse = await getQueryFolders()
            }

            if (refetchEntityType === 'query' || !refetchEntityType) {
                queryResponse = await getQueries()
            }

            console.log('collection parent update final api: ', {
                guid,
                folderResponse,
                queryResponse,
            })

            const updatedFolders = checkAndAppendNewNodes(
                folderResponse,
                'Folder',
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
            console.log('parent update final: ', { guid, updatedTreeData })
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: CustomTreeDataItem) => {
                // debugger
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    console.log('parent update start: ', node)
                    let folderResponse: IndexSearchResponse<Folder> | null =
                        null
                    let queryResponse: IndexSearchResponse<SavedQuery> | null =
                        null

                    if (refetchEntityType === 'Folder' || !refetchEntityType) {
                        folderResponse = await getSubFolders(node.qualifiedName)
                    }
                    if (refetchEntityType === 'query' || !refetchEntityType) {
                        queryResponse = await getFolderQueries(
                            node.qualifiedName
                        )
                    }

                    console.log('parent update final api: ', {
                        guid,
                        folderResponse,
                        queryResponse,
                    })

                    //correct till here

                    const updatedFolders = checkAndAppendNewNodes(
                        folderResponse,
                        'Folder',
                        false,
                        node
                    )
                    const updatedQueries = checkAndAppendNewNodes(
                        queryResponse,
                        'Query',
                        false,
                        node
                    )

                    // If the first item in the updatedFolder list is CTA, remove the CTA node
                    if (updatedFolders[0]?.isCta === 'cta') {
                        updatedFolders.shift()
                        console.log('updatedFolders: ', updatedFolders)
                    }

                    const ctaNode = {
                        ...node,
                        key: `cta-${node?.key}`,
                        isLeaf: true,
                        selected: 'false',
                        // typeName: 'cta',
                        selectable: false,
                        checkable: false,
                        isCta: 'cta',
                        class: 'no-hover', // Added to manipulate hover and cursor states
                    }

                    let updatedChildren: CustomTreeDataItem[] = []

                    // Condition to add new node to the tree
                    if (
                        updatedFolders.length === 0 &&
                        updatedQueries.length === 0
                    ) {
                        updatedChildren = [
                            ...updatedFolders,
                            ...updatedQueries,
                            ctaNode,
                        ]
                    } else {
                        updatedChildren = [...updatedFolders, ...updatedQueries]
                    }

                    // const updatedChildren: CustomTreeDataItem[] = [
                    //     ...updatedFolders,
                    //     ...updatedQueries,
                    // ]

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
            console.log('parent here: ', parent)

            const updatedTreeData: CustomTreeDataItem[] = []

            // eslint-disable-next-line no-restricted-syntax
            for (const node of treeData.value) {
                // debugger
                if (node.key === parent) {
                    // console.log('loaded keys: ', loadedKeys.value)
                    const updatedNode = await updateNodeNested(node)
                    // console.log('parent updated new nodes: ', updatedNode)

                    updatedTreeData.push(updatedNode)
                    const isExpanded = expandedKeys.value?.includes(guid)
                    if (!isExpanded) {
                        expandedKeys.value?.push(guid)
                        expandedKeys.value = [...expandedKeys.value]
                        store.set(expandedCacheKey, expandedKeys.value)
                    }
                    const isLoaded = loadedKeys.value?.includes(guid)
                    if (!isLoaded) {
                        loadedKeys.value.push(guid)
                    }
                } else {
                    updatedTreeData.push(node)
                }
            }
            console.log('parent update final: ', { guid, updatedTreeData })

            treeData.value = [...updatedTreeData]
        }
    }

    const updateNodeUtil = ({ entity, guid }) => {
        debugger
        const currentParents = nodeToParentNameMap[guid]
        if (
            currentParents === 'root' ||
            (typeof currentParents !== 'string' &&
                currentParents?.find((parent) => parent === 'root'))
        ) {
            // if the node is at the root level, just loop through the treeData linearly
            treeData.value = treeData.value.map((treeNode) => {
                if (treeNode.key === guid) {
                    return {
                        ...treeNode,
                        entity: entity,
                        attributes: entity.attributes,
                        classifications: entity.classifications,
                        meanings: entity.meanings,
                    }
                }

                return treeNode
            })

            // console.log('update query node tree: ', treeData)
        } else {
            let parentStack: string[]

            const updateNodeNested = (
                node: CustomTreeDataItem,
                path: string[]
            ): CustomTreeDataItem => {
                const currentPath = path.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    return {
                        ...node,
                        entity: entity,
                        attributes: entity.attributes,
                        classifications: entity.classifications,
                        meanings: entity.meanings,
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
            parentStack = recursivelyFindPath(guid)
            const parent = parentStack.pop()

            treeData.value = treeData?.value?.map(
                (node: CustomTreeDataItem) => {
                    if (node.key === parent)
                        return updateNodeNested(node, parentStack)
                    return node
                }
            )
        }
    }
    /**
     * Locally updates the attributes of a node inside the tree
     *
     * @param qualifiedName  - guid/key of the node that needs to be updated
     * @param entity - The entire updated entity
     */
    const updateNode = ({
        guid,
        entity,
        updateAttributesOnly = false,
    }: {
        guid: string
        entity: SavedQuery
        updateAttributesOnly?: boolean
    }) => {
        debugger
        if (updateAttributesOnly) {
            ;(async () => {
                const {
                    data: data2,
                    error: error2,
                    isLoading: isLoading2,
                } = Insights.GetSavedQuery(guid, {})
                await until(isLoading2).toBe(false)
                if (error2.value) {
                    console.error('Failed to update')
                }
                if (data2.value) {
                    updateNodeUtil({
                        entity: data2.value.entity,
                        guid,
                    })
                }
            })()
        } else {
            updateNodeUtil({
                entity,
                guid,
            })
        }
    }

    const checkAndAppendNewNodes = (
        response: IndexSearchResponse<SavedQuery | Folder> | null,
        typeName: 'Query' | 'Folder',
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
                // console.log('entity: ', existingEntity)
                // if the entity already exists,ignore it so as to maintain the expanded state
                if (
                    existingEntity &&
                    existingEntity.attributes.name === entity.attributes.name
                ) {
                    updatedTreeData.push(existingEntity)
                } else if (
                    existingEntity &&
                    existingEntity.attributes.name !== entity.attributes.name
                ) {
                    existingEntity.attributes.name = entity.attributes.name
                    existingEntity.title = entity.attributes.name
                    updatedTreeData.push(existingEntity)
                } else {
                    // if a new folder is found at the root level, append it
                    nodeToParentKeyMap[entity.guid] = isRoot
                        ? collection.value?.guid
                        : node?.key
                    nodeToParentNameMap[entity.guid] = isRoot
                        ? collection.value?.guid
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
            meanings: item.meanings,
            // ...item.attributes,
            isLeaf: item.typeName === 'Query' ? true : false,
            entity: item,
        }
    }

    const onLoadFolderData = async (treeNode: {
        [key: string]: any
        dataRef: CustomTreeDataItem
    }) => {
        // debugger
        if (!treeNode.dataRef.children) {
            treeNode.dataRef.children = []
        }

        if (treeNode.dataRef.typeName === 'Folder') {
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
                // treeNode.dataRef.children?.push({
                //     title: 'emptyNode',
                //     isLeaf: true
                // })
            }
        }
        loadedKeys.value.push(treeNode.dataRef.key)
    }

    watch(collection, (newColletion) => {
        loadedKeys.value = []
        expandedKeys.value = []
        const newCollectionQualifiedName =
            newColletion?.attributes?.qualifiedName
        if (newCollectionQualifiedName) {
            immediateParentFolderQF.value = newCollectionQualifiedName
            immediateParentGuid.value = collection.value?.guid
            // currentSelectedNode.value = collection
        }

        console.log(
            'useQueryTree change queryCollectionQualifiedName: ',
            queryCollectionQualifiedName
        )
        initTreeData()
    })
    onMounted(() => {
        console.log('useQueryTree mounted', {
            queryCollectionsLoading: queryCollectionsLoading.value,
        })
        if (!queryCollectionsLoading.value) {
            initTreeData()
        }
        // if (queryFolderNamespace.value?.guid) initTreeData()
    })

    // watch(treeData, ()=> {
    //     console.log('updated Tree Data: ', treeData.value)
    // })

    return {
        errorReq,
        treeData,
        loadedKeys,
        isInitingTree,
        isLoading,
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
        expandNodeManually,
        selectNode,
        refetchNode,
        initTreeData,
        currentSelectedNode,
        isNodeLoading,
        nodeError,
        errorNode,
        refetchNodeLocally,
        // addInputBox,
        // removeInputBox
    }
}

export default useQueryTree
