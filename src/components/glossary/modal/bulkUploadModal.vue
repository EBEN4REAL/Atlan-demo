<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        width="800px"
        :class="$style.modalStyles"
        :centered="true"
    >
        <!-- modal title -->
        <template #title>
            <div class="flex items-center">
                <span class="text-base font-bold text-gray-700"
                    >New Bulk Upload</span
                >
                <atlan-icon icon="CaretRight" class="mx-1" />
                <atlan-icon icon="Glossary" class="mr-1" />
                <span class="text-base text-gray-700">{{ glossaryName }}</span>
            </div>
        </template>
        <!-- Modal body -->
        <template #closeIcon>
            <atlan-icon icon="Close" class="h-6" />
        </template>

        <span class="text-gray-700 px-4 pt-4"
            >Getting started with bulk upload?</span
        >
        <div class="flex items-center my-1 text-primary px-4">
            <a :href="excelFileLink" download>
                <span
                    class="cursor-pointer flex items-center px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-primary font-bold"
                    ><atlan-icon icon="Download" class="mr-1 mb-0.5" />Download
                    sample template here</span
                >
            </a>
            <!-- <span class="mx-2">|</span> -->
            <!-- <span class="cursor-pointer flex items-center" -->
            <!--     >View upload guidelines here -->
            <!--     <atlan-icon icon="External" class="ml-1 mb-0.5" -->
            <!-- /></span> -->
        </div>
        <div class="mx-4">
            <Uploader :config="formConfig" @change="handleFormChange" />
        </div>
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
                        <span
                            class="text-gray-500 text-xs text-left mx-2"
                            :class="
                                index === illutrationMap?.length - 1
                                    ? 'w-36'
                                    : 'w-40'
                            "
                            >{{ i?.text }}</span
                        >
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
    import { defineComponent, ref, computed, watch, inject } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import FormGen from '~/components/common/formGenerator/index.vue'
    import Uploader from '~/components/glossary/common/uploader.vue'
    import useBulkUpload from '@/glossary/modal/useBulkUpload'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { isWorkflowRunning } from '@/glossary/modal/useBulkUpload'
    import { message } from 'ant-design-vue'
    import CSVData from '~/assets/samples/terms-template.json'
    import { downloadFile } from '~/utils/library/download'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        components: { FormGen, Uploader },
        props: {
            guid: {
                type: String,
                required: true,
            },
            glossaryName: {
                type: String,
                required: true,
            },
        },
        emits: [],
        setup(props, { emit }) {
            // data
            const visible = ref<boolean>(false)
            const { getGlossaryByGuid } = useGlossaryData()
            const fileS3Key = ref('') // s3 key is what we get from the files api
            const router = useRouter()
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
                    text: 'Use a comma separated list to add multiple values for a column.',
                },
                {
                    icon: 'CommonError3',
                    text: "Add terms in the desired category hierarchy using the '@' symbol.",
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

            const facets = computed(() => ({
                prefix: `atlan-gtc-bulk-upload-${props.guid?.slice(-8)}`,
                filterOut: [
                    'atlan-typedef-seeder',
                    'atlan', // atlan-upadate
                    'cloud-es-log-policy',
                    'cloud-backups',
                ],
            }))
            const { displayName, name, phase } = useWorkflowInfo()

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            // function to show modal
            const showModal = () => {
                const showMessage = () => {
                    message.error({
                        content: `This action cannot be completed because there is only one upload supported at a time`,
                        duration: 5,
                    })
                }
                if (!getGlossaryByGuid(props?.guid)?.isBulkUploadRunning) {
                    const {
                        list: runs,
                        quickChange,
                        resetState,
                        isLoading,
                        data,
                        error,
                    } = useRunDiscoverList({
                        facets,
                        limit: ref(1),
                        offset: ref(0),
                        preference,
                    })
                    watch(error, () => {
                        if (error.value) message.error('Something went wrong')
                    })
                    watch(runs, () => {
                        if (error.value) return
                        if (!runs.value.length) {
                            visible.value = true
                            return
                        }
                        const isFirstWfRunning =
                            phase(runs.value[0]) === 'Running'
                        if (isFirstWfRunning) {
                            showMessage()
                            getGlossaryByGuid(props?.guid).isBulkUploadRunning =
                                true
                        } else visible.value = true
                    })
                } else showMessage()
            }
            const handleCancel = () => {
                visible.value = false
            }

            // get called on file upload
            const handleFormChange = (data) => {
                if (data.key) {
                    fileS3Key.value = data.key
                    const { startUpload } = useBulkUpload({
                        guid: props?.guid,
                        fileS3Key,
                        glossaryName: props?.displayText,
                    })
                    startUpload()
                    visible.value = false // close modal on hit submit
                    useAddEvent('gtc', 'term', 'bulk_upload_initiated')
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
                const fileName = `${props?.glossaryName} - Atlan Bulk Terms Template`

                downloadFile(csv, fileName)
            }

            const isWfRunningForGtc = computed(
                () => getGlossaryByGuid(props?.guid)?.isBulkUploadRunning
            )

            const changeActiveTab = inject('changeActiveTab')

            watch(isWfRunningForGtc, () => {
                if (isWfRunningForGtc.value && changeActiveTab) {
                    setTimeout(() => {
                        changeActiveTab('uploadHistory')
                    }, 1000)
                }
            })

            const excelFileLink = '/gtc_bulk_upload_template.xlsx'
            return {
                handleCancel,
                showModal,
                visible,
                formConfig,
                handleFormChange,
                handleDownload,
                illutrationMap,
                excelFileLink,
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
            @apply bg-primary-light mb-4 !important;
        }
    }
</style>
