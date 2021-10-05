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
}

const useTree = ({
    emit,
    openSavedQueryInNewTab,
    cacheKey,
    isAccordion,
    pushGuidToURL,
    connector
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

    const { getQueryFolders, getQueries, getSubFolders, getFolderQueries } =
        useLoadQueryData({connector})

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
        const folders =  await getQueryFolders()

        folders.entities?.forEach((folder) => {
            if (!folder.attributes.parentFolder) {
                treeData.value.push(returnTreeDataItemAttributes(folder))
                nodeToParentKeyMap[folder.attributes.qualifiedName] = 'root'
            }
        })
        queries.entities?.forEach((query) => {
            if (!query.attributes.folder) {
                treeData.value.push(returnTreeDataItemAttributes(query))
                nodeToParentKeyMap[query.attributes.qualifiedName] = 'root'
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
                if (
                    !loadedKeys.value.find(
                        (key) => folder.attributes.qualifiedName === key
                    )
                ) {
                    treeNode.dataRef.children?.push(
                        returnTreeDataItemAttributes(folder)
                    )
                    nodeToParentKeyMap[folder.attributes.qualifiedName] =
                        treeNode.dataRef.qualifiedName
                }
            })
            subQueriesResponse.entities?.forEach((query) => {
                treeNode.dataRef.children?.push(
                    returnTreeDataItemAttributes(query)
                )
                nodeToParentKeyMap[query.attributes.qualifiedName] =
                    treeNode.dataRef.qualifiedName
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
            openSavedQueryInNewTab(item)
            selectedKeys.value.push(item.attributes.qualifiedName)
            if (pushGuidToURL) {
                pushGuidToURL(item.guid)
            }
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

    const returnTreeDataItemAttributes = (item: SavedQuery | Folder) => {
        return {
            attributes: item.attributes,
            key: item.attributes.qualifiedName,
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

    watch(connector, (newConnector) => {
        isInitingTree.value = true
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
        onLoadData,
        expandNode,
        selectNode,
    }
}

export default useTree
