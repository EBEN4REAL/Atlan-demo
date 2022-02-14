<template>
    <a-select
        :placeholder="placeholder"
        :value="modelValue"
        :allowClear="!isSelectFirstDefault(connector.id)"
        :showSearch="true"
        notFoundContent="No data available"
        style="width: 100%; border-radius: 8px"
        :class="[
            $style.connector,
            bgGrayForSelector ? `${$style.selector_bg}` : '',
        ]"
        @change="handleChange"
        :disabled="disabled"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        dropdownClassName="connectorDropdown"
        :loading="isLoading"
    >
        <template v-for="item in dropdownOption" :key="item.label">
            <a-select-option :value="item.value">
                <div class="flex items-center truncate">
                    <!-- <img :src="item.image" class="w-auto h-4 mr-1" /> -->
                    <AtlanIcon
                        :icon="typeName + `Gray`"
                        class="w-auto h-4 mr-2"
                    />
                    <span class="parent-ellipsis-container-base"
                        >{{ item?.label }}
                    </span>
                </div></a-select-option
            >
        </template>
        <template #suffixIcon>
            <AtlanIcon
                icon="ChevronDown"
                class="h-4 -mt-0.5 -ml-1"
                color="#6F7590"
            />
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, toRefs, computed, PropType } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { isSelectFirstDefault } from '~/components/insights/common/composables/getDialectInfo'

    import { message } from 'ant-design-vue'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
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
            modelValue: {
                type: String,
                required: false,
            },
            filters: {
                type: Object,
                required: false,
            },
            placeholder: {
                type: String,
                required: true,
            },
            typeName: {
                type: String,
                required: false,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            index: {
                type: Number,
                required: true,
            },
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
        },
        emits: ['update:modelValue', 'change', 'firstSelectByDefaultChange'],
        setup(props, { emit }) {
            const {
                disabled,
                filters,
                typeName,
                modelValue,
                connector,
                index,
            } = toRefs(props)
            const initialBody = {
                dsl: filters.value,
                attributes: ['name', 'displayName'],
            }
            const { list, replaceBody, data, isLoading, error } =
                useAssetListing({}, false)

            watch(error, () => {
                if (error.value) {
                    console.log(typeName.value)
                    message.error({
                        content: `Failed to fetch ${typeName.value}s!`,
                        duration: 3,
                    })
                }
            })
            const totalCount = computed(() => data.value?.approximateCount || 0)
            watch(
                [disabled, filters],
                () => {
                    if (!disabled.value) {
                        initialBody.dsl = filters.value

                        replaceBody(initialBody)
                    }
                },
                { immediate: true }
            )
            const handleChange = (checkedValues: string) => {
                console.log('checkedValue: ', checkedValues)
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            const checkifNeedsIsSelectFirstDefault = (
                data: any[],
                forceRefresh = false
            ) => {
                // debugger
                if (
                    isSelectFirstDefault(connector.value.id) &&
                    index.value == 0
                ) {
                    if (data?.length > 0) {
                        // debugger
                        // emit(
                        //     'firstSelectByDefaultChange',
                        //     'connectionQualifiedName',
                        //     filters.value.attributeValue,
                        //     0
                        // )
                        emit(
                            'firstSelectByDefaultChange',
                            'databaseQualifiedName',
                            data[0].value,
                            1,
                            forceRefresh
                        )
                    }
                }
            }

            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))

                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            watch(dropdownOption, () => {
                if (index.value == 0)
                    checkifNeedsIsSelectFirstDefault(
                        dropdownOption.value,
                        dropdownOption.value?.length > 0
                    )
            })

            return {
                index,
                typeName,
                list,
                handleChange,
                totalCount,
                data,
                isLoading,
                dropdownOption,
                connector,
                isSelectFirstDefault,
            }
        },
    })
</script>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
            background-color: #fbfbfb !important;
            border: 1px solid #e9ebf1 !important;
            color: #6f7590 !important;
            border-radius: 8px !important;

            input::placeholder {
                color: #6f7590 !important;
            }
        }
        :global(.ant-select-selection-search) {
            input::placeholder {
                color: #6f7590 !important;
            }
        }
    }
    // input::placeholder {
    //     color: #6f7590 !important;
    // }
</style>
<style lang="less" scoped>
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
