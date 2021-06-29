
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';

import { SearchBasic } from '~/api/atlas/searchbasic';
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';
import axios, { CancelTokenSource } from 'axios';
import { SourceList } from '~/constant/source';
import swrvState from '../utils/swrvState';
import { Components } from '~/api/atlas/client';
import { ConnectionType } from '~/types/atlas/connection';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';


export default function fetchConnectionList(cache?: string, dependentKey?: Ref<any>, paramEntityFilters?: Components.Schemas.FilterCriteria) {

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());

    let entityFilters: Components.Schemas.FilterCriteria = {};
    if (paramEntityFilters) {
        entityFilters = {
            ...paramEntityFilters,
            criterion: paramEntityFilters.criterion
        }
    } else {
        entityFilters = {
            condition: "AND" as Components.Schemas.Condition,
            criterion: []
        }
    }

    const body: Ref<SearchParameters> = ref({
        typeName: "Connection",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 100,
        offset: 0,
        attributes: [...BaseAttributes, ...BasicSearchAttributes],
        entityFilters: {
            ...entityFilters,
            criterion: entityFilters.criterion
        },
        aggregationAttributes: [],
    });

    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
    });
    const { data, mutate, isValidating, error } = SearchBasic.BasicV2(cache, body, options, dependentKey);
    const { state, STATES } = swrvState(data, error, isValidating);

    const list: Ref<ConnectionType[]> = ref([]);
    watch(data, () => {
        if (body?.value?.offset > 0) {
            list.value = list.value.concat(data?.value?.entities);
        } else {
            if (data.value?.entities) {
                list.value = data.value?.entities;
            } else {
                list.value = [];
            }
        }
    });

    const listCount: ComputedRef<any> = computed(() => {
        return list.value.length;
    });
    const limit: ComputedRef<any> = computed(() => {
        return body.value.limit;
    });
    const offset: ComputedRef<any> = computed(() => {
        return body.value.offset;
    });
    const totalCount: ComputedRef<any> = computed(() => {
        return data?.value?.approximateCount;
    });
    const aggregations: ComputedRef<any[]> = computed(() => {
        return data?.value?.aggregations;
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

    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            options.value.cancelToken = cancelTokenSource.value.token;
        }
        mutate();
    };

    const isLoadMore = computed(() => {
        if (listCount.value < totalCount.value) {
            return true;
        }
        return false;
    });

    const loadMore = (limit: number) => {
        if (isLoadMore.value) {
            body.value.offset += limit;
        }
        refresh();
    };

    const query = (queryText: string) => {
        body.value.query = queryText;
        body.value.offset = 0;
        refresh();
    };


    const filter = (filters: Components.Schemas.FilterCriteria) => {
        body.value.entityFilters.criterion = filters;
        refresh();
    };

    const isLoading = computed(() => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            return true;
        }
        return false;
    });

    const isError = computed(() => {
        if ([STATES.ERROR, STATES.STALE_IF_ERROR].includes(state.value)) {
            return true;
        }
        return false;
    });

    let treeData = ref<TreeDataItem[]>([]);
    watch(list, () => {
        treeData.value = [];
        sourceList.value?.forEach((src) => {
            let children = list.value?.filter((item) => {
                return item.attributes.integrationName === src.id;
            }).map((item) => {
                return {
                    key: item.guid,
                    title: item.attributes.displayName || item.attributes.name,
                    type: "connection"
                };
            });

            children = children?.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
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


    return {
        data,
        list,
        listCount,
        mutate,
        isLoadMore,
        loadMore,
        query,
        filter,
        isError,
        isLoading,
        error,
        limit,
        offset,
        totalCount,
        aggregations,
        refresh,
        sourceList,
        treeData,
    }
}