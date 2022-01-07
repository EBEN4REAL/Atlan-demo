<template>
    <div class="relative">
        <div
            class="flex items-start justify-between px-4 pb-4 bg-white border-b pt-7"
        >
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <AvatarUpdate :metadata="localBm" />
                    <div class="text-xl">
                        {{ localBm.displayName }}
                    </div>
                </div>
                <div>
                    <p class="text-gray-500">{{ localBm.description }}</p>
                </div>
            </div>
            <div class="flex items-center">
                <MetadataHeaderButton
                    :metadata="localBm"
                    :allow-delete="allowDelete"
                    :assetCount="assetCount"
                />
            </div>
        </div>
        <div
            class="px-4 pb-8 overflow-y-auto"
            style="height: calc(100vh - 145px)"
        >
            <div class="flex items-start justify-between py-3">
                <CreateUpdateInfo
                    :created-at="localBm.createTime"
                    :updated-at="localBm.updateTime"
                    :created-by="localBm.createdBy"
                    :updated-by="localBm.updatedBy"
                />
            </div>
            <div v-if="localBm.attributeDefs.length" class="pt-2 pb-5">
                <div
                    class="sticky top-0 z-10 flex items-center justify-between py-3 mb-4 bg-primary-light"
                >
                    <div class="mr-4">
                        <div
                            class="relative flex items-stretch w-full overflow-hidden"
                        >
                            <a-input
                                v-model:value="attrsearchText"
                                class="w-full h-8 px-2 pl-2"
                                :placeholder="'Search for property'"
                            >
                                <template #suffix>
                                    <AtlanIcon
                                        v-if="!attrsearchText"
                                        icon="Search"
                                        class="h-4"
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
                    <a-button
                        v-auth="map.UPDATE_BUSINESS_METADATA"
                        class=""
                        type="primary"
                        @click="addPropertyDrawer.open(null, false)"
                    >
                        Add property
                    </a-button>
                </div>
                <div v-if="!searchedAttributeList.length" class="mt-40">
                    <a-empty
                        :image="noPropertyImage"
                        :image-style="{
                            height: '115px',
                            display: 'flex',
                            justifyContent: 'center',
                        }"
                    >
                        <template #description>
                            <!-- <p
                            v-if="checkAccess(map.UPDATE_BUSINESS_METADATA)"
                            class="font-bold"
                        >
                            Start adding properties
                        </p>-->
                            <p>No properties found</p>
                        </template>

                        <Button class="mx-auto" @click="attrsearchText = ''"
                            >Clear Search</Button
                        >
                    </a-empty>
                </div>
                <PropertyList
                    v-else
                    :metadata="localBm"
                    :properties="searchedAttributeList"
                    @remove-property="handleRemoveAttribute"
                    :selected="selected"
                    @open-edit-drawer="openEdit"
                />
            </div>
            <div v-else class="flex items-center justify-center h-full">
                <a-empty
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
                </a-empty>
            </div>
        </div>
    </div>
    <AddPropertyDrawer
        ref="addPropertyDrawer"
        :metadata="cleanLocalBm"
        @added-property="handlePropertyUpdate"
    />
</template>
<script lang="ts">
    import { defineComponent, ref, computed, onMounted, watch, Ref } from 'vue'

    // ? Components
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import MetadataHeaderButton from './metadataHeaderButton.vue'
    import AddPropertyDrawer from './propertyDrawer.vue'
    import noPropertyImage from '~/assets/images/admin/no-property.png'
    import PropertyList from './propertyList.vue'
    import AvatarUpdate from './avatarUpdate.vue'

    import getAssetCount from '@/governance/custom-metadata/composables/getAssetCount'

    // ? Store
    import { useTypedefStore } from '~/store/typedef'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'
    import Button from '@/UI/button.vue'

    export default defineComponent({
        components: {
            Button,
            CreateUpdateInfo,
            MetadataHeaderButton,
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
                    return localBm.value.attributeDefs.filter(
                        (attr: { name: string }) =>
                            attr.displayName
                                .toUpperCase()
                                .includes(attrsearchText.value.toUpperCase())
                    )
                }
                return localBm.value.attributeDefs
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
                    // clean allowFiltering, allowSearch, allowMultiple
                    tempBM.attributeDefs[index].options.allowSearch =
                        x.options.allowSearch === 'true'
                    tempBM.attributeDefs[index].options.allowFiltering =
                        x.options.allowFiltering === 'true'
                    tempBM.attributeDefs[index].options.multiValueSelect =
                        x.options.multiValueSelect === 'true'
                })
                return tempBM
            })

            // computes is search has a text
            const searchedAttributeList = computed(() =>
                attrsearchText.value
                    ? searchedAttributes.value
                    : localBm.value.attributeDefs
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

            return {
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
            }
        },
        data() {
            return {
                noPropertyImage,
            }
        },
    })
</script>
