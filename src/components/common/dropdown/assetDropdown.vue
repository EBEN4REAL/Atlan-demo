<template>
    <div class="flex flex-col w-full pb-1 mt-2 gap-y-2">
        <template v-for="(item, index) in list" :key="item.typeName">
            <div>
                <AssetSelector
                    :key="getKey(index)"
                    :modelValue="asset[item.attribute]"
                    :type-name="item.typeName"
                    :filters="getFilter(index)"
                    :disabled="isDisabled(index)"
                    @change="handleChange(item.attribute, $event, item.level)"
                    :placeholder="`Select ${item.name}`"
                    :data-test-id="item.name?.toLowerCase()"
                    :bgGrayForSelector="bgGrayForSelector"
                ></AssetSelector>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        ComputedRef,
        Ref,
        toRefs,
        PropType,
    } from 'vue'
    import { Components } from '~/types/atlas/client'
    import AssetSelector from '~/components/common/dropdown/assetSelector.vue'
    import bodybuilder from 'bodybuilder'

    export default defineComponent({
        name: 'AssetDropdown',
        components: { AssetSelector },
        props: {
            connector: {
                type: Object as PropType<{
                    id: string
                    label: string
                    image: string
                    types: string[]
                    hierarchy: Record<string, any>[]
                    filterMaxLevel: number
                }>,
                required: false,
            },
            filter: {
                type: Object as PropType<Components.Schemas.FilterCriteria>,
                required: false,
                default: () => '',
            },
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
        },
        emits: ['labelChange', 'change'],
        setup(props, { emit }) {
            const { connector, filter } = toRefs(props)
            console.log('connection filters: ', filter.value)
            console.log('connector preview: ', connector.value)

            const list: ComputedRef<any[]> = computed(
                () =>
                    connector.value?.hierarchy.filter(
                        (item) => item.level < 3
                    ) || []
            )

            const asset: ComputedRef<Record<string, any>> = computed(() => {
                const chunks = filter.value.attributeValue?.split('/') || []
                const blankAsset = {}
                if (chunks?.length > 3) {
                    // Splicing first 3 as they contain tenant/integration/connection
                    for (
                        let idx = 0;
                        idx < list.value.length && idx < chunks?.length - 3;
                        idx++
                    ) {
                        let attrName = list.value[idx].attribute
                        blankAsset[attrName] = chunks
                            .slice(0, idx + 4)
                            .join('/')
                    }
                }
                return blankAsset
            })

            const hasConnection = computed(
                () => (filter.value.attributeValue?.split('/')?.length || 0) > 2
            )

            const isDisabled = (index: number) => {
                if (index == 0 && hasConnection.value) {
                    return false
                } else if (index > 0) {
                    const item = list.value[index - 1]
                    return !asset.value?.[item.attribute]
                }
            }

            const getFilter = (index) => {
                if (index > 0) {
                    const item = list.value[index - 1]
                    const typeName = list.value[index].typeName
                    if (asset.value[item.attribute]) {
                        return bodybuilder()
                            .filter(
                                'term',
                                `${item.attribute}`,
                                asset.value[item.attribute]
                            )
                            .filter('term', '__state', 'ACTIVE')
                            .filter('term', '__typeName.keyword', typeName)
                            .size(100)
                            .build()
                    }
                }
                // For the first filter we need the connection name
                else {
                    let connectionName = filter.value?.attributeValue
                        ?.split('/')
                        .slice(0, 3)
                        ?.join('/')

                    return bodybuilder()
                        .filter('term', '__state', 'ACTIVE')
                        .filter(
                            'term',
                            'connectionQualifiedName',
                            connectionName
                        )
                        .filter(
                            'term',
                            '__typeName.keyword',
                            list.value[index].typeName
                        )
                        .size(100)
                        .build()
                }
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

            const handleChange = (
                key: string,
                value: string | undefined,
                level: number
            ) => {
                let isFilterAttributeFound = false
                const tempAsset = { ...asset.value }
                tempAsset[key] = value
                // Reset all values which are more than this level
                list.value.forEach((lv) => {
                    if (lv.level > level) {
                        tempAsset[lv.attribute] = undefined
                    }
                })
                // Check the most granular filter and emit it
                for (let i = list.value.length - 1; i >= 0; i--) {
                    const currentListItem = list.value[i]
                    if (tempAsset[currentListItem?.attribute]) {
                        emit('change', {
                            attributeName: currentListItem?.attribute,
                            attributeValue:
                                tempAsset[currentListItem?.attribute],
                        })
                        isFilterAttributeFound = true
                        break
                    }
                }

                // Emit with empty attributes when the selectors are cleared
                if (!isFilterAttributeFound)
                    emit('change', { attributeName: '', attributeValue: '' })

                setSelectorValue()
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
