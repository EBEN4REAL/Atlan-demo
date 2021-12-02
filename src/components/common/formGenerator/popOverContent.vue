<template>
    <EditorContent :editor="editorInst" />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useEditor, EditorContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Link from '@tiptap/extension-link'

    export default defineComponent({
        name: 'PopOverContent',
        components: {
            EditorContent,
        },
        props: { content: { type: String, required: true } },
        setup(props) {
            const editorInst = useEditor({
                content: props.content,
                editable: false,
                autofocus: true,
                extensions: [StarterKit, Link],
            })
            return { editorInst }
        },
    })
</script>

<style scoped></style>
