import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { computed, ComputedRef, ref, Ref, toRefs, watch } from 'vue';
import { Components } from '~/api/atlas/client';
import { Glossary } from '~/api/atlas/glossary'
import { Search } from '~/api/atlas/search';

import BasicSearch from '~/composables/common/basicsearch';
import { BaseAttributes, GlossaryAttributes } from '~/constant/projection';
import { GlossaryType } from '~/types/atlas/glossary';
import axios from "axios";

export default function useGlossaryTree(list: ComputedRef<GlossaryType[] | undefined>,) {

    const categoryMap: { [key: string]: Components.Schemas.AtlasRelatedCategoryHeader[] } = {};
    const treeData = ref<TreeDataItem[]>([]);
    watch(list, async (newValue, oldValue) => {
        // If orignal tree is empty, just append the list of glossary
        if (!treeData.value.length) {
            treeData.value = list.value?.map((item, index) => {
                return {
                    key: item.guid,
                    title: item.attributes.name,
                    type: "glossary",
                    isRoot: true,
                };
            }) as TreeDataItem[];
        } else {
            const updatedTreeData: TreeDataItem[] = [];
            if (newValue) {
                // use `for-of` loop, since we want to await for any promises to resolve before going to the next iteration
                for (let currentElement of newValue) {
                    // Check if the currentElement already exists in the tree or not
                    const newNode = treeData.value.find((treeNode: TreeDataItem) => treeNode.key === currentElement.guid);

                    // Recursive function to update any nodes in the tree which are expanded
                    const recursivelyRefreshChildren = async (element: TreeDataItem) => {
                        // Only refresh if the node had children or was expandedin the UI
                        if (element.children?.length || element.isOpen) {

                            // Traverse to the leaf nodes
                            element?.children?.forEach((child) => recursivelyRefreshChildren(child))
                            if (element.type === 'category') {
                                // For each category, fetch its sub-categories and Terms
                                const termsList = await Glossary.ListTermsForCategory(element.key as string, {}, { cache: false });
                                const response = await Glossary.ListCategoryHeadersForGlossary(element.glossaryID, {}, { cache: false });

                                const newChildren: TreeDataItem[] = []

                                // Iterate through the sub-categories ->
                                response.forEach((updated) => {
                                    // if this sub-category is a direct child of current Category
                                    if (updated.parentCategoryGuid === element.key) {
                                        const orignal = element.children?.find((child) => child.key === updated.categoryGuid);

                                        // If this is a new sub-category, just push it to the newChildren list
                                        if (!orignal) newChildren.push({ title: updated.displayText, key: updated.categoryGuid, glossaryID: element.glossaryID, type: "category", isRoot: true })
                                       // If this sub-category already existed, use the attributes coming from the freshly fetched sub-category (update)
                                       // But keep the children from the orignal one, since the list of children were updated in the recursive call   
                                        else newChildren.push({
                                            children: orignal.children,
                                            title: updated.displayText, key: updated.categoryGuid, glossaryID: element.glossaryID, type: "category", isRoot: true
                                        })
                                    }
                                });
                                // Push the update terms to the newChildren array
                                termsList.forEach((updated) => {
                                    newChildren.push({
                                        title: updated.name, key: updated.guid, glossaryID: element.glossaryID, type: "term", isLeaf: true
                                    })
                                });
                                //  Replace the children array with the updated one
                                element.children = newChildren;
                            } else if (element.type === 'glossary') {
                                // Fetch the categories and terms for the current glossary
                                const response = await Glossary.ListCategoryHeadersForGlossary(element.key as string, {}, { cache: false });
                                const termsList = await Glossary.ListTermsForGlossary(element.key as string, {}, { cache: false });

                                const updatedList: TreeDataItem[] = [];

                                // For each sub-category ->
                                response.forEach((updated) => {
                                    // Check if the category is a direct descendant of the glossary (First level child)
                                    // ( Sub-categories have a parent category guid attribute)
                                    if (!updated.parentCategoryGuid) {
                                        const orignal = element.children?.find((child) => child.key === updated.categoryGuid);

                                        // If its a new category, push to array
                                        if (!orignal) updatedList.push({ title: updated.displayText, key: updated.categoryGuid, glossaryID: element.key, type: "category", isRoot: true })
                                        // If already existed, use updated attributes, but keep the orignal children since they were refreshed in the recursive call
                                        else updatedList.push({
                                            children: orignal.children,
                                            title: updated.displayText, key: updated.categoryGuid, glossaryID: element.key, type: "category", isRoot: true
                                        })
                                    }
                                });
                                // Push the updated terms
                                termsList.forEach((updated) => {
                                    updatedList.push({
                                        title: updated.name, key: updated.guid, glossaryID: element.key, type: "term", isLeaf: true
                                    })
                                });
                                element.children = updatedList;
                            }
                            // If its a root element(glossary) push to updatedTreeData
                            if (element.type === "glossary")
                                updatedTreeData.push({
                                    key: currentElement.guid,
                                    title: currentElement.attributes.name,
                                    type: "glossary",
                                    isRoot: true,
                                    isOpen: element.isOpen,
                                    children: element.children
                                })

                            // We don't need to check for terms since they are updated by their respective parents
                        } else {
                            return
                        }
                    }
                  
                    // If newNode is undefined, i.e it does not already exist in the tree, simply push it
                    if (!newNode) {
                        updatedTreeData.push({
                            key: currentElement.guid,
                            title: currentElement.attributes.name,
                            type: "glossary",
                            isRoot: true,
                        })
                    }
                    // if newNode already exists in the tree ->
                    else if (newNode) {
                        // If the tree has children or was expanded, need to refresh it in order to update the UI.
                        // ( `children` is undefined if the tree was not expanded in the UI, even if in reality it might have children. 
                        // If its not expanded, no need to refresh it, since fresh values are going to be fetched whenever it is expaned)
                        if (newNode.children?.length || newNode.isOpen) {
                            await recursivelyRefreshChildren(newNode)
                        } else {
                            // If the node does not have any children, or was not open, no need to refresh it: push to updatedTree
                            updatedTreeData.push({
                                key: currentElement.guid,
                                title: currentElement.attributes.name,
                                type: "glossary",
                                isRoot: true,
                                children: newNode.children
                            })
                        }
                    }
                }
            }
            treeData.value = updatedTreeData;
        }
    })
    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isOpen = true;
        if (treeNode.dataRef.children) {
            return;
        }
        else if (treeNode.dataRef.type === "glossary") {
            try {
                const response = await Glossary.ListCategoryHeadersForGlossary(treeNode.dataRef.key, {}, { cache: true });
                const termsList = await Glossary.ListTermsForGlossary(treeNode.dataRef.key, {}, { cache: true });
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
            //find all categories which are children
            const children = categoryMap[treeNode.dataRef.glossaryID]?.filter((item) => {
                return item.parentCategoryGuid === treeNode.dataRef.key
            });
            children?.forEach((child) => {
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = [];
                }
                treeNode.dataRef.children.push(
                    { title: child.displayText, key: child.categoryGuid, glossaryID: treeNode.dataRef.glossaryID, categoryID: treeNode.dataRef.key, type: "category", isRoot: true, }
                )
            });
            try {
                const termsList = await Glossary.ListTermsForCategory(treeNode.dataRef.key, {}, { cache: true });
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

    return {
        treeData,
        onLoadData
    }
}