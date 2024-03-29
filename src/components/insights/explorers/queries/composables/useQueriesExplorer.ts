import { watch, ref, Ref, computed, ComputedRef, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

// import { Attributes,  BasicSearchResponse } from '~/types/insights/savedQuery.interface'
import { Attributes } from '~/types/insights/savedQuery.interface'

import {
    BasicSearchResponse,
} from '~/types/common/atlasSearch.interface'

import { Components } from '~/types/atlas/client'

import store from '~/utils/storage'

// composables
import useLoadQueryTree from './useLoadQueryTree';

type CustomTreeDataItem = Omit<TreeDataItem, 'children'> & Attributes &{
    children?: CustomTreeDataItem[];
    typeName: string;
    guid: string | undefined;
    classifications?: Components.Schemas.AtlasClassification[];
} | {
    key: string;
    title: string;
    isLeaf: Boolean;
    click: any;
    children?: CustomTreeDataItem[];
    qualifiedName: string;
    typeName: string;
};

interface useQueriresExplorerTreeProps {
    emit: any;
    connectionQualifiedName?: Ref<string>;
    databaseQualifiedName?: Ref<string>; 
    schemaQualifiedName?: Ref<string>;
    cacheKey?: string; 
    isAccordion?: boolean;
}

const useTree = ({ emit, connectionQualifiedName, databaseQualifiedName, schemaQualifiedName, cacheKey, isAccordion}: useQueriresExplorerTreeProps) => {

    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, 'root' | string> = {}

    const treeData = ref<CustomTreeDataItem[]>([])

    const isInitingTree = ref(false)
    const loadedKeys = ref<string[]>([])
    const selectedCacheKey = `${cacheKey}_selected`
    const expandedCacheKey = `${cacheKey}_expanded`
    const selectedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])

    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const {
        getSavedQueriesForConnector,
    } = useLoadQueryTree()

    const serviceMap = {
        'Connection': getDatabaseForConnection,
        'Database': getSchemaForDatabase,
        'Schema': getTablesForSchema,
        'Table': getColumnsForTable,
    }

    /** * 
     * @param targetGuid - guid / key of the node whose path needs to be found
     * 
     * Given the guid of a child node, finds and return the path to that node.  
     * The last element of the returned array is the top parent of the node  
     * 
     * [ targetNode, ....., child2, child1, topParent ]  
     */
    const recursivelyFindPath = (targetGuid: string, initialStack?: string[]) => {
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

        findPath(targetGuid);

        return parentStack;
    }
    
    /**
     * Reinitializes the entire tree while and **loses the expanded state of the tree**
     * @param guid - Guid of the parent Glossary
     */
    const initTreeData = async (connectorQualifiedName?: string= 'snowflake', databaseQualifiedName?: string, schemaQualifiedName?: string) => {
        // TODO: optimisation - if new selcted name is already expanded, use the same child instead of reinitializing
        // treeData.value = [];
                treeData.value = []
                loadedKeys.value = [];

                const savedQueriesResponse = await getSavedQueriesForConnector(connectorQualifiedName, 0)
                savedQueriesResponse.entities?.forEach((query) => {
                    console.log(query,"q1")
                    treeData.value.push(returnTreeDataItemAttributes(query));
                    nodeToParentKeyMap[query.attributes.qualifiedName] = 'root'
                })

                checkAndAddLoadMoreNode(savedQueriesResponse, 'Connector', connectorQualifiedName, 'root')

        isInitingTree.value = false;
    }

    const triggerLoadingState = (parentNodeId: string) => {
        if(parentNodeId === 'root') {
            treeData.value = treeData.value.map((node) => {
                if( node.title === 'Load more') {
                    return {
                        ...node,
                        isLoading: true
                    }
                }
                return node
            })
        } else {
            const path = recursivelyFindPath(parentNodeId);
            
            const trigger = (node: CustomTreeDataItem) => {
                const currentPath = path.pop();

                if(node.qualifiedName === parentNodeId && !currentPath) {
                    return {
                        ...node,
                        children: node.children?.map((child) => {
                            if(child.title === 'Load more') return {...child, isLoading: true}
                            return child
                        }),
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((child) => {
                        if(child.qualifiedName === currentPath) return trigger(child);
                        return child;
                    })
                }
            }

            const parent = path.pop();
            treeData.value = treeData.value.map((node) => {
                if(node.qualifiedName === parent) return trigger(node);
                return node;
            })
        }
    }


    const loadMore = async (offset: number, limit: number, service: 'Connection' | 'Database' | 'Schema' | 'Table', parentNodeId: string, parentQualifiedName: string) => {
        const getAssets = serviceMap[service];


        if(parentNodeId === 'root'){
            triggerLoadingState(parentNodeId);

            const response = await getAssets(parentQualifiedName, offset);

            treeData.value = treeData.value.filter((node) => node.title !== 'Load more');
            response.entities?.forEach((entity) => {
                
                treeData.value.push(returnTreeDataItemAttributes(entity));
                nodeToParentKeyMap[entity.attributes.qualifiedName] = parentQualifiedName
            });
            checkAndAddLoadMoreNode(response, service, parentQualifiedName, parentNodeId)
        } else {
            triggerLoadingState(parentNodeId);
            const response = await getAssets(parentQualifiedName, offset);

            const path = recursivelyFindPath(parentQualifiedName);

            const appendNewNodes = (node: CustomTreeDataItem) => {
                const currentPath = path.pop();

                if(node.qualifiedName === parentQualifiedName && !currentPath){
                    const newChildren = node.children?.filter((child) => child.title !== 'Load more');
                    response.entities?.forEach((entity) => {
                        console.log(entity,"entity")
                        newChildren?.push(returnTreeDataItemAttributes(entity));
                        nodeToParentKeyMap[entity.attributes.qualifiedName] = parentQualifiedName
                    })

                    // Load More Node
                    if(response.approximateCount && response.entities && response.approximateCount > (response.searchParameters?.limit ?? 0) + (response?.searchParameters?.offset ?? 0)) {
                        newChildren?.push({
                            key:parentQualifiedName + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            click: () => loadMore(
                                (response.searchParameters?.limit ?? 0) + (response?.searchParameters?.offset ?? 0),
                                5,
                                service,
                                parentQualifiedName,
                                parentQualifiedName
                            ),
                            typeName: 'LoadMore',
                            qualifiedName: 'LoadMore'
                        })
                    }

                    return {
                        ...node,
                        children: newChildren
                    }
                } 
                return {
                    ...node,
                    children: node.children?.map((child) => {
                        if(child.qualifiedName === currentPath) return appendNewNodes(child);
                        return child;
                    })
                }
            }


            const parent = path.pop();
            treeData.value = treeData.value.map((node) => {
                if(node.qualifiedName === parent) return appendNewNodes(node);
                return node;
            })
        }
    }

    /**
     * Asynchronously fetches children of a node and appends them
     */
    const onLoadData = async (treeNode: {
        [key: string]: any;
        dataRef: CustomTreeDataItem,
    }) => {
        console.log(treeNode)
        if(!treeNode.dataRef.children) {
            treeNode.dataRef.children = []
        }

        if (treeNode.dataRef.typeName === 'Database') {
            const schemaResponse = await getSchemaForDatabase(treeNode.dataRef.qualifiedName);
            
            schemaResponse.entities?.forEach((schema) => {
                treeNode.dataRef.children?.push(returnTreeDataItemAttributes(schema))
                nodeToParentKeyMap[schema.attributes.qualifiedName] = treeNode.dataRef.qualifiedName
            })
            
            if(!schemaResponse.entities?.length) treeNode.dataRef.isLeaf = true;
            checkAndAddLoadMoreNode(schemaResponse, 'Database', treeNode.dataRef.qualifiedName)

        } else if (treeNode.dataRef.typeName === 'Schema') {
            const tableResponse = await getTablesForSchema(treeNode.dataRef.qualifiedName);

            tableResponse.entities?.forEach((table) => {
                treeNode.dataRef.children?.push(returnTreeDataItemAttributes(table));
                nodeToParentKeyMap[table.attributes.qualifiedName] = treeNode.dataRef.qualifiedName
            })

            if(!tableResponse.entities?.length) treeNode.dataRef.isLeaf = true;
            checkAndAddLoadMoreNode(tableResponse, 'Schema', treeNode.dataRef.qualifiedName)

        } else if ( treeNode.dataRef.typeName === 'Table') {

            const columnResponse = await getColumnsForTable(treeNode.dataRef.qualifiedName);

            columnResponse.entities?.forEach((column) => {
                treeNode.dataRef.children?.push(returnTreeDataItemAttributes(column));
                nodeToParentKeyMap[column.attributes.qualifiedName] = treeNode.dataRef.qualifiedName
            })
            checkAndAddLoadMoreNode(columnResponse, 'Table', treeNode.dataRef.qualifiedName)
        }
        loadedKeys.value.push(treeNode.dataRef.key)
    }

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        console.log('expanded', expanded)
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



    const returnTreeDataItemAttributes = (item:  Database | Schema | Table | Column) => {
        return {
            key: item.attributes.qualifiedName,
            guid: item.guid,
            title: item.attributes.name,
            typeName: item.typeName,
            classifications: item.classifications,
            ...item.attributes,
            isLeaf: item.typeName === 'Column' ? true : false
        }
    }

    const checkAndAddLoadMoreNode = (response: BasicSearchResponse<Database> | BasicSearchResponse<Schema> | BasicSearchResponse<Table> | BasicSearchResponse<Column>, serviceName:'Connection' | 'Database' | 'Schema' | 'Table' ,parentQualifiedName: string, key?: string) => {
        if(response.approximateCount && response.entities && response.approximateCount > (response.searchParameters?.limit ?? 0) + (response?.searchParameters?.offset ?? 0)) {
            if(key === 'root') {
                treeData.value.push({
                    key:( key ?? parentQualifiedName) + '_Load_More',
                    title: 'Load more',
                    isLeaf: true,
                    isLoading: false,
                    click: () =>  {
                        loadMore(
                            (response.searchParameters?.limit ?? 0) + (response?.searchParameters?.offset ?? 0),
                            5,
                            serviceName,
                            key ?? parentQualifiedName,
                            parentQualifiedName
                        )
                    },
                    typeName: 'LoadMore',
                    qualifiedName: 'LoadMore'
                })
            } else {
                const path = recursivelyFindPath(parentQualifiedName);
                const addLoadMoreInNestedNode = (node: CustomTreeDataItem) => {
                    const currentPath = path.pop()
                    if(node.qualifiedName === parentQualifiedName && !currentPath) {
                        node.children?.push({
                            key:( key ?? parentQualifiedName) + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            isLoading: false,
                            click: () => loadMore(
                                (response.searchParameters?.limit ?? 0) + (response?.searchParameters?.offset ?? 0),
                                5,
                                serviceName,
                                key ?? parentQualifiedName,
                                parentQualifiedName
                            ),
                            typeName: 'LoadMore',
                            qualifiedName: 'LoadMore'
                        })
                        return node;
                    } 
                    return {
                        ...node,
                        children: node.children?.map((child) => {
                            if(child.qualifiedName === currentPath) return addLoadMoreInNestedNode(child)
                            return child
                        })
                    }
                }
                const parent = path.pop()

                treeData.value = treeData.value.map((node) => {
                    if(node.qualifiedName === parent) return addLoadMoreInNestedNode(node);
                    return node;
                })
            }
        }
    }

    onMounted(() => {
        isInitingTree.value = true;
        initTreeData(connectionQualifiedName?.value, databaseQualifiedName?.value, schemaQualifiedName?.value)
    })

    watch([connectionQualifiedName, databaseQualifiedName, schemaQualifiedName], ([c, d, s]) => {
        isInitingTree.value = true;
        initTreeData(c, d, s)
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
