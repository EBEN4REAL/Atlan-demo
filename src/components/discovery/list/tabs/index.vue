<template>
    <div class="w-full">
        <a-tabs
            v-model:activeKey="assetType"
            class="w-full mt-3"
            :class="$style.assetbar"
            @change="handleChange"
        >
            <a-tab-pane v-for="item in assetTypeList" :key="item.id">
                <template #tab>
                    <div :class="{ active: item.id === assetType }">
                        <span>{{ item.label }}</span>
                        <span
                            class="chip"
                            v-if="item.id === 'Catalog' && total > 0"
                            >{{ getCountString(total) }}</span
                        >
                        <span
                            class="chip"
                            v-if="
                                assetTypeMap[item.id] &&
                                assetTypeMap[item.id] > 0
                            "
                            >{{ getCountString(assetTypeMap[item.id]) }}</span
                        >
                    </div>
                </template>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { defineComponent, nextTick, ref, toRefs, watch } from 'vue'
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
            }
        },
    })
</script>

<style lang="less" module>
    .assetbar {
        :global(.ant-tabs-tab) {
            padding-left: 2px !important;
            padding-right: 2px !important;
            @apply pb-5 !important;
            @apply mr-4 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-5 !important;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray !important;
            @apply font-bold !important;
            @apply tracking-normal;
        }
        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
        }
        :global(.ant-tabs-content) {
            padding-right: 0px;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
</style>

<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mx-1;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply font-bold;
        @apply text-gray-500;
        @apply bg-gray-100;
    }
    .active {
        @apply text-primary;
    }
    .active .chip {
        @apply text-primary;
        @apply bg-primary-light;
    }
</style>
