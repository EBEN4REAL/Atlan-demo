import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { ref, watch } from 'vue';
import { SourceList } from '~/constant/source';
import fetchConnectionList from './fetchConnectionList';

export default function useConnectionTree(query?: string) {

    const { list,
        sourceList,
        totalCount,
        listCount,
        error,
        body,
        mutate } = fetchConnectionList();

    let treeData = ref<TreeDataItem[]>([]);
    watch(list, () => {
        console.log("watch changes");
        treeData.value = [];
        sourceList.value?.forEach((src) => {
            const children = list.value?.filter((item) => {
                return item.attributes.integrationName === src.id;
            }).map((item) => {
                return {
                    key: item.guid,
                    title: item.attributes.name,
                    type: "connection"
                };
            });

            let found = SourceList.find((item) => item.id == src.id)
            treeData.value.push({
                key: src.id,
                title: src.label,
                children: children,
                image: found?.image,
                type: "connector",
                isRoot: true,
            });
        });
    });
    return {
        body,
        treeData,
        list,
        sourceList,
        totalCount,
        listCount,
        error,
        mutate
    }
}