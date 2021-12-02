<template>
    <a-select
        placeholder="Select a connection"
        :v-model:value="selectedValue"
        :allowClear="true"
        :showSearch="true"
        @search="handleSearch"
        @change="handleChange"
        :get-popup-container="(target) => target.parentNode"
        notFoundContent="No connection found"
    >
        <a-select-option
            :value="item.attributes?.qualifiedName"
            v-for="item in filteredList"
            :key="item.guid"
        >
            <div class="flex flex-col">
                {{ item?.attributes.displayName || item.attributes.name }}
                <span class="text-xs text-gray-500" v-if="showCount"
                    >{{ item.assetCount }} assets</span
                >
            </div>
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, ref, toRefs, computed } from 'vue'

    import useConnectionData from '~/composables/connection/useConnectionData'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            showCount: {
                type: Boolean,
                required: false,
                default() {
                    return true
                },
            },
            connector: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { connector, showCount } = toRefs(props)

            const { modelValue } = useVModels(props, emit)

            const { list } = useConnectionData()

            const queryText = ref('')

            const selectedValue = ref(modelValue.value)
            const handleChange = (value) => {
                modelValue.value = value
                emit('change')
            }

            const handleSearch = (val) => {
                queryText.value = val
            }

            const filteredList = computed(() => {
                return list
                    .filter((i) => {
                        let isConnector = true
                        if (connector?.value !== '') {
                            isConnector =
                                i.attributes?.connectorName?.toLowerCase() ===
                                connector.value.toLowerCase()
                        }
                        if (queryText?.value !== '') {
                            return (
                                isConnector &&
                                (i.attributes?.name
                                    ?.toLowerCase()
                                    .includes(queryText.value.toLowerCase()) ||
                                    i.attributes?.displayName
                                        ?.toLowerCase()
                                        .includes(
                                            queryText.value.toLowerCase()
                                        ))
                            )
                        }
                        return isConnector
                    })
                    .sort((a, b) => {
                        if (a.assetCount > b.assetCount) return -1
                        if (a.assetCount < b.assetCount) return 1
                        return 0
                    })
            })

            return {
                list,
                filteredList,
                selectedValue,
                handleChange,
                handleSearch,
                showCount,
            }
        },
    })
</script>

<style lang="less" scoped></style>
