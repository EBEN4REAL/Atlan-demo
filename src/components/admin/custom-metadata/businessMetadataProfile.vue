<template>
    <div class="relative">
        <div class="flex items-start justify-between px-4 py-3 border-b">
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
                <MetadataHeaderButton :metadata="localBm" />
            </div>
        </div>
        <div class="flex items-start justify-between px-4 py-3 border-b">
            <CreateUpdateInfo
                :created-at="localBm.createTime"
                :updated-at="localBm.updateTime"
                :created-by="localBm.createdBy"
                :updated-by="localBm.updatedBy"
            />
        </div>
        <div
            class="px-4 pt-3 pb-8 overflow-y-auto"
            style="height: calc(100% - 3rem)"
        >
            <div v-if="localBm.attributeDefs.length" class="py-5">
                <div class="flex items-center justify-between mb-4">
                    <div class="mr-4">
                        <div
                            class="relative flex items-stretch w-full overflow-hidden "
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
                                        class="h-4 text-red-600"
                                        @click="attrsearchText = ''"
                                    />
                                </template>
                            </a-input>
                        </div>
                    </div>
                    <a-button
                        variant="secondary"
                        class=""
                        @click="addPropertyDrawer.open(undefinded, false)"
                    >
                        Add property
                    </a-button>
                </div>
                <PropertyList
                    :metadata="localBm"
                    :properties="searchedAttributeList"
                    @changeOrder="localBm.attributeDefs = $event"
                    @removeProperty="handleRemoveAttribute"
                    @openEditDrawer="
                        addPropertyDrawer.open(
                            $event.property,
                            true,
                            $event.index
                        )
                    "
                />
            </div>
            <div v-else>
                <a-empty
                    :image="noPropertyImage"
                    :image-style="{
                        height: '115px',
                        display: 'flex',
                        justifyContent: 'center',
                    }"
                >
                    <template #description>
                        <p class="font-bold">Start adding properties</p>
                    </template>

                    <a-button
                        type="primary"
                        @click="addPropertyDrawer.open(undefinded, false)"
                        ><AtlanIcon icon="Add" class="inline" /> Add property
                    </a-button>
                </a-empty>
            </div>
        </div>
    </div>
    <AddPropertyDrawer
        ref="addPropertyDrawer"
        :metadata="cleanLocalBm"
        @addedProperty="handlePropertyUpdate"
    />
</template>
<script lang="ts">
    import { defineComponent, ref, computed, onMounted, watch, Ref } from 'vue'

    // ? Components
    import AddAttributeCard from '@/admin/custom-metadata/addAttributeCard.vue'
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    // import { BusinessMetadataService } from '~/services/meta/types/customMetadata'
    import MetadataHeaderButton from './metadataHeaderButton.vue'
    import AddPropertyDrawer from './propertyDrawer.vue'
    import noPropertyImage from '~/assets/images/admin/no-property.png'
    import PropertyList from './propertyList.vue'
    import AvatarUpdate from './avatarUpdate.vue'

    // ? Store
    import { useTypedefStore } from '~/store/typedef'
    // import { useAccessStore } from '~/services/access/accessStore'

    interface attributeDefs {
        name: string
        options: { displayName: string }
    }

    export default defineComponent({
        components: {
            AddAttributeCard,
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
        emits: ['update', 'selectBm'],
        setup(props, context) {
            const store = useTypedefStore()
            // const accessStore = useAccessStore()

            // const updatePermission = computed(() =>
            //     accessStore.checkPermission('UPDATE_BUSINESS_METADATA')
            // )
            // * Data
            const localBm = ref({
                name: '',
                description: '',
                options: { displayName: '' },
                guid: '',
                attributeDefs: <attributeDefs[]>[],
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

            // * Lifecycle hooks
            /**
             * @desc if a BM is select on the BM list, make a local copy
             *       is Selected BM is a new template, enable editMode
             *       also add an empty attribute for the new BM
             */
            onMounted(() => {
                if (props.selectedBm) {
                    localBm.value = JSON.parse(JSON.stringify(props.selectedBm))
                }
            })

            watch(props.selectedBm, (newValue) => {
                console.log('JBJBD')

                if (newValue)
                    localBm.value = JSON.parse(JSON.stringify(props.selectedBm))
            })

            // converts customEntityTypes from string to array so they can be set on the a-tree component
            const cleanLocalBm = computed(() => {
                const tempBM = JSON.parse(JSON.stringify(localBm.value))
                tempBM.attributeDefs.forEach((x, index) => {
                    // console.log(typeof x.options.customEntityTypes)
                    if (typeof x.options.customEntityTypes === 'string') {
                        tempBM.attributeDefs[index].options.customEntityTypes =
                            JSON.parse(x.options.customEntityTypes)
                    }
                })
                // console.log('done:', tempBM.attributeDefs)
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
                store.updateCustomMetadata(localBm.value)

                // onUpdate()
            }

            return {
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
                // updatePermission,
                addPropertyDrawer,
                searchedAttributeList,
                handlePropertyUpdate,
            }
        },
        data() {
            return {
                noPropertyImage,
            }
        },
    })
</script>
