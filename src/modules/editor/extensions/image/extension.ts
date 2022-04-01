import { defaultSettings, imagePlugin } from 'prosemirror-image-plugin'
import Image from '@tiptap/extension-image'
import useUploadImage from '~/composables/image/uploadImage'
import {
    NAME_OF_EVENTS,
    README_TRIGGERS,
    TYPE_OF_EVENTS,
    useTrackEvent,
} from '~/modules/editor/analytics/useTrackEvent'

export default Image.extend({
    addProseMirrorPlugins() {
        const assetType =
            this.editor.options.editorProps.attributes['data-asset-type']
        return [
            imagePlugin(this.editor.schema, {
                ...defaultSettings,
                hasTitle: false,
                enableResize: true,
                uploadFile(file: File): Promise<string> {
                    const { upload, data } = useUploadImage()
                    return upload(file).then(() => {
                        useTrackEvent({
                            type: TYPE_OF_EVENTS.NODE,
                            name: NAME_OF_EVENTS.IMAGE,
                            trigger: README_TRIGGERS.PASTED,
                            properties: {
                                assetType,
                            },
                        })
                        return `/api/service/images/${data.value?.id}?ContentDisposition=inline&name=image`
                    })
                },
            }),
        ]
    },
})
