<template>
    <div class="w-full">
        <a-tabs
            v-model:activeKey="assetType"
            class="w-full"
            :class="$style.assetbar"
            @change="handleChange"
        >
            <a-tab-pane
                v-for="item in sortedAssetTypeList"
                :key="item.id"
                :disabled="item.id !== 'Catalog' && !assetTypeMap[item.id]"
            >
                <template #tab>
                    <div :class="{ active: item.id === assetType }">
                        <span>{{ item.label }}</span>
                        <span v-if="item.id === 'Catalog'" class="chip">{{
                            getCountString(total)
                        }}</span>
                        <span
                            v-if="
                                assetTypeMap[item.id] &&
                                assetTypeMap[item.id] > 0
                            "
                            class="chip"
                            >{{ getCountString(assetTypeMap[item.id]) }}</span
                        >
                    </div>
                </template>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        nextTick,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { getCountString } from '~/composables/asset/useFormat'

    export default defineComponent({
        name: 'AssetTypeTabs',
        props: {
            assetTypeList: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            assetTypeMap: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            total: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            modelValue: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            connectors: {
                type: Array,
                required: false,
                default() {
                    return ['snowflake']
                },
            },
        },
        emits: ['refresh', 'update:modelValue'],
        setup(props, { emit }) {
            const { assetTypeMap } = toRefs(props)
            const assetType = ref<String>(props.modelValue)

            const handleChange = () => {
                emit('update:modelValue', assetType.value)
            }

            watch(
                () => props.assetTypeList,
                () => {
                    // check if the current assetType exists in assetTypeList
                    const found = props.assetTypeList.find(
                        (item) => item.id === assetType.value
                    )
                    if (!found) {
                        assetType.value = 'Catalog'
                    }
                },
                {
                    immediate: true,
                }
            )
            const sortedAssetTypeList = computed(() => {
                // remove catalog object so that the rest of list can be used for filtering
                const assetTypeListWithoutCatalog = props.assetTypeList.filter(
                    (type) => type.id !== 'Catalog'
                )
                // get catalog object - to reconstruct the sorted list- this would always be the first tab
                const catalogObject = props.assetTypeList.filter(
                    (type) => type.id === 'Catalog'
                )
                // filter out types with 0 results
                const typesWithNoResults = assetTypeListWithoutCatalog.filter(
                    (type) => !props.assetTypeMap[type.id]
                )
                // filter out types with results
                const typesWithResults = assetTypeListWithoutCatalog.filter(
                    (type) =>
                        props.assetTypeMap[type.id] &&
                        props.assetTypeMap[type.id] > 0
                )
                return [
                    ...catalogObject,
                    ...typesWithResults,
                    ...typesWithNoResults,
                ]
            })
            watch(assetTypeMap, () => {
                const prev = assetType.value
                assetType.value = ''
                nextTick(() => (assetType.value = prev))
            })

            // const filteredList = computed(() => {
            //   let foundConnections: ConnectionType[] = [];

            //   // get one example of connection for each connector
            //   props.connectors?.forEach((element) => {
            //     let found = cachedConnectionList.value.find((item) => {
            //       return item.attributes?.integrationName === element;
            //     });
            //     if (found) {
            //       foundConnections.push(found);
            //     }
            //   });

            //   //filter on discoverable and mappings and order asset types
            //   let filteredTypeList = AssetTypeList.filter((item) => {
            //     if (item.isDiscoverable) {
            //       let isAvailable = false;
            //       foundConnections.forEach((conn) => {
            //         //TODO - Change to dynamic mapping
            //         let found = testMapping.find((map) => {
            //           return map.id === item.id;
            //         });
            //         console.log(found);
            //         if (found) {
            //           isAvailable = true;
            //         }
            //       });
            //       return isAvailable;
            //     }
            //     return false;
            //   }).sort((x, y) => {
            //     return y.orderWeight - x.orderWeight;
            //   });

            //   console.log(props.assetTypeList);
            //   //Update Count from Aggregations
            //   filteredTypeList.forEach((f) => {
            //     if (props.assetTypeList[f.id]) {
            //       f.count = props.assetTypeList[f.id];
            //     } else if (props.assetTypeList[f.id.toLowerCase()]) {
            //       f.count = props.assetTypeList[f.id.toLowerCase()];
            //     }
            //   });

            //   return filteredTypeList;
            // });

            // let foundConnections = [];
            // props.connectors?.forEach((element) => {
            //   let found = cachedConnectionList.value.find((item) => {
            //     return item.attributes?.integrationName === element;
            //   });
            //   if (found) {
            //     foundConnections.push(found);
            //   }
            // });

            // if (props.defaultAssetType) {
            //   assetType.value = props.defaultAssetType;
            // }
            return {
                assetType,
                handleChange,
                getCountString,
                sortedAssetTypeList,
            }
        },
    })
</script>

<style lang="less" module>
    .assetbar {
        :global(.ant-tabs-bar) {
            @apply mb-0 border-0 !important;
        }
        :global(.ant-tabs-tab) {
            @apply bg-white text-sm mr-1 !important;
            border: 1px solid #e6e6eb;
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05) !important;

            transition: all 0.8s ease-out;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-3 !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;
        }

        :global(.ant-tabs-ink-bar) {
            @apply hidden !important;
        }

        :global(.ant-tabs-nav-wrap) {
            margin-top: 4px !important;
            min-height: 30px !important;
        }
    }
</style>

<style scoped>
    .chip {
        @apply px-1 pt-0.5 pb-0.5 mx-1;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply font-bold;
        @apply text-gray-400;
    }
    .active {
        @apply text-primary;
    }
    .active .chip {
        @apply text-primary;
        @apply bg-primary-light;
    }
</style>
