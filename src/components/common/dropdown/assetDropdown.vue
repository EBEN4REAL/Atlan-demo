<template>
    <div class="flex flex-col w-full pb-1 mt-4 gap-y-4">
        <template v-for="(item, index) in list" :key="item.typeName">
            <div>
                <AssetSelector
                    :key="getKey(index)"
                    v-model:value="asset[item.attribute]"
                    :type-name="item.typeName"
                    :filters="getFilter(index)"
                    :disabled="isDisabled(index)"
                    @change="handleChange($event, item.level)"
                    :placeholder="`Select ${item.name}`"
                ></AssetSelector>
            </div>
        </template>
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
        emits: ['labelChange'],
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
            const selectorValue = ref(`All ${list.value[0]?.name}s`)
            const handleChange = (value: any, level: number) => {
                // Reset all values which are more than this level
                list.value.forEach((lv) => {
                    if (lv.level > level) {
                        asset.value[lv.attribute] = undefined
                    }
                })
                setSelectorValue()
                // assetDirty[index] = Date.now().toString();
                // dirtyTimestamp.value = Date.now().toString();
            }

            function setSelectorValue() {
                // Iterate from the last to see the most granular filter value and display it
                for (let i = list.value.length - 1; i >= 0; i--) {
                    const lv = list.value[i]
                    if (asset.value?.[lv.attribute]) {
                        selectorValue.value = asset.value?.[lv.attribute]
                            .split('/')
                            .pop()
                        emit('labelChange', selectorValue.value)
                        return
                    }
                }

                selectorValue.value = `All ${list.value[0]?.name}s`
                emit('labelChange', '')
            }

            return {
                list,
                asset,
                getFilter,
                handleChange,
                dirtyTimestamp,
                isDisabled,
                getKey,
                assetDirty,
                selectorValue,
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
