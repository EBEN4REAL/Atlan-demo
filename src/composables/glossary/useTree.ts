import { watch, ref, Ref,computed, ComputedRef } from 'vue';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';

import { useAPI } from "~/api/useAPI"
import { GET_GTC_ENTITY } from "~/api/keyMaps/glossary"
import { Glossary, Category, Term } from "~/types/glossary/glossary.interface";
import { Components } from '~/api/atlas/client';

import { Glossary as GlossaryApi } from '~/api/atlas/glossary'

import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';

// composables
import useGTCEntity from '~/composables/glossary/useGtcEntity'

const useTree = (currentGuid: Ref<string>, type: ComputedRef<'glossary' | 'category' | 'term'>) => {
    const categoryMap: { [key: string]: Components.Schemas.AtlasRelatedCategoryHeader[] } = {};
    const treeData = ref<TreeDataItem[]>([]);

    const { entity, error, isLoading, refetch } = useGTCEntity<
    Glossary | Term | Category
    >(
    type.value,
    currentGuid,
    )
   
    const initTreeData = async () => {
        const categoryList = await GlossaryApi.ListCategoryHeadersForGlossary(currentGuid.value, {});
        const termsList = await GlossaryApi.ListTermsForGlossary(currentGuid.value, {});
        categoryMap[currentGuid.value] = categoryList;
        treeData.value = [];
        categoryList.forEach(element => {
            if (!element.parentCategoryGuid) {
                treeData.value.push(
                    { title: element.displayText, key: element.categoryGuid, glossaryID: currentGuid.value, type: "category", isRoot: true, children: [] }
                )
            };
        });
        termsList.forEach(element => {
            treeData.value.push(
                { title: element.name, key: element.guid, glossaryID: currentGuid.value, type: "term", isLeaf: true }
            )
        })

    }

    watch(entity, (newEntity) => {
        if(newEntity?.typeName === 'AtlasGlossary'){
            treeData.value = [];
            initTreeData()
        }
    });

    return { treeData }
}

export default useTree;