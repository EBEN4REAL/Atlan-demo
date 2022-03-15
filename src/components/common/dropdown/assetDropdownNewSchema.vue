<template>
    <div class="flex flex-col w-full pb-1 mt-1 gap-y-2">
        <template v-if="list.length > 0">
            <div>
                <AssetSelectorNew
                    :SchemaPopoverVisible="SchemaPopoverVisible"
                    :_firsCalled="_firsCalled"
                    :key="getKey(1)"
                    :modelValue="asset[list[1].attribute]"
                    :type-name="list[1].typeName"
                    :disabled="isDisabled(1)"
                    @change="
                        handleChange(list[1].attribute, $event, list[1].level)
                    "
                    @firstSelectByDefaultChange="firstSelectByDefaultChange"
                    :searchPlaceholder="`${list[1].name}`"
                    :data-test-id="list[1].name?.toLowerCase()"
                    :bgGrayForSelector="bgGrayForSelector"
                    :selectFirstByDefault="selectFirstByDefault"
                    :index="1"
                    :listFromAssetDropdown="list"
                    :filterFromAssetDropdown="filter"
                    :assetFromAssetDropdown="asset"
                ></AssetSelectorNew>
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
        watch,
    } from 'vue'
    import { Components } from '~/types/atlas/client'
    import AssetSelectorNew from '~/components/common/dropdown/assetSelectorNew.vue'
    import bodybuilder from 'bodybuilder'
    import { isSelectFirstDefault } from '~/components/insights/common/composables/getDialectInfo'

    export default defineComponent({
        name: 'AssetDropdownNewSchema',
        components: { AssetSelectorNew },
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
            clearStateSchema: {
                type: Boolean,
            },
            SchemaPopoverVisible: {
                type: Boolean,
            },
        },
        emits: ['labelChange', 'change'],
        setup(props, { emit }) {
            const {
                connector,
                filter,
                connection,
                clearStateSchema,
                SchemaPopoverVisible,
            } = toRefs(props)
            const _firsCalled = ref(false)
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
                // console.log('tempAssetFnValues: ', key, value, level)
                // console.log('tempAssetSchema: ', tempAsset)
                tempAsset[key] = value
                // console.log('tempAssetSchemaNew: ', tempAsset)

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

            const handleClear = () => {
                emit('update:clearStateSchema', false)
            }

            watch([clearStateSchema], () => {
                if (clearStateSchema.value === true) {
                    handleChange('schemaQualifiedName', undefined, 2)
                    handleClear()
                }
            })

            const firstSelectByDefaultChange = (
                key: string,
                value: string | undefined,
                level: number
            ) => {
                if (!_firsCalled.value) {
                    handleChange(key, value, level)
                    _firsCalled.value = true
                }
            }
            watch(connector, () => {
                _firsCalled.value = false
            })
            watch(connection, () => {
                if (isSelectFirstDefault(connector.value.id)) {
                    _firsCalled.value = false
                }
            })

            return {
                _firsCalled,
                list,
                asset,
                handleChange,
                isDisabled,
                getKey,
                handleClear,
                firstSelectByDefaultChange,
                filter,
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
