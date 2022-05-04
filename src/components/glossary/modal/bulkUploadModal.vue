<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        width="800px"
        :class="$style.modalStyles"
    >
        <!-- modal title -->
        <template #title>
            <div class="bg-gray-200 flex items-center">
                <span class="text-base font-bold text-gray-700"
                    >New Bulk Upload</span
                >
                <atlan-icon icon="CaretRight" class="mx-2" />
                <atlan-icon icon="Glossary" class="mr-1" />
                <span class="text-base text-gray-700">{{
                    entity?.displayText
                }}</span>
            </div>
        </template>
        <!-- Modal body -->

        <span class="text-gray-700 px-4 pt-2"
            >Getting started with bulk upload?</span
        >
        <div class="flex items-center my-1 text-primary px-4">
            <span
                class="cursor-pointer flex items-center"
                @click="handleDownload"
                ><atlan-icon icon="Download" class="mr-1 mb-0.5" />Download
                sample template here</span
            >
            <span class="mx-2">|</span>
            <span class="cursor-pointer flex items-center"
                >View upload guidelines here
                <atlan-icon icon="External" class="ml-1 mb-0.5"
            /></span>
        </div>
        <div
            class="flex justify-center items-center px-4 mx-4 bg-gray-50 border border-dashed border-gray-400 rounded-xl my-4"
        >
            <atlan-icon icon="CSVLogo" class="h-36 mt-2" />
            <div class="">
               <FormGen :config="formConfig" @vchange="handleFormChange" />
            </div>
        </div>
        <!-- Modal footer -->
        <template #footer>
            <div class="flex items-center py-3 border-t mb-2">
                <span class="font-bold text-gray-700">
                    Common errors to avoid</span
                >
            </div>
            <div class="flex items-center justify-between pb-4">
                <div
                    v-for="(i, index) in illutrationMap"
                    :key="i?.icon"
                    class="flex items-center"
                >
                    <div class="flex flex-col">
                        <atlan-icon :icon="i?.icon" class="h-28 mb-2" />
                        <span class="text-gray-500 text-xs text-left w-40 mx-2">{{
                            i?.text
                        }}</span>
                    </div>
                    <div
                        v-if="illutrationMap?.length !== index + 1"
                        class="h-40 w-0.5 bg-gray-200 ml-4"
                    ></div>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import FormGen from '~/components/common/formGenerator/index.vue'
    import useBulkUpload from '@/glossary/modal/useBulkUpload'
    import { isWorkflowRunning } from '@/glossary/modal/useBulkUpload'
    import { message } from 'ant-design-vue'
    import CSVData from '~/assets/samples/terms-template.json'
    import { downloadFile } from '~/utils/library/download'

    export default defineComponent({
        components: { FormGen },
        props: {
            entity: {
                type: Object,
                required: true,
                default: () => {},
            },
        },
        emits: [],
        setup(props, { emit }) {
            // data
            const visible = ref<boolean>(false)
            const fileS3Key = ref('') // s3 key is what we get from the files api
            // http on local https on production
            const getBasePath = function (): any {
                if (process.env.NODE_ENV === 'development')
                    return 'http://{{domain}}/api/service/files'
                return 'https://{{domain}}/api/service/files'
            }

            const illutrationMap = [
                {
                    icon: 'CommonError1',
                    text: 'Categories, Classifications, Users & Groups mentioned in the file should exactly match those on Atlan.',
                },
                {
                    icon: 'CommonError2',
                    text: 'Use a comma separated list to add multiple values for a column',
                },
                {
                    icon: 'CommonError3',
                    text: "Add terms in the desired category hierarchy using the ,'@' symbol.",
                },
                {
                    icon: 'CommonError4',
                    text: 'Please do not edit the first row or rearrange the columns. It is for Atlan use only.',
                },
            ]

            const formConfig = ref([
                {
                    type: 'upload',
                    id: 'test',
                    label: '',
                    isVisible: true,
                    accept: '.csv',
                    requestConfig: {
                        url: getBasePath(),
                        formDataFormat: {
                            name: 'name',
                            file: '{{file}}',
                            prefix: 'glossary_bulk_upload',
                            force: false,
                            excludePrefix: false,
                        },
                    },
                },
            ]) // this drives the upload form

            // function to show modal
            const showModal = () => {
                if (isWorkflowRunning.value) {
                    message.error({
                        content: `Sorry, this action cannot be completed because there is an ongoing upload for this glossary. Retry again later.`,
                        duration: 5,
                    })
                } else {
                    visible.value = true
                }
            }
            const handleCancel = () => {
                visible.value = false
            }

            // get called on file upload
            const handleFormChange = (data) => {
                if (data.key) {
                    fileS3Key.value = data.key
                    const { startUpload } = useBulkUpload({
                        guid: props?.entity?.guid,
                        fileS3Key,
                        glossaryName: props?.entity?.displayText,
                    })
                    startUpload()
                    visible.value = false // close modal on hit submit
                }
            }

            // handles download of sample file
            const handleDownload = () => {
                const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
                const header = Object.keys(CSVData[0])
                const csv = [
                    header.join(','), // header row first
                    ...CSVData.map((row) =>
                        header
                            .map((fieldName) =>
                                JSON.stringify(row[fieldName], replacer)
                            )
                            .join(',')
                    ),
                ].join('\r\n')

                console.log(csv)
                const fileName = 'Sample'

                downloadFile(csv, fileName)
            }

            return {
                handleCancel,
                showModal,
                visible,
                formConfig,
                handleFormChange,
                handleDownload,
                illutrationMap,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-upload-drag-container) {
            @apply bg-white !important;
        }
        :global(.ant-upload-drag) {
            @apply bg-white !important;
        }
        :global(.ant-modal-header) {
            @apply bg-primary-light mb-2 !important;
        }
    }
</style>
