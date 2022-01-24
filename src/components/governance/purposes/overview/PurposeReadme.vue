<template>
    <div class="p-4 mt-5 bg-white border border-gray-200 rounded">
        <AtlanIcon icon="Readme" class="w-auto h-8 mr-3" /><span
            class="text-base font-bold text-gray"
            >Readme</span
        >
        <div v-if="!isLoading" class="mt-2">
            <Editor
                ref="editor"
                v-model="data"
                placeholder="Type '/' for commands"
                :is-edit-mode="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import Editor from '@/common/editor/index.vue'
    import { Files } from '~/services/service/files/index'

    export default {
        name: 'PurposeReadme',
        components: {
            Editor,
        },
        setup() {
            const { data, isLoading } = Files.GetFile()

            return {
                data,
                isLoading,
            }
        },
    }
</script>

<style></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_USERS]
    redirect: false
</route>
