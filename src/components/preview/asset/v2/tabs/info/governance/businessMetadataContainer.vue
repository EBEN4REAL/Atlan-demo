<template>
    <div class="mt-3 text-sm text-gray-500">
        <p class="flex justify-between mb-2 text-sm tracking-wide">
            <span
                >Custom Metadata&nbsp;
                <span
                    v-if="
                        attributesList.length &&
                        attributesList.filter(
                            (bmCol) =>
                                bmCol.attributes && bmCol.attributes.length
                        ).length
                    "
                >
                    ({{ attributesList.length }})
                </span>
                <fa
                    v-if="updateBmAttributesStatus === 'loading'"
                    icon="fal circle-notch spin"
                    class="ml-2 mr-1 animate-spin text-grey-600" />
                <fa
                    v-else-if="updateBmAttributesStatus === 'failed'"
                    icon="fal times"
                    class="ml-2 mr-1 text-red-600" />
                <fa
                    v-else-if="updateBmAttributesStatus === 'success'"
                    icon="fal check"
                    class="ml-2 mr-1 text-green-600"
            /></span>
            <span
                class="pr-2 mr-1 text-xs cursor-pointer hover:text-blue-900"
                @click.stop.prevent="visibility = true"
                >+ Add</span
            >
        </p>
        <a-popover
            v-model:visible="visibility"
            placement="left"
            trigger="none"
            title="Create Custom Metadata Widget"
        >
            <template #content>
                <div
                    class="flex flex-col p-2 overflow-y-auto"
                    style="width: 280px; height: 200px"
                >
                    <p class="mb-1 text-sm text-gray">
                        Select Custom Metadata
                    </p>
                    <a-select
                        v-model:value="addBusinessMetadata"
                        placeholder="Custom Metadata"
                        allow-clear
                        mode="multiple"
                        :options="addBMSelectOptions"
                    />
                    <p class="mt-2 text-xs text-gray">
                        Can't find the right Custom Metadata to add, create a
                        new Custom Metadata from
                        <router-link to="/admin/custom-metadata"
                            >here</router-link
                        >
                    </p>
                    <div
                        class="absolute flex p-2 space-x-2 border-t border-gray-100  bottom-1 right-3"
                    >
                        <a-button size="small" @click="visibility = false"
                            >Cancel</a-button
                        >
                        <a-button
                            type="primary"
                            size="small"
                            :disabled="!addBusinessMetadata.length"
                            @click="handleAddWidget"
                            >Done</a-button
                        >
                    </div>
                </div>
            </template>
            <div class="px-2 py-1">
                <p
                    v-if="!attributesList.length"
                    class="mb-0 text-sm text-gray-500"
                >
                    No Custom Metadata Added.
                </p>
                <div style="max-height: 300px" class="pr-2 overflow-auto">
                    <BusinessMetadataWidget
                        v-for="(bm, x) in attributesList"
                        :key="x"
                        :class="x !== attributesList.length ? 'mb-2' : ''"
                        :bm="bm"
                        :original-b-m="getBMbyName(bm.bm)"
                        :asset-type="selectedAsset.typeName"
                        @updateAttribute="handleUpdateAttribute"
                    />
                </div>
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { ref, defineComponent, computed, watch, onMounted } from 'vue'
    import BusinessMetadataWidget from '@/common/businessMetadataWidget.vue'
    import { BusinessMetadataService } from '~/api/atlas/businessMetadata'

    // ? Store
    import { useBusinessMetadataStore } from '~/store/businessMetadata'
    import { State } from '~/store/businessMetadata/state'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { BusinessMetadataWidget },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props, context) {
            const store = useBusinessMetadataStore()
            const attributesList = ref([])
            const originalBmAttributesList = ref([])
            const updateBmAttributesStatus = ref('')
            const isEditBusinessMetadata = ref(false)
            const accessLevel = ref('editor')
            const visibility = ref(false)
            const addBusinessMetadata = ref([])

            // * Computed
            const businessMetadataList = computed(
                () => store.getBusinessMetadataList
            )

            const availableBM = computed(() => {
                if (businessMetadataList.value) {
                    return businessMetadataList.value.filter((bm) => {
                        if (
                            attributesList.value.find((b) => bm.name === b.bm)
                        ) {
                            return false
                        }
                        return true
                    })
                }
            })

            const addBMSelectOptions = computed(() =>
                availableBM.value.map((b) => ({
                    value: b.name,
                    title: b.options.displayName,
                }))
            )

            // ? Methods
            // ! NO longer need
            const handleMissingDisplayNameKey = (
                BMlist:
                    | (object[] & ((state: State) => object[] | null))
                    | { attributeDefs: object[] }[]
            ) =>
                BMlist.map((bm) => ({
                    ...bm,
                    attributeDefs: bm.attributeDefs.map(
                        (a: {
                            options: { displayName: string }
                            name: string
                        }) => ({
                            ...a,
                            options: {
                                ...a.options,
                                displayName: a.options.displayName || a.name,
                            },
                        })
                    ),
                }))

            /**
             * @param {Object} updateBM BM object from widget for operation
             * @return {Obeect} formatted BM object supported by api
             */
            const getUpdatePayload = (updateBM: { bm: string }) => {
                let mappedBM = {}
                const finalBM = attributesList.value.map((bm) => {
                    if (bm.bm === updateBM.bm) return updateBM
                    return bm
                })

                finalBM.forEach((bm) => {
                    mappedBM = {
                        ...mappedBM,
                        [bm.bm]: {},
                    }
                    bm.attributes.forEach(
                        (attr: {
                            name: string
                            typeName: string
                            value: string
                        }) => {
                            mappedBM[bm.bm] = {
                                ...mappedBM[bm.bm],
                                [attr.name]:
                                    attr.typeName === 'date'
                                        ? parseInt(attr.value, 10)
                                        : attr.value,
                            }
                        }
                    )
                })
                return mappedBM
            }

            /**
             * @desc parses all the attached bm from the asset payload and forms the initial attribute list
             */
            const setAttributesList = () => {
                // Setting attributesList
                if (props.selectedAsset && props.selectedAsset.attributes) {
                    Object.keys(props.selectedAsset.attributes).forEach(
                        (attributeKey) => {
                            if (attributeKey.split('.').length > 1) {
                                const foundBmFromList =
                                    handleMissingDisplayNameKey(
                                        businessMetadataList.value
                                    ).find(
                                        (bm) =>
                                            bm.name ===
                                            attributeKey.split('.')[0]
                                    )
                                const foundAttributeFromList =
                                    foundBmFromList &&
                                    foundBmFromList.attributeDefs
                                        ? foundBmFromList.attributeDefs.find(
                                              (attr: { name: string }) =>
                                                  attr.name ===
                                                  attributeKey.split('.')[1]
                                          )
                                        : null
                                if (
                                    foundBmFromList &&
                                    attributesList.value &&
                                    attributesList.value.find(
                                        (attr) =>
                                            attr.bm === foundBmFromList.name
                                    )
                                ) {
                                    if (
                                        attributesList.value.length &&
                                        attributesList.value.findIndex(
                                            (a) =>
                                                a.bm ===
                                                attributeKey.split('.')[0]
                                        ) > -1
                                    ) {
                                        const foundAttributeIndex =
                                            attributesList.value.findIndex(
                                                (a) =>
                                                    a.bm ===
                                                    attributeKey.split('.')[0]
                                            )
                                        if (
                                            attributesList.value[
                                                foundAttributeIndex
                                            ].attributes &&
                                            !attributesList.value[
                                                foundAttributeIndex
                                            ].attributes.find(
                                                (attr: { name: string }) =>
                                                    attr.name ===
                                                    attributeKey.split('.')[1]
                                            )
                                        ) {
                                            // eslint-disable-next-line
                                            attributesList.value[
                                                foundAttributeIndex
                                            ].attributes.push({
                                                ...(foundAttributeFromList ||
                                                    {}),
                                                name: attributeKey.split(
                                                    '.'
                                                )[1],
                                                value:
                                                    foundAttributeFromList &&
                                                    foundAttributeFromList.typeName ===
                                                        'date'
                                                        ? parseInt(
                                                              props
                                                                  .selectedAsset
                                                                  .attributes[
                                                                  attributeKey
                                                              ],
                                                              10
                                                          )
                                                        : props.selectedAsset
                                                              .attributes[
                                                              attributeKey
                                                          ],
                                            })
                                        }
                                    }
                                } else {
                                    // eslint-disable-next-line
                                    attributesList.value.push({
                                        bm: attributeKey.split('.')[0],
                                        displayName:
                                            foundBmFromList.options.displayName,
                                        isNew: false,
                                        attributes: [
                                            {
                                                ...(foundAttributeFromList ||
                                                    {}),
                                                name: attributeKey.split(
                                                    '.'
                                                )[1],
                                                options: {
                                                    ...foundAttributeFromList.options,
                                                    displayName:
                                                        foundAttributeFromList
                                                            .options
                                                            .displayName ||
                                                        attributeKey.split(
                                                            '.'
                                                        )[1],
                                                },
                                                value:
                                                    foundAttributeFromList &&
                                                    foundAttributeFromList.typeName ===
                                                        'date'
                                                        ? parseInt(
                                                              props
                                                                  .selectedAsset
                                                                  .attributes[
                                                                  attributeKey
                                                              ],
                                                              10
                                                          )
                                                        : props.selectedAsset
                                                              .attributes[
                                                              attributeKey
                                                          ],
                                            },
                                        ],
                                    })
                                }
                            }
                        }
                    )
                }
            }

            const handleAddWidget = () => {
                addBusinessMetadata.value.forEach((b) => {
                    attributesList.value.push({
                        attributes: [],
                        bm: b,
                        isNew: true,
                    })
                })
                visibility.value = false
                addBusinessMetadata.value = []
            }

            /**
             * Find the required from the BM List and return
             * @param  {String} name Name of the required BM
             * @return {Object}  The required BM or null
             */
            const getBMbyName = (name: string) => {
                const requiredBM = businessMetadataList.value.find(
                    (bm: object) => name === bm.name
                )
                return requiredBM || null
            }

            /** @param {Object} value - object of the BM with attrs to get updated of an widget
             * @desc makes api call to update, also updates the local list
             */
            const handleUpdateAttribute = (value: object) => {
                // ? remove empty widget if newly added without making network call
                const bmExists = attributesList.value.find(
                    (b) => b.bm === value.bm
                )
                if (
                    value.isNew &&
                    !value.attributes.length &&
                    !bmExists.attributes.length
                ) {
                    attributesList.value = attributesList.value.filter(
                        (b) => value.bm !== b.bm
                    )
                    return
                }

                // ? compute the payload
                updateBmAttributesStatus.value = 'loading'
                const { error, isReady, isLoading } =
                    BusinessMetadataService.saveAssetBMUpdateChanges(
                        props.selectedAsset.guid,
                        ref(getUpdatePayload(value))
                    )

                watch([() => isLoading.value, error, isReady], (n) => {
                    if (isLoading.value) {
                        updateBmAttributesStatus.value = 'loading'
                    } else if (error.value) {
                        updateBmAttributesStatus.value = 'failed'
                    } else if (isReady.value) {
                        updateBmAttributesStatus.value = 'success'
                        // * add new value of the attribute to state if success update
                        const index = attributesList.value.findIndex(
                            (a) => a.bm === value.bm
                        )
                        if (index > -1 && value.attributes.length) {
                            attributesList.value[index] = value
                        } else {
                            // ? if remove a BM completely, delete the bm from list
                            attributesList.value = attributesList.value.filter(
                                (b) => value.bm !== b.bm
                            )
                        }

                        setTimeout(async () => {
                            // await this.refreshAssetInAssetsList(this.asset.guid);
                            updateBmAttributesStatus.value = ''
                            // this.originalBmAttributesList = JSON.parse(
                            //   JSON.stringify(this.attributesList)
                            // );
                        }, 1000)
                    }
                })
            }

            onMounted(() => {
                setAttributesList()
            })

            return {
                attributesList,
                originalBmAttributesList,
                updateBmAttributesStatus,
                isEditBusinessMetadata,
                accessLevel,
                availableBM,
                handleUpdateAttribute,
                getBMbyName,
                handleAddWidget,
                visibility,
                addBMSelectOptions,
                addBusinessMetadata,
            }
        },
    })
</script>

<style scoped></style>
