import { watch, ref, Ref, computed, ComputedRef, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

import { Attributes,  Database, Schema, Table, Column } from '~/types/insights/table.interface'
import { Components } from '~/api/atlas/client'

import store from '~/utils/storage'

// composables
import useLoadTreeData from './useLoadTreeData';

type CustomTreeDataItem = Omit<TreeDataItem, 'children'> & Attributes &{
    children?: CustomTreeDataItem[];
    typeName: string;
    guid: string | undefined;
    classifications?: Components.Schemas.AtlasClassification[];
};

interface useSchemaExplorerTreeProps {
    emit: any;
    connectionQualifiedName?: Ref<string>;
    databaseQualifiedName?: Ref<string>; 
    schemaQualifiedName?: Ref<string>;
    cacheKey?: string; 
    isAccordion?: boolean;
}

const useTree = ({ emit, connectionQualifiedName, databaseQualifiedName, schemaQualifiedName, cacheKey, isAccordion}: useSchemaExplorerTreeProps) => {

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
        getDatabaseForConnection,
        getSchemaForDatabase,
        getTablesForSchema,
        getColumnsForTable,
    } = useLoadTreeData()

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
    const initTreeData = async (connectionQualifiedName?: string, databaseQualifiedName?: string, schemaQualifiedName?: string) => {
        // TODO: optimisation - if new selcted name is already expanded, use the same child instead of reinitializing
        treeData.value = [];

        if(schemaQualifiedName) {
            // get tables for schema - composable_useGetTablesForSchema
            // add to treeData
            const tableResponse = await getTablesForSchema(schemaQualifiedName);
            tableResponse.entities?.forEach((table) => {
                treeData.value.push(returnTreeDataItemAttributes(table))
            })
        } else if (databaseQualifiedName) {
            // get schema for database - composable_useGetSchemaForDatabase
            // add to treeData
            const schemaResponse = await getSchemaForDatabase(databaseQualifiedName);
            schemaResponse.entities?.forEach((schema) => {
                treeData.value.push(returnTreeDataItemAttributes(schema))
            })
        } else if (connectionQualifiedName) {
            // get database for connection - composable_useGetDatabaseForConnection
            // add to treeData
            const databasesResponse = await getDatabaseForConnection(connectionQualifiedName, 0)
            databasesResponse.entities?.forEach((database) => {
                treeData.value.push(returnTreeDataItemAttributes(database))
            })
            if(databasesResponse.approximateCount && databasesResponse.entities && databasesResponse.approximateCount > databasesResponse.entities?.length) {
                treeData.value.push({
                    key: 'root',
                    title: 'Load more',
                    isLeaf: true,
                    click: () => loadMore(
                        databasesResponse.searchParameters?.limit ?? 0 + databasesResponse.searchParameters?.offset ?? 0,
                        5,
                        'Connection',
                        'root',
                        connectionQualifiedName
                    )
                })
            }
        } else {
            // nothing
        }
        isInitingTree.value = false;
    }

    const loadMore = async (offset: number, limit: number, service: 'Connection' | 'Database' | 'Schema' | 'Table', parentNodeId: string, parentQualifiedName: string) => {
        const getAssets = serviceMap[service];

        const response = await getAssets(parentQualifiedName);
        if(parentNodeId === 'root'){
            treeData.value = treeData.value.filter((node) => node.title !== 'Load more');
            response.entities?.forEach((entity) => {
                treeData.value.push(returnTreeDataItemAttributes(entity))
            });
            if(response.approximateCount && response.entities && response.approximateCount > response.entities?.length) {
                treeData.value.push({
                    key: 'root',
                    title: 'Load more',
                    isLeaf: true,
                    click: () => loadMore(
                        response.searchParameters?.limit ?? 0 + response.searchParameters?.offset ?? 0,
                        5,
                        service,
                        'root',
                        connectionQualifiedName
                    )
                })
            }
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
            // get schema for database - composable_useGetSchemaForDatabase
            const schemaResponse = await getSchemaForDatabase(treeNode.dataRef.qualifiedName);
            schemaResponse.entities?.forEach((schema) => {
                treeNode.dataRef.children?.push(returnTreeDataItemAttributes(schema))
            })
            if(!schemaResponse.entities?.length) treeNode.dataRef.isLeaf = true;
        } else if (treeNode.dataRef.typeName === 'Schema') {
            // get tables for schema - composable_useGetTablesForSchema
            const tableResponse = await getTablesForSchema(treeNode.dataRef.qualifiedName);
            tableResponse.entities?.forEach((table) => {
                treeNode.dataRef.children?.push(returnTreeDataItemAttributes(table))
            })
            if(!tableResponse.entities?.length) treeNode.dataRef.isLeaf = true;
        } else if ( treeNode.dataRef.typeName === 'Table') {
            const columnResponse = await getColumnsForTable(treeNode.dataRef.qualifiedName);
            columnResponse.entities?.forEach((column) => {
                treeNode.dataRef.children?.push(returnTreeDataItemAttributes(column))
            })
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
            key: item.guid,
            guid: item.guid,
            title: item.attributes.name,
            typeName: item.typeName,
            classifications: item.classifications,
            ...item.attributes,
            isLeaf: item.typeName === 'Column' ? true : false
        }
    }

    onMounted(() => {
        isInitingTree.value = true;
        initTreeData(connectionQualifiedName?.value, databaseQualifiedName?.value, schemaQualifiedName?.value)
    })

    watch([connectionQualifiedName, databaseQualifiedName, schemaQualifiedName], ([c, d, s]) => {
        isInitingTree.value = true;
        initTreeData(c?.value, d?.value, s?.value)
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
