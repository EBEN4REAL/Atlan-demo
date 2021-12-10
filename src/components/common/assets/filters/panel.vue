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
                        <div class="flex items-center">
                            <img
                                v-if="item?.options?.logoType === 'image'"
                                class="float-left w-auto h-4 mr-2"
                                :src="imageUrl(item.options?.imageId)"
                            />

                            <span
                                v-else-if="item?.options?.logoType === 'emoji'"
                                class="self-center float-left mr-2 text-base"
                            >
                                {{ item?.options?.emoji }}
                            </span>
                            <span
                                class="text-xs uppercase text-gray hover:text-primary title"
                                style="letter-spacing: 0.07em"
                            >
                                {{ item.label }}</span
                            >
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
    import QueryStatus from '@/common/facet/queryStatus/index.vue'
    import Hierarchy from '@/common/facet/hierarchy/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { capitalizeFirstLetter } from '~/utils/string'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
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

            const handleChange = () => {
                modelValue.value = facetMap.value
                emit('change')
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

                if(id === 'terms' && facetMap.value[id]) {
                    let count = facetMap.value[id].terms.length
                    if(facetMap.value[id].empty) count = count + 1
                    return `${count} applied`
                }

                if (id === 'certificateStatus' && facetMap.value[id]) {
                    return facetMap.value[id]?.length < 3
                        ? facetMap.value[id].join(',')
                        : `${facetMap.value[id]?.length} applied`
                }

                if (id === 'owners') {
                    let usersLength = 0
                    let groupsLength = 0

                    let val = ''

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
                        val = facetMap.value[id]?.ownerGroups?.join(', ')
                    } else if (
                        usersLength < 3 &&
                        groupsLength === 0 &&
                        usersLength > 0
                    ) {
                        val = facetMap.value[id]?.ownerUsers?.join(', ')
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

                let numOfAttributes = 0
                Object.keys(facetMap.value[id]).forEach((key) => {
                    if (
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

            const imageUrl = (url) =>
                `${window.location.origin}/api/service/images/${url}?ContentDisposition=inline&name=${url}`

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
            }
        },
    })
</script>
