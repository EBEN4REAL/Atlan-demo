<template>
    <div>
        <a-table
            v-if="apiKeysList"
            class="overflow-hidden border rounded-lg apikey-list"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :pagination="false"
            :data-source="apiKeysList"
            :columns="columns"
            :row-key="(apikey) => apikey.id"
            :loading="isLoading"
            @change="handleTableChange"
        >
            <template #name="{ text: apikey }">
                <div v-if="apikey.attributes.description">
                    <a-popover trigger="hover" placement="bottom">
                        <template #content>
                            {{ apikey.attributes.description }}
                        </template>
                        <div
                            @click="$emit('selectAPIKey', apikey)"
                            class="cursor-pointer"
                        >
                            {{ apikey.attributes.displayName }}
                        </div>
                    </a-popover>
                </div>
                <div v-else @click="$emit('selectAPIKey', apikey)" class="cursor-pointer">
                    {{ apikey.attributes.displayName }}
                </div>
            </template>
            <template #key="{ text: apikey }">
                {{ apikey.client_id }}
            </template>
            <template #personas="{ text: apikey }">
                <!-- <span v-if="apikey.attributes.personas">
                    {{ apikey.attributes.personas.length }}
                </span>
                <span v-else> 0 </span> -->
                <PillGroup
                    v-model:data="apikey.attributes.personas"
                    label-key="persona"
                    :read-only="true"
                >
                </PillGroup>
            </template>
            <template #created="{ text: apikey }">
                <div class="flex items-center">
                    <Avatar
                        :image-url="imageUrl(createdByUsername)"
                        :allow-upload="false"
                        :avatar-name="createdByUsername"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-1 mt-0.5"
                    /><span
                        class="cursor-pointer"
                        @click="
                            () =>
                                handleUserPreview(
                                    apikey.attributes.createdByUsername
                                )
                        "
                        >{{ apikey.attributes.createdByUsername }}</span
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
                                    isDeletePopoverVisible[apikey.id] = false
                                "
                            >
                                <span>Cancel</span></AtlanBtn
                            >
                            <AtlanBtn
                                v-auth="[map.DELETE_APIKEY]"
                                size="sm"
                                class="text-white bg-error border-error"
                                padding="compact"
                                @click="() => handleDelete(apikey.id)"
                                :is-loading="deleteAPIKeyLoading"
                                ><span v-if="deleteAPIKeyLoading"
                                    >Deleting</span
                                >
                                <span v-else>Delete</span></AtlanBtn
                            >
                        </div>
                    </template>
                </a-popover>
            </template>
        </a-table>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref, Ref, watch, toRefs } from 'vue'
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
</style>