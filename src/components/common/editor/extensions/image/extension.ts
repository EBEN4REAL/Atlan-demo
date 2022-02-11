import { Schema } from 'prosemirror-model'
import {
    defaultSettings,
    imagePlugin,
    updateImageNode,
} from 'prosemirror-image-plugin'
import { ImagePluginSettings } from 'prosemirror-image-plugin/dist/types'
import Image, { ImageOptions } from '@tiptap/extension-image'
import useUploadImage from '~/composables/image/uploadImage'

interface CustomImageOptions extends ImageOptions {
    imageSettings: ImagePluginSettings
}

export default Image.extend<CustomImageOptions>({
    onBeforeCreate() {
        this.editor.schema = new Schema({
            nodes: updateImageNode(this.editor.schema.spec.nodes, {
                ...this.options.imageSettings,
            }),
            marks: this.editor.schema.spec.marks,
        })
    },
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