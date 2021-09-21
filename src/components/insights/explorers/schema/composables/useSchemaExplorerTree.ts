import { watch, ref, Ref, computed, ComputedRef, onMounted } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

import store from '~/utils/storage'

// composables
import useLoadTreeData from './useLoadTreeData';


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

    const treeData = ref<TreeDataItem[]>([])

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
        treeData.value = [];

        if(schemaQualifiedName) {
            // get tables for schema - composable_useGetTablesForSchema
            // add to treeData
            const tableResponse = await getTablesForSchema(schemaQualifiedName);
            tableResponse.entities.forEach((table) => {
                treeData.value.push({
                    ...table.attributes,
                    key: table.guid,
                    title: table.attributes.name
                })
            })
        } else if (databaseQualifiedName) {
            // get schema for database - composable_useGetSchemaForDatabase
            // add to treeData
            const schemaResponse = await getSchemaForDatabase(databaseQualifiedName);
            schemaResponse.entities.forEach((schema) => {
                treeData.value.push({
                    ...schema.attributes,
                    key: schema.guid,
                    title: schema.attributes.name
                })
            })
        } else if (connectionQualifiedName) {
            // get database for connection - composable_useGetDatabaseForConnection
            // add to treeData
            const databasesResponse = await getDatabaseForConnection(connectionQualifiedName, 0)
            databasesResponse.entities.forEach((database) => {
                treeData.value.push({
                    ...database.attributes,
                    key: database.guid,
                    title: database.attributes.name
                })
            })
        } else {
            // nothing
        }
        isInitingTree.value = false;
    }

    /**
     * Asynchronously fetches children of a node and appends them
     */
    const onLoadData = async (treeNode: any) => {
        if (treeNode.type === 'Database') {
            // get schema for database - composable_useGetSchemaForDatabase
        } else if (treeNode.type === 'Schema') {
            // get tables for schema - composable_useGetTablesForSchema
        } else if ( treeNode.type === 'Table') {
            // get columns for table - composable_useGetColumnsForTable
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
