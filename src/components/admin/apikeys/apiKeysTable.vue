<template>
    <div>
        <a-table
            v-if="apiKeysList"
            class="overflow-hidden border rounded-b-lg apikey-list api-keys-table"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :pagination="false"
            :data-source="apiKeysList"
            :columns="columns"
            :row-key="(apikey) => apikey.id"
            :loading="isLoading"
            @change="handleTableChange"
        >
            <template #headerCell="{ title, column }">
                <div
                    class="flex p-4 py-2 font-normal tracking-wide text-gray-500 uppercase w-100 group-hover:text-gray-700"
                >
                    {{ title }}
                </div>
            </template>
            <template #emptyText>
                No api keys found
                <span v-if="searchText"
                    >with <span class="italic">{{ searchText }}</span>
                </span>
            </template>
            <template #name="{ text: apikey }">
                <div v-if="apikey.attributes.description">
                    <a-popover trigger="hover" placement="bottom">
                        <template #content>
                            <div class="px-3 py-1">
                                {{ apikey.attributes.description }}
                            </div>
                        </template>
                        <div
                            class="cursor-pointer text-primary"
                            @click="$emit('selectAPIKey', apikey)"
                        >
                            {{ apikey.attributes.displayName }}
                        </div>
                    </a-popover>
                </div>
                <div
                    v-else
                    class="cursor-pointer text-primary"
                    @click="$emit('selectAPIKey', apikey)"
                >
                    {{ apikey.attributes.displayName }}
                </div>
            </template>
            <template #personas="{ text: apikey }">
                <!-- <span v-if="apikey.attributes.personas">
                    {{ apikey.attributes.personas.length }}
                </span> -->

                <PillGroup
                    v-if="
                        apikey &&
                        apikey.attributes &&
                        apikey.attributes.personas &&
                        apikey.attributes.personas.length
                    "
                    v-model:data="apikey.attributes.personas"
                    label-key="persona"
                    :read-only="true"
                >
                </PillGroup>
                <span v-else> No personas </span>
            </template>
            <template #expiry="{ text: apikey }">
                <div
                    v-if="
                        apikey &&
                        apikey.attributes &&
                        apikey.attributes.validityStringRelative
                    "
                >
                    <a-tooltip
                        v-if="apikey.attributes.validityString"
                        placement="bottom"
                    >
                        <template #title>{{
                            apikey.attributes.validityString
                        }}</template>
                        {{
                            apikey.attributes.validity.$y >
                            new Date().getFullYear() + 5
                                ? 'Never'
                                : apikey.attributes.validityStringRelative
                        }}
                    </a-tooltip>
                    <div v-else>
                        {{ apikey.attributes.validityStringRelative }}
                    </div>
                </div>
                <div v-else>-</div>
            </template>
            <template #created="{ text: apikey }">
                <div class="flex items-center">
                    <Avatar
                        v-if="
                            apikey &&
                            apikey.attributes &&
                            apikey.attributes.createdBy
                        "
                        :image-url="imageUrl(apikey.attributes.createdBy)"
                        :allow-upload="false"
                        :avatar-name="apikey.attributes.createdBy"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-2 mt-0.5"
                    />
                    <span
                        class="cursor-pointer"
                        @click="
                            () => handleUserPreview(apikey.attributes.createdBy)
                        "
                        >{{ apikey.attributes.createdBy }}</span
                    >
                    <span class="mx-1 text-gray-500">on</span>
                    {{ apikey.attributes.createdAtFormatted }}
                </div>
            </template>

            <template #actions="{ text: apikey }">
                <a-popover
                    trigger="click"
                    placement="bottomLeft"
                    :visible="isDeletePopoverVisible[apikey.id]"
                >
                    <AtlanBtn
                        color="secondary"
                        padding="compact"
                        size="sm"
                        class="bg-transparent border-none"
                    >
                        <AtlanIcon
                            icon="Delete"
                            class="shadow-none cursor-pointer"
                            :class="
                                isDeletePopoverVisible[apikey.id]
                                    ? 'text-error'
                                    : ''
                            "
                            @click="() => showDeletePopover(apikey.id)"
                        />
                    </AtlanBtn>
                    <template #content>
                        <div class="px-4 py-3">
                            <div class="mb-4 text-base font-bold">
                                Delete API Key
                            </div>
                            <div class="mb-3.5">
                                Are you sure you want to delete
                                <span class="font-bold">
                                    {{ apikey.attributes.displayName }}?</span
                                >
                            </div>
                            <div class="flex justify-end mb-2">
                                <AtlanBtn
                                    color="secondary"
                                    padding="compact"
                                    size="sm"
                                    class="mr-3 shadow-sm"
                                    @click="
                                        isDeletePopoverVisible[
                                            apikey.id
                                        ] = false
                                    "
                                >
                                    <span>Cancel</span></AtlanBtn
                                >
                                <AtlanBtn
                                    v-auth="[map.DELETE_APIKEY]"
                                    size="sm"
                                    class="text-white bg-error border-error"
                                    padding="compact"
                                    :is-loading="deleteAPIKeyLoading"
                                    @click="() => handleDelete(apikey.id)"
                                    ><span v-if="deleteAPIKeyLoading"
                                        >Deleting</span
                                    >
                                    <span v-else>Delete</span></AtlanBtn
                                >
                            </div>
                        </div>
                    </template>
                </a-popover>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import map from '~/constant/accessControl/map'
    import Avatar from '~/components/common/avatar/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'

    export default defineComponent({
        name: 'ApiKeysTable',
        components: { Avatar, AtlanBtn, PillGroup },
        props: {
            apiKeysList: {
                type: Array,
                default: () => [],
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
            selectedAPIKey: {
                type: Object,
                default: () => {},
            },
            deleteAPIKeyLoading: {
                type: Boolean,
                default: false,
            },
            searchText: {
                type: String,
                default: '',
            },
        },
        emits: ['selectAPIKey', 'deleteAPIKey'],
        setup(props, { emit }) {
            const { deleteAPIKeyLoading } = toRefs(props)
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const apiKeyId = ref('')
            const isDeletePopoverVisible = ref({})
            const { showUserPreview: openPreview, setUserUniqueAttribute } =
                useUserPreview()
            const handleUserPreview = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                openPreview()
            }
            const handleDelete = (id) => {
                apiKeyId.value = id
                emit('deleteAPIKey', id)
            }
            const showDeletePopover = (id) => {
                isDeletePopoverVisible.value[id] = true
            }
            // automatically close popover after loading action is complete
            watch(deleteAPIKeyLoading, (newval, oldVal) => {
                if (oldVal === true && newval === false) {
                    isDeletePopoverVisible.value[apiKeyId.value] = false
                }
            })
            const columns = [
                {
                    title: 'Name',
                    key: 'name',
                    ellipsis: true,
                    width: 300,
                    slots: { customRender: 'name' },
                },
                // {
                //     title: 'Key',
                //     key: 'key',
                //     slots: { customRender: 'key' },
                // },
                {
                    title: 'Personas',
                    slots: { customRender: 'personas' },
                    key: 'personas',
                },

                {
                    title: 'Expiry',
                    key: 'expiry',
                    ellipsis: true,
                    slots: { customRender: 'expiry' },
                },
                {
                    title: 'Created',
                    key: 'created',
                    ellipsis: true,
                    slots: { customRender: 'created' },
                },
                {
                    key: 'actions',
                    width: 70,
                    slots: { customRender: 'actions' },
                },
            ]
            return {
                columns,
                imageUrl,
                showDeletePopover,
                handleUserPreview,
                handleDelete,
                isDeletePopoverVisible,
                map,
            }
        },
    })
</script>

<style lang="less">
    .api-keys-table {
        .ant-table-thead {
            height: 44px !important;
            .ant-table-cell {
                padding: 0 !important;
            }
        }
    }
</style>
