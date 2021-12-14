<template>
    <!-- <a-select
        :value="modelValue"
        style="width: 100%; border-radius: 8px"
        :class="$style.connector"
        @change="handleChange"
        :placeholder="placeholder"
        :disabled="disabled"
        :options="dropdownOption"
        :loading="isLoading"
        show-search
        filter-option
        allow-clear
    >
        <template #option="item">
            <div class="flex">
                <AtlanIcon :icon="typeName" class="h-4 mt-0.5 ml-1 mr-1" />
                <p>{{ item.label }}</p>
            </div>
        </template>

        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />

            <a-divider style="margin: 4px 0" />
            <div class="px-3">
                {{ list.length }} of {{ totalCount }} &nbsp;{{ typeName }}
            </div>
        </template>
        <template #suffixIcon>
            <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
        </template>
    </a-select>
    <div></div> -->

    <a-select
        :placeholder="placeholder"
        :value="modelValue"
        :allowClear="true"
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
            const { disabled, filters, typeName } = toRefs(props)
            const initialBody = {
                dsl: filters.value,
                attributes: ['name', 'displayName'],
            }
            const { list, replaceBody, data, isLoading, error } =
                useAssetListing('', false)
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
                dropdownOption,
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
