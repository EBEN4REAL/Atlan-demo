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

import { Components } from '~/api/atlas/client'

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
      }

interface useSavedQueriesTreeProps {
    emit: any
    openSavedQueryInNewTab: Function
    pushGuidToURL?: Function
    cacheKey?: string
    isAccordion?: boolean
    connector: Ref<string | undefined>
    savedQueryType: Ref<'personal' | 'all'>
}

const useTree = ({
    emit,
    openSavedQueryInNewTab,
    cacheKey,
    isAccordion,
    pushGuidToURL,
    connector,
    savedQueryType,
}: useSavedQueriesTreeProps) => {
    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, 'root' | string> = {}

    const treeData = ref<CustomTreeDataItem[]>([])

    const isInitingTree = ref(false)

    const loadedKeys = ref<string[]>([])
    const selectedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])

    const selectedCacheKey = `${cacheKey ?? 'queryTree'}_selected`
    const expandedCacheKey = `${cacheKey ?? 'queryTree'}_expanded`
    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const immediateParentFolderQF = ref<string>('root')
    const immediateParentGuid = ref<string>('root')

    const { getQueryFolders, getQueries, getSubFolders, getFolderQueries } =
        useLoadQueryData({ connector, savedQueryType })

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
    const initTreeData = async () => {
        treeData.value = []
        const queries = await getQueries()
        const folders = await getQueryFolders()

        folders.entities?.forEach((folder) => {
            if (!folder.attributes.parentFolder) {
                treeData.value.push(returnTreeDataItemAttributes(folder))
                nodeToParentKeyMap[folder.guid] = 'root'
            }
        })
        queries.entities?.forEach((query) => {
            if (!query.attributes.folder) {
                treeData.value.push(returnTreeDataItemAttributes(query))
                nodeToParentKeyMap[query.guid] = 'root'
            }
        })
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

            subFoldersResponse.entities?.forEach((folder) => {
                if (!loadedKeys.value.find((key) => folder.guid === key)) {
                    treeNode.dataRef.children?.push(
                        returnTreeDataItemAttributes(folder)
                    )
                    nodeToParentKeyMap[folder.guid] = treeNode.dataRef.guid
                }
            })
            subQueriesResponse.entities?.forEach((query) => {
                treeNode.dataRef.children?.push(
                    returnTreeDataItemAttributes(query)
                )
                nodeToParentKeyMap[query.guid] = treeNode.dataRef.guid
            })

            if (
                !subQueriesResponse.entities?.length &&
                !subFoldersResponse.entities?.length
            )
                treeNode.dataRef.isLeaf = true

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
        if (item.typeName === 'Query') {
            immediateParentFolderQF.value = item.attributes.parentFolderQualifiedName;
            immediateParentGuid.value = nodeToParentKeyMap[item.guid];

            openSavedQueryInNewTab(item)
            selectedKeys.value.push(item.guid)
            if (pushGuidToURL) {
                pushGuidToURL(item.guid)
            }
        } else if(item.typeName === 'QueryFolder') {
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
        emit('select', event.node.eventKey)
        store.set(selectedCacheKey, selectedKeys.value)
    }

      /**
     * Refreshes a node via API ( All attributes and new children ) while maintaining the state
     *
     * @param guid - guid/key of the node that needs to be refetched
     */
       const refetchNode = async (guid: string | 'root', refetchEntityType?: 'query' | 'queryFolder') => {
        // if the root level of the tree needs a refetch
        if (guid === 'root') {
            let folderResponse: BasicSearchResponse<Folder> | null = null;
            let queryResponse: BasicSearchResponse<SavedQuery> | null = null;

            if(refetchEntityType === 'queryFolder' || !refetchEntityType) {
                folderResponse= await getQueryFolders()
            }

            if(refetchEntityType === 'query' || !refetchEntityType) {
                queryResponse = await getQueries()
            } 


            const updatedFolders = checkAndAppendNewNodes(folderResponse, 'QueryFolder', true)
            const updatedQueries = checkAndAppendNewNodes(queryResponse, 'Query', true)

            const updatedTreeData: CustomTreeDataItem[] = [...updatedFolders, ...updatedQueries]


            treeData.value.forEach((item) => {
                if(item.title === 'Load more') updatedTreeData.push(item);
            });

            treeData.value = updatedTreeData
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: CustomTreeDataItem) => {
                const currentPath = parentStack.pop()

                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    let folderResponse: BasicSearchResponse<Folder> | null = null;
                    let queryResponse: BasicSearchResponse<SavedQuery> | null = null;

                    if(refetchEntityType === 'queryFolder' || !refetchEntityType) {
                        folderResponse = await getSubFolders(node.qualifiedName)
                    } 
                    if(refetchEntityType === 'query' || !refetchEntityType) {
                        queryResponse= await getFolderQueries(node.qualifiedName)
                    }

                    const updatedFolders = checkAndAppendNewNodes(folderResponse, 'QueryFolder', false, node)
                    const updatedQueries = checkAndAppendNewNodes(queryResponse, 'Query', false, node)
        
                    const updatedChildren: CustomTreeDataItem[] = [...updatedFolders, ...updatedQueries]
            
                    node.children?.forEach((item) => {
                        if(item.title === 'Load more')  updatedChildren.push(item)
                    });
            

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

    const checkAndAppendNewNodes = (response: BasicSearchResponse<SavedQuery | Folder> | null, typeName: 'Query' | 'QueryFolder', isRoot: boolean, node?: CustomTreeDataItem) => {
        const updatedTreeData: CustomTreeDataItem[] = []

        const parent = isRoot ? treeData.value : node?.children;
        if(response !== null) {
            response?.entities?.forEach((entity) => {
                const existingEntity = parent?.find(
                    (item) => item.guid === entity.guid
                )
                // if the entity already exists,ignore it so as to maintain the expanded state
                if (existingEntity) {
                    updatedTreeData.push(existingEntity)
                } else {
                    // if a new folder is found at the root level, append it
                    nodeToParentKeyMap[entity.guid] = isRoot ? 'root' : node?.key;
                    updatedTreeData.push(returnTreeDataItemAttributes(entity))
                }
            })
        } else {
            parent?.forEach((item) => {
                if(item.typeName === typeName) updatedTreeData.push(item)
            })
        }

        return updatedTreeData
    }

    const returnTreeDataItemAttributes = (item: SavedQuery | Folder) => {
        return {
            attributes: item.attributes,
            key: item.guid,
            qualifiedName: item.attributes.qualifiedName,
            guid: item.guid,
            title: item.attributes.name,
            typeName: item.typeName,
            classifications: item.classifications,
            // ...item.attributes,
            isLeaf: item.typeName === 'Query' ? true : false,
            entity: item,
        }
    }

    watch([connector, savedQueryType], () => {
        isInitingTree.value = true
        loadedKeys.value = []
        expandedKeys.value = []
        initTreeData()
    })
    onMounted(() => {
        isInitingTree.value = true
        initTreeData()
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
        onLoadData,
        expandNode,
        selectNode,
        refetchNode
    }
}

export default useTree
