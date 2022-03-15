import { defaultSettings, imagePlugin } from 'prosemirror-image-plugin'
import { ImagePluginSettings } from 'prosemirror-image-plugin/dist/types'
import Image, { ImageOptions } from '@tiptap/extension-image'
import useUploadImage from '~/composables/image/uploadImage'

interface CustomImageOptions extends ImageOptions {
    imageSettings: ImagePluginSettings
}

export default Image.extend<CustomImageOptions>({
    addOptions() {
        return {
            ...this.parent?.(),
            imageSettings: {
                ...defaultSettings,
                hasTitle: false,
                enableResize: true,
                uploadFile(file: File): Promise<string> {
                    const { upload, data } = useUploadImage()
                    return upload(file).then(
                        () =>
                            `/api/service/images/${data.value?.id}?ContentDisposition=inline&name=image`
                    )
                },
            },
        }
    },
    addProseMirrorPlugins() {
        return [
            imagePlugin(this.editor.schema, { ...this.options.imageSettings }),
        ]
    },
})
