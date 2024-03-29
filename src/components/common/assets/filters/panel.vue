<template>
    <a-collapse-panel
        class="group"
        :show-arrow="false"
        :class="isFiltered ? 'bg-white text-primary' : ''"
    >
        <template #header>
            <div class="select-none">
                <div class="flex flex-col flex-1">
                    <div
                        class="flex items-center justify-between hover:text-primary"
                    >
                        <div class="flex items-center w-full">
                            <div
                                v-if="
                                    item?.options?.logoType === 'image' &&
                                    (item.options?.imageId ||
                                        item.options?.logoUrl)
                                "
                                class="flex items-center float-left w-4 h-4 mr-2"
                            >
                                <img
                                    class="object-contain"
                                    :src="imageUrl(item)"
                                />
                            </div>

                            <span
                                v-else-if="
                                    item?.options?.logoType === 'emoji' &&
                                    item?.options?.emoji
                                "
                                class="self-center float-left mr-2 text-base"
                            >
                                {{ item?.options?.emoji }}
                            </span>
                            <span
                                class="w-full text-xs tracking-widest text-gray hover:text-primary title"
                                :class="{
                                    'tracking-widest uppercase':
                                        item?.component !== 'properties',
                                }"
                            >
                                <Truncate
                                    :tooltip-text="item.label"
                                    :rows="2"
                                />
                            </span>
                        </div>

                        <span
                            v-if="isFiltered"
                            class="ml-auto text-xs text-gray-500 opacity-0 hover:text-red-500 group-hover:opacity-100"
                            @click.stop.prevent="handleClear"
                        >
                            clear
                        </span>
                        <AtlanIcon
                            icon="CaretDown"
                            class="ml-3 text-gray-500 transition-transform duration-300 transform h2 hover:text-primary title"
                        />
                    </div>
                </div>

                <transition v-if="isFiltered && !isActive" name="fade">
                    <div class="flex items-center">
                        <img
                            v-if="item.id === 'hierarchy'"
                            :src="
                                getConnectorImageMap[
                                    getFilterValue.toLowerCase()
                                ]
                            "
                            class="w-auto h-4 mr-1"
                        />
                        <span class="text-primary"> {{ getFilterValue }}</span>
                    </div>
                </transition>
            </div>
        </template>

        <component
            :is="item.component"
            :key="componentKey"
            v-model="facetMap[item.id]"
            v-model:selectedRecords="selectedRecordsUsers[item.id]"
            v-model:selectedRecordsGroup="selectedRecordsGroup[item.id]"
            :show-none="item.showNone"
            :item="item"
            v-bind="item.propsToComponent"
            :select-user-key="item.selectUserKey || 'username'"
            @change="handleChange"
        />
    </a-collapse-panel>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        watch,
        computed,
        defineAsyncComponent,
        defineComponent,
        ref,
        toRefs,
    } from 'vue'

    import Owners from '@common/facet/owners/index.vue'
    import Certificate from '@common/facet/certificate/index.vue'
    import LogAction from '@common/facet/accessLogs/actions.vue'
    import LogStatus from '@common/facet/accessLogs/status.vue'
    import UserTypes from '@common/facet/accessLogs/userTypes.vue'
    import CheckBoxOption from '@common/facet/checkBoxOption/index.vue'
    import RadioButton from '@common/facet/radioButton/index.vue'
    import QueryStatus from '@/common/facet/queryStatus/index.vue'
    import Hierarchy from '@/common/facet/hierarchy/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { capitalizeFirstLetter } from '~/utils/string'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            Truncate,
            Hierarchy,
            Certificate,
            Owners,
            QueryStatus,
            LogAction,
            LogStatus,
            UserTypes,
            CheckBoxOption,
            Connector: defineAsyncComponent(
                () => import('@common/treeselect/connector/index.vue')
            ),
            Classifications: defineAsyncComponent(
                () => import('@/common/facet/classification/index.vue')
            ),
            Terms: defineAsyncComponent(
                () => import('@/common/facet/term/index.vue')
            ),
            Properties: defineAsyncComponent(
                () => import('@/common/facet/properties/index.vue')
            ),
            RadioButton,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            activeKey: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            componentParentKey: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const selectedRecordsUsers = ref({})
            const selectedRecordsGroup = ref({})
            const { modelValue } = useVModels(props, emit)
            const { item, activeKey, componentParentKey } = toRefs(props)
            const { getConnectorImageMap } = useAssetInfo()
            const componentState = ref(0)
            const forceRender = () => {
                componentState.value += 1
            }
            const componentKey = computed(
                () => `${item.value.id}_${componentState.value}`
            )

            const facetMap = ref(modelValue.value)
            watch(modelValue, (newModelValue) => {
                facetMap.value = newModelValue
            })
            const isFiltered = computed(() => {
                const id = item.value?.id
                if (facetMap?.value) {
                    if (facetMap?.value[id]) {
                        if (facetMap?.value[id].constructor === Object) {
                            if (Object.keys(facetMap?.value[id]).length === 0) {
                                return false
                            }
                        }
                        if (facetMap?.value[id].constructor === Array) {
                            if (facetMap?.value[id].length === 0) {
                                return false
                            }
                        }
                    }
                }
                return facetMap.value[id]
            })

            const isActive = computed(() =>
                activeKey.value.includes(componentParentKey?.value)
            )

            const handleChange = (...args) => {
                modelValue.value = facetMap.value
                emit('change', item.value, ...args)
            }

            const handleClear = () => {
                delete facetMap.value[item.value.id]
                handleChange()
                forceRender()
            }

            // Function to build filter applied string for owner facet
            const getOwnerFilterAppliedString = (
                usersLength,
                groupsLength
            ): String => {
                let str = ''
                if (usersLength)
                    str += `${usersLength} ${
                        usersLength > 1 ? 'users' : 'user'
                    }`
                if (usersLength && groupsLength) str += ' & '
                if (groupsLength)
                    str += `${groupsLength} ${
                        groupsLength > 1 ? 'groups' : 'group'
                    }`
                return str
            }

            const getFilterValue = computed(() => {
                const id = item.value?.id
                if (id === 'hierarchy') {
                    if (facetMap.value[id].connectorName) {
                        return capitalizeFirstLetter(
                            facetMap.value[id].connectorName
                        )
                    }
                }
                if (id === '__traitNames' && facetMap.value[id]) {
                    const { classificationList } = useTypedefData()

                    const list = classificationList.value
                        .filter((i) =>
                            facetMap.value[id]?.classifications?.includes(
                                i.name
                            )
                        )
                        .map((i) => i.displayName)

                    if (facetMap.value[id].empty) {
                        list.push('NONE')
                    }

                    return list.length < 3
                        ? list.join(',')
                        : `${list?.length} applied`
                }

                if (id === 'terms' && facetMap.value[id]) {
                    let count = facetMap.value[id].terms.length
                    if (facetMap.value[id].empty) count += 1
                    return `${count} applied`
                }

                if (id === 'certificateStatus' && facetMap.value[id]) {
                    return facetMap.value[id]?.length < 3
                        ? facetMap.value[id]
                              .map((el) => {
                                  if (el === null) return 'NONE'
                                  return el
                              })
                              .join(',')
                        : `${facetMap.value[id]?.length} applied`
                }

                if (id === 'statusRequest' && facetMap.value[id]) {
                    return facetMap.value[id]?.length < 3
                        ? facetMap.value[id]
                              .map(
                                  (_id: string) =>
                                      item.value.data.find(
                                          (status) => status.id === _id
                                      ).label
                              )
                              .join(',')
                        : `${facetMap.value[id]?.length} applied`
                }
                if (id === 'assetType' && facetMap.value[id]) {
                    return facetMap.value[id]?.length < 3
                        ? facetMap.value[id].join(',')
                        : `${facetMap.value[id]?.length} applied`
                }

                if (id === 'owners' || id === 'creators') {
                    let usersLength = 0
                    let groupsLength = 0
                    let val = ''
                    const selectUserKey =
                        item?.value?.propsToComponent?.selectUserKey
                    const selectGroupKey =
                        item?.value?.propsToComponent?.selectGroupKey
                    if (facetMap.value[id]?.ownerUsers) {
                        usersLength = facetMap.value[id]?.ownerUsers.length
                    }
                    if (facetMap.value[id]?.ownerGroups) {
                        groupsLength = facetMap.value[id]?.ownerGroups?.length
                    }

                    if (
                        usersLength === 0 &&
                        groupsLength < 3 &&
                        groupsLength > 0
                    ) {
                        if (selectGroupKey === 'id') {
                            const dataSelected =
                                selectedRecordsGroup.value[id]?.map(
                                    (el) => el.name
                                ) || []
                            val = dataSelected.join(', ')
                        } else {
                            val = facetMap.value[id]?.ownerGroups?.join(', ')
                        }
                    } else if (
                        usersLength < 3 &&
                        groupsLength === 0 &&
                        usersLength > 0
                    ) {
                        if (selectUserKey === 'id') {
                            const dataSelected =
                                selectedRecordsUsers.value[id]?.map(
                                    (el) => el.username
                                ) || []
                            val = dataSelected.join(', ')
                        } else {
                            val = facetMap.value[id]?.ownerUsers?.join(', ')
                        }
                    } else if (usersLength + groupsLength >= 2) {
                        val = `${getOwnerFilterAppliedString(
                            usersLength,
                            groupsLength
                        )}`
                    }

                    if (facetMap.value[id].empty) {
                        if (val !== '') {
                            val += ',NONE'
                        } else {
                            val = 'NONE'
                        }
                    }

                    return val
                }

                // Array of primitive objects
                if (
                    Array.isArray(facetMap.value[id]) &&
                    facetMap.value[id]?.length &&
                    typeof facetMap.value[id][0] !== 'object'
                ) {
                    return facetMap.value[id]?.length === 1
                        ? facetMap.value[id][0]
                        : `${facetMap.value[id]?.length} selected`
                }

                if (typeof facetMap.value[id] === 'string') {
                    return facetMap.value[id]
                }

                let numOfAttributes = 0
                Object.keys(facetMap.value[id]).forEach((key) => {
                    const facet = facetMap.value[id][key]
                    if (
                        Array.isArray(facet) &&
                        facetMap.value[id][key].find((element) => element.value)
                    )
                        numOfAttributes += 1
                })

                let str = ''
                if (numOfAttributes)
                    str += `${numOfAttributes} ${
                        numOfAttributes > 1 ? 'attributes' : 'attribute'
                    }`

                return str
            })

            const imageUrl = (item) => {
                const imageId = item.options?.imageId
                const url = imageId
                    ? `${window.location.origin}/api/service/images/${imageId}?ContentDisposition=inline&name=${imageId}`
                    : item.options.logoUrl
                return url
            }

            return {
                isFiltered,
                componentState,
                getFilterValue,
                handleClear,
                handleChange,
                isActive,
                facetMap,
                getConnectorImageMap,
                forceRender,
                componentKey,
                imageUrl,
                activeKey,
                componentParentKey,
                selectedRecordsUsers,
                selectedRecordsGroup,
            }
        },
    })
</script>

<style lang="less" scoped>
    .tracking {
        letter-spacing: 0.07em;
    }
</style>
