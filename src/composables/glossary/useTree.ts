import { watch, ref, Ref,computed, ComputedRef } from 'vue';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { useRouter, useRoute } from 'vue-router'

import { Glossary, Category, Term } from "~/types/glossary/glossary.interface";
import { Components } from '~/api/atlas/client';

import { Glossary as GlossaryApi } from '~/api/atlas/glossary'
import store from '~/utils/storage'


// composables
import useGTCEntity from '~/composables/glossary/useGtcEntity'

const useTree = (emit: any, cacheKey?: string, isAccordion?: boolean) => {
    const route = useRoute()
    const router = useRouter()

    // A map of node guids to the guid of their parent. Used for traversing the tree while doing local update
    const nodeToParentKeyMap: Record<string, 'root' | string> = {}

    const categoryMap: { [key: string]: Components.Schemas.AtlasGlossaryCategory[] } = {};
    const treeData = ref<TreeDataItem[]>([]);
    const parentGlossary = ref<Glossary>();
    const isInitingTree = ref(false);
    const loadedKeys = ref<string[]>([]);
    const selectedCacheKey = `${cacheKey}_selected`
    const expandedCacheKey = `${cacheKey}_expanded`
    const selectedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])

    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)


    const currentGuid = ref<string>(route.params.id as string);
    const fetchGuid = ref<string>(currentGuid.value);
    const currentType = ref(
        router.currentRoute.value.fullPath.split('/')[
            router.currentRoute.value.fullPath.split('/').length - 2
        ] as 'glossary' | 'category' | 'term'
    );
    const fetchType = ref(currentType.value)

    const currentEntity = ref<Glossary | Category | Term>();
    const { entity:fetchedEntity, error, isLoading, refetch } = useGTCEntity<
    Glossary | Term | Category
    >(
    // type,
    // currentGuid,
    fetchType,
    fetchGuid,
    false,
    )
   
    const initTreeData = async (guid: string) => {
        const categoryList = await GlossaryApi.ListCategoryForGlossary(guid, {});
        const termsList = await GlossaryApi.ListTermsForGlossary(guid, {});
        categoryMap[guid] = categoryList;
        treeData.value = [];
        categoryList.forEach(element => {
            
            if (!element.parentCategory?.categoryGuid) {
                if(element.guid)
                    nodeToParentKeyMap[element.guid] = 'root';

                treeData.value.push(
                    {...element, title: element.name, key: element.guid, glossaryID: guid, type: "category", }
                )
            };
        });
        termsList.forEach(element => {
            if(element.guid)
                nodeToParentKeyMap[element.guid] = 'root';
            
            treeData.value.push(
                {...element, title: element.name, key: element.guid, glossaryID: guid, type: "term", isLeaf: true }
            )
        })
        isInitingTree.value = false;
        // selectedKeys.value.push(guid)
        // Logic to expand tree
        // if(currentEntity.value?.typeName === 'AtlasGlossaryCategory'){
        //     loadedKeys.value.push(currentEntity.value?.attributes?.parentCategory?.guid)
            
        // }
    }

    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isOpen = true;
        if (treeNode.dataRef.children) {
            
        }
        else if (treeNode.dataRef.type === "glossary") {
            try {
                const response = await GlossaryApi.ListCategoryForGlossary(treeNode.dataRef.key, {}, { cache: true });
                const termsList = await GlossaryApi.ListTermsForGlossary(treeNode.dataRef.key, {}, { cache: true });
                categoryMap[treeNode.dataRef.key] = response;
                response.forEach(element => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = [];
                    }
                    if (!element.parentCategory?.categoryGuid) {
                        treeNode.dataRef.children.push(
                            { ...element, title: element.name, key: element.guid, glossaryID: treeNode.dataRef.key, type: "category", isRoot: true }
                        )
                    };
                });
                termsList.forEach(element => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = [];
                    }
                    treeNode.dataRef.children.push(
                        { ...element, title: element.name, key: element.guid, glossaryID: treeNode.dataRef.key, type: "term", isLeaf: true }
                    )
                });
                treeData.value = [...treeData.value];
                loadedKeys.value.push(treeNode.dataRef.key)
            } catch (error) {
                console.log(error);
            }
        } else if (treeNode.dataRef.type === "category") {
            // find all categories which are children
            const children = categoryMap[treeNode.dataRef.glossaryID]?.filter((item) => item.parentCategory?.categoryGuid === treeNode.dataRef.key);
            children?.forEach((child) => {
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = [];
                }
                if(child.guid) {
                    nodeToParentKeyMap[child.guid] = treeNode.dataRef.key;
                }

                treeNode.dataRef.children.push(
                    { ...child, title: child.name, key: child.guid, glossaryID: treeNode.dataRef.glossaryID, categoryID: treeNode.dataRef.key, type: "category", isRoot: true, }
                )
            });
            try {
                const termsList = await GlossaryApi.ListTermsForCategory(treeNode.dataRef.key, {}, { cache: true });
                termsList.forEach(element => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = [];
                    }
                    if(element.guid) {
                        nodeToParentKeyMap[element.guid] = treeNode.dataRef.key;
                    }
                    treeNode.dataRef.children.push(
                        { ...element,title: element.name, key: element.guid, glossaryID: treeNode.dataRef.key, type: "term", isLeaf: true }
                    )
                });
                loadedKeys.value.push(treeNode.dataRef.key)
            } catch (err) {
                console.log(err);
            }
            treeData.value = [...treeData.value];
        } else {

        }
    };

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        if (!event.node.isLeaf ) {
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
            selectedKeys.value = []
        } else {
            if (selectedKeys.value.includes(selected)) {
                selectedKeys.value = []
            } else {
                selectedKeys.value = [...selected]
            }
            emit('select', event.node.eventKey)
        }
        store.set(selectedCacheKey, selectedKeys.value)
        
    }

    const updateNode = ({guid, entity, name, assetStatus}: {
        guid: string,
        entity?: Glossary | Category | Term,
        name?: string,
        assetStatus?: string
    }) => {
        if(nodeToParentKeyMap[guid] === 'root') {
            treeData.value = treeData.value.map((treeNode) => {
                if(treeNode.key === guid) return {
                    ...treeNode,
                    assetStatus: entity?.attributes?.assetStatus ?? assetStatus ?? treeNode.assetStatus,
                    name: entity?.attributes?.name ?? name ?? treeNode.name,
                    title: entity?.attributes?.name ?? name ?? treeNode.title
                }
                return treeNode
            })
        } else {
            const parentStack:string[] = [guid];
            const recursivelyFindPath = (currentGuid: string) => {
                if(nodeToParentKeyMap[currentGuid] && nodeToParentKeyMap[currentGuid] !== 'root') {
                    parentStack.push(nodeToParentKeyMap[currentGuid])
                    recursivelyFindPath(nodeToParentKeyMap[currentGuid])
                }
            };
            const updateNodeNested = (node: TreeDataItem): TreeDataItem => {
                const currentPath = parentStack.pop();
                if(node.key === guid || !currentPath) {
                    return {
                        ...node,
                        assetStatus: entity?.attributes?.assetStatus ?? assetStatus ?? node.assetStatus,
                        name: entity?.attributes?.name ?? name ?? node.name,
                        title: entity?.attributes?.name ?? name ?? node.title
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((childNode: TreeDataItem) => {
                        if(childNode.key === currentPath) {
                            return updateNodeNested(childNode) 
                        }
                        return childNode;
                    })
                }
            }
            recursivelyFindPath(guid);
            const parent = parentStack.pop();

            treeData.value = treeData.value.map((node: TreeDataItem) => {
                if(node.key === parent) return updateNodeNested(node);
                return node;
            })
        }
    }

    const refetchGlossary = async (guid: string | 'root') => {
        if(guid === 'root' && parentGlossary.value?.guid) {

            const categoryList = await GlossaryApi.ListCategoryForGlossary(parentGlossary.value?.guid, {}, {});
            const termsList = await GlossaryApi.ListTermsForGlossary(parentGlossary.value?.guid, {}, { });
            categoryMap[parentGlossary.value?.guid] = categoryList;

            const updatedTreeData: TreeDataItem[]  = [];

            categoryList.forEach((category) => {
                const existingCategory = treeData.value.find((entity) => entity.guid === category.guid);
                if(existingCategory) {
                    updatedTreeData.push(existingCategory)
                } else if (!category.parentCategory?.categoryGuid) {
                    nodeToParentKeyMap[category.guid] = 'root'
                    updatedTreeData.push(
                        { ...category, title: category.name, key: category.guid, glossaryID: parentGlossary.value?.guid, type: "category", isRoot: true, }
                    )
                }
            });
            termsList.forEach((term) => {
                const existingTerm = treeData.value.find((entity) => entity.guid === term.guid);
                if(existingTerm) {
                    updatedTreeData.push(existingTerm)
                } else {
                    nodeToParentKeyMap[term.guid] = 'root'
                    updatedTreeData.push(
                        { ...term, title: term.name, key: term.guid, glossaryID: parentGlossary.value?.guid, type: "term", isLeaf: true }
                    )
                }
            })
            
            treeData.value = updatedTreeData;
        } else {
            const parentStack:string[] = [guid];
            const recursivelyFindPath = (currentGuid: string) => {
                if(nodeToParentKeyMap[currentGuid] && nodeToParentKeyMap[currentGuid] !== 'root') {
                    parentStack.push(nodeToParentKeyMap[currentGuid])
                    recursivelyFindPath(nodeToParentKeyMap[currentGuid])
                }
            };
            const updateNodeNested = async (node: TreeDataItem) => {
                const currentPath = parentStack.pop();
                if(node.key === guid || !currentPath) {
                    const categoryList = await GlossaryApi.ListCategoryForGlossary(parentGlossary.value?.guid ?? '', {}, {});
                    const termsList = await GlossaryApi.ListTermsForCategory(guid, {}, { });
                    categoryMap[parentGlossary.value?.guid ?? ''] = categoryList;

                    const updatedChildren: TreeDataItem[] = [];
                    
                    categoryList.forEach((category) => {
                        const existingCategory = node.children?.find((entity) => entity.guid === category.guid);
                        
                        if(existingCategory) {
                            updatedChildren.push(existingCategory)
                        } else if (category.parentCategory?.categoryGuid === node.key){
                            nodeToParentKeyMap[category?.guid ?? ''] = node.key as string;
                            updatedChildren.push(
                                { ...category, title: category.name, key: category.guid, glossaryID: parentGlossary.value?.guid, categoryID: node.key, type: "category", isRoot: true, }
                            )
                        }
                    })

                    termsList.forEach((term) => {
                        const existingTerm = node.children?.find((entity) => entity.guid === term.guid)
                        if(existingTerm){
                            updatedChildren.push(existingTerm)
                        } else {
                            nodeToParentKeyMap[term?.guid ?? ''] = node.key as string;
                            updatedChildren.push(
                                { ...term,title: term.name, key: term.guid, glossaryID: parentGlossary.value?.guid, type: "term", isLeaf: true }
                            )
                        }
                    });
                    return {
                        ...node,
                        children: updatedChildren
                    }
                }
                const updatedChildren:TreeDataItem[] = [];

                // eslint-disable-next-line no-restricted-syntax
                for(const childNode of node?.children ?? []){
                    if(childNode.key === currentPath) {
                        const updatedNode = await updateNodeNested(childNode) 
                        updatedChildren.push(updatedNode);
                    } else {
                        updatedChildren.push(childNode);
                    }
                }
                return {
                    ...node,
                    children: updatedChildren
                }
            }
            recursivelyFindPath(guid);
            const parent = parentStack.pop();

            const updatedTreeData: TreeDataItem[] = [];

            // eslint-disable-next-line no-restricted-syntax
            for(const node of treeData.value){
                if(node.key === parent){
                    const updatedNode =  await updateNodeNested(node);
                    updatedTreeData.push(updatedNode)
                } else {
                    updatedTreeData.push(node)
                }
            };

            treeData.value = updatedTreeData;
        }
    }

    watch(fetchGuid, () => {
        if(fetchType.value === 'glossary'){
            isInitingTree.value = true;
            expandedKeys.value = [];
            loadedKeys.value = []
        }
    })

    watch(fetchedEntity, (newEntity) => {
        if(newEntity?.typeName === 'AtlasGlossary'){
            parentGlossary.value = newEntity
            treeData.value = [];
            initTreeData(fetchGuid.value)
        } 
        else if(newEntity?.typeName === 'AtlasGlossaryCategory' || newEntity?.typeName === 'AtlasGlossaryTerm') {
            if(!treeData.value?.length){
                currentEntity.value = fetchedEntity.value;
                fetchGuid.value = newEntity?.attributes?.anchor?.guid;
                fetchType.value = 'glossary';
                refetch()
            }
        }
    });

    watch(
        () => route.params.id,
        (newId) => {
            currentGuid.value = newId as string
            currentType.value = 
                router.currentRoute.value.fullPath.split('/')[
                    router.currentRoute.value.fullPath.split('/')
                        .length - 2
                ] as 'glossary' | 'category' | 'term';

            fetchType.value = currentType.value;
            fetchGuid.value = currentGuid.value;
        }
    );


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
        onLoadData, 
        expandNode,
        selectNode,
        updateNode,
        refetchGlossary
    }
}

export default useTree;