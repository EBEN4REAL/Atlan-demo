<template>
    <div v-if="loading" class="flex items-center justify-center w-full h-full">
        <AtlanIcon icon="Loader" class="w-auto h-8 animate-spin" />
    </div>
    <div
        v-else
        class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-6"
    >
        <div class="flex items-center justify-between">
            <div class="font-semibold text-gray-500">{{ data.label }}</div>
            <div>
                <div
                    v-if="readOnly"
                    class="text-sm font-bold cursor-pointer text-primary"
                    @click="() => (readOnly = false)"
                >
                    Edit
                </div>
                <div v-else class="flex gap-x-2">
                    <div
                        class="text-sm font-medium text-gray-500 cursor-pointer"
                        @click="handleCancel"
                    >
                        Cancel
                    </div>
                    <div
                        class="text-sm font-bold cursor-pointer text-primary"
                        @click="handleUpdate"
                    >
                        Update
                    </div>
                </div>
            </div>
        </div>
        <div v-for="(a, x) in applicableList" :key="x">
            <div class="">
                <div class="mb-2 font-normal text-gray-500">
                    <span>{{ a.displayName }}</span>
                    <a-tooltip>
                        <template #title>
                            <span>{{ a.options.description }}</span>
                        </template>
                        <AtlanIcon
                            v-if="a.options.description"
                            class="h-4 mb-1 ml-2 text-gray-400 hover:text-gray-500"
                            icon="Info"
                        />
                    </a-tooltip>
                </div>

                <ReadOnly v-if="readOnly" :attribute="a" />

                <EditState
                    v-else
                    v-model="a.value"
                    :attribute="a"
                    @change="handleChange(x, a.value)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        watch,
        PropType,
        inject,
        defineAsyncComponent,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import { Types } from '~/services/meta/types/index'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import useFacetGroups from '~/composables/group/useFacetGroups'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'
    import { languageTokens } from '~/components/insights/playground/editor/monaco/sqlTokens'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {
            ReadOnly: defineAsyncComponent(() => import('./readOnly.vue')),
            EditState: defineAsyncComponent(() => import('./editState.vue')),
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset, data } = toRefs(props)

            const readOnly = ref(true)
            const loading = ref(false)
            const guid = ref()

            const { title } = useAssetInfo()
            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getApplicableAttributes,
                getEnumOptions,
            } = useCustomMetadataHelpers()

            const applicableList = ref(
                getApplicableAttributes(
                    data.value,
                    selectedAsset.value.typeName
                )
            )
            const payload = ref({})

            /**
             * @desc parses all the attached bm from the asset payload and
             *  forms the initial attribute list
             */
            const setAttributesList = () => {
                if (selectedAsset.value?.attributes) {
                    const bmAttributes = Object.keys(
                        selectedAsset.value.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    bmAttributes.forEach((ab) => {
                        if (data.value.id === ab.split('.')[0]) {
                            const attribute = ab.split('.')[1]

                            let value = selectedAsset.value.attributes[ab]
                            const attrIndex = applicableList.value.findIndex(
                                (a) => a.name === attribute
                            )
                            const options =
                                applicableList.value[attrIndex]?.options

                            if (attrIndex > -1) {
                                // !FIXME
                                if (
                                    // (options?.customType === 'users' ||
                                    //     options?.customType === 'groups' ||
                                    //     options?.isEnum === 'true') &&
                                    options?.multiValueSelect === 'true'
                                ) {
                                    value = value
                                        ?.replace(/\[|\]/g, '')
                                        .split(',')
                                        .map((v: string) => v.trim())
                                }
                                // else if (
                                //     options?.multiValueSelect === 'true'
                                // ) {
                                //     value = JSON.parse(value)
                                // }
                                applicableList.value[attrIndex].value = value
                            }
                        }
                    })
                }
            }

            // {"BM for facet 2":{"test for facet 2":"1","test for facet 2 date":1629294652575}}
            const payloadConstructor = () => {
                const mappedPayload = { [data.value.id]: {} }
                // ? handle current payload
                Object.keys(selectedAsset.value.attributes).forEach((k) => {
                    if (k.split('.').length > 1) {
                        const b = k.split('.')[0]
                        const a = k.split('.')[1]
                        const value = selectedAsset.value.attributes[k]
                        mappedPayload[b] = {
                            ...(mappedPayload[b] || {}),
                            [a]: value,
                        }
                    }
                })

                // ? handle new payload
                applicableList.value.forEach((at) => {
                    mappedPayload[data.value.id][at.name] = at.value
                })

                return mappedPayload
            }
            const { list: userList, handleSearch: handleUserSearch } =
                useFacetUsers()

            const userSearch = (val) => {
                handleUserSearch(val)
            }

            const { list: groupList, handleSearch: handleGroupSearch } =
                useFacetGroups()
            const groupSearch = (val) => {
                handleGroupSearch(val)
            }

            const {
                asset,
                mutate: mutateUpdate,
                isReady: isUpdateReady,
            } = useCurrentUpdate({
                id: guid,
            })

            const handleUpdate = () => {
                payload.value = payloadConstructor()

                const { error, isReady, isLoading } =
                    Types.updateAssetBMChanges(
                        selectedAsset.value?.guid,
                        payload.value
                    )
                loading.value = isLoading.value

                watch([() => isLoading, error, isReady], () => {
                    if (error.value) {
                        loading.value = false
                        message.error(
                            'Some error occured...Please try again later.'
                        )
                    } else if (isReady.value) {
                        loading.value = false
                        message.success(
                            `${data.value?.label} attributes for ${title(
                                selectedAsset.value
                            )} updated`
                        )
                        guid.value = selectedAsset.value.guid

                        mutateUpdate()
                    }
                })

                readOnly.value = true
            }

            const handleCancel = () => {
                applicableList.value.forEach((att) => {
                    att.value = ''
                })
                setAttributesList()

                readOnly.value = true
            }
            const handleChange = (index, value) => {
                applicableList.value[index].value = value
                console.log('hellooooo', index, value)
            }

            const updateList = inject('updateList')
            whenever(isUpdateReady, () => {
                if (
                    asset.value.typeName !== 'AtlasGlossary' &&
                    asset.value.typeName !== 'AtlasGlossaryCategory' &&
                    asset.value.typeName !== 'AtlasGlossaryTerm'
                ) {
                    updateList(asset.value)
                    setAttributesList()
                }
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    applicableList.value = getApplicableAttributes(
                        data.value,
                        selectedAsset.value.typeName
                    )
                },
                {
                    immediate: true,
                }
            )

            setAttributesList()

            return {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                applicableList,
                readOnly,
                handleUpdate,
                handleCancel,
                getEnumOptions,
                handleChange,
                loading,
                userSearch,
                userList,
                groupSearch,
                groupList,
            }
        },
    })
</script>
