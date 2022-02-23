<template>
    <div class="flex items-center w-full my-2">
        <div class="mr-1">
            <a-tooltip v-if="!isLoading" title="Connection" placement="right">
                <AtlanIcon class="w-4 h-4" icon="Connection"
            /></a-tooltip>
            <a-spin v-else size="small" class="w-4 h-4"></a-spin>
        </div>

        <a-select
            v-model:value="selectedValue"
            placeholder="Select a connection"
            :allow-clear="true"
            :show-search="true"
            class="w-full"
            :filter-option="false"
            :get-popup-container="(target) => target.parentNode"
            not-found-content="No connection found"
            @search="handleSearch"
            @change="handleChange"
        >
            <template #suffixIcon>
                <AtlanIcon icon="CaretDown" class="mb-0" />
            </template>
            <template #notFoundContent>
                <span v-if="isLoading">
                    <a-spin size="small" class="mr-1" />searching connections
                </span>
                <AtlanIcon v-if="error" icon="Error"></AtlanIcon>
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
                            /><span class="truncate">{{
                                item.attributes.name
                            }}</span>
                        </div>
                        <span v-if="showCount" class="text-xs text-gray-500"
                            >{{ item.assetCount }} assets</span
                        >
                    </div>
                </a-select-option>
            </template>
        </a-select>
    </div>
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

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import whoami from '~/composables/user/whoami'
    import { usePersonaStore } from '~/store/persona'
    import { useConnectionByConnectorName } from '~/composables/connection/useConnection'

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

            const { list, isLoading, error, mutate } =
                useConnectionByConnectorName(connector.value)

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
                list.value
                    ?.filter((item) => {
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
            watch(connector, () => {
                if (connector.value && connector.value !== '') {
                    mutate()
                }
            })

            onMounted(() => {
                if (connector.value) {
                    if (!selectedValue.value) {
                        if (filteredList.value.length === 1) {
                            selectedValue.value =
                                filteredList.value[0].attributes.qualifiedName
                            handleChange(selectedValue.value)
                        }
                    }
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
                isLoading,
                error,
            }
        },
    })
</script>

<style lang="less" scoped></style>
