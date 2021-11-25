<template>
    <div v-if="loading" class="flex items-center justify-center w-full h-full">
        <AtlanIcon icon="Loader" class="w-auto h-8 animate-spin" />
    </div>
    <div
        v-else
        class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-5"
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
            <div
                class="gap-6 gap-y-0 group"
                :class="
                    getDatatypeOfAttribute(a) === 'text' && !readOnly
                        ? ''
                        : 'mb-4'
                "
            >
                <div class="mb-2 font-normal text-gray-500">
                    <span>{{ a.displayName }}</span>
                    <a-tooltip>
                        <template #title>
                            <span>{{ a.options.description }}</span>
                        </template>
                        <AtlanIcon
                            v-if="a.options.description"
                            class="inline h-4 mb-1 ml-2 text-gray-400  hover:text-gray-500"
                            icon="Info"
                        />
                    </a-tooltip>
                </div>

                <div
                    v-if="readOnly"
                    class="flex items-center self-start flex-grow break-all"
                >
                    <a
                        v-if="a?.options?.customType === 'url'"
                        class="font-bold text-primary"
                        target="_blank"
                        :href="`//${a.value}`"
                    >
                        {{ a.value || '-' }}</a
                    >
                    <span v-else class="font-bold text-gray-700">
                        {{
                            formatDisplayValue(
                                a.value?.toString() || '',
                                getDatatypeOfAttribute(a)
                            ) || '-'
                        }}</span
                    >
                </div>
                <div v-else class="flex self-start flex-grow">
                    <a-input
                        v-if="getDatatypeOfAttribute(a) === 'number'"
                        v-model:value="a.value"
                        :allow-clear="true"
                        class="flex-grow border shadow-none"
                        type="number"
                        placeholder="Type..."
                        @change="(e) => handleChange(x, e.target.value)"
                    />
                    <a-input
                        v-if="getDatatypeOfAttribute(a) === 'url'"
                        v-model:value="a.value"
                        :allow-clear="true"
                        class="flex-grow border shadow-none"
                        type="url"
                        placeholder="Type..."
                        @change="(e) => handleChange(x, e.target.value)"
                    />
                    <a-radio-group
                        v-else-if="getDatatypeOfAttribute(a) === 'boolean'"
                        :allow-clear="true"
                        :value="a.value"
                        class="flex-grow"
                        @change="(e) => handleChange(x, e.target.value)"
                    >
                        <a-radio class="" :value="true">Yes</a-radio>
                        <a-radio class="" :value="false">No</a-radio>
                    </a-radio-group>
                    <template v-else-if="getDatatypeOfAttribute(a) === 'date'">
                        <a-date-picker
                            :allow-clear="true"
                            :value="(a.value || '').toString()"
                            class="flex-grow w-100"
                            value-format="x"
                            @change="(e) => handleChange(x, e.target.value)"
                        />
                    </template>
                    <a-textarea
                        v-else-if="getDatatypeOfAttribute(a) === 'text'"
                        v-model:value="a.value"
                        :allow-clear="true"
                        :auto-size="true"
                        :show-count="parseInt(a.options.maxStrLength) < 1000"
                        :maxlength="parseInt(a.options.maxStrLength)"
                        placeholder="Type..."
                        type="text"
                        class="flex-grow shadow-none"
                        @change="(e) => handleChange(x, e.target.value)"
                    />
                    <div v-else class="flex-grow shadow-none border-1">
                        <a-select
                            v-model:value="a.value"
                            :allow-clear="true"
                            placeholder="Unassigned"
                            style="width: 100%"
                            :show-arrow="true"
                            :options="getEnumOptions(a)"
                            class=""
                            @change="(e) => handleChange(x, e.target.value)"
                        />
                    </div>
                </div>
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
        computed,
        PropType,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import { Types } from '~/services/meta/types/index'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {},
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
                            const value = selectedAsset.value.attributes[ab]
                            const attrIndex = applicableList.value.findIndex(
                                (a) => a.name === attribute
                            )
                            if (attrIndex > -1)
                                applicableList.value[attrIndex].value = value
                        }
                    })
                }
                console.log(applicableList.value)
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
                applicableList.value
                    .filter((a) => a.value === 0 || a?.value?.toString())
                    .forEach((at) => {
                        mappedPayload[data.value.id][at.name] = at.value
                    })

                return mappedPayload
            }

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
                    }
                })

                readOnly.value = true
            }
            const handleCancel = () => {
                setAttributesList()
                readOnly.value = true
            }
            const handleChange = (index, value) => {
                applicableList.value[index].value = value
            }

            watch(
                () => selectedAsset.value.guid,
                () => {
                    applicableList.value = getApplicableAttributes(
                        data.value,
                        selectedAsset.value.typeName
                    )
                    setAttributesList()
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
            }
        },
    })
</script>
