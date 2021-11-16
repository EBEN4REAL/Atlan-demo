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
            <div id="drag-container" class="relative">
                <div
                    v-for="(property, index) in properties"
                    :id="`prop-${property.name}`"
                    :key="index"
                    :data-property="property"
                    class="relative flex items-center justify-between last:rounded-b"
                    style="height: 44px"
                    :class="{ 'border-b': properties.length !== index + 1 }"
                >
                    <div class="flex">
                        <div style="width: 44px">
                            <AtlanIcon class="h-4 mx-auto" icon="MoveItem" />
                        </div>
                        <!-- <div style="width: 44px">
                            {{ index + 1 }}
                        </div> -->
                        <div
                            class="cursor-pointer text-primary"
                            style="width: 248px"
                            @click="
                                $emit('openEditDrawer', { property, index })
                            "
                        >
                            {{ property.displayName }}
                        </div>
                        <div class="capitalize" style="width: 248px">
                            <AtlanIcon
                                class="inline h-4 mr-2"
                                :icon="
                                    mapTypeToIcon(property.typeName, property)
                                "
                            />
                            {{ resolveType(property) }}
                        </div>
                    </div>

                    <div style="width: 130px">
                        <a-button
                            class="px-1 py-0 border-0"
                            @click="copyAPI(property.displayName)"
                        >
                            <AtlanIcon icon="CopyOutlined" />
                        </a-button>
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
        Ref,
    } from 'vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message, Modal } from 'ant-design-vue'
    import { Types } from '~/services/meta/types'

    import { useTypedefStore } from '~/store/typedef'
    import { ATTRIBUTE_TYPES } from '~/constant/businessMetadataTemplate'

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
        emits: ['openEditDrawer', 'removeProperty', 'changeOrder'],
        setup(props, { emit }) {
            const store = useTypedefStore()
            const { metadata, properties } = toRefs(props)
            const isSorting = ref(false)

            // map icon to type
            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )

            const copyAPI = (text: string) => {
                copyToClipboard(text)
                message.success({
                    content: 'Name copied!',
                })
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
                const sortableLists = properties.value
                Array.prototype.map.call([sortableLists], (list) => {
                    enableDragList(list)
                })
            }

            const enableDragList = (list) => {
                Array.prototype.map.call(list, (property) => {
                    enableDragItem(
                        document.getElementById(`prop-${property.name}`)
                    )
                })
            }

            const enableDragItem = (item) => {
                item.setAttribute('draggable', true)
                item.ondrag = handleDrag
                item.ondragend = handleDrop
                item.ondragover = (e) => {
                    e.preventDefault()
                }
            }

            const handleDrag = (item) => {
                item.preventDefault()
                const selectedItem = item.target
                const list = selectedItem.parentNode
                const x = event.clientX
                const y = event.clientY

                selectedItem.classList.add('opacity-10')
                let swapItem =
                    document.elementFromPoint(x, y) === null
                        ? selectedItem
                        : document.elementFromPoint(x, y)

                if (list === swapItem.parentNode) {
                    swapItem =
                        swapItem !== selectedItem.nextSibling
                            ? swapItem
                            : swapItem.nextSibling
                    list.insertBefore(selectedItem, swapItem)
                }
            }
            const updatePropertyValuesStore = () => {
                isSorting.value = true
                const dragContainer = document.getElementById('drag-container')
                console.log(dragContainer.children)

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
                        store.updateCustomMetadata(tempBM)
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
                return property.typeName
            }

            return {
                copyAPI,
                handleRemoveProperty,
                isSorting,
                sortedProperties,
                reInitializeDragSort,
                mapTypeToIcon,
                resolveType,
            }
        },
    })
</script>
