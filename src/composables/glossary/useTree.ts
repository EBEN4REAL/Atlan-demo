import { watch, ref, Ref,computed, ComputedRef } from 'vue';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { useRouter, useRoute } from 'vue-router'

import { useAPI } from "~/api/useAPI"
import { GET_GTC_ENTITY } from "~/api/keyMaps/glossary"
import { Glossary, Category, Term } from "~/types/glossary/glossary.interface";
import { Components } from '~/api/atlas/client';

import { Glossary as GlossaryApi } from '~/api/atlas/glossary'


// composables
import useGTCEntity from '~/composables/glossary/useGtcEntity'

const useTree = () => {
    const route = useRoute()
    const router = useRouter()


    const categoryMap: { [key: string]: Components.Schemas.AtlasRelatedCategoryHeader[] } = {};
    const treeData = ref<TreeDataItem[]>([]);
    const parentGlossary = ref<Glossary>();
    const isInitingTree = ref(false);

    const currentGuid = ref<string>(route.params.id as string);
    const type = ref(
        router.currentRoute.value.fullPath.split('/')[
            router.currentRoute.value.fullPath.split('/').length - 2
        ] as 'glossary' | 'category' | 'term'
    );

    const { entity, error, isLoading, refetch } = useGTCEntity<
    Glossary | Term | Category
    >(
    type,
    currentGuid,
    false,
    )
   
    const initTreeData = async (guid: string) => {
        const categoryList = await GlossaryApi.ListCategoryHeadersForGlossary(guid, {});
        const termsList = await GlossaryApi.ListTermsForGlossary(guid, {});
        categoryMap[guid] = categoryList;
        treeData.value = [];
        categoryList.forEach(element => {
            if (!element.parentCategoryGuid) {
                treeData.value.push(
                    { title: element.displayText, key: element.categoryGuid, glossaryID: guid, type: "category", }
                )
            };
        });
        termsList.forEach(element => {
            treeData.value.push(
                { title: element.name, key: element.guid, glossaryID: guid, type: "term", isLeaf: true }
            )
        })
        isInitingTree.value = false;
    }

    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isOpen = true;
        if (treeNode.dataRef.children) {
            
        }
        else if (treeNode.dataRef.type === "glossary") {
            try {
                const response = await GlossaryApi.ListCategoryHeadersForGlossary(treeNode.dataRef.key, {}, { cache: true });
                const termsList = await GlossaryApi.ListTermsForGlossary(treeNode.dataRef.key, {}, { cache: true });
                categoryMap[treeNode.dataRef.key] = response;
                response.forEach(element => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = [];
                    }
                    if (!element.parentCategoryGuid) {
                        treeNode.dataRef.children.push(
                            { title: element.displayText, key: element.categoryGuid, glossaryID: treeNode.dataRef.key, type: "category", isRoot: true }
                        )
                    };
                });
                termsList.forEach(element => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = [];
                    }
                    treeNode.dataRef.children.push(
                        { title: element.name, key: element.guid, glossaryID: treeNode.dataRef.key, type: "term", isLeaf: true }
                    )
                });
                treeData.value = [...treeData.value];
            } catch (error) {
                console.log(error);
            }
        } else if (treeNode.dataRef.type === "category") {
            // find all categories which are children
            const children = categoryMap[treeNode.dataRef.glossaryID]?.filter((item) => item.parentCategoryGuid === treeNode.dataRef.key);
            children?.forEach((child) => {
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = [];
                }
                treeNode.dataRef.children.push(
                    { title: child.displayText, key: child.categoryGuid, glossaryID: treeNode.dataRef.glossaryID, categoryID: treeNode.dataRef.key, type: "category", isRoot: true, }
                )
            });
            try {
                const termsList = await GlossaryApi.ListTermsForCategory(treeNode.dataRef.key, {}, { cache: true });
                termsList.forEach(element => {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = [];
                    }
                    treeNode.dataRef.children.push(
                        { title: element.name, key: element.guid, glossaryID: treeNode.dataRef.key, type: "term", isLeaf: true }
                    )
                });
            } catch (err) {
                console.log(err);
            }
            treeData.value = [...treeData.value];
        } else {

        }
    };

    watch(currentGuid, () => {
        if(type.value === 'glossary')
            isInitingTree.value = true;
    })

    watch(entity, (newEntity) => {
        if(newEntity?.typeName === 'AtlasGlossary'){
            parentGlossary.value = newEntity
            treeData.value = [];
            initTreeData(currentGuid.value)
        } 
        else if(newEntity?.typeName === 'AtlasGlossaryCategory' || newEntity?.typeName === 'AtlasGlossaryTerm') {
            if(!treeData.value?.length){
                // parentGlossary.value = newEntity.attributes.anchor
                // initTreeData(newEntity?.attributes?.anchor?.guid)
                currentGuid.value = newEntity?.attributes?.anchor?.guid;
                type.value = 'glossary';
                refetch()
            }
        }
    });


    watch(
        () => route.params.id,
        (newId) => {
            currentGuid.value = newId as string
            type.value =
                router.currentRoute.value.fullPath.split('/')[
                    router.currentRoute.value.fullPath.split('/')
                        .length - 2
                ] as 'glossary' | 'category' | 'term'
        }
    );

    return { 
        treeData, 
        currentGuid,
        type, 
        onLoadData, 
        parentGlossary, 
        isInitingTree
    }
}

export default useTree;