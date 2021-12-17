<template>
    <div>
        <div class="overflow-hidden border rounded-lg">
            <div
                class="flex items-center justify-between border-b bg-gray-50"
                style="height: 40px"
            >
                <div class="flex font-bold">
                    <div style="width: 44px"></div>
                    <div class="cursor-pointer" style="width: 248px">
                        Property
                    </div>
                    <div class="capitalize" style="width: 248px">Type</div>
                </div>
                <div style="width: 130px"></div>
            </div>
            <div id="drag-container" class="bg-white">
                <div
                    v-for="(property, index) in properties"
                    :id="`prop-${property.name}`"
                    :key="property.name"
                    :data-property="property"
                    class="relative flex items-center justify-between last:rounded-b"
                    style="height: 44px"
                    :class="{ 'border-b': properties.length !== index + 1 }"
                >
                    <div class="flex items-center">
                        <div
                            style="width: 44px"
                            class="h-4 text-center"
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
                        <!-- <div style="width: 44px">
                            {{ index + 1 }}
                        </div> -->
                        <div
                            class="leading-none cursor-pointer align-center"
                            style="width: 248px"
                            @click="
                                $emit('openEditDrawer', { property, index })
                            "
                        >
                            <span class="text-primary">{{
                                property.displayName
                            }}</span>
                            <a-tooltip>
                                <template #title>
                                    <span>{{
                                        property.options.description
                                    }}</span>
                                </template>
                                <AtlanIcon
                                    v-if="property.options.description"
                                    class="inline h-4 ml-2 text-gray-400 hover:text-gray-500"
                                    :icon="'Info'"
                                />
                            </a-tooltip>
                        </div>
                        <div class="capitalize" style="width: 248px">
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
                        <a-button
                            class="px-1 py-0 border-0"
                            @click="
                                copyAPI(property.displayName, 'Name Copied!')
                            "
                        >
                            <AtlanIcon icon="CopyOutlined" />
                        </a-button>
                        <a-dropdown :trigger="['click']">
                            <a-button class="border-0 rounded" size="small">
                                <AtlanIcon icon="KebabMenu"></AtlanIcon>
                            </a-button>
                            <template #overlay>
                                <a-menu
                                    ><a-menu-item
                                        @click="
                                            copyAPI(
                                                property.displayName,
                                                'Name Copied!'
                                            )
                                        "
                                    >
                                        <AtlanIcon
                                            icon="CopyOutlined"
                                            class="mr-2"
                                        />Copy Name</a-menu-item
                                    >
                                    <a-menu-item
                                        @click="
                                            copyAPI(
                                                property.name,
                                                'GUID Copied!'
                                            )
                                        "
                                    >
                                        <AtlanIcon
                                            icon="CopyOutlined"
                                            class="mr-2"
                                        />Copy GUID</a-menu-item
                                    >
                                </a-menu></template
                            >
                        </a-dropdown>
                        <!-- <a-button
                            class="px-1 py-0 border-0"
                            @click="handleRemoveProperty(index, property)"
                        >
                            <AtlanIcon class="inline mr-2" icon="Trash" />
                        </a-button> -->
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
    import { copyToClipboard } from '~/utils/clipboard'
    import { Types } from '~/services/meta/types'
    import { useTypedefStore } from '~/store/typedef'
    import { ATTRIBUTE_TYPES } from '~/constant/businessMetadataTemplate'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
            properties: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['openEditDrawer', 'removeProperty'],
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

            const copyAPI = (text: string, theMessage: String) => {
                copyToClipboard(text)
                message.success({
                    content: theMessage,
                } as any)
            }

            const handleRemoveProperty = (index, property) => {
                Modal.confirm({
                    title: 'Delete property',
                    content: `Are you sure you want delete ${property.displayName} ?`,
                    okText: 'Yes',
                    okType: 'danger',
                    onOk() {
                        emit('removeProperty', index)
                        const tempBM = { ...metadata.value }
                        tempBM.attributeDefs.splice(index, 1)
                        const { data, error, isReady } =
                            Types.updateCustomMetadata({
                                businessMetadataDefs: [tempBM],
                            })
                        watch([data, isReady, error], () => {
                            if (isReady && !error.value) {
                                message.success('Property deleted.')
                                // reloadTable()
                            } else if (error && error.value) {
                                message.error(
                                    'Unable to delete property, please try again'
                                )
                            }
                        })
                    },
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
                copyAPI,
                handleRemoveProperty,
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
