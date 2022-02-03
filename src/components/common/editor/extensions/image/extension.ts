import { Schema } from 'prosemirror-model'
import {
    defaultSettings,
    imagePlugin,
    updateImageNode,
} from 'prosemirror-image-plugin'
import Image from '@tiptap/extension-image'
import useUploadImage from '~/composables/image/uploadImage'

export default Image.extend({
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
