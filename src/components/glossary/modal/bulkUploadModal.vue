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
            <span class="text-base font-bold text-gray-700"
                >Bulk Upload Terms from CSV</span
            >
        </template>
        <!-- Modal body -->

        <div class="flex space-x-32">
            <FormGen :config="formConfig" @vchange="handleFormChange" />
            <span class="ml-12 text-gray-500"
                >Click the button on the left to upload a valid CSV file
                containing data.</span
            >
        </div>
        <!-- Modal footer -->
        <template #footer>
            <div class="flex items-center">
                <a-button class="px-2" @click="handleDownload"
                    >Download sample CSV template</a-button
                >
                <!-- TODO: Uncomment when doc for bulk is ready -->
                <!-- <span class="text-primary ml-7">Learn more</span> -->
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import FormGen from '~/components/common/formGenerator/index.vue'
    import useBulkUpload from `@/glossary/modal/useBulkUpload.ts`

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

            const formConfig = ref([
                {
                    type: 'upload',
                    id: 'test',
                    label: '',
                    isVisible: true,
                    requestConfig: {
                        url: getBasePath(),
                        formDataFormat: {
                            name: 'name',
                            file: '{{file}}',
                            prefix: 'prefix',
                        },
                    },
                },
            ]) // this drives the upload form

            // function to show modal
            const showModal = async () => {
                visible.value = true
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
                    })
                    startUpload()
                    visible.value = false // close modal on hit submit
                }
            }

            // handles download of sample file
            const handleDownload = () => {
                const link = window.document.createElement('a')
                link.setAttribute(
                    'href',
                    '/src/assets/samples/terms-template.csv'
                )
                link.setAttribute('download', 'sample.csv')
                link.click()
            }
            return {
                handleCancel,
                showModal,
                visible,
                formConfig,
                handleFormChange,
                handleDownload,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4 pt-6  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 py-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-7  py-2 !important;
        }
        :global(.ant-upload-drag-container) {
            @apply bg-white !important;
        }
        :global(.ant-upload-drag) {
            @apply bg-white !important;
        }
    }
</style>