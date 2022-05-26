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

        <div class="p-6 space-y-5" style="height: calc(100vh - 9.5rem)">
            <template v-if="localBm.attributeDefs.length">
                <div
                    v-if="finalAttributeList.length"
                    class="pt-4 space-y-4 bg-white rounded-lg"
                >
                    <div
                        class="sticky top-0 z-10 flex items-center justify-between px-4"
                    >
                        <div class="mr-4">
                            <div
                                class="relative flex items-stretch w-full overflow-hidden"
                            >
                                <a-input
                                    v-model:value="attrsearchText"
                                    class="h-8 px-2 pl-2 border border-gray-300 rounded-lg shadow-none w-80"
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
                        <!-- TODO dont allow delete for internal -->
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
                        @archive-property="archiveAttribute"
                        @open-edit-drawer="openEdit"
                    />
                </div>
                <template v-if="archivedAttributeList.length">
                    <div class="pt-4 space-y-4 bg-white rounded-lg">
                        <div class="px-4 text-gray-500 uppercase">
                            deleted properties
                        </div>
                        <ArchivedPropertyList
                            :metadata="localBm"
                            :properties="archivedAttributeList"
                            :selected="selected"
                            @archive-property="archiveAttribute"
                            @open-edit-drawer="openEdit"
                        />
                    </div>
                </template>
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
            </div>
        </div>
    </div>
    <AddPropertyDrawer
        ref="addPropertyDrawer"
        :metadata="cleanLocalBm"
        @added-property="handlePropertyUpdate"
        @openDirection="openDirection"
    />
</template>
<script lang="ts">
    import { defineComponent, ref, computed, onMounted, watch, Ref } from 'vue'

    // ? Components
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import MetadataHeaderButton from './metadataHeaderButton.vue'
    import AddPropertyDrawer from './propertyDrawer/propertyDrawer.vue'
    import noPropertyImage from '~/assets/images/admin/no-property.png'
    import PropertyList from '@/governance/custom-metadata/properties/propertyList.vue'
    import ArchivedPropertyList from '@/governance/custom-metadata/properties/archivedPropertyList.vue'
    import AvatarUpdate from './avatarUpdate.vue'

    import getAssetCount from '@/governance/custom-metadata/composables/getAssetCount'
    import InternalCMBanner from '@/common/customMetadata/internalCMBanner.vue'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'

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
            ArchivedPropertyList,
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
                    (a) => !['true', true].includes(a.options.isArchived)
                )
            )
            const archivedAttributeList = computed(() =>
                (localBm.value.attributeDefs ?? [])
                    .filter((a) =>
                        ['true', true].includes(a.options.isArchived)
                    )
                    .map((attr) => ({
                        ...attr,
                        displayName: attr.displayName.split('-archived')[0],
                    }))
            )

            const attrsearchText = ref('')
            const panelModel = ref(1)
            const isUpdated = ref(false)
            const showArchiveMetadataModal = ref(false)
            const loading = ref(false)
            const error = ref('')
            const addPropertyDrawer = ref(null)

            /**
             * @param {Number} index - index of the newly added attribute
             * @desc removes newly added attribute if not saved
             */
            // TODO this function to remove attribute locally and also store
            const archiveAttribute = (index: number, attr: CMA) => {
                const tempAttributes = JSON.parse(
                    JSON.stringify(localBm.value.attributeDefs)
                )
                tempAttributes[index] = attr
                localBm.value.attributeDefs = tempAttributes
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

            const openEdit = ({ property, archived }) => {
                const index = cleanLocalBm.value.attributeDefs.findIndex(
                    (x) => x.name === property.name
                )
                addPropertyDrawer.value?.open(
                    archived
                        ? property
                        : cleanLocalBm.value.attributeDefs[index],
                    true,
                    index
                )
            }
            const openDirection = ({ name, direction, isArchived }) => {
                let property
                if (isArchived) {
                    const index = archivedAttributeList.value.findIndex(
                        (attr) => attr.name === name
                    )
                    if (index === -1) return
                    if (direction === 'next') {
                        if (index === archivedAttributeList.value.length - 1)
                            // eslint-disable-next-line prefer-destructuring
                            property = archivedAttributeList.value[0]
                        else property = archivedAttributeList.value[index + 1]
                    } else if (direction === 'previous') {
                        if (index)
                            // eslint-disable-next-line prefer-destructuring
                            property = archivedAttributeList.value[index - 1]
                        else
                            property =
                                archivedAttributeList.value[
                                    archivedAttributeList.value.length - 1
                                ]
                    }
                } else {
                    const index = searchedAttributeList.value.findIndex(
                        (attr) => attr.name === name
                    )
                    if (index === -1) return
                    if (direction === 'next') {
                        if (index === searchedAttributeList.value.length - 1)
                            // eslint-disable-next-line prefer-destructuring
                            property = searchedAttributeList.value[0]
                        else property = searchedAttributeList.value[index + 1]
                    } else if (direction === 'previous') {
                        if (index)
                            property = searchedAttributeList.value[index - 1]
                        else
                            property =
                                searchedAttributeList.value[
                                    searchedAttributeList.value.length - 1
                                ]
                    }
                }

                addPropertyDrawer.value?.open(property, true)
            }
            return {
                openDirection,
                selected,
                openEdit,
                allowDelete,
                assetCount,
                attrsearchText,
                error,
                archiveAttribute,
                isUpdated,
                loading,
                localBm,
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
                archivedAttributeList,
            }
        },
        data() {
            return {
                noPropertyImage,
            }
        },
    })
</script>
