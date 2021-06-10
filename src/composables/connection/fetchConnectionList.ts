import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { Components } from '~/api/atlas/client';
import { BaseAttributes, ConnectionAttributes } from '~/constant/projection';
import { SourceList } from '~/constant/source';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import fetchSearchList from '../utils/search';
import { ConnectionType } from '~/types/atlas/connection';


export default function fetchConnectionList(dependent: any, query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "Connection",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...ConnectionAttributes],
        query: query,
        entityFilters: filters,
    });

    const { data,

        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate } = fetchSearchList(dependent, body)

    const list: any = computed(() => {
        console.log(data);
        return <ConnectionType[] | undefined>data.value?.entities;
    });
    const item: any = computed(() => {
        if (list.value) {
            if (list.value.length > 0) {
                return list.value[0] as ConnectionType;
            }
        }
        return {} as ConnectionType;
    });

    let treeData = ref<TreeDataItem[]>([]);
    watch(list, () => {
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
                count: children?.length,
                image: found?.image,
                type: "connector",
                isRoot: true,
            });
        });
    });
    const sourceList: ComputedRef<any[] | undefined> = computed(() => {
        let source: any[] = [];
        let allSourceList = list.value?.map((value) => {
            return value.attributes.integrationName;
        });
        let uniq = [
            ...new Set(allSourceList),
        ];
        uniq.forEach((d) => {
            let found = SourceList.find((item) => item.id == d);
            if (found) {
                source.push(found);
            } else {
                source.push({
                    id: d,
                    label: d,
                    image: ""
                });
            }
        });
        return source;
    });



    return {
        data,
        body,
        treeData,
        list,
        item,
        sourceList,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}