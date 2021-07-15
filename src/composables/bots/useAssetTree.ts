import { ref, Ref, watch } from 'vue';
import useSearchList from './useSearchList';
import axios from 'axios';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { BaseAttributes, BasicSearchAttributes } from "~/constant/projection";

export default function useAssetTree(dependentKey?: Ref<any>, typeName?: string, initialBody?: any, cacheSuffx?: string | "") {

    let cancelTokenSource = ref(axios.CancelToken.source());
    const list: Ref<any> = ref([]);
    const { data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        replaceBody,
        refresh,
        body,
    } = useSearchList(typeName || "Catalog", list, [], dependentKey, initialBody, cacheSuffx, false, cancelTokenSource, true);


    const treeList: Ref<any> = ref([]);
    const loadNow = ref(true);
    let cancelTokenSource2 = ref(axios.CancelToken.source());
    const childBody = {
        limit: 0,
        attributes: [...BaseAttributes, ...BasicSearchAttributes],
    }
    const { replaceBodyAsync, body: treeChildBody } = useSearchList("Schema", treeList, [], loadNow, childBody, cacheSuffx, false, cancelTokenSource2, false);

    const treeData = ref<TreeDataItem[]>([]);
    watch(list, (newValue, oldValue) => {
        // If orignal tree is empty, just append the list of glossary
        if (!treeData.value.length) {
            treeData.value = list.value?.map((item, index) => {
                return {
                    id: `${item.attributes.qualifiedName}`,
                    key: `${item.guid}_${index}`,
                    rootPId: `${item.attributes.qualifiedName}`,
                    title: null,
                    type: "Database",
                    titleText: item.attributes.name,
                    value: `${item.guid}_${index}`,
                    isLeaf: false,
                    connector: item.attributes.integrationName,
                    slots: {
                        title: "title"
                    }
                };
            }) as TreeDataItem[];
        } else {

        }
    })

    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isOpen = true;
        if (treeNode.dataRef.children) {
            return;
        }
        const { id } = treeNode.dataRef;


        console.log(treeNode.dataRef.id);

        // treeData.value = treeData.value.concat([genTreeNode(id, false), genTreeNode(id, true)]);
        // if (!loadNow.value) {
        //     loadNow.value = true;
        // }

        let childBody = treeChildBody.value;
        childBody.limit = 100;
        childBody.entityFilters = {
            condition: "AND",
            criterion: [],
        };

        childBody.entityFilters.criterion.push({
            attributeName: "databaseQualifiedName",
            attributeValue: treeNode.dataRef.id,
            operator: "eq",
        });

        await replaceBodyAsync(childBody);

        console.log(treeList);
        treeList.value.forEach((element, index) => {
            treeData.value.push({
                id: `${element.attributes.qualifiedName}`,
                key: `${element.guid}_${index}`,
                pId: `${element.attributes.databaseQualifiedName}`,
                title: null,
                type: element.typeName,
                titleText: element.attributes.name,
                value: `${element.guid}_${index}`,
                isLeaf: true,
                connector: element.attributes.integrationName,
                slots: {
                    title: "title"
                }
            })
        });

        treeData.value = [...treeData.value];

        console.log(treeData.value);





    };



    return {
        data,
        list,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        replaceBody,
        refresh,
        body,
        treeData,
        onLoadData
    }
}

