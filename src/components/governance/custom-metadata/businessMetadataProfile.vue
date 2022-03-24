<template>
    <div class="relative">
        <div
            class="flex flex-col items-start justify-between px-8 pb-4 bg-white border-b pt-7 gap-y-2"
        >
            <div class="flex w-full text-xl">
                <div class="w-full text-xl">
                    <div class="flex gap-2 mb-2">
                        <AvatarUpdate :metadata="localBm" />
                        <div class="w-full">
                            <Truncate
                                class="mt-0.5"
                                :tooltip-text="localBm.displayName"
                                :rows="2"
                            />
                        </div>
                    </div>
                    <!-- <div>
                    <p class="text-gray-500">{{ localBm.description }}</p>
                </div> -->
                </div>
                <div class="flex items-center">
                    <MetadataHeaderButton
                        :metadata="localBm"
                        :allow-delete="allowDelete"
                        :asset-count="assetCount"
                    />
                </div>
            </div>
            <div class="flex items-start justify-between">
                <CreateUpdateInfo
                    :created-at="localBm.createTime"
                    :updated-at="localBm.updateTime"
                    :created-by="localBm.createdBy"
                    :updated-by="localBm.updatedBy"
                />
            </div>
        </div>

        <div class="p-6" style="height: calc(100vh - 9.5rem)">
            <template v-if="finalAttributeList.length">
                <div class="pt-4 space-y-4 bg-white rounded-lg">
                    <div
                        class="sticky top-0 z-10 flex items-center justify-between px-4"
                    >
                        <div class="mr-4">
                            <div
                                class="relative flex items-stretch w-full overflow-hidden"
                            >
                                <a-input
                                    v-model:value="attrsearchText"
                                    class="h-8 px-2 pl-2 border border-gray-300 rounded-lg w-80"
                                    :placeholder="`Search from ${finalAttributeList.length} properties`"
                                >
                                    <template #prefix>
                                        <AtlanIcon
                                            v-if="!attrsearchText"
                                            icon="Search"
                                            class="h-4 border-gray-500"
                                        />
                                        <AtlanIcon
                                            v-else
                                            icon="Cancel"
                                            class="h-3 text-gray-500"
                                            @click="attrsearchText = ''"
                                        />
                                    </template>
                                </a-input>
                            </div>
                        </div>
                        <template
                            v-if="
                                ['true', true].includes(
                                    localBm.options?.isLocked
                                )
                            "
                        >
                            <div
                                class="flex items-center p-2 text-xs rounded gap-x-2 bg-primary-light text-primary"
                            >
                                <InternalCMBanner />
                            </div>
                        </template>
                        <a-button
                            v-else
                            v-auth="map.UPDATE_BUSINESS_METADATA"
                            class=""
                            type="primary"
                            @click="addPropertyDrawer?.open(null, false)"
                        >
                            Add property
                        </a-button>
                    </div>
                    <div
                        v-if="!searchedAttributeList.length"
                        class="flex flex-col items-center justify-center space-y-8"
                        style="height: calc(100vh - 16.3rem)"
                    >
                        <AtlanIcon icon="NoProperty" class="h-40" />
                        <p>
                            {{ `No properties found for "${attrsearchText}"` }}
                        </p>

                        <AtlanButton2
                            class="mx-auto"
                            size="large"
                            label="Clear Search"
                            @click="attrsearchText = ''"
                        />
                    </div>
                    <PropertyList
                        v-else
                        :metadata="localBm"
                        :properties="searchedAttributeList"
                        :selected="selected"
                        @remove-property="handleRemoveAttribute"
                        @open-edit-drawer="openEdit"
                    />
                </div>
            </template>
            <div
                v-else
                class="flex flex-col items-center justify-center h-full gap-y-8"
            >
                <AtlanIcon icon="NoProperty" class="h-52" />
                <div class="flex flex-col items-center gap-y-1">
                    <template v-if="checkAccess(map.UPDATE_BUSINESS_METADATA)">
                        <span class="font-bold text-center">
                            Start Creating Properties
                        </span>
                        <span class="text-base font-normal text-gray-500">
                            Create properties to manage custom fields
                        </span>
                    </template>
                    <p v-else>This custom metadata has no properties</p>

                    <AtlanButton2
                        v-auth="map.UPDATE_BUSINESS_METADATA"
                        color="primary"
                        label="New property"
                        class="mt-4"
                        @click="addPropertyDrawer.open(undefined, false)"
                    />
                </div>
                <!-- <a-empty
                    :image="noPropertyImage"
                    :image-style="{
                        height: '115px',
                        display: 'flex',
                        justifyContent: 'center',
                    }"
                >
                    <template #description>
                        <p
                            v-if="checkAccess(map.UPDATE_BUSINESS_METADATA)"
                            class="font-bold"
                        >
                            Start adding properties
                        </p>
                        <p v-else>This custom metadata has no properties</p>
                    </template>

                    <a-button
                        v-auth="map.UPDATE_BUSINESS_METADATA"
                        type="primary"
                        @click="addPropertyDrawer.open(undefined, false)"
                        ><AtlanIcon icon="Add" class="inline" /> Add property
                    </a-button>
                </a-empty> -->
            </div>
        </div>
    </div>
    <AddPropertyDrawer
        ref="addPropertyDrawer"
        :metadata="cleanLocalBm"
        @added-property="handlePropertyUpdate"
        @openIndex="openIndex"
    />
