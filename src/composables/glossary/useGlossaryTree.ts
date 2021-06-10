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
        treeData.value = list.value?.map((item) => {
            return {
                key: item.guid,
                title: item.attributes.name,
                type: "glossary",
                isRoot: true,
            };
        }) as TreeDataItem[];
    })
    const onLoadData = async (treeNode: any) => {
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
            const children = categoryMap[treeNode.dataRef.glossaryID].filter((item) => {
                return item.parentCategoryGuid === treeNode.dataRef.key
            });
            children.forEach((child) => {
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