<template>
    <DefaultLayout title="API Keys">
        <template #header>
            <div class="flex items-center justify-between pb-3">
                <a-input-search
                    v-model:value="searchText"
                    :placeholder="`Search from api keys`"
                    class="w-1/3 mr-1 shadow-sm"
                    size="default"
                    :allow-clear="true"
                    @change="handleSearch"
                ></a-input-search>
                <div class="flex-grow w-0"></div>
                <AtlanBtn
                    padding="compact"
                    size="sm"
                    color="primary"
                    class="px-7"
                    @click="handleGenerateKey"
                >
                    <AtlanIcon icon="Add" class="ml-2" />Generate API Key
                </AtlanBtn>
            </div>
        </template>

        <APIKeysTable
            :api-keys-list="apiKeysList"
            :is-loading="isLoading"
            @selectAPIKey="handleSelectAPIKey"
        />
        <a-drawer
            :visible="isAPIKeyDrawerVisible"
            :mask="false"
            :width="350"
            class="api-key"
            :closable="false"
        >
            <APIKeyDrawer
                @closeDrawer="toggleAPIKeyDrawer"
                :api-key="selectedAPIKey"
                @updateAPIKey="handleUpdate"
                @createAPIKey="handleCreate"
            />
        </a-drawer>
    </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import useAPIKeysList from '@/governance/apikeys/composables/useAPIKeysList'
import useUpdateAPIKey from '@/governance/apikeys/composables/useUpdateAPIKey'
import useCreateAPIKey from '@/governance/apikeys/composables/useCreateAPIKey'
import DefaultLayout from '~/components/admin/layout.vue'
import AtlanBtn from '@/UI/button.vue'
import APIKeysTable from '@/governance/apikeys/apiKeysTable.vue'
import APIKeyDrawer from '@/governance/apikeys/apiKeyDrawer.vue'
import filteredPersonas from '~/components/governance/personas/personaView.vue'

export default defineComponent({
    name: 'ApiKeysView',
    components: {
        DefaultLayout,
        AtlanBtn,
        APIKeysTable,
        APIKeyDrawer,
    },
    setup() {
        const apiKeyDirty = ref({})
        const {
            apiKeysList,
            isLoading,
            searchAPIKeys,
            selectedAPIKey,
            setSelectedAPIKey,
            resetSelectedAPIKey,
            reFetchList,
        } = useAPIKeysList()
        const {
            createAPIKey,
            isLoading: createAPIKeyLoading,
            error: createAPIError,
        } = useCreateAPIKey(apiKeyDirty)
        const { updateAPIKey } = useUpdateAPIKey(apiKeyDirty)
        const searchText: Ref<string> = ref('')
        const isAPIKeyDrawerVisible: Ref<boolean> = ref(false)
        const toggleAPIKeyDrawer = () => {
            isAPIKeyDrawerVisible.value = !isAPIKeyDrawerVisible.value
        }
        const handleGenerateKey = () => {
            toggleAPIKeyDrawer()
            resetSelectedAPIKey()
        }
        const handleUpdate = async (apiKey) => {
            apiKeyDirty.value = apiKey.value
            await updateAPIKey()
            reFetchList()
        }
        const handleCreate = async (apiKey) => {
            try {
                apiKeyDirty.value = apiKey
                await createAPIKey()
                toggleAPIKeyDrawer()
                reFetchList()
                message.success('API Key generated successfully.')
            } catch (e) {
                toggleAPIKeyDrawer()
                message.error(
                    'Unable to generate API Key. Please try again later.'
                )
            }
        }
        const handleSelectAPIKey = (apikey) => {
            // Disabling edit flow for now
            // toggleAPIKeyDrawer()
            setSelectedAPIKey({
                ...apikey,
                displayName: 'Example Display Name',
            })
        }
        watch(searchText, () => searchAPIKeys(searchText.value))
        return {
            apiKeysList,
            isLoading,
            searchText,
            selectedAPIKey,
            isAPIKeyDrawerVisible,
            handleGenerateKey,
            handleUpdate,
            handleCreate,
            handleSelectAPIKey,
            toggleAPIKeyDrawer,
            filteredPersonas,
        }
    },
})
</script>