</template>
<script lang="ts">
    import { defineComponent, ref, computed, onMounted, watch, Ref } from 'vue'

    // ? Components
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import MetadataHeaderButton from './metadataHeaderButton.vue'
    import AddPropertyDrawer from './propertyDrawer/propertyDrawer.vue'
    import noPropertyImage from '~/assets/images/admin/no-property.png'
    import PropertyList from './propertyList.vue'
    import AvatarUpdate from './avatarUpdate.vue'

    import getAssetCount from '@/governance/custom-metadata/composables/getAssetCount'
    import InternalCMBanner from '@/common/customMetadata/internalCMBanner.vue'

    // ? Store
    import { useTypedefStore } from '~/store/typedef'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: {
            Truncate,
            CreateUpdateInfo,
            MetadataHeaderButton,
            InternalCMBanner,
            AddPropertyDrawer,
            PropertyList,
            AvatarUpdate,
        },
        props: {
            selectedBm: {
                type: Object,
                required: true,
            },
        },
        emits: ['update'],
        setup(props, context) {
            const store = useTypedefStore()
            const { checkAccess } = useAuth()
            // * Data
            const localBm = computed({
                get: () => props.selectedBm,
                set: (value) => {
                    store.updateCustomMetadata(value)
                },
            })
            // ? attribute list that is not- deprecated,
            const finalAttributeList = computed(() =>
                (localBm.value.attributeDefs ?? []).filter(
                    (a) => a.options.isDeprecated !== 'true'
                )
            )

            const attrsearchText = ref('')
            const panelModel = ref(1)
            const isUpdated = ref(false)
            const showArchiveMetadataModal = ref(false)
            const loading = ref(false)
            const error = ref('')
            const addPropertyDrawer = ref(null)

            const onUpdate = () => {
                isUpdated.value = true
                context.emit(
                    'update',
                    JSON.parse(JSON.stringify(localBm.value))
                )
            }

            /**
             * @param {Number} index - index of the newly added attribute
             * @desc removes newly added attribute if not saved
             */
            const handleRemoveAttribute = (index: number) => {
                const tempAttributes = JSON.parse(
                    JSON.stringify(localBm.value.attributeDefs)
                )
                tempAttributes.splice(index, 1)
                localBm.value.attributeDefs = tempAttributes
                onUpdate()
            }

            // * Computed

            const searchedAttributes = computed(() => {
                if (attrsearchText.value) {
                    return finalAttributeList.value.filter(
                        (attr: { name: string }) =>
                            attr.displayName
                                .toUpperCase()
                                .includes(attrsearchText.value.toUpperCase())
                    )
                }
                return finalAttributeList.value
            })

            // converts customApplicableEntityTypes from string to array so they can be set on the a-tree component
            const cleanLocalBm = computed(() => {
                const tempBM = JSON.parse(JSON.stringify(localBm.value))
                console.log(tempBM.attributeDefs)

                tempBM.attributeDefs.forEach((x, index) => {
                    if (x === null) console.log(x)

                    // clean attribute defs
                    if (
                        typeof x.options.customApplicableEntityTypes ===
                        'string'
                    ) {
                        tempBM.attributeDefs[
                            index
                        ].options.customApplicableEntityTypes = JSON.parse(
                            x.options.customApplicableEntityTypes
                        )
                    }
                    // clean allowFiltering, allowSearch, allowMultiple, showInOverview
                    tempBM.attributeDefs[index].options.allowSearch =
                        x.options.allowSearch === 'true'
                    tempBM.attributeDefs[index].options.allowFiltering =
                        x.options.allowFiltering === 'true'
                    tempBM.attributeDefs[index].options.showInOverview =
                        x.options.showInOverview === 'true'
                    tempBM.attributeDefs[index].options.multiValueSelect =
                        x.options.multiValueSelect === 'true'
                })
                return tempBM
            })

            // computes is search has a text
            const searchedAttributeList = computed(() =>
                attrsearchText.value
                    ? searchedAttributes.value
                    : finalAttributeList.value
            )

            const handlePropertyUpdate = ($event) => {
                localBm.value.attributeDefs = $event
            }

            const {
                count: assetCount,
                mutate,
                isReady,
            } = getAssetCount(localBm.value)

            if (localBm.value.attributeDefs?.length) mutate()

            const allowDelete = computed(() => {
                if (!localBm.value.attributeDefs?.length) return true
                return !assetCount.value
            })

            const selected = computed(() =>
                addPropertyDrawer.value?.visible
                    ? addPropertyDrawer.value?.form.name
                    : ''
            )

            const openEdit = ({ property, index }) => {
                addPropertyDrawer.value.open(
                    cleanLocalBm.value.attributeDefs.find(
                        (x) => x.name === property.name
                    ),
                    true,
                    index
                )
            }

            const openIndex = (i) => {
                if (i < 0 || i > addPropertyDrawer.value.length) return
                console.log('openIndex', i)
                addPropertyDrawer.value.open(
                    cleanLocalBm.value.attributeDefs[i],
                    true,
                    i
                )
            }
            return {
                openIndex,
                selected,
                openEdit,
                allowDelete,
                assetCount,
                attrsearchText,
                error,
                handleRemoveAttribute,
                isUpdated,
                loading,
                localBm,
                onUpdate,
                cleanLocalBm,
                panelModel,
                searchedAttributes,
                showArchiveMetadataModal,
                addPropertyDrawer,
                searchedAttributeList,
                handlePropertyUpdate,
                map,
                checkAccess,
                finalAttributeList,
            }
        },
        data() {
            return {
                noPropertyImage,
            }
        },
    })
</script>
