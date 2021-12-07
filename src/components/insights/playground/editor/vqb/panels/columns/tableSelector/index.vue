<template>
    <a-select
        :placeholder="`Select from ${dropdownOption?.length} ${typeName}s`"
        :value="modelValue"
        :allowClear="true"
        :showSearch="true"
        :class="$style.selector"
        notFoundContent="No data available"
        style="width: 100%; border-radius: 8px"
        @change="handleChange"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        dropdownClassName="connectorDropdown"
        @dropdownVisibleChange="dropdownVisibleChange"
        :loading="isLoading"
    >
        <template v-for="item in dropdownOption" :key="item.label">
            <a-select-option :value="item.value">
                <div class="flex items-center justify-between truncate">
                    <div class="flex items-center truncate">
                        <AtlanIcon
                            :icon="typeName + `Gray`"
                            class="w-auto h-4 mr-2"
                        />
                        <span class="parent-ellipsis-container-base"
                            >{{ item?.label }}
                        </span>
                    </div>
                    <div v-if="showAggregations" class="text-gray-500">
                        {{ item?.columnCount }}
                    </div>
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
    import {
        defineComponent,
        watch,
        toRefs,
        ref,
        computed,
        inject,
        ComputedRef,
    } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    import useBody from './useBody'

    export default defineComponent({
        name: 'Table Selector',
        components: {
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            modelValue: {
                type: String,
                required: false,
            },
            typeName: {
                type: String,
                required: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { typeName } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const getInitialBody = () => {
                return {
                    dsl: useBody({
                        schemaQualifiedName:
                            activeInlineTab.value.playground.editor.context
                                .attributeValue,
                    }),
                    attributes: ['name', 'displayName', 'columnCount'],
                }
            }
            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )
            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    replaceBody(getInitialBody())
                },
                {
                    immediate: true,
                }
            )

            const totalCount = computed(() => data.value?.approximateCount || 0)
            const handleChange = (checkedValues: string) => {
                console.log('checkedValue: ', checkedValues)
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }
            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    value: ls.attributes.qualifiedName,
                }))
                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            const showAggregations = ref(false)
            const dropdownVisibleChange = (open) => {
                if (open) {
                    showAggregations.value = true
                } else {
                    showAggregations.value = false
                }
            }
            return {
                showAggregations,
                dropdownVisibleChange,
                typeName,
                list,
                handleChange,
                totalCount,
                data,
                isLoading,
                dropdownOption,
            }
        },
    })
</script>
<style lang="less" module>
    .selector {
        :global(.ant-select-selector) {
            height: 100% !important;
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
