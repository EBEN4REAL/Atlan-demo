<template>
    <div class="flex flex-col p-4 bg-white rounded">
        <div>
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                    <AtlanIcon icon="Readme" class="w-auto h-8 mr-3" /><span
                        class="text-base font-bold text-gray"
                        >Readme</span
                    >
                </div>

                <a-button
                    v-if="!isLoading && !content && isEdit && !isEditMode"
                    class="flex items-center"
                    type="primary"
                    @click="handleEditMode"
                >
                    <AtlanIcon icon="Edit" class="w-auto h-4 mr-1" />Add a
                    readme</a-button
                >

                <div
                    v-if="!isLoading && isEdit && isEditMode"
                    class="flex gap-x-1"
                >
                    <a-button
                        v-if="!isAssetUpdateLoading"
                        class="flex items-center"
                        @click="handleCancel"
                    >
                        Cancel</a-button
                    >

                    <a-button
                        class="flex items-center"
                        type="primary"
                        :loading="isAssetUpdateLoading"
                        @click="handleUpdate"
                    >
                        Save</a-button
                    >
                </div>

                <a-button
                    v-if="!isLoading && isEdit && content && !isEditMode"
                    class="flex items-center"
                    type="primary"
                    @click="handleEditMode"
                >
                    <AtlanIcon
                        icon="Edit"
                        class="w-auto h-4 mr-1"
                    />Edit</a-button
                >
            </div>
            <span
                v-if="!isLoading && !content && !isEditMode"
                class="text-sm text-gray-500"
                >Add a README with an overview of your asset.</span
            >
        </div>
        <div v-if="isLoading" class="h-24" style="min-height: 200px">
            <SectionLoader></SectionLoader>
        </div>
        <div
            v-else-if="(guid && !isLoading) || isEditMode || readme.guid"
            class="border-0"
            style="min-height: 200px; transition: min-height 0.3s ease-in-out"
        >
            <Editor ref="editor" v-model="content" :is-edit-mode="isEditMode" />
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
        inject,
    } from 'vue'

    import Editor from '@/common/editor/index.vue'
    import { InternalAttributes } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SectionLoader from '@/common/loaders/section.vue'
    import updateAsset from '~/composables/discovery/updateAsset'

    export default defineComponent({
        components: {
            Editor,
            SectionLoader,
        },
        props: {
            isEdit: {
                type: Boolean,
                required: false,
                default: true,
            },
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)
            const actions = inject('actions')

            const { readmeGuid } = useAssetInfo()

            const guid = computed(() => readmeGuid(asset.value))
            const isEdit = ref(true)

            const isEditMode = ref(false)

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: guid.value,
            })
            const dependentKey = ref(guid?.value)
            const defaultAttributes = ref([...InternalAttributes])
            const readme = ref({})
            const content = ref('')

            const { list, isLoading } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
            })

            watch(list, () => {
                if (list?.value?.length > 0) {
                    readme.value = list.value[0]
                    console.log(description(readme?.value))
                    content.value = description(readme?.value)
                }
            })

            const { description } = useAssetInfo()

            const handleEditMode = () => {
                isEditMode.value = !isEditMode.value
            }

            const editor = ref()

            const handleUpdate = () => {
                entity.value.attributes.description = content.value
                body.value.entities = [entity.value]
                mutate()
            }

            const handleCancel = () => {
                if (editor.value) {
                    console.log(readme.value)
                    console.log(description(readme.value))
                    editor.value.resetEditor(description(readme?.value))
                }
                isEditMode.value = false
            }
            const entity = ref({
                typeName: 'Readme',
                attributes: {
                    qualifiedName: `${asset?.value?.guid}/readme`,
                    name: `Readme`,
                },
                relationshipAttributes: {
                    asset: {
                        guid: asset?.value?.guid,
                        typeName: asset?.value?.typeName,
                    },
                },
            })

            const body = ref({
                entities: [],
            })

            const {
                data,
                mutate,
                isLoading: isAssetUpdateLoading,
                error: isAssetUpdateError,
            } = updateAsset(body)

            watch(data, () => {
                if (data.value?.mutatedEntities?.CREATE?.length > 0) {
                    readme.value = data.value?.mutatedEntities?.CREATE[0]
                    asset.value.readme = {
                        guid: readme.value?.guid,
                    }
                    handleCancel()
                } else if (data.value?.mutatedEntities?.UPDATE?.length > 0) {
                    readme.value.attributes.description =
                        data.value?.mutatedEntities?.UPDATE[0].attributes?.description
                    isEditMode.value = false
                } else {
                    isEditMode.value = false
                }
            })

            return {
                isLoading,
                isEdit,
                content,
                readme,
                handleUpdate,
                isEditMode,
                handleEditMode,
                handleCancel,
                editor,
                isAssetUpdateLoading,
                entity,
                isAssetUpdateError,
                guid,
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
