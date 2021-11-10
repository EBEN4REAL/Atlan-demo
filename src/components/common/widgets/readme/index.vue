<template>
    <div
        class="flex flex-col px-6 py-4 bg-white border border-gray-100 rounded"
        v-if="guid || isEdit"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <AtlanIcon icon="Readme" class="w-auto h-5 mr-3" /><span
                    class="text-sm font-semibold text-gray-700"
                    >Readme</span
                >
            </div>

            <a-button
                class="flex items-center"
                v-if="!isLoading && !content && isEdit"
                @click="handleEditMode"
            >
                <AtlanIcon icon="Edit" class="w-auto h-4 mr-1" />Start a
                readme</a-button
            >
            <a-button
                class="flex items-center"
                v-if="!isLoading && isEdit && content"
                @click="handleEditMode"
            >
                <AtlanIcon icon="Edit" class="w-auto h-4 mr-1" />Edit</a-button
            >
        </div>
        <div class="h-24" v-if="isLoading" style="min-height: 200px">
            <SectionLoader></SectionLoader>
        </div>
        <div class="mt-3 border-0" style="min-height: 200px">
            <Editor
                ref="editor"
                :editable="isEditMode"
                :content="content"
                @onEditorContentUpdate="handleUpdate"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        watch,
        computed,
        toRefs,
    } from 'vue'

    import Editor from '@/common/editor/index.vue'
    import { InternalAttributes } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import SectionLoader from '@/common/loaders/section.vue'

    export default defineComponent({
        components: {
            Editor,
            SectionLoader,
        },
        props: {
            guid: {
                type: String,
                required: false,
                default: '',
            },
            isEdit: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const { guid, isEdit } = toRefs(props)

            const isEditMode = ref(false)

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: guid.value,
            })
            const dependentKey = ref(guid.value)
            const defaultAttributes = ref([...InternalAttributes])
            const readme = ref({})

            const { list, isLoading } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
            })

            watch(list, () => {
                if (list.value.length > 0) {
                    readme.value = list.value[0]
                }
            })

            const { description } = useAssetInfo()
            const content = computed(() => description(readme?.value))

            const handleEditMode = () => {
                isEditMode.value = !isEditMode.value
            }

            // const editable = ref(false)
            // const editor = ref()
            // const { entity } = toRefs(props)
            // const editorContent = ref(
            //     entity.value?.attributes?.readme?.attributes?.description ?? ''
            // )
            // const readmeDescription = computed(
            //     () => entity.value?.attributes?.readme?.attributes?.description
            // )

            const handleUpdate = (
                content: string,
                json: Record<string, any>
            ) => {
                console.log(content)
            }

            // const onCancel = () => {
            //     if (editor.value) {
            //         editor.value.resetEditor()
            //     }
            //     editorContent.value = readmeDescription.value

            //     editable.value = false
            // }

            // const startEdit = () => {
            //     editable.value = true
            // }

            // const handleSave = () => {
            //     editable.value = false
            //     if (
            //         readmeDescription.value?.length ||
            //         readmeDescription.value === ''
            //     ) {
            //         const { update } = useUpdateReadme(
            //             entity.value?.attributes?.readme,
            //             editorContent.value
            //         )
            //         update()
            //     } else {
            //         const { createReadme } = useCreateReadme(
            //             entity,
            //             editorContent.value
            //         )
            //         createReadme()
            //     }
            // }

            return {
                isLoading,
                isEdit,
                content,
                readme,
                handleUpdate,
                isEditMode,
                handleEditMode,
                // editable,
                // editor,
                // editorContent,
                // onUpdate,
                // onCancel,
                // startEdit,
                // handleSave,
                // readmeDescription,
            }
        },
    })
</script>

<style lang="less">
    .container {
        display: flex;
        width: 100vw !important;
        align-items: center;
    }
</style>

<route lang="yaml">
meta:
    layout: project
    requiresAuth: true
</route>
