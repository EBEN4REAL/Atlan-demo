<template>
    <div class="flex items-center w-full">
        <div class="mr-1">
            <a-tooltip :title="typeName" placement="top">
                <AtlanIcon
                    class="w-4 h-4"
                    :icon="typeName + `Gray`"
                    :class="disabled ? 'text-gray-500' : 'text-gray-700'"
            /></a-tooltip>
        </div>
        <div style="width: calc(100% - 22px)">
            <a-select
                :placeholder="placeholder"
                :value="modelValue"
                :allowClear="true"
                :showSearch="true"
                notFoundContent="No data available"
                class="w-full"
                :dropdownMatchSelectWidth="true"
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

                            <span class="parent-ellipsis-container-base"
                                >{{ item?.label }}
                            </span>
                        </div></a-select-option
                    >
                </template>

                <template #suffixIcon>
                    <AtlanIcon icon="CaretDown" class="mb-0" />
                </template>
            </a-select>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, toRefs, computed } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
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
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { disabled, filters, typeName, modelValue } = toRefs(props)
            const initialBody = {
                dsl: filters.value,
                attributes: ['name', 'displayName'],
            }

            const immediate = computed(() => {
                return !!modelValue.value
            })

            const { list, replaceBody, data, isLoading, error } =
                useAssetListing(initialBody, immediate)
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
                filters,
                () => {
                    console.log('fetch', modelValue.value)
                    console.log('fetch', !disabled.value)
                    if (!modelValue.value && !disabled.value) {
                        console.log('fetch', typeName.value)
                        // console.log('model', modelValue)
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
            const dropdownOption = computed(() => {
                // const tree: Record<string, any>[] = []
                // list.value.forEach((ls) => {
                //     let treeNodeObj = {
                //         label:
                //             ls.attributes?.displayName || ls.attributes?.name,
                //         value: ls.attributes.qualifiedName,
                //         slots: {
                //             title: 'title',
                //         },
                //         children: [],
                //     }
                //     tree.push(treeNodeObj)
                //     console.log('selector tree data: ', tree)
                // })
                // tree.sort((x, y) => {
                //     if (x.label < y.label) return -1
                //     if (x.label > y.label) return 1
                //     return 0
                // })
                // return tree
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))
                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                // console.log('data here: ', data)
                return data
            })

            return {
                typeName,
                list,
                handleChange,
                totalCount,
                data,
                isLoading,
                modelValue,
                dropdownOption,
                immediate,
            }
        },
    })
</script>
