<template>
    <div class="m-4">
        <div
            v-for="(a, x) in applicableList"
            :key="x"
            class="flex justify-between mb-4"
        >
            <div>{{ a.options.displayName }}</div>
            <div class="">
                <a-input
                    v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
                    v-model:value="a.value"
                    class="px-2 mr-2 border shadow-none w-100"
                    type="number"
                    placeholder="Type..."
                    @input="() => debounce(() => updateAttribute(), 800)"
                />
                <a-radio-group
                    v-else-if="getDatatypeOfAttribute(a.typeName) === 'boolean'"
                    :value="a.value"
                    class=""
                    @change="(e) => handleChange(x, e.target.value)"
                >
                    <a-radio class="" :value="true">True</a-radio>
                    <a-radio class="" :value="false">False</a-radio>
                </a-radio-group>
                <span v-else-if="getDatatypeOfAttribute(a.typeName) === 'date'">
                    <a-date-picker
                        :value="(a.value || '').toString()"
                        value-format="x"
                        class="w-100"
                        style="width: 100%"
                        @change="
                            (timestamp, string) => handleChange(x, timestamp)
                        "
                    />
                </span>
                <a-input
                    v-else
                    v-model:value="a.value"
                    placeholder="Type..."
                    type="text"
                    class="px-2 mr-2 shadow-none border-1"
                    @input="() => debounce(() => updateAttribute(), 800)"
                />
            </div>
            <div
                class="text-gray-500 cursor-pointer  hover:font-bold group-hover:opacity-100"
            >
                Clear
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, onMounted, computed } from 'vue'
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
            const applicableList = ref(null)
            applicableList.value = getApplicableAttributes(
                props.item.id,
                props.selectedAsset.typeName
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
                        mappedPayload[props.item.id][at.name] = at.value
                    })

                return mappedPayload
            })

            const updateAttribute = () => {
                const { error, isReady, isLoading } =
                    BusinessMetadataService.saveAssetBMUpdateChanges(
                        props.selectedAsset.guid,
                        payload.value
                    )
            }

            const handleChange = (index, value) => {
                applicableList.value[index].value = value
                updateAttribute()
            }

            onMounted(() => {
                setAttributesList()
            })

            return {
                getDatatypeOfAttribute,
                applicableList,
                updateAttribute,

                handleChange,
                debounce: createDebounce(),
            }
        },
    })
</script>

<style scoped></style>
