<template>
    <div>
        <a-table
            v-if="apiKeysList"
            class="overflow-hidden border rounded-lg"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :pagination="false"
            :data-source="apiKeysList"
            :columns="columns"
            :row-key="(apikey) => apikey.clientId"
            :loading="isLoading"
            @change="handleTableChange"
        >
            <template #name="{ text: apikey }">
                <a-popover trigger="hover" placement="bottom">
                    <template #content>
                        {{ apikey.attributes.description }}
                    </template>
                    <div @click="$emit('selectAPIKey', apikey)">
                        {{ apikey.attributes.displayName }}
                    </div>
                </a-popover>
            </template>
            <template #key="{ text: apikey }">
                {{ apikey.client_id }}
            </template>
            <template #personas="{ text: apikey }">
                <span v-if="apikey.attributes.personas">
                    {{ apikey.attributes.personas.length }}
                </span>
                <span v-else> 0 </span>
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
                    />{{ apikey.attributes.createdByUsername }}
                    <span class="mx-1 text-gray-500">on</span>
                    {{ apikey.attributes.createdAtFormatted }}
                </div></template
            >
        </a-table>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import Avatar from '~/components/common/avatar/index.vue'

export default defineComponent({
    name: 'ApiKeysTable',
    components: { Avatar },
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
    },
    emits: ['selectAPIKey'],
    setup(props) {
        const imageUrl = (username: any) =>
            `${window.location.origin}/api/service/avatars/${username}`
        const columns = [
            {
                title: 'Name',
                key: 'name',
                ellipsis: true,
                width: 300,
                slots: { customRender: 'name' },
            },
            {
                title: 'Key',
                key: 'key',
                slots: { customRender: 'key' },
            },
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
                width: 50,
                slots: { customRender: 'actions' },
            },
        ]
        return { columns, imageUrl }
    },
})
</script>

<style lang="less"></style>
