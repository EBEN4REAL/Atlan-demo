<template>
    <a-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
        :remove="handleRemove"
        name="file"
        accept="text/xml"
        :multiple="false"
        :show-upload-list="false"
        @change="onFileUpload"
    >
        <AtlanBtn
            color="secondary"
            padding="compact"
            size="sm"
            class="shadow-sm"
            @click="downloadMetadataFile"
        >
            <div class="flex flex-row items-center">
                <AtlanIcon icon="Upload"></AtlanIcon>
                <span class="ml-1">Import from XML</span>
            </div>
        </AtlanBtn>
    </a-upload>
</template>
<script lang="ts">
    import { defineComponent, ref, reactive, toRaw } from 'vue'
    // @ts-ignore
    import xmlToJson from '~/utils/library/xmltojson'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'ImportMetadataFromXML',
        components: {
            AtlanBtn,
        },
        emits: ['setSSODetails'],
        setup(_, context) {
            const fileList = ref<any>([])
            const metadata = reactive({
                singleSignOnServiceUrl: '',
                signingCertificate: '',
            })

            const parseJSONFromUploadedXMLFile = (json: any) => {
                if (!json) {
                    return
                }
                const EntityDescriptor =
                    json?.EntityDescriptor || json['md:EntityDescriptor']
                const IDPSSODescriptor =
                    EntityDescriptor?.IDPSSODescriptor ||
                    EntityDescriptor['md:IDPSSODescriptor']
                const SingleSignOnService =
                    IDPSSODescriptor?.SingleSignOnService ||
                    IDPSSODescriptor['md:SingleSignOnService']
                const KeyDescriptor =
                    IDPSSODescriptor?.KeyDescriptor ||
                    IDPSSODescriptor['md:KeyDescriptor']
                const keyInfo =
                    KeyDescriptor?.KeyInfo || KeyDescriptor['ds:KeyInfo']
                const X509Data = keyInfo?.X509Data || keyInfo['ds:X509Data']

                metadata.singleSignOnServiceUrl = SingleSignOnService?.length
                    ? SingleSignOnService[0]?.$?.Location
                    : SingleSignOnService?.$?.Location
                metadata.signingCertificate =
                    X509Data['ds:X509Certificate'] || X509Data.X509Certificate

                console.log(metadata)
                context.emit('setSSODetails', toRaw(metadata))
            }

            const onFileUpload = ({ file }: { file: any }) => {
                if (!file) return
                const reader = new FileReader()
                reader.readAsText(file)
                reader.addEventListener('load', (event) => {
                    const xml: any = event?.target?.result
                    console.log('onFileUpload -> xml', xml)
                    const xmlDOM: any = new DOMParser().parseFromString(
                        xml,
                        'text/xml'
                    )
                    const finalJSON = xmlToJson(xmlDOM)
                    parseJSONFromUploadedXMLFile(finalJSON)
                })
            }

            const beforeUpload = (file: any) => {
                fileList.value = [...fileList.value, file]
                return false
            }

            const handleRemove = () => {
                fileList.value = []
            }

            return {
                fileList,
                beforeUpload,
                handleRemove,
                onFileUpload,
            }
        },
    })
</script>
