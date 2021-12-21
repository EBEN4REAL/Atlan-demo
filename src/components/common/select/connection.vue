<template>
    <a-select
        placeholder="Select a connection"
        v-model:value="selectedValue"
        :allowClear="true"
        :showSearch="true"
        :filterOption="false"
        @search="handleSearch"
        @change="handleChange"
        :get-popup-container="(target) => target.parentNode"
        notFoundContent="No connection found"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-1" />
        </template>
        <template
            v-for="item in filteredList"
            :key="item.attributes?.qualifiedName"
        >
            <a-select-option :value="item.attributes?.qualifiedName">
                <div class="flex flex-col">
                    <div class="flex items-center">
                        <img
                            :src="getConnectorImage(item)"
                            class="h-3 mr-1 mb-0.5"
                        />{{ item.attributes.name }}
                    </div>
                    <span class="text-xs text-gray-500" v-if="showCount"
                        >{{ item.assetCount }} assets</span
                    >
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, ref, toRefs, computed } from 'vue'

    import useConnectionData from '~/composables/connection/useConnectionData'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

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
            const selectedValue = ref(modelValue.value)

            const { list } = useConnectionData()
            const queryText = ref('')

            const { getConnectorImage } = useAssetInfo()

            const filteredList = computed(() =>
                list
                    .filter((item) => {
                        if (queryText.value && connector.value) {
                            return (
                                item.attributes?.connectorName?.toLowerCase() ===
                                    connector.value.toLowerCase() &&
                                item.attributes.name
                                    .toLowerCase()
                                    .includes(queryText.value.toLowerCase())
                            )
                        }
                        if (connector.value) {
                            return (
                                item.attributes?.connectorName?.toLowerCase() ===
                                connector.value.toLowerCase()
                            )
                        }
                        if (queryText.value) {
                            return item.attributes.name
                                .toLowerCase()
                                .includes(queryText.value.toLowerCase())
                        }
                        return true
                    })
                    .sort((a, b) => {
                        if (a.assetCount > b.assetCount) return -1
                        if (a.assetCount < b.assetCount) return 1
                        return 0
                    })
            )

            // console.log(filteredList.value)

            const handleChange = (value) => {
                modelValue.value = value
                emit('change')
            }

            const handleSearch = (val) => {
                queryText.value = val
            }

            return {
                list,
                filteredList,
                selectedValue,
                handleChange,
                handleSearch,
                showCount,
                getConnectorImage,
            }
        },
    })
</script>

<style lang="less" scoped></style>
