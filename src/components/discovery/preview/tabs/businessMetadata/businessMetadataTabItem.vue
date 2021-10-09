<template>
    <div class="px-5 py-2">
        <div class="flex justify-end">
            <span
                class="text-sm font-bold cursor-pointer  ant-typography ant-typography-ellipsis ant-typography-single-line text-primary"
                @click="() => (readOnly = !readOnly)"
            >
                {{ readOnly ? 'Edit' : 'Done' }}
            </span>
        </div>
        <div v-for="(a, x) in applicableList" :key="x">
            <div
                class="gap-6 gap-y-0 group"
                :class="
                    a.error ||
                    (getDatatypeOfAttribute(a.typeName) === 'text' && !readOnly)
                        ? ''
                        : 'mb-4'
                "
            >
                <div class="mb-2 text-gray-700">
                    {{ a.options.displayName }}
                </div>

                <div
                    v-if="readOnly"
                    class="flex items-center self-start flex-grow break-all"
                >
                    <a
                        v-if="isLink(a.value, a.options.displayName)"
                        target="_blank"
                        :href="a.value"
                    >
                        {{ a.value || '-' }}</a
                    >
                    <span v-else>
                        {{
                            formatDisplayValue(
                                a.value?.toString() || '',
                                getDatatypeOfAttribute(a.typeName)
                            ) || '-'
                        }}</span
                    >
                </div>
                <div v-else class="flex self-start flex-grow">
                    <a-input
                        v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
                        v-model:value="a.value"
                        :allow-clear="true"
                        class="flex-grow border shadow-none"
                        type="number"
                        placeholder="Type..."
                        @input="() => debounce(() => updateAttribute(x), 800)"
                    />
                    <a-radio-group
                        v-else-if="
                            getDatatypeOfAttribute(a.typeName) === 'boolean'
                        "
                        :allow-clear="true"
                        :value="a.value"
                        class="flex-grow"
                        @change="(e) => handleChange(x, e.target.value)"
                    >
                        <a-radio class="" :value="true">True</a-radio>
                        <a-radio class="" :value="false">False</a-radio>
                    </a-radio-group>
                    <template
                        v-else-if="
                            getDatatypeOfAttribute(a.typeName) === 'date'
                        "
                    >
                        <a-date-picker
                            :allow-clear="true"
                            :value="(a.value || '').toString()"
                            class="flex-grow w-100"
                            value-format="x"
                            @change="
                                (timestamp, string) =>
                                    handleChange(x, timestamp)
                            "
                        />
                    </template>
                    <a-textarea
                        v-else-if="
                            getDatatypeOfAttribute(a.typeName) === 'text'
                        "
                        v-model:value="a.value"
                        :allow-clear="true"
                        :auto-size="true"
                        :show-count="true"
                        :maxlength="parseInt(a.options.maxStrLength)"
                        placeholder="Type..."
                        type="text"
                        class="flex-grow shadow-none"
                        @input="() => debounce(() => updateAttribute(x), 800)"
                    />
                    <div v-else class="flex-grow shadow-none border-1">
                        <a-select
                            v-model:value="a.value"
                            :allow-clear="true"
                            placeholder="Unassigned"
                            style="width: 100%"
                            :show-arrow="true"
                            class=""
                            :options="getEnumOptions(a.typeName)"
                            @change="updateAttribute(x)"
                        />
                    </div>
                    <div class="w-4 col-span-1 ml-3">
                        <template v-if="loading !== '' && activeIndex === x">
                            <fa
                                v-if="loading === 'loading'"
                                icon="fal circle-notch spin"
                                class="animate-spin text-grey-600"
                            />
                            <fa
                                v-else-if="loading === 'failed'"
                                icon="fal times"
                                class="text-red-600"
                            />
                            <fa
                                v-else-if="loading === 'success'"
                                icon="fal check"
                                class="text-green-600"
                            />
                        </template>
                    </div>
                </div>
            </div>
            <div v-if="a.error" class="pr-3 mb-4 text-warning">
                {{ a.error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        computed,
        watch,
        inject,
    } from 'vue'
    import useEnums from '@/admin/enums/composables/useEnums'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import { BusinessMetadataService } from '~/api/atlas/businessMetadata'

    export default defineComponent({
        name: 'BusinessMetadataListItem',
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const {
                getApplicableAttributes,
                getDatatypeOfAttribute,
                createDebounce,
                formatDisplayValue,
                isLink,
            } = useBusinessMetadataHelper()

            // eslint-disable-next-line no-unused-vars
            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset', () => {})

            const { enumListData: enumsList } = useEnums()

            const readOnly = ref(true)

            const applicableList = ref(
                getApplicableAttributes(
                    props.item.id,
                    props.selectedAsset.typeName
                )
            )

            const getEnumOptions = (enumName: string) => {
                if (enumsList.value.length) {
                    return (
                        enumsList.value
                            .find((e) => e.name === enumName)
                            ?.elementDefs.map((a) => ({
                                label: a.value,
                                value: a.value,
                            })) || []
                    )
                }
                return []
            }
            /**
             * @desc parses all the attached bm from the asset payload and
             *  forms the initial attribute list
             */
            const setAttributesList = () => {
                if (props?.selectedAsset?.attributes) {
                    const bmAttributes = Object.keys(
                        props.selectedAsset.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    bmAttributes.forEach((ab) => {
                        if (props.item.id === ab.split('.')[0]) {
                            const attribute = ab.split('.')[1]
                            const value = props.selectedAsset.attributes[ab]
                            const attrIndex = applicableList.value.findIndex(
                                (a) => a.name === attribute
                            )
                            if (attrIndex > -1)
                                applicableList.value[attrIndex].value = value
                        }
                    })
                }
            }

            // {"BM for facet 2":{"test for facet 2":"1","test for facet 2 date":1629294652575}}
            const payload = computed(() => {
                const mappedPayload = { [props.item.id]: {} }
                // ? handle current payload
                Object.keys(props.selectedAsset.attributes).forEach((k) => {
                    if (k.split('.').length > 1) {
                        const b = k.split('.')[0]
                        const a = k.split('.')[1]
                        const value = props.selectedAsset.attributes[k]
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
                        mappedPayload[props.item.id][at.name] = at.value
                    })

                return mappedPayload
            })

            const mutatedAsset = computed(() => {
                if (props?.selectedAsset?.attributes) {
                    // ? clean all bm attribute from
                    const tempAsset = JSON.parse(
                        JSON.stringify(props.selectedAsset)
                    )

                    const currentAttributes = Object.keys(
                        props.selectedAsset.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    currentAttributes.forEach(
                        (a) => delete tempAsset.attributes[a]
                    )

                    // ? add new payload attributes
                    const newAttributes = {}
                    Object.keys(payload.value).forEach((p) => {
                        Object.entries(payload.value[p]).forEach((e) => {
                            // eslint-disable-next-line prefer-destructuring
                            newAttributes[`${p}.${e[0]}`] = e[1]
                        })
                    })

                    return {
                        ...tempAsset,
                        attributes: {
                            ...tempAsset.attributes,
                            ...newAttributes,
                        },
                    }
                }
                return null
            })

            // const hasError = ref(false)
            const loading = ref('')
            const activeIndex = ref(null)
            const updateAttribute = (index) => {
                activeIndex.value = index
                loading.value = 'loading'
                const { error, isReady, isLoading } =
                    BusinessMetadataService.saveAssetBMUpdateChanges(
                        props.selectedAsset.guid,
                        payload.value
                    )

                watch([() => isLoading.value, error, isReady], () => {
                    if (isLoading.value) {
                        loading.value = 'loading'
                    } else if (error.value) {
                        loading.value = 'failed'
                        console.log(error.value.response.data.errorMessage)
                        let message =
                            error.value?.response?.data?.errorMessage || ''
                        if (message) message = message.split(':')
                        if (message?.length > 1)
                            applicableList.value[
                                index
                            ].error = `Error occured: ${
                                message[message.length - 1]
                            }`
                        else
                            applicableList.value[index].error =
                                'Some error occured please try again.'
                        // hasError.value = true
                    } else if (isReady.value) {
                        if (mutatedAsset.value)
                            mutateSelectedAsset(mutatedAsset.value)
                        loading.value = 'success'
                        applicableList.value[index].error = false
                        // hasError.value = false
                        setTimeout(async () => {
                            loading.value = ''
                        }, 1000)
                    }
                })
            }

            const handleChange = (index, value) => {
                applicableList.value[index].value = value
                updateAttribute(index)
            }

            watch(
                () => props.selectedAsset.guid,
                () => {
                    applicableList.value = getApplicableAttributes(
                        props.item.id,
                        props.selectedAsset.typeName
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
                applicableList,
                updateAttribute,
                loading,
                handleChange,
                activeIndex,
                payload,
                getEnumOptions,
                readOnly,
                formatDisplayValue,
                isLink,
                mutateSelectedAsset,
                mutatedAsset,
                debounce: createDebounce(),
            }
        },
    })
</script>

<style></style>
