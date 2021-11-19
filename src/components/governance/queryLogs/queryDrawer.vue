<!-- This component works in 3 modes/views: 1/ form to generate a key 2/ form to update/delete a key 3/ info for generated key; generatedAPIKey (3) is the first level of distinction bw these modes/views, if value exists for that we show the third screen; If not we check if the passed in key (props) that we take in this component as apiKeyDirty has an id or not; if it has id, we are in edit mode i.e. 2nd screen (form is prefilled) else new key generation mode (form is empty)-->
<template>
    <div class="h-full">
        <div
            class="flex items-center justify-between p-4 border-b border-gray-300 "
        >
            <span class="text-base font-bold tex-gray-700">Query details</span>
            <div class="top-0 p-1 cursor-pointer right-2">
                <AtlanIcon icon="Cross" class="r" @click="handleClose" />
            </div>
        </div>
        <div class="p-4">
            <SQLSnippet :text="query._source.log.message?.userSqlQuery" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import SQLSnippet from '@common/sql/snippet.vue'

    export default defineComponent({
        name: 'queryPreviewDrawer',
        components: { SQLSnippet },
        props: {
            query: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['updateAPIKey', 'closeDrawer'],
        setup(props, { emit }) {
            const { query } = toRefs(props)
            const handleClose = () => {
                emit('closeDrawer')
            }
            return { query, handleClose }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped></style>
