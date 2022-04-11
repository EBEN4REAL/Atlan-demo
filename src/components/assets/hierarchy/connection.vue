<template>
    <a-select
        v-model:value="selectedValue"
        placeholder="Select a connection"
        :allow-clear="true"
        :show-search="true"
        :filter-option="false"
        :get-popup-container="(target) => target.parentNode"
        not-found-content="No connection found"
        class="w-full connection-select"
        @search="handleSearch"
        @change="handleChange"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-0" />
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
                            class="h-4 mr-1 mb-0.5"
                            style="min-width: 1rem"
                        />
                        <Tooltip
                            :tooltip-text="item.attributes.name"
                            placement="topLeft"
                        />
                    </div>
                    <span v-if="showCount" class="text-xs text-gray-500"
                        >{{ item.assetCount }} assets</span
                    >
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        onMounted,
        watch,
    } from 'vue'

    import Tooltip from '@common/ellipsis/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import whoami from '~/composables/user/whoami'
    import { usePersonaStore } from '~/store/persona'
    import { useConnection } from '~/composables/connection/useConnection'
    import useConnectionData from '~/composables/connection/useConnectionData'

    export default defineComponent({
        components: { Tooltip },
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
            persona: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            isAdmin: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { connector, showCount, persona, isAdmin } = toRefs(props)

            const personaStore = usePersonaStore()

            const { modelValue } = useVModels(props, emit)
            const selectedValue = ref(modelValue.value)

            const { list } = useConnectionData()

            const queryText = ref('')

            const { getConnectorImage, createdBy, adminGroups, adminUsers } =
                useAssetInfo()

            const { username, groups } = whoami()

            const applicableConnectionArray = computed(() => {
                const found = personaStore.list.find(
                    (item) => item.id === persona.value
                )
                return found?.metadataPolicies.map((i) => i.connectionId) || []
            })

            const isAdminConnection = (item) => {
                if (
                    createdBy(item) === username.value ||
                    adminUsers(item).includes(username) ||
                    adminGroups(item).some((group) =>
                        groups.value.includes(group)
                    )
                ) {
                    return true
                }
                return false
            }

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
                            /*   useConnectionByConnectorName(connector.value) */
                            return (
                                item.attributes?.connectorName?.toLowerCase() ===
                                connector.value.toLowerCase()
                            )
                        }
                        if (queryText.value) {
                            return item?.attributes?.name
                                ?.toLowerCase()
                                .includes(queryText.value.toLowerCase())
                        }
                        return true
                    })
                    .filter((item) => {
                        if (isAdmin.value) {
                            if (isAdminConnection(item)) {
                                return true
                            }
                            return false
                        }
                        if (persona.value) {
                            return applicableConnectionArray.value.includes(
                                item.guid
                            )
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

            onMounted(() => {
                if (connector.value && connector.value !== '') {
                    if (!selectedValue.value) {
                        if (filteredList.value.length === 1) {
                            selectedValue.value =
                                filteredList.value[0].attributes.qualifiedName
                            handleChange(selectedValue.value)
                        }
                    }
                } else if (connector.value === '') {
                    useConnection()
                }
            })

            return {
                list,
                filteredList,
                selectedValue,
                handleChange,
                handleSearch,
                getConnectorImage,
                applicableConnectionArray,
                createdBy,
                adminGroups,
                adminUsers,
                isAdminConnection,
            }
        },
    })
</script>

<style lang="less">
    .connection-select {
        .ant-select-selector {
            @apply border-0 rounded-lg !important;
            border-top-width: 0px !important;
            border-right-width: 0px !important;
            border-bottom-width: 1px !important;
            border-left-width: 0px !important;
            border-color: rgba(
                243,
                243,
                243,
                var(--tw-border-opacity)
            ) !important;
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
        }
    }
</style>
