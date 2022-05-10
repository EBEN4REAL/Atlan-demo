<template>
    <div class="pr-3">
        <div class="border border-gray-300 rounded-xl">
            <div v-if="type === 'persona'" class="flex h-9">
                <div
                    v-if="connection.length"
                    class="p-1 bg-gray-100 rounded-tl-xl rounded-br-xl"
                >
                    <div
                        class="flex p-1.5 bg-white rounded-tl-xl rounded-br-xl"
                    >
                        <div
                            v-for="imgPath in connection"
                            :key="imgPath"
                            class="rounded-full relativebg-white fit"
                        >
                            <img class="w-4 h-4" :src="imgPath" />
                        </div>
                    </div>
                </div>
                <div
                    v-if="item?.tags?.length"
                    class="p-1 bg-gray-100 rounded-tl-xl rounded-br-xl"
                >
                    <div
                        class="flex items-center p-1.5 bg-white rounded-tl-xl rounded-br-xl text-xs text-gray-700"
                    >
                        <AtlanIcon
                            icon="ClassificationShield"
                            class="w-4 h-4 mr-1 stroke-current text-primary"
                        />
                        {{
                            `${item?.tags?.length} ${
                                item?.tags?.length > 1
                                    ? 'classifications'
                                    : 'classification'
                            }`
                        }}
                    </div>
                </div>
            </div>
            <div class="px-4 mt-3">
                <div class="w-40 text-base font-bold truncate text-primary">
                    {{ item.name }}
                </div>
                <div class="w-40 h-16 mt-2 text-xs text-gray-600 line-clamp-2">
                    {{ item.description || 'No description' }}
                </div>
            </div>
            <div
                v-if="type === 'purpose'"
                class="flex mx-4 border-b border-gray-300 border-dashed h-9"
            >
                <div
                    v-for="(classification, i) in listClassifications.slice(
                        0,
                        2
                    )"
                    :key="classification.guid"
                    class="flex items-end"
                >
                    <ClassificationPill
                        :name="classification.name"
                        :display-name="classification?.displayName"
                        :is-propagated="false"
                        :allow-delete="false"
                        :color="classification.options?.color"
                        :created-by="classification?.createdBy"
                        class="border-none pill-class-widget"
                        :no-hover="true"
                    />
                    <div
                        v-if="i === 0 && listClassifications.length > 1"
                        class="mb-1.5 text-xs text-gray-600"
                    >
                        ,
                    </div>
                </div>
            </div>
            <div class="flex items-center h-6 px-4">
                <Avatar
                    v-for="(user, index) in users"
                    :key="user"
                    :avatar-size="24"
                    :avatar-shape="'circle'"
                    :style="{
                        'z-index': `${users.length - 1 - index}`,
                        transform: `translateX(-${index * 8}px)`,
                    }"
                />
                <div
                    v-if="item.users?.length > 3"
                    class="flex items-center justify-center w-6 h-6 mt-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                    :style="{
                        'z-index': `4`,
                        transform: `translateX(-24px)`,
                    }"
                >
                    +{{ item.users?.length - 3 }}
                </div>
            </div>
            <div
                class="flex items-center justify-center px-4 py-3 mt-4 border-t border-gray-300"
            >
                <div class="text-xs text-center cursor-pointer text-primary">
                    View assets
                </div>
                <AtlanIcon icon="ArrowRight" class="ml-2 text-primary" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Avatar from '~/components/common/avatar/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import ClassificationPill from '@/common/pills/classification.vue'

    export default defineComponent({
        name: 'WidgetPersonaPurposeCard',
        components: { Avatar, ClassificationPill },

        props: {
            item: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { classificationList } = useTypedefData()
            const { getConnectorImageMap } = useAssetInfo()
            const { item, type } = toRefs(props)
            const getUniqueTypeIcons = () => {
                const displayImages = {
                    connectors: [],
                    icons: new Set(),
                    count: 0,
                }
                const metadataPolicies = item.value?.metadataPolicies || []
                const dataPolicies = item.value?.dataPolicies || []
                const policies = [...metadataPolicies, ...dataPolicies]
                policies
                    .map((policy) => policy.assets[0])
                    .forEach((asset) => {
                        if (asset.startsWith('default')) {
                            const connectorName = asset.split('/')[1]
                            const imgPath =
                                getConnectorImageMap.value[connectorName]
                            displayImages.connectors.push(imgPath)
                        }
                    })
                return {
                    ...displayImages,
                    connectors: [...new Set(displayImages.connectors)],
                }
            }
            const classifications = computed(() => {
                const arr: any[] = []
                classificationList.value.forEach((cl) => {
                    item.value?.tags?.forEach((name) => {
                        if (name === cl.name) {
                            arr.push({
                                typeName: cl.name,
                                entityGuid: cl.guid,
                                entityStatus: 'ACTIVE',
                                propagate: false,
                                validityPeriods: [],
                                removePropagationsOnEntityDelete: false,
                            })
                        }
                    })
                })
                return arr
            })
            const users = computed(() => item.value?.users?.slice(0, 3) || [])
            const connection = computed(() => {
                // const glossary = item.value?.glossaryPolicies?.length || 0
                if (type.value === 'purpose') return []
                const lengthCoonection = 5
                return getUniqueTypeIcons().connectors.slice(
                    0,
                    lengthCoonection
                )
            })
            const listClassifications = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications.value,
                    'name',
                    'typeName'
                )

                return matchingIdsResult
            })
            return {
                connection,
                users,
                classifications,
                listClassifications,
            }
        },
    })
</script>

<style lang="less">
    .pill-class-widget {
        max-width: 80px !important;
    }
</style>
