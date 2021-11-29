import { watch, ref, Ref, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

import {
    Attributes,
    Database,
    Schema,
    Table,
    Column,
    View,
} from '~/types/insights/table.interface'
// import { IndexSearchResponse } from '~/types/common/atlasSearch.interface'
import { IndexSearchResponse } from '~/services/meta/search/index'

import { Components } from '~/types/atlas/client'

import store from '~/utils/storage'

// composables
import useLoadTreeData from './useLoadTreeData'

type CustomTreeDataItem =
    | (Omit<TreeDataItem, 'children'> &
          Attributes & {
              children?: CustomTreeDataItem[]
              typeName: string
              guid: string | undefined
              classifications?: Components.Schemas.AtlasClassification[]
          })
    | {
          key: string
          title: string
          isLeaf: Boolean
          click: any
          children?: CustomTreeDataItem[]
          qualifiedName: string
          typeName: string
      }

interface useSchemaExplorerTreeProps {
    emit: any
    queryText: Ref<string>
    facets: Ref<object>
    sortOrderTable: Ref<string>
    sortOrderColumn: Ref<string>
    searchResultType: Ref<string>
    connectionQualifiedName?: Ref<string | undefined>
    databaseQualifiedName?: Ref<string | undefined>
    schemaQualifiedName?: Ref<string | undefined>
    cacheKey?: string
    initSelectedKeys?: Ref<string | undefined>
    initialExapndedKeys?: Ref<string | undefined>
    isAccordion?: boolean
}

const useTree = ({
    emit,
    connectionQualifiedName,
    databaseQualifiedName,
    schemaQualifiedName,
    initSelectedKeys,
    initialExapndedKeys,
    cacheKey,
    isAccordion,
    queryText,
    facets,
    sortOrderTable,
    sortOrderColumn,
    searchResultType,
}: useSchemaExplorerTreeProps) => {
    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, 'root' | string> = {}
    console.log(initSelectedKeys, 'initial')
    const treeData = ref<CustomTreeDataItem[]>([])

    const isInitingTree = ref(false)
    const loadedKeys = ref<string[]>([])
    const selectedCacheKey = `${cacheKey}_selected`
    const expandedCacheKey = `${cacheKey}_expanded`
    const selectedKeys = ref<string[]>([initSelectedKeys?.value])
    let exKeys: string = []
    if (initialExapndedKeys?.value) exKeys = [...initialExapndedKeys.value]
    const expandedKeys = ref<string[]>(exKeys)

    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const {
        getDatabaseForConnection,
        getSchemaForDatabase,
        getTablesAndViewsForSchema,
        getColumnsForTable,
        // getViewsForSchema,
        getColumnsForView,
    } = useLoadTreeData(
        queryText,
        searchResultType,
        facets,
        sortOrderTable,
        sortOrderColumn
    )

    const serviceMap = {
        Connection: getDatabaseForConnection,
        Database: getSchemaForDatabase,
        Schema: getTablesAndViewsForSchema,
        Table: getColumnsForTable,
        View: getColumnsForView,
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

    function removeDuplicates(treeData: Ref<CustomTreeDataItem[]>) {
        const arr = []
        treeData.value.reduce((acc, curr) => {
            if (acc.indexOf(curr.guid) === -1) {
                acc.push(curr.guid)
                arr.push(curr)
            }
            return acc
        }, [])
        return arr
    }

    /**
     * Reinitializes the entire tree while and **loses the expanded state of the tree**
     * @param guid - Guid of the parent Glossary
     */
    const initTreeData = async (
        connectionQualifiedName?: string,
        databaseQualifiedName?: string,
        schemaQualifiedName?: string
    ) => {
        // treeData.value = [];
        // console.log('query1: ', queryText)
        if (schemaQualifiedName) {
            const found = loadedKeys.value.find(
                (qualifiedName) => qualifiedName === schemaQualifiedName
            )
            const node = treeData.value.find(
                (node) => node.qualifiedName === schemaQualifiedName
            )

            if (found && node) {
                if (node && node.children) treeData.value = node.children
            } else {
                treeData.value = []
                loadedKeys.value = []

                const tableResponse = await getTablesAndViewsForSchema(
                    schemaQualifiedName
                )
                tableResponse.entities?.forEach((table) => {
                    treeData.value.push(returnTreeDataItemAttributes(table))
                    nodeToParentKeyMap[table.attributes.qualifiedName] = 'root'
                })

                checkAndAddLoadMoreNode(
                    tableResponse,
                    'Schema',
                    schemaQualifiedName,
                    'root'
                )
            }
        } else if (databaseQualifiedName) {
            const found = loadedKeys.value.find(
                (qualifiedName) => qualifiedName === databaseQualifiedName
            )
            const node = treeData.value?.find(
                (node) => node.qualifiedName === databaseQualifiedName
            )

            if (found && node) {
                if (node && node.children) treeData.value = node.children
            } else {
                treeData.value = []
                loadedKeys.value = []

                const schemaResponse = await getSchemaForDatabase(
                    databaseQualifiedName
                )
                schemaResponse.entities?.forEach((schema) => {
                    treeData.value.push(returnTreeDataItemAttributes(schema))
                    nodeToParentKeyMap[schema.attributes.qualifiedName] = 'root'
                })

                checkAndAddLoadMoreNode(
                    schemaResponse,
                    'Database',
                    databaseQualifiedName,
                    'root'
                )
            }
        } else if (connectionQualifiedName) {
            const found = loadedKeys.value.find(
                (qualifiedName) => qualifiedName === connectionQualifiedName
            )
            const node = treeData.value.find(
                (node) => node.qualifiedName === connectionQualifiedName
            )

            if (found && node) {
                if (node && node.children) treeData.value = node.children
            } else {
                treeData.value = []
                loadedKeys.value = []

                const databasesResponse = await getDatabaseForConnection(
                    connectionQualifiedName,
                    0
                )
                databasesResponse.entities?.forEach((database) => {
                    treeData.value.push(returnTreeDataItemAttributes(database))
                    nodeToParentKeyMap[database.attributes.qualifiedName] =
                        'root'
                })

                checkAndAddLoadMoreNode(
                    databasesResponse,
                    'Connection',
                    connectionQualifiedName,
                    'root'
                )
            }
        } else if (!connectionQualifiedName) {
            treeData.value = []
        }
        /* removing duplicates */
        treeData.value = removeDuplicates(treeData)

        isInitingTree.value = false
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
            const path = recursivelyFindPath(parentNodeId)

            const trigger = (node: CustomTreeDataItem) => {
                const currentPath = path.pop()

                if (node.qualifiedName === parentNodeId && !currentPath) {
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
                        if (child.qualifiedName === currentPath)
                            return trigger(child)
                        return child
                    }),
                }
            }

            const parent = path.pop()
            treeData.value = treeData.value.map((node) => {
                if (node.qualifiedName === parent) return trigger(node)
                return node
            })
        }
    }

    const loadMore = async (
        offset: number,
        limit: number,
        service: 'Connection' | 'Database' | 'Schema' | 'Table' | 'View',
        parentNodeId: string,
        parentQualifiedName: string
    ) => {
        const getAssets = serviceMap[service]

        if (parentNodeId === 'root') {
            triggerLoadingState(parentNodeId)

            const response = await getAssets(parentQualifiedName, offset)

            treeData.value = treeData.value.filter(
                (node) => node.title !== 'Load more'
            )
            response.entities?.forEach((entity) => {
                treeData.value.push(returnTreeDataItemAttributes(entity))
                nodeToParentKeyMap[entity.attributes.qualifiedName] =
                    parentQualifiedName
            })
            checkAndAddLoadMoreNode(
                response,
                service,
                parentQualifiedName,
                parentNodeId
            )
        } else {
            triggerLoadingState(parentNodeId)
            const response = await getAssets(parentQualifiedName, offset)
            const query = JSON.parse(
                JSON.stringify(response.searchParameters.query)
            )
            const limit = query.size
            const responseOffset = query.from

            const path = recursivelyFindPath(parentQualifiedName)

            const appendNewNodes = (node: CustomTreeDataItem) => {
                const currentPath = path.pop()

                if (
                    node.qualifiedName === parentQualifiedName &&
                    !currentPath
                ) {
                    const newChildren = node.children?.filter(
                        (child) => child.title !== 'Load more'
                    )
                    response.entities?.forEach((entity) => {
                        newChildren?.push(returnTreeDataItemAttributes(entity))
                        nodeToParentKeyMap[entity.attributes.qualifiedName] =
                            parentQualifiedName
                    })

                    // Load More Node
                    if (
                        response.approximateCount &&
                        response.entities &&
                        response.approximateCount >
                            (limit ?? 0) + (responseOffset ?? 0)
                    ) {
                        newChildren?.push({
                            key: parentQualifiedName + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            click: () =>
                                loadMore(
                                    (limit ?? 0) + (responseOffset ?? 0),
                                    5,
                                    service,
                                    parentQualifiedName,
                                    parentQualifiedName
                                ),
                            typeName: 'LoadMore',
                            qualifiedName: 'LoadMore',
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
                        if (child.qualifiedName === currentPath)
                            return appendNewNodes(child)
                        return child
                    }),
                }
            }

            const parent = path.pop()
            treeData.value = treeData.value.map((node) => {
                if (node.qualifiedName === parent) return appendNewNodes(node)
                return node
            })
        }
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

        if (treeNode.dataRef.typeName === 'Database') {
            const schemaResponse = await getSchemaForDatabase(
                treeNode.dataRef.qualifiedName
            )

            schemaResponse.entities?.forEach((schema) => {
                treeNode.dataRef.children?.push(
                    returnTreeDataItemAttributes(schema)
                )
                nodeToParentKeyMap[schema.attributes.qualifiedName] =
                    treeNode.dataRef.qualifiedName
            })

            if (!schemaResponse.entities?.length) treeNode.dataRef.isLeaf = true
            checkAndAddLoadMoreNode(
                schemaResponse,
                'Database',
                treeNode.dataRef.qualifiedName
            )
        } else if (treeNode.dataRef.typeName === 'Schema') {
            const tableResponse = await getTablesAndViewsForSchema(
                treeNode.dataRef.qualifiedName
            )

            tableResponse.entities?.forEach((table) => {
                treeNode.dataRef.children?.push(
                    returnTreeDataItemAttributes(table)
                )
                nodeToParentKeyMap[table.attributes.qualifiedName] =
                    treeNode.dataRef.qualifiedName
            })

            if (!tableResponse.entities?.length) treeNode.dataRef.isLeaf = true
            checkAndAddLoadMoreNode(
                tableResponse,
                'Schema',
                treeNode.dataRef.qualifiedName
            )
        } else if (treeNode.dataRef.typeName === 'Table') {
            const columnResponse = await getColumnsForTable(
                treeNode.dataRef.qualifiedName
            )

            columnResponse.entities?.forEach((column) => {
                treeNode.dataRef.children?.push(
                    returnTreeDataItemAttributes(column)
                )
                nodeToParentKeyMap[column.attributes.qualifiedName] =
                    treeNode.dataRef.qualifiedName
            })
            checkAndAddLoadMoreNode(
                columnResponse,
                'Table',
                treeNode.dataRef.qualifiedName
            )
        } else if (treeNode.dataRef.typeName === 'View') {
            const columnResponse = await getColumnsForView(
                treeNode.dataRef.qualifiedName
            )

            columnResponse.entities?.forEach((column) => {
                treeNode.dataRef.children?.push(
                    returnTreeDataItemAttributes(column)
                )
                nodeToParentKeyMap[column.attributes.qualifiedName] =
                    treeNode.dataRef.qualifiedName
            })
            checkAndAddLoadMoreNode(
                columnResponse,
                'View',
                treeNode.dataRef.qualifiedName
            )
        }
        loadedKeys.value.push(treeNode.dataRef.key)
    }

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        // console.log('expanded', expanded)
        // if (!event.node.isLeaf) {
        //     const key: string = event.node.eventKey
        //     const isExpanded = expandedKeys.value?.includes(key)
        //     if (!isExpanded) {
        //         if (isAccordion && event.node.dataRef.isRoot) {
        //             expandedKeys.value = []
        //         }
        //         expandedKeys.value?.push(key)
        //     } else if (isExpanded) {
        //         const index = expandedKeys.value?.indexOf(key)
        //         expandedKeys.value?.splice(index, 1)
        //     }
        //     expandedKeys.value = [...expandedKeys.value]
        // }
        // store.set(expandedCacheKey, expandedKeys.value)
    }

    const selectNode = (selected: any, event: any) => {
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

    const returnTreeDataItemAttributes = (
        item: Database | Schema | Table | Column
    ) => {
        return {
            attributes: item.attributes,
            entity: item,
            key: item.attributes.qualifiedName,
            guid: item.guid,
            title: item.attributes.name,
            typeName: item.typeName,
            classifications: item.classifications,
            ...item.attributes,
            meanings: item.meanings,
            isLeaf: item.typeName === 'Column' ? true : false,
        }
    }

    const checkAndAddLoadMoreNode = (
        response:
            | IndexSearchResponse<Database>
            | IndexSearchResponse<Schema>
            | IndexSearchResponse<Table>
            | IndexSearchResponse<Column>,
        serviceName: 'Connection' | 'Database' | 'Schema' | 'Table' | 'View',
        parentQualifiedName: string,
        key?: string
    ) => {
        const query = JSON.parse(response.searchParameters.query)
        const limit = query.size
        const offset = query.from
        if (
            response.approximateCount &&
            response.entities &&
            response.approximateCount > (limit ?? 0) + (offset ?? 0)
        ) {
            if (key === 'root') {
                treeData.value.push({
                    key: (key ?? parentQualifiedName) + '_Load_More',
                    title: 'Load more',
                    isLeaf: true,
                    isLoading: false,
                    click: () => {
                        loadMore(
                            (limit ?? 0) + (offset ?? 0),
                            5,
                            serviceName,
                            key ?? parentQualifiedName,
                            parentQualifiedName
                        )
                    },
                    typeName: 'LoadMore',
                    qualifiedName: 'LoadMore',
                })
            } else {
                const path = recursivelyFindPath(parentQualifiedName)
                const addLoadMoreInNestedNode = (node: CustomTreeDataItem) => {
                    const currentPath = path.pop()
                    if (
                        node.qualifiedName === parentQualifiedName &&
                        !currentPath
                    ) {
                        node.children?.push({
                            key: (key ?? parentQualifiedName) + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            isLoading: false,
                            click: () =>
                                loadMore(
                                    (limit ?? 0) + (offset ?? 0),
                                    5,
                                    serviceName,
                                    key ?? parentQualifiedName,
                                    parentQualifiedName
                                ),
                            typeName: 'LoadMore',
                            qualifiedName: 'LoadMore',
                        })
                        return node
                    }
                    return {
                        ...node,
                        children: node.children?.map((child) => {
                            if (child.qualifiedName === currentPath)
                                return addLoadMoreInNestedNode(child)
                            return child
                        }),
                    }
                }
                const parent = path.pop()

                treeData.value = treeData.value.map((node) => {
                    if (node.qualifiedName === parent)
                        return addLoadMoreInNestedNode(node)
                    return node
                })
            }
        }
    }

    onMounted(() => {
        isInitingTree.value = true
        initTreeData(
            connectionQualifiedName?.value,
            databaseQualifiedName?.value,
            schemaQualifiedName?.value
        )
    })

    watch(
        [
            connectionQualifiedName,
            databaseQualifiedName,
            schemaQualifiedName,
            queryText,
            facets,
            sortOrderTable,
            sortOrderColumn,
        ],
        ([c, d, s]) => {
            console.log('reinitialized')
            console.log('tree filters: ', {facets, sortOrderColumn, sortOrderTable})
            isInitingTree.value = true
            initTreeData(c, d, s)
        }
    )

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
        updateNode,
    }
}

export default useTree
