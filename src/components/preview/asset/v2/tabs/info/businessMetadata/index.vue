<template>
    <div class="px-5 py-2">
        <div
            v-for="(a, x) in applicableList"
            :key="x"
            class="flex gap-6 mb-4 gap-y-0 group"
        >
            <div class="w-40 font-bold text-gray-500">
                {{ a.options.displayName }}
            </div>
            <div class="flex items-center flex-grow w-1">
                <a-input
                    v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
                    v-model:value="a.value"
                    class="flex-grow border shadow-none"
                    type="number"
                    placeholder="Type..."
                    @input="() => debounce(() => updateAttribute(x), 800)"
                />
                <a-radio-group
                    v-else-if="getDatatypeOfAttribute(a.typeName) === 'boolean'"
                    :value="a.value"
                    class="flex-grow"
                    @change="(e) => handleChange(x, e.target.value)"
                >
                    <a-radio class="" :value="true">True</a-radio>
                    <a-radio class="" :value="false">False</a-radio>
                </a-radio-group>
                <template
                    v-else-if="getDatatypeOfAttribute(a.typeName) === 'date'"
                >
                    <a-date-picker
                        :allowClear="false"
                        :value="(a.value || '').toString()"
                        class="flex-grow w-100"
                        value-format="x"
                        @change="
                            (timestamp, string) => handleChange(x, timestamp)
                        "
                    />
                </template>
                <a-textarea
                    :id="`${x}`"
                    v-else
                    :auto-size="true"
                    v-model:value="a.value"
                    placeholder="Type..."
                    type="text"
                    ref="text"
                    class="flex-grow shadow-none border-1"
                    @input="() => debounce(() => updateAttribute(x), 800)"
                />
                <div class="flex flex-none w-4 col-span-1 ml-3">
                    <template v-if="loading !== '' && activeIndex === x">
                        <fa
                            v-if="loading === 'loading' || true"
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
                    <div
                        v-if="a?.value?.toString() && loading === ''"
                        class="col-span-1 text-gray-500 opacity-0 cursor-pointer  group-hover:opacity-100 hover:font-bold"
                        @click.stop.prevent="
                            () => {
                                a.value = ''
                                updateAttribute(x)
                            }
                        "
                    >
                        <!-- Clear -->
                        <AtlanIcon icon="Cancel" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        onMounted,
        computed,
        watch,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import { BusinessMetadataService } from '~/api/atlas/businessMetadata'

    export default defineComponent({
        name: 'BusinessMetadataListItem',
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
            } = useBusinessMetadataHelper()

            const applicableList = ref(
                getApplicableAttributes(
                    props.item.id,
                    props.selectedAsset.typeName
                )
            )

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
                let mappedPayload = {}
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
                    .filter((a) => a.value === 0 || a.value)
                    .forEach((at) => {
                        if (!mappedPayload[props.item.id])
                            mappedPayload[props.item.id] = {}
                        mappedPayload[props.item.id][at.name] = at.value
                    })

                return mappedPayload
            })
            const text = ref(null)

            const loading = ref('')
            const activeIndex = ref(null)
            const updateAttribute = (index) => {
                const i = document.getElementById('7')
                console.log(text.value, i)
                activeIndex.value = index
                loading.value = 'loading'
                const { error, isReady, isLoading } =
                    BusinessMetadataService.saveAssetBMUpdateChanges(
                        props.selectedAsset.guid,
                        payload.value
                    )

                watch([() => isLoading.value, error, isReady], (n) => {
                    if (isLoading.value) {
                        loading.value = 'loading'
                    } else if (error.value) {
                        loading.value = 'failed'
                    } else if (isReady.value) {
                        loading.value = 'success'

                        setTimeout(async () => {
                            // await this.refreshAssetInAssetsList(this.asset.guid);
                            loading.value = ''
                            // this.originalBmAttributesList = JSON.parse(
                            //   JSON.stringify(this.attributesList)
                            // );
                        }, 1000)
                    }
                })
            }

            const handleChange = (index, value) => {
                applicableList.value[index].value = value
                updateAttribute(index)
            }

            setAttributesList()

            return {
                getDatatypeOfAttribute,
                applicableList,
                updateAttribute,
                loading,
                handleChange,
                activeIndex,
                text,
                debounce: createDebounce(),
            }
        },
    })
</script>

<style>
    .ant-calendar-picker-input {
        /* width: 170px; */
    }
</style>
