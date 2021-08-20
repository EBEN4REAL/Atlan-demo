<template>
    <div class="">
        <div class="">
            <div class="flex gap-x-2">
                <a-popover placement="bottomLeft" trigger="click">
                    <template #content>
                        <div class="flex flex-col pb-1 gap-y-3">
                            <template
                                v-for="(item, index) in list"
                                :key="item.typeName"
                            >
                                <div>
                                    <p class="mb-0 text-gray-500">
                                        {{ item.name }}
                                    </p>
                                    <AssetSelector
                                        :key="getKey(index)"
                                        v-model:value="asset[item.attribute]"
                                        :type-name="item.typeName"
                                        :filters="getFilter(index)"
                                        :disabled="isDisabled(index)"
                                        style="width: 200px"
                                        @change="handleChange"
                                    ></AssetSelector>
                                </div>
                            </template>
                        </div>
                    </template>
                    <div class="flex pr-3 cursor-pointer">
                        <p v-if="list?.length > 0" class="connector-btn">
                            <component
                                :is="list[0].typeName"
                                class="w-auto h-3 mr-1"
                            ></component
                            >All {{ list[0].name }}s
                            {{ selectorValues }}
                            <AtlanIcon icon="ChevronDown" class="ml-2" />
                        </p>
                    </div>
                </a-popover>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import AssetSelector from '@common/selector/asset/index.vue'
    import { useConnectionsStore } from '~/store/connections'

    export default defineComponent({
        name: 'AssetDropdown',
        components: { AssetSelector },
        props: {
            connector: {
                type: Object,
                required: false,
            },
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const asset: { [key: string]: any } = ref({})

            const assetDirty: { [key: string]: any } = ref({})

            const list = computed(
                () =>
                    props.connector?.hierarchy.filter(
                        (item) => item.level < 3
                    ) || []
            )

            const isDisabled = (index) => {
                if (index == 0 && props.data?.connection) {
                    return false
                }
                if (index > 0) {
                    const item = list.value[index - 1]
                    if (asset.value[item.attribute]) {
                        return false
                    }
                }
                return true
            }

            const getFilter = (index) => {
                const baseFilter = {
                    condition: 'AND',
                    criterion: [
                        {
                            attributeName: 'connectionQualifiedName',
                            attributeValue: props.data?.connection,
                            operator: 'eq',
                        },
                    ],
                }

                if (index > 0) {
                    const item = list.value[index - 1]
                    if (asset.value[item.attribute]) {
                        baseFilter.criterion.push({
                            attributeName: item.attribute,
                            attributeValue: asset.value[item.attribute],
                            operator: 'eq',
                        })
                    }
                }
                return baseFilter
                // if (index > 0) {
                //   const item = list.value[index - 1];
                //   if (item) {
                //     return {
                //       condition: "AND",
                //       criterion: [
                //         {
                //           attributeName: "connectionQualifiedName",
                //           attributeValue: props.data?.connection,
                //           operator: "eq",
                //         },
                //       ],
                //     };
                //   }
                // }
            }

            const getKey = (index) => {
                if (index > 0) {
                    const item = list.value[index - 1]
                    return `${item.typeName}_${asset.value[item.attribute]}`
                }
                return 'default'
            }

            const dirtyTimestamp = ref('')
            const handleChange = () => {
                console.log(asset)
                // assetDirty[index] = Date.now().toString();
                // dirtyTimestamp.value = Date.now().toString();
            }

            // const selectorValues = computed(() =>
            //     list.value.map((lv) => {
            //         debugger
            //         return asset?.[lv.attribute]
            //     })
            // )

            return {
                list,
                asset,
                getFilter,
                handleChange,
                dirtyTimestamp,
                isDisabled,
                getKey,
                assetDirty,
                // selectorValues,
            }
        },
    })
</script>

<style scoped>
    .connector-btn {
        @apply flex items-center h-8 px-2 mb-0;
        @apply text-xs tracking-wide text-gray;
        @apply rounded cursor-pointer;
    }
    .connector-btn:hover {
        @apply bg-gray-100;
    }
</style>
