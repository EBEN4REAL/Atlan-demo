<template>
    <div class="flex justify-between items-center px-4 py-3.5 text-xs border-b">
        <div class="font-medium text-gray-description">3 filters applied</div>
        <div class="flex items-center text-gray-description">
            <div class="px-3 py-1 font-mediumrounded text-primar">Reset</div>
            <a-button
                class="px-3 py-1 text-xs font-medium border-0 rounded  bg-primary-light text-primary"
                >Save</a-button
            >
        </div>
    </div>
    <a-collapse
        v-model:activeKey="activeKey"
        expandIconPosition="right"
        :bordered="false"
        class="bg-transparent"
        :class="$style.filter"
        :accordion="true"
    >
        <a-collapse-panel
            v-for="item in List"
            :key="item.id"
            :class="activeKey === item.id ? 'bg-gray-medium' : ''"
            class="bg-transparent hover:bg-gray-medium group"
        >
            <template #header>
                <div
                    :key="dirtyTimestamp"
                    class="flex justify-between select-none"
                >
                    {{ item.label }}

                    <div
                        v-if="isFilter(item.id)"
                        class="opacity-0 group-hover:opacity-100"
                        @click.stop.prevent="handleClear(item.id)"
                    >
                        Clear
                    </div>
                </div>
            </template>
            <component
                :is="item.component"
                :ref="
                    (el) => {
                        refMap[item.id] = el
                    }
                "
                :item="item"
                :data="dataMap[item.id]"
                @change="handleChange"
            ></component>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        ref,
        computed,
        Ref,
    } from 'vue'
    import { List } from './filters'
    import { Components } from '~/api/atlas/client'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { Collapse } from '~/types'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            Status: defineAsyncComponent(
                () => import('@common/facets/status.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('@common/facets/owners.vue')
            ),
            Classifications: defineAsyncComponent(
                () => import('@common/facets/classifications.vue')
            ),
            Advanced: defineAsyncComponent(
                () => import('@common/facets/advanced/index.vue')
            ),
        },
        props: {
            initialFilters: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['refresh'],
        setup(props, { emit }) {
            const classificationsStore = useClassificationStore()
            const activeKey: Ref<string> = ref('')
            const initialFilterMap = {
                status: {
                    condition:
                        props.initialFilters.facetsFilters.status.condition,
                    criterion:
                        props.initialFilters.facetsFilters.status.criterion,
                },
                classifications: {
                    condition:
                        props.initialFilters.facetsFilters.classifications
                            .condition,
                    criterion:
                        props.initialFilters.facetsFilters.classifications
                            .criterion,
                },
                owners: {
                    condition:
                        props.initialFilters.facetsFilters.owners.condition,
                    criterion:
                        props.initialFilters.facetsFilters.owners.criterion,
                },
                advanced: {
                    condition:
                        props.initialFilters.facetsFilters.advanced.condition,
                    criterion:
                        props.initialFilters.facetsFilters.advanced.criterion,
                },
            }
            const filterMap: {
                [key: string]: Components.Schemas.FilterCriteria
            } = {
                ...initialFilterMap,
            }
            let filters: Components.Schemas.FilterCriteria[] = []

            const dirtyTimestamp = ref('dirty_')

            const refMap: { [key: string]: any } = ref({})

            // Mapping of Data to child compoentns
            const dataMap: { [key: string]: any } = ref({})
            dataMap.value.status = {
                checked: props.initialFilters.facetsFilters.status.checked,
            }
            dataMap.value.classifications = {
                classifications: computed(
                    () => classificationsStore.classifications
                ),
                checked:
                    props.initialFilters.facetsFilters.classifications.checked,
            }
            dataMap.value.owners = {
                userValue: props.initialFilters.facetsFilters.owners.userValue,
                groupValue:
                    props.initialFilters.facetsFilters.owners.groupValue,
            }
            dataMap.value.advanced = {
                list: props.initialFilters.facetsFilters.advanced.list,
            }

            const refresh = () => {
                filters = []
                Object.keys(filterMap).forEach((key) => {
                    filters.push(filterMap[key])
                })
                emit('refresh', filters, filterMap)
            }

            const handleChange = (value: any) => {
                filterMap[value.id] = value.payload
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                console.log(dirtyTimestamp.value)
                refresh()
                // updateChangesInStore(value);
            }

            const isFilter = (id) => {
                console.log(id)
                console.log(filterMap[id])
                if (filterMap[id]) {
                    if (filterMap[id]?.criterion?.length > 0) {
                        return true
                    }
                }
                return false
            }

            const handleClear = (id) => {
                console.log(refMap.value[id])
                if (refMap.value[id]) {
                    refMap.value[id].clear()
                }
            }
            return {
                activeKey,
                dataMap,
                handleChange,
                isFilter,
                dirtyTimestamp,
                filterMap,
                handleClear,
                refMap,
            }
        },
        data() {
            return {
                List,
                searchParam: {
                    entityFilters: {},
                } as Components.Schemas.SearchParameters,
                filterMap: {} as { [key: string]: any },
                filters: {} as Components.Schemas.FilterCriteria,
            }
        },
        mounted() {},
        methods: {
            handleChanged(value: any) {
                //   console.log("handle Change filters", value);
                // this.filters.condition = "AND";
                // const found = List.find((item) => item.id == value.id);
                // if (found) {
                //   let criteria = <Components.Schemas.FilterCriteria>{
                //     condition: found.overallCondition.toUpperCase(),
                //     criterion: [],
                //   };
                //   found.filters.forEach((element) => {
                //     let groupCriteria = <Components.Schemas.FilterCriteria>{
                //       condition: element.condition,
                //       criterion: [],
                //     };
                //     console.log(value);
                //     if (value.payload[element.attributeName]) {
                //       if (value.payload[element.attributeName].length > 0) {
                //         value.payload[element.attributeName].forEach((e: any) => {
                //           let valCriteria = <Components.Schemas.FilterCriteria>{};
                //           valCriteria.attributeName = element.attributeName;
                //           console.log(e);
                //           // special condition for null support
                //           if (e === "is_null") {
                //             valCriteria.operator = "isNull";
                //           } else {
                //             valCriteria.attributeValue = e;
                //             valCriteria.operator = element.operator;
                //           }
                //           if (element.isMultiple) {
                //             groupCriteria.criterion.push(valCriteria);
                //           } else {
                //             criteria.criterion.push(valCriteria);
                //           }
                //         });
                //         if (element.isMultiple) {
                //           criteria.criterion.push(groupCriteria);
                //         }
                //       }
                //     }
                //   });
                //   console.log(criteria);
                //   this.filterMap[found.id] = criteria;
                // }
                // console.log(this.filterMap);
                // this.searchParam.entityFilters.condition = "AND";
                // this.searchParam.entityFilters.criterion = [];
                // Object.keys(this.filterMap).forEach((key) => {
                //   this.searchParam.entityFilters.criterion.push(this.filterMap[key]);
                // });
                // this.$emit("change", this.searchParam);
            },
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            @apply px-4;
            @apply py-3;
            @apply border-b;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            padding-bottom: 0px;
        }
    }
</style>
