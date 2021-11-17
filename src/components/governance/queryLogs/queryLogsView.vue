<template>
    <div class="h-full">
        <div
            v-if="!totalAPIKeysCount && !isLoading"
            class="flex flex-col items-center justify-center h-full"
        >
            <component :is="NewAPIKeyIllustration" class="mb-4"></component>
            <div class="text-xl font-bold">Create API Keys</div>
            <AtlanBtn
                padding="compact"
                size="sm"
                color="primary"
                class="mt-6 px-7"
                @click="handleGenerateKey"
                v-auth="[map.CREATE_APIKEY]"
            >
                <AtlanIcon icon="Add" class="ml-2" />Generate API Key
            </AtlanBtn>
        </div>
        <DefaultLayout title="Query Logs" v-else>
            <template #header>
                <div class="flex items-center justify-between pb-3">
                    <div class="flex items-stretch w-full">
                        <div class="flex items-center">
                            <a-button
                                type="default"
                                class="px-2 border border-r-0 border-gray-300 rounded-tl rounded-tr-none rounded-bl rounded-br-none "
                            >
                                <AtlanIcon
                                    :icon="false ? 'FilterDot' : 'Filter'"
                                    class="w-4 h-4"
                                />
                            </a-button>
                        </div>
                        <a-input-search
                            v-model:value="searchText"
                            :placeholder="`Search through logs`"
                            class="w-1/3 mr-1 border border-gray-300 rounded-none rounded-tr rounded-br shadow-sm "
                            size="default"
                            :allow-clear="true"
                            @change="handleSearch"
                        ></a-input-search>
                    </div>
                    <div class="flex-grow w-0"></div>

                    <TimeFrameSelector
                        v-model:modelValue="timeFrame"
                        @change="handleRangePickerChange"
                        :timeFrame="timeFrame"
                    />
                </div>
            </template>

            <QueryLogTable
                :api-keys-list="[]"
                :is-loading="isLoading"
                :deleteAPIKeyLoading="deleteAPIKeyLoading"
                @selectAPIKey="handleSelectAPIKey"
                @deleteAPIKey="handleDelete"
            />
            <div class="flex justify-end max-w-full mt-4">
                <a-pagination
                    :total="pagination.total"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    @change="handlePagination"
                />
            </div>
        </DefaultLayout>
        <a-drawer
            :visible="isAPIKeyDrawerVisible"
            :mask="false"
            :width="350"
            class="api-key"
            :closable="false"
        >
            <APIKeyDrawer
                :api-key="selectedAPIKey"
                @updateAPIKey="handleUpdate"
                @createAPIKey="handleCreate"
                @deleteAPIKey="handleDelete"
                @closeDrawer="toggleAPIKeyDrawer"
                :createUpdateLoading="
                    createAPIKeyLoading || updateAPIKeyLoading
                "
                :deleteAPIKeyLoading="deleteAPIKeyLoading"
                v-model:generatedAPIKey="generatedAPIKey"
            />
        </a-drawer>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, watch, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import map from '~/constant/accessControl/map'
    import { APIKey } from '~/services/service/apikeys'
    import useAPIKeysList from '@/governance/apikeys/composables/useAPIKeysList'
    //TODO: Try to make update flow similar to create flow i.e use callback from the composable instead of watching the states
    // import useUpdateAPIKey from '@/governance/apikeys/composables/useUpdateAPIKey'
    import useCreateAPIKey from '@/governance/apikeys/composables/useCreateAPIKey'
    import DefaultLayout from '~/components/admin/layout.vue'
    import AtlanBtn from '@/UI/button.vue'
    import QueryLogTable from '@/governance/queryLogs/queryLogTable.vue'
    import APIKeyDrawer from '@/governance/apikeys/apiKeyDrawer.vue'
    import filteredPersonas from '~/components/governance/personas/personaView.vue'
    import NewAPIKeyIllustration from '~/assets/images/illustrations/new_apikey.svg'
    import TimeFrameSelector from '@/governance/queryLogs/timeFrameSelector.vue'
    import dayjs from 'dayjs'

    export default defineComponent({
        name: 'ApiKeysView',
        components: {
            DefaultLayout,
            AtlanBtn,
            QueryLogTable,
            TimeFrameSelector,
            APIKeyDrawer,
        },
        setup() {
            /**LOCAL STATE */
            const apiKeyDirty = ref({})
            const deleteAPIKeyLoading = ref(false)
            const updateAPIKeyLoading = ref(false)
            const searchText: Ref<string> = ref('')
            const isAPIKeyDrawerVisible: Ref<boolean> = ref(false)
            const timeFrame = ref('30 days')

            /**COMPOSABLES */
            const {
                apiKeysList,
                isLoading,
                searchAPIKeys,
                selectedAPIKey,
                setSelectedAPIKey,
                resetSelectedAPIKey,
                reFetchList,
                filteredAPIKeysCount,
                totalAPIKeysCount,
                paginateAPIKeys,
                params: listParams,
            } = useAPIKeysList()
            const {
                data: generatedAPIKey,
                createAPIKey,
                isLoading: createAPIKeyLoading,
            } = useCreateAPIKey(apiKeyDirty)
            //TODO: Try to make update flow similar to create flow i.e use callback from the composable instead of watching the states
            // const { updateAPIKey, isLoading: updateAPIKeyLoading } =
            //     useUpdateAPIKey(apiKeyDirty)

            /**METHODS */
            const toggleAPIKeyDrawer = (
                val: boolean | undefined = undefined
            ) => {
                if (val === undefined)
                    isAPIKeyDrawerVisible.value = !isAPIKeyDrawerVisible.value
                else isAPIKeyDrawerVisible.value = val
            }
            const handleGenerateKey = () => {
                toggleAPIKeyDrawer()
                resetSelectedAPIKey()
            }
            const handleUpdate = async (apiKey) => {
                apiKeyDirty.value = apiKey
                const { data, isReady, error, isLoading } =
                    APIKey.Update(apiKeyDirty)
                watch(
                    isLoading,
                    () => {
                        updateAPIKeyLoading.value = isLoading.value
                    },
                    { immediate: true }
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        if (isReady && !error.value && !isLoading.value) {
                            toggleAPIKeyDrawer()
                            reFetchList()
                            message.success('API Key updated successfully.')
                        } else if (error && error.value) {
                            toggleAPIKeyDrawer()
                            message.error(
                                'Unable to update API Key. Please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }
            const handleCreate = async (apiKey) => {
                try {
                    apiKeyDirty.value = apiKey
                    await createAPIKey()
                    // toggleAPIKeyDrawer()
                    reFetchList()
                    message.success('API Key generated successfully.')
                } catch (e) {
                    toggleAPIKeyDrawer()
                    message.error(
                        'Unable to generate API Key. Please try again.'
                    )
                }
            }
            const handleDelete = async (apiKeyId) => {
                const { data, isReady, error, isLoading } =
                    APIKey.Delete(apiKeyId)
                watch(
                    isLoading,
                    () => {
                        deleteAPIKeyLoading.value = isLoading.value
                    },
                    { immediate: true }
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        if (isReady && !error.value && !isLoading.value) {
                            toggleAPIKeyDrawer(false)
                            reFetchList()
                            message.success('API Key deleted successfully.')
                        } else if (error && error.value) {
                            toggleAPIKeyDrawer(false)
                            message.error(
                                'Unable to delete API Key. Please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }
            const handleSelectAPIKey = (apikey) => {
                // Disabling edit flow for now
                toggleAPIKeyDrawer()
                const localAPIKey = {
                    displayName: apikey?.display_name,
                    description: apikey?.attributes?.description,
                    validitySeconds: apikey?.['access.token.lifespan'],
                    personas: apikey?.attributes?.personas || [],
                    id: apikey?.id,
                }
                setSelectedAPIKey({
                    ...localAPIKey,
                })
            }
            const handlePagination = (page: number) => {
                paginateAPIKeys(page)
            }

            const handleRangePickerChange = (e) => {
                console.log(e, 'Date pick')
                message.info(
                    `Selected Dates b/w ${dayjs(e[0]).format(
                        'DD MMM YYYY'
                    )} - ${dayjs(e[1]).format('DD MMM YYYY')}`
                )
            }

            /**WATCHERS */
            watch(searchText, () => searchAPIKeys(searchText.value))

            /**COMPUTED PROPERTIES */
            const pagination = computed(() => ({
                total: searchText.value.length
                    ? filteredAPIKeysCount.value
                    : totalAPIKeysCount.value,
                pageSize: listParams.value.limit,
                current: listParams.value.offset / listParams.value.limit + 1,
            }))
            return {
                timeFrame,
                handleRangePickerChange,
                apiKeysList,
                isLoading,
                searchText,
                selectedAPIKey,
                isAPIKeyDrawerVisible,
                handleGenerateKey,
                handleUpdate,
                handleCreate,
                handleDelete,
                createAPIKeyLoading,
                updateAPIKeyLoading,
                deleteAPIKeyLoading,
                handleSelectAPIKey,
                toggleAPIKeyDrawer,
                filteredPersonas,
                generatedAPIKey,
                pagination,
                filteredAPIKeysCount,
                totalAPIKeysCount,
                handlePagination,
                NewAPIKeyIllustration,
                map,
            }
        },
    })
</script>