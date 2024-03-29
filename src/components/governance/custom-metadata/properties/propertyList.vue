<template>
    <div class="">
        <div class="overflow-hidden">
            <div
                class="flex items-center justify-between bg-gray-100"
                style="height: 40px"
            >
                <div class="flex text-gray-500 uppercase">
                    <div class="ml-4 cursor-pointer" style="width: 276px">
                        Property
                    </div>
                    <div class="uppercase" style="width: 248px">Type</div>
                </div>
                <div style="width: 130px"></div>
            </div>
            <!-- TODO height based on hasArchived  - learn a better way to do this -->
            <div
                id="drag-container"
                class="overflow-y-auto bg-white rounded-b-lg"
                :style="
                    hasArchived
                        ? 'max-height: calc(100vh - 25rem)'
                        : 'max-height: calc(100vh - 19rem)'
                "
            >
                <div
                    v-for="(property, index) in properties"
                    :id="`prop-${property.name}`"
                    :key="property.name"
                    :data-property="property"
                    class="relative flex items-center justify-between last:rounded-b hover:bg-gray-light"
                    style="height: 44px"
                    :class="{
                        'bg-gray-light': selected === property.name,
                        'border-b': properties.length !== index + 1,
                    }"
                >
                    <div class="flex items-center">
                        <div
                            style="width: 44px"
                            class="text-center"
                            :class="
                                checkAccess(map.UPDATE_BUSINESS_METADATA)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            "
                        >
                            <AtlanIcon
                                class="inline h-4 grap"
                                icon="MoveItem"
                            />
                        </div>

                        <div
                            class="leading-none cursor-pointer align-center"
                            style="width: 248px"
                            @click="$emit('openEditDrawer', { property })"
                        >
                            <div class="flex items-center">
                                <Truncate
                                    :tooltip-text="property.displayName"
                                    classes="text-primary"
                                    :rows="2"
                                />

                                <a-tooltip>
                                    <template #title>
                                        <span>{{
                                            property.description ||
                                            property.options.description
                                        }}</span>
                                    </template>
                                    <div
                                        v-if="
                                            property.description ||
                                            property.options.description
                                        "
                                        class="mr-2"
                                    >
                                        <AtlanIcon
                                            class="inline h-4 ml-2 text-gray-400 hover:text-gray-500"
                                            :icon="'Info'"
                                        />
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                        <div class="flex capitalize" style="width: 248px">
                            <AtlanIcon
                                v-if="
                                    mapTypeToIcon(
                                        property.options.primitiveType ??
                                            property.typeName,
                                        property
                                    )
                                "
                                class="inline h-4 mr-2"
                                :icon="
                                    mapTypeToIcon(
                                        property.options.primitiveType ??
                                            property.typeName,
                                        property
                                    )
                                "
                            />
                            {{ resolveType(property) }}
                        </div>
                    </div>

                    <div style="width: 130px">
                        <PropertyActions
                            :name="property.displayName"
                            :guid="property.name"
                            :internal="metadata.options?.isLocked === 'true'"
                            @delete="handleArchiveProperty(property.name)"
                        />
                    </div>
                </div>
                <div
                    v-if="isSorting"
                    class="absolute top-0 flex items-center justify-center w-full h-full bg-white bg-opacity-40"
                >
                    <a-spin size="large" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
        ref,
        reactive,
        computed,
        onMounted,
        watch,
        nextTick,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import { Types } from '~/services/meta/types'
    import { useTypedefStore } from '~/store/typedef'
    import { ATTRIBUTE_TYPES } from '~/constant/businessMetadataTemplate'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import Truncate from '@/common/ellipsis/index.vue'
    import PropertyActions from '@/governance/custom-metadata/properties/propertyActions.vue'
    import whoami from '~/composables/user/whoami'
    import { getAnalyticsProperties } from '@/governance/custom-metadata/properties/properties.utils'

    export default defineComponent({
        components: { Truncate, PropertyActions },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
            selected: {
                type: String,
                required: false,
                default: '',
            },
            properties: {
                type: Object,
                default: () => {},
            },
            hasArchived: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['openEditDrawer', 'archiveProperty'],
        setup(props, { emit }) {
            const store = useTypedefStore()
            const { metadata, properties } = toRefs(props)
            const isSorting = ref(false)

            const { checkAccess } = useAuth()
            // map icon to type
            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )

            const mapTypeToIcon = (id, property) => {
                const foundIcon = attributesTypes.find(
                    (x) =>
                        x.id ===
                        (property.options?.customType
                            ? property.options?.customType
                            : id) // if has customType property, use it instead of id to search for icon
                )?.icon // find icon in attributesTypes
                if (property.options?.isEnum === 'true') return 'Enum'
                return foundIcon
            }

            const resolveType = (property) => {
                if (property.options?.customType) {
                    return property.options?.customType
                }
                const label = attributesTypes.find(
                    (x) =>
                        x.id ===
                        (property.options?.customType
                            ? property.options?.customType
                            : property.options.primitiveType ??
                              property.typeName) // if has customType property, use it instead of id to search for icon
                )?.label
                return (
                    (label || property.options.primitiveType) ??
                    property.typeName
                )
            }
            const { username } = whoami()
            // residue code to delete
            const handleArchiveProperty = (guid) => {
                const timestamp = new Date().getTime()
                const tempBM = JSON.parse(JSON.stringify(metadata.value))
                const index = tempBM.attributeDefs.findIndex(
                    (attr) => attr.name === guid
                )
                tempBM.attributeDefs[
                    index
                ].displayName += `-archived-${timestamp}`
                tempBM.attributeDefs[index].options.archivedAt = timestamp
                tempBM.attributeDefs[index].options.archivedBy = username.value
                tempBM.attributeDefs[index].options.isArchived = true

                const { data, error, isReady } = Types.updateCustomMetadata({
                    businessMetadataDefs: [tempBM],
                })
                message.loading({
                    content: 'Deleting property...',
                    key: 'archive',
                })
                watch([data, isReady, error], () => {
                    if (isReady && !error.value) {
                        message.success({
                            content: 'Property deleted.',
                            key: 'archive',
                        })
                        emit(
                            'archiveProperty',
                            index,
                            tempBM.attributeDefs[index]
                        )
                        useAddEvent(
                            'governance',
                            'custom_metadata',
                            'property_deleted',
                            getAnalyticsProperties(
                                tempBM.attributeDefs[index],
                                tempBM.displayName
                            )
                        )
                    } else if (error && error.value) {
                        message.error({
                            content:
                                'Unable to delete property, please try again',
                            key: 'archive',
                        })
                    }
                })
            }

            const storePropertyValues = computed(() => {
                const temp = {}
                properties.value.forEach((x) => {
                    temp[`prop-${x.name}`] = x
                })
                return temp
            })
            const sortedProperties = ref([])

            const enableDragSort = () => {
                if (checkAccess(map.UPDATE_BUSINESS_METADATA)) {
                    const sortableLists = properties.value
                    Array.prototype.map.call([sortableLists], (list) => {
                        enableDragList(list)
                    })
                }
            }

            const enableDragList = (list) => {
                Array.prototype.map.call(list, (property) => {
                    enableDragItem(
                        document.getElementById(`prop-${property.name}`)
                    )
                })
            }

            const enableDragItem = (item) => {
                if (!item) return
                item.setAttribute('draggable', true)
                // remove event handler first
                item.removeEventListener('ondrag', handleDrag)
                item.removeEventListener('ondragend', handleDrop)
                item.ondrag = handleDrag
                item.ondragend = handleDrop
                item.ondragover = (e) => {
                    e.preventDefault()
                }
            }

            const handleDrag = (item) => {
                item.preventDefault()
                const selectedItem = item.target
                const parent = selectedItem.parentNode
                const x = event.clientX
                const y = event.clientY

                selectedItem.classList.add('opacity-10')
                let swapItem =
                    document.elementFromPoint(x, y) === null
                        ? selectedItem
                        : document.elementFromPoint(x, y)

                if (parent === swapItem.parentNode) {
                    swapItem =
                        swapItem !== selectedItem.nextSibling
                            ? swapItem
                            : swapItem.nextSibling
                    parent.insertBefore(selectedItem, swapItem)
                }
            }
            const updatePropertyValuesStore = () => {
                isSorting.value = true
                const dragContainer = document.getElementById('drag-container')
                dragContainer.children.forEach((element, index) => {
                    sortedProperties.value[index] =
                        storePropertyValues.value[element.id]
                })

                // update
                const tempBM = { ...metadata.value }
                tempBM.attributeDefs = sortedProperties.value
                const { data, error, isReady } = Types.updateCustomMetadata({
                    businessMetadataDefs: [tempBM],
                })
                watch([data, isReady, error], () => {
                    if (isReady && !error.value) {
                        isSorting.value = false
                        message.success('Arrangement saved.')
                        store.updateCustomMetadata(
                            data.value.businessMetadataDefs[0]
                        )
                        store.tickForceRevalidate()
                        useAddEvent(
                            'governance',
                            'custom_metadata',
                            'property_reordered'
                        )
                    } else if (error && error.value) {
                        isSorting.value = false
                        message.error('Unable to save order, please try again')
                    }
                })
            }

            const handleDrop = (item) => {
                item.preventDefault()
                item.target.classList.remove('opacity-10')
                updatePropertyValuesStore()
            }

            onMounted(() => {
                enableDragSort()
            })

            const reInitializeDragSort = () => {
                enableDragSort()
            }

            watch(properties, async (n, o) => {
                await nextTick() // wait for new property to be available in DOM
                if (n?.length > o?.length) enableDragSort()
                // reInitializeDragSort()
            })

            return {
                handleArchiveProperty,
                isSorting,
                sortedProperties,
                reInitializeDragSort,
                mapTypeToIcon,
                resolveType,
                map,
                checkAccess,
            }
        },
    })
</script>

<style>
    .grap {
        cursor: grab;
    }
</style>
