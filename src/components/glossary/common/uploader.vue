<template>
    <a-upload-dragger
        class="flex justify-center items-center bg-gray-100 rounded-xl my-4"
        v-model:fileList="fileList"
        :open-file-dialog-on-click="fileList?.length ? false : true"
        :multiple="false"
        @remove="handleRemove"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        :custom-request="() => {}"
        @drop="handleDrop"
        @change="handleChange"
    >
        <div class="flex justify-center items-center">
            <atlan-icon icon="CSVLogo" class="h-40 mt-2" />
            <div class="">
                <!-- <p class="ant-upload-text">Click or drag file to this area to upload</p> -->
                <!--  <p class="ant-upload-hint"> -->
                <!--      Support for a single or bulk upload. Strictly prohibit from -->
                <!--      uploading company data or other band files -->
                <!--  </p> -->
                <div class="flex flex-col items-center">
                    <span
                        v-if="fileList.length < 1"
                        class="font-bold text-gray-700"
                        >Select a CSV file to upload</span
                    >
                    <span v-if="!fileList?.length" class="text-gray-500"
                        >Or drag and drop it here</span
                    >
                    <div class="flex items-center mt-2 space-x-3">
                        <a-button
                            v-if="fileList?.length"
                            type="primary"
                            class="bg-primary text-white"
                            :disabled="fileList.length === 0"
                            :loading="uploading"
                            @click="handleUpload"
                        >
                            {{ uploading ? 'Uploading' : 'Start Upload' }}
                        </a-button>
                    </div>
                    <div
                        v-if="fileList?.length"
                        class="flex items-center mt-3 space-x-1"
                    >
                        <atlan-icon icon="PaperClip" />
                        <span class="text-gray-500">{{
                            fileList[0]?.name
                        }}</span>
                        <span class="text-gray-500">|</span>
                        <a-tooltip>
                            <template #title>Remove file</template>
                            <atlan-icon
                                icon="Delete"
                                class="text-red-500 cursor-pointer"
                                @click="fileList = []"
                            />
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </a-upload-dragger>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        ref,
        watchEffect,
        watch,
        toRefs,
        computed,
    } from 'vue'
    import type { UploadChangeParam } from 'ant-design-vue'
    import { message } from 'ant-design-vue'
    import useFileUploader from '@/common/input/useFileUploader'

    export default defineComponent({
        name: 'FileUploader',
        props: {
            config: {
                type: Object,
                required: false,
                default: () => null,
            },
            accept: {
                type: String,
                required: false,
                default: '.csv',
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { config, accept } = toRefs(props)
            const reqConfig = computed(() => config.value[0]?.requestConfig)
            const handleChange = (info: UploadChangeParam) => {
                console.log(info)
                if (info?.file?.type !== 'text/csv') {
                    fileList.value = []
                    message.error('Unsupported file type. Upload a CSV file')
                }
           }
            const {
                handleUpload,
                beforeUpload,
                handleRemove,
                uploading,
                fileList,
                error: fileError,
                success: fileSuccess,
            } = useFileUploader(reqConfig, emit)
            const handleDrop = (event) => {
                console.log(event)
            }
            return {
                handleUpload,
                beforeUpload,
                handleRemove,
                fileList,
                uploading,
                fileError,
                fileSuccess,
                handleDrop,
                handleChange,
            }
        },
    })
</script>
