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
    watch(list, (newValue, oldValue) => {
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

            newValue?.forEach((newElement) => {
                const newNode = treeData.value.find((treeNode: TreeDataItem) => treeNode.key === newElement.guid);

                const recursivelyRefreshChildren = async (element: TreeDataItem) => {
                    if (element.children?.length || element.isOpen) {
                        element?.children?.forEach((child) => recursivelyRefreshChildren(child))
                        if (element.type === 'category') {
                            const termsList = await Glossary.ListTermsForCategory(element.key as string, {}, { cache: false });
                            const response = await Glossary.ListCategoryHeadersForGlossary(element.glossaryID, {}, { cache: false });
                            console.log(element.glossaryID)
                            const newChildren: TreeDataItem[] = []

                            response.forEach((updated) => {
                                if (updated.parentCategoryGuid === element.key) {
                                    const orignal = element.children?.find((child) => child.key === updated.categoryGuid);

                                    if (!orignal) newChildren.push({ title: updated.displayText, key: updated.categoryGuid, glossaryID: element.glossaryID, type: "category", isRoot: true })
                                    else newChildren.push({
                                        children: orignal.children,
                                        title: updated.displayText, key: updated.categoryGuid, glossaryID: element.glossaryID, type: "category", isRoot: true
                                    })
                                }
                            });
                            termsList.forEach((updated) => {
                                newChildren.push({
                                    title: updated.name, key: updated.guid, glossaryID: element.glossaryID, type: "term", isLeaf: true
                                })
                            });

                            element.children = newChildren;
                        } else if (element.type === 'glossary') {

                            const response = await Glossary.ListCategoryHeadersForGlossary(element.key as string, {}, { cache: false });
                            const termsList = await Glossary.ListTermsForGlossary(element.key as string, {}, { cache: false });

                            const updatedList: TreeDataItem[] = [];

                            response.forEach((updated) => {
                                if (!updated.parentCategoryGuid) {
                                    const orignal = element.children?.find((child) => child.key === updated.categoryGuid);

                                    if (!orignal) updatedList.push({ title: updated.displayText, key: updated.categoryGuid, glossaryID: element.glossaryID, type: "category", isRoot: true })
                                    else updatedList.push({
                                        children: orignal.children,
                                        title: updated.displayText, key: updated.categoryGuid, glossaryID: element.glossaryID, type: "category", isRoot: true
                                    })
                                }
                            });
                            termsList.forEach((updated) => {
                                updatedList.push({
                                    title: updated.name, key: updated.guid, glossaryID: element.glossaryID, type: "term", isLeaf: true
                                })
                            });

                            element.children = updatedList;
                        }
                    } else {
                        return
                    }
                }
                if (!newNode) {
                    updatedTreeData.push({
                        key: newElement.guid,
                        title: newElement.attributes.name,
                        type: "glossary",
                        isRoot: true,
                    })
                }
                else if (newNode) {
                    if (newNode.children?.length || newNode.isOpen) {
                        // newNode.children.forEach((child) => {
                        recursivelyRefreshChildren(newNode)
                        // })
                        updatedTreeData.push({
                            key: newElement.guid,
                            title: newElement.attributes.name,
                            type: "glossary",
                            isRoot: true,
                            children: newNode.children
                        })
                    } else {
                        updatedTreeData.push({
                            key: newElement.guid,
                            title: newElement.attributes.name,
                            type: "glossary",
                            isRoot: true,
                            children: newNode.children
                        })
                    }
                }
            })

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