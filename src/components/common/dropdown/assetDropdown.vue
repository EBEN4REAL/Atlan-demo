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
                    @change="handleChange(item.level)"
                    :placeholder="`Select ${item.name}`"
                ></AssetSelector>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, ComputedRef, Ref } from 'vue'
    import AssetSelector from '~/components/common/dropdown/assetSelector.vue'
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
        emits: ['labelChange', 'change'],
        setup(props, { emit }) {
            const asset: Ref<Record<string, any>> = ref({})

            const list: ComputedRef<any[]> = computed(
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
                            attributeName: 'integrationName',
                            attributeValue: props.data?.connector,
                            operator: 'eq',
                        },
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

            // This function returns a string which can used in the main searchbar's placeholder
            function setSelectorValue() {
                // Iterate from the last to see the most granular filter value and display it
                for (let i = list.value.length - 1; i >= 0; i--) {
                    const lv = list.value[i]
                    if (asset.value?.[lv.attribute])
                        emit(
                            'labelChange',
                            asset.value?.[lv.attribute].split('/').pop()
                        )
                    return
                }
                emit('labelChange', '')
            }

            const handleChange = (level: number) => {
                let isFilterAttributeFound = false
                // Reset all values which are more than this level
                list.value.forEach((lv) => {
                    if (lv.level > level) {
                        asset.value[lv.attribute] = undefined
                    }
                })

                setSelectorValue()

                // Check the most granular filter and emit it
                for (let i = list.value.length - 1; i >= 0; i--) {
                    const currentListItem = list.value[i]
                    if (asset.value[currentListItem?.attribute]) {
                        emit('change', {
                            attributeName: currentListItem?.attribute,
                            attributeValue:
                                asset.value[currentListItem?.attribute],
                        })
                        isFilterAttributeFound = true
                        break
                    }
                }

                // Emit with empty attributes when the selectors are cleared
                if (!isFilterAttributeFound)
                    emit('change', { attributeName: '', attributeValue: '' })
            }

            return {
                list,
                asset,
                getFilter,
                handleChange,
                isDisabled,
                getKey,
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
