<template>
    <DefaultLayout
        v-if="listPermissions"
        title="API Keys"
        sub-title="Create, delete and access API Keys"
    >
        <template #header>
            <div class="flex items-center justify-between">
                <a-input-search
                    v-model:value="searchText"
                    placeholder="Search API..."
                    style="width: 300px"
                    allow-clear="true"
                    @change="handleSearch"
                />
                <a-button
                    type="primary"
                    class="rounded-md"
                    @click="showAPIKeyModal"
                    >Create New API</a-button
                >
            </div>
        </template>

        <div>
            <ErrorView
                v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            ></ErrorView>
            <a-table
                v-else
                id="apiKeysList"
                :table-layout="'fixed'"
                :pagination="{ pageSize: 7 }"
                :data-source="apiList"
                :columns="columns"
                :row-key="(key) => key.id"
                :loading="[STATES.PENDING].includes(state)"
                @change="handleTableChange"
            >
                <template #name="{ text: key }">
                    <div class="flex items-center align-middle">
                        <div class="truncate">
                            <div class="truncate">{{ key.name }}</div>
                            <p class="mb-0 text-gray">
                                {{ timeAgo(key.created_at) }} ago
                            </p>
                        </div>
                    </div>
                </template>
                <template #createdBy="{ text: key }">
                    <div
                        class="truncate cursor-pointer"
                        @click="() => handleClickUser(key.created_by)"
                    >
                        {{ key.created_by }}
                    </div>
                </template>
                <template #apiKey="{ text: key }">
                    <div
                        class="
                            inline-flex
                            items-center
                            px-2
                            py-0.5
                            bg-gray-100
                            rounded
                            text-gray-500
                        "
                    >
                        <div>{{ key.code.slice(key.code.length - 22) }}</div>
                    </div>
                </template>
                <template #actions="{ text: key }">
                    <a-button-group>
                        <a-tooltip placement="bottom">
                            <template #title>
                                <span>Copy API Key</span>
                            </template>
                            <a-button
                                size="small"
                                class="mr-3.5 rounded"
                                :diasbled="key.created_by !== currentUserId"
                                @click="copyAPI(key)"
                            >
                                <fa icon="fal copy"></fa>
                            </a-button>
                        </a-tooltip>

                        <a-tooltip
                            :diasbled="key.created_by !== currentUserId"
                            placement="bottom"
                        >
                            <template #title>
                                <span>Delete API Key</span>
                            </template>
                            <a-button
                                size="small"
                                class="rounded"
                                :diasbled="key.created_by !== currentUserId"
                                @click="deleteAPI(key.id)"
                            >
                                <fa
                                    icon="fal trash-alt"
                                    class="text-red-600"
                                ></fa>
                            </a-button>
                        </a-tooltip>
                    </a-button-group>
                </template>
            </a-table>
        </div>
        <div>
            <a-modal v-model:visible="isCreateAPI" title="Create API Key">
                <label>Name:</label>
                <a-input v-model:value="apiName" />
                <template #footer>
                    <a-button key="back" @click="showAPIKeyModal"
                        >Cancel</a-button
                    >
                    <a-button
                        key="submit"
                        type="primary"
                        :disabled="!apiName.length"
                        :loading="isAPILoading"
                        @click="createAPIKey"
                        >Create</a-button
                    >
                </template>
            </a-modal>
        </div>
    </DefaultLayout>
    <NoAcces v-else />
</template>
<script lang="ts">
    // Todo: Add createdBy user name for each API Key

    import { defineComponent, inject, onMounted, ref, computed } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    // TODO: Why do we need dayjs? Use vueuse
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import NoAcces from '@/admin/common/noAccessPage.vue'
    import ErrorView from '@common/error/index.vue'
    import DefaultLayout from '@/admin/defaultLayout.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import useAPIKeys from './useAPIKeys'
    import { APIKeyService } from '~/api/auth/apiKeys'
    import { debounce } from '~/composables/utils/debounce'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useAccessStore } from '~/services/access/accessStore'
    
    dayjs.extend(relativeTime)

    export default defineComponent({
        components: { ErrorView, DefaultLayout, NoAcces },
        setup() {
            const keycloak: any = inject('$keycloak')
            const accessStore = useAccessStore()
            const listPermissions = computed(() => accessStore.checkPermission('LIST_REQUEST'))
            const {
                apiList,
                state,
                STATES,
                AdminrolesId,
                getUpdatedAPI,
                getRoleList,
                searchAPI,
            } = useAPIKeys({
                revalidateOnFocus: false,
                dedupingInterval: 1,
            })
            const isCreateAPI = ref(false)
            const apiName = ref('')
            const isAPILoading = ref(false)
            const searchText = ref('')
            onMounted(() => getRoleList())

            const timeAgo = (time: string) => dayjs().from(time, true)

            const showAPIKeyModal = () => {
                isCreateAPI.value = !isCreateAPI.value
            }
            const copyAPI = (item: any) => {
                copyToClipboard(item.code)
                message.success({
                    content: 'API Copied!',
                })
            }

            const handleSearch = debounce(() => {
                searchAPI(searchText.value)
            }, 500)

            const onSearch = (value: string) => {
                searchAPI(value)
            }

            const createAPIKey = async () => {
                isAPILoading.value = true
                const body = {
                    category: '',
                    name: apiName.value,
                    roleId: AdminrolesId.value,
                    roleName: '$admin',
                }
                await APIKeyService.createAPIKey(body)
                getUpdatedAPI()
                showAPIKeyModal()
                apiName.value = ''
                isAPILoading.value = false
            }

            const deleteAPI = (item: any) => {
                Modal.confirm({
                    title: 'Delete API Key',
                    content: 'Are you sure to delete this API key?',
                    okType: 'danger',
                    okText: 'Yes',
                    cancelText: 'No',
                    async onOk() {
                        await APIKeyService.deleteAPIKey(item)
                        getUpdatedAPI()
                    },
                })
            }
            // user preview drawer
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (userId: string) => {
                setUserUniqueAttribute(userId)
                showUserPreview({ allowed: ['about'] })
            }

            return {
                copyAPI,
                deleteAPI,
                apiList,
                state,
                STATES,
                currentUserId: keycloak?.tokenParsed?.userId ?? '',
                AdminrolesId,
                onSearch,
                showAPIKeyModal,
                apiName,
                isCreateAPI,
                createAPIKey,
                isAPILoading,
                timeAgo,
                searchText,
                handleSearch,
                handleClickUser,
                listPermissions

            }
        },
        data() {
            return {
                columns: [
                    {
                        title: 'Name',
                        key: 'name',
                        width: 200,
                        slots: { customRender: 'name' },
                    },
                    {
                        title: 'Created By',
                        key: 'created_by',
                        width: 150,
                        slots: { customRender: 'createdBy' },
                    },
                    {
                        title: 'API Key',
                        width: 120,
                        slots: { customRender: 'apiKey' },
                    },
                    {
                        width: 100,
                        title: 'Actions',
                        slots: { customRender: 'actions' },
                    },
                ],
            }
        },
    })
</script>
