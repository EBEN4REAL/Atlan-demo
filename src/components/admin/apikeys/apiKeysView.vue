<template>
    <div class="h-full">
        <div
            v-if="!totalAPIKeysCount && !isLoading"
            class="flex flex-col items-center justify-center h-full"
        >
            <component :is="NewAPIKeyIllustration" class="mb-4"></component>
            <div class="text-xl font-bold">Create API Keys</div>
            <AtlanBtn
                v-auth="[map.CREATE_APIKEY]"
                padding="compact"
                size="sm"
                color="primary"
                class="mt-6 px-7"
                @click="handleGenerateKey"
            >
                <AtlanIcon icon="Add" class="ml-2" />Generate API Key
            </AtlanBtn>
            <AtlanBtn
                padding="compact"
                size="sm"
                color="secondary"
                class="hidden mt-3 bg-transparent border-none px-7 text-primary"
            >
                Learn more about API keys<AtlanIcon icon="ArrowRight" />
            </AtlanBtn>
        </div>
        <DefaultLayout v-else title="API Keys">
            <template #header>
                <div class="flex items-center justify-between pb-3">
                    <a-input-search
                        v-model:value="searchText"
                        :placeholder="`Search ${totalAPIKeysCount} api keys`"
                        class="w-1/3 mr-1 shadow-sm"
                        size="default"
                        :allow-clear="true"
                        @change="handleSearch"
                    ></a-input-search>
                    <div class="flex-grow w-0"></div>
                    <AtlanBtn
                        v-auth="[map.CREATE_APIKEY]"
                        padding="compact"
                        size="sm"
                        color="primary"
                        class="px-7"
                        @click="handleGenerateKey"
                    >
                        <AtlanIcon icon="Add" />Generate API Key
                    </AtlanBtn>
                </div>
            </template>

            <APIKeysTable
                :api-keys-list="apiKeysList"
                :is-loading="isLoading"
                :delete-a-p-i-key-loading="deleteAPIKeyLoading"
                :search-text="searchText"
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
                v-model:generatedAPIKey="generatedAPIKey"
                :api-key="selectedAPIKey"
                :create-update-loading="
                    createAPIKeyLoading || updateAPIKeyLoading
                "
                :delete-a-p-i-key-loading="deleteAPIKeyLoading"
                @updateAPIKey="handleUpdate"
                @createAPIKey="handleCreate"
                @deleteAPIKey="handleDelete"
                @closeDrawer="toggleAPIKeyDrawer"
            />
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import map from '~/constant/accessControl/map'
import { APIKey } from '~/services/service/apikeys'
import useAPIKeysList from '@/admin/apikeys/composables/useAPIKeysList'
// TODO: Try to make update flow similar to create flow i.e use callback from the composable instead of watching the states
// import useUpdateAPIKey from '@/governance/apikeys/composables/useUpdateAPIKey'
import useCreateAPIKey from '@/admin/apikeys/composables/useCreateAPIKey'
import DefaultLayout from '~/components/admin/layout.vue'
import AtlanBtn from '@/UI/button.vue'
import APIKeysTable from '@/admin/apikeys/apiKeysTable.vue'
import APIKeyDrawer from '@/admin/apikeys/apiKeyDrawer.vue'
import filteredPersonas from '~/components/governance/personas/personaView.vue'
import NewAPIKeyIllustration from '~/assets/images/illustrations/new_apikey.svg'

export default defineComponent({
    name: 'ApiKeysView',
    components: {
        DefaultLayout,
        AtlanBtn,
        APIKeysTable,
        APIKeyDrawer,
    },
    setup() {
        /** LOCAL STATE */
        const apiKeyDirty = ref({})
        const deleteAPIKeyLoading = ref(false)
        const updateAPIKeyLoading = ref(false)
        const searchText: Ref<string> = ref('')
        const isAPIKeyDrawerVisible: Ref<boolean> = ref(false)

        /** COMPOSABLES */
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
        // TODO: Try to make update flow similar to create flow i.e use callback from the composable instead of watching the states
        // const { updateAPIKey, isLoading: updateAPIKeyLoading } =
        //     useUpdateAPIKey(apiKeyDirty)

        /** METHODS */
        const toggleAPIKeyDrawer = (val: boolean | undefined = undefined) => {
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
                message.error('Unable to generate API Key. Please try again.')
            }
        }
        const handleDelete = async (apiKeyId) => {
            const { data, isReady, error, isLoading } = APIKey.Delete(apiKeyId)
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

        /** WATCHERS */
        watch(searchText, () => searchAPIKeys(searchText.value))

        /** COMPUTED PROPERTIES */
        const pagination = computed(() => ({
            total: searchText.value.length
                ? filteredAPIKeysCount.value
                : totalAPIKeysCount.value,
            pageSize: listParams.value.limit,
            current: listParams.value.offset / listParams.value.limit + 1,
        }))
        return {
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

