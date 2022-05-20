<template>
    <div class="pr-3">
        <div
            class="border cursor-pointer rounded-xl hover:border-blue-200 hover:drop-shadow-md"
            :class="active ? 'border-primary ' : 'border-gray-300'"
            @click.stop="$emit('overView', item)"
        >
            <div v-if="type === 'persona'" class="flex h-9">
                <div class="p-1 bg-gray-200 rounded-tl-xl rounded-br-xl">
                    <div
                        class="p-1.5 bg-white rounded-tl-xl rounded-br-xl drop-shadow-md"
                    >
                        <div v-if="connection.length" class="flex gap-2">
                            <div
                                v-for="imgPath in connection.slice(0, 3)"
                                :key="imgPath"
                                class="relative bg-white rounded-full fit"
                            >
                                <img class="w-4 h-4" :src="imgPath" />
                            </div>
                            <div
                                v-if="connection.length > 3"
                                class="text-xs text-gray-600"
                            >
                                +{{ connection.length - 3 }}
                            </div>
                        </div>
                        <div v-else class="text-xs text-gray-600">-</div>
                    </div>
                </div>
            </div>
            <div class="px-4 mt-3">
                <div class="w-40 text-base font-bold truncate text-primary">
                    {{ item.name }}
                </div>
                <div
                    :class="`w-40 h-8 mb-8 mt-2 ${
                        item.description ? 'text-gray-600' : 'text-gray-400'
                    } text-xs line-clamp-2`"
                >
                    {{ item.description || 'No description available' }}
                </div>
            </div>
            <div class="flex">
                <div
                    v-if="type === 'purpose'"
                    class="flex items-end h-4 mx-4 mb-6 border-b border-gray-300 border-dashed"
                >
                    <div
                        v-if="!listClassifications.length"
                        class="mb-1 text-xs text-gray-600"
                    >
                        No classification attached
                    </div>
                    <div
                        v-for="(classification, i) in listClassifications.slice(
                            0,
                            1
                        )"
                        v-else
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
                            class="border-none"
                            :no-hover="true"
                            class-copy="text-xs"
                            class-icon="h-3 w-3"
                        />
                    </div>
                    <div
                        v-if="listClassifications.length > 1"
                        class="mb-1 ml-1 text-xs text-gray-600"
                    >
                        +{{ listClassifications.length - 1 }}
                    </div>
                </div>
            </div>
            <div class="flex items-center h-6 px-4">
                <div v-for="(user, index) in users" :key="user.id">
                    <a-tooltip v-if="user.username !== 'all-users'">
                        <template #title>
                            {{ user.username }}
                        </template>
                        <Avatar
                            :avatar-bg-class="'bg-primary-light border-white border border-2 uppercase'"
                            :initial-name="user.username[0]"
                            :image-url="imageUrl(user.username)"
                            :avatar-size="30"
                            :avatar-shape="'circle'"
                            :style="{
                                'z-index': `${index + 1}`,
                                transform: `translateX(-${index * 8}px)`,
                            }"
                        />
                    </a-tooltip>
                    <div
                        v-else-if="user.username === 'all-users'"
                        class="flex items-center text-xs text-gray-700"
                    >
                        <Avatar
                            class="mb-1 mr-1"
                            :avatar-bg-class="'bg-primary-light border-white border border-2 uppercase'"
                            :image-url="logoUrl"
                            :avatar-size="14"
                            :avatar-shape="'circle'"
                        />
                        <div class="truncate display-name">
                            Everyone at {{ displayName }}
                        </div>
                    </div>
                </div>
                <a-tooltip
                    v-if="
                        (type === 'persona'
                            ? item.users?.length
                            : users.length) > 3 && users.length
                    "
                >
                    <template #title>
                        {{
                            type === 'persona'
                                ? `${item.users?.length - 3} ${
                                      item.users?.length > 1 ? 'users' : 'user'
                                  }`
                                : `${users.length - 3} ${
                                      users.length - 3 ? 'users' : 'user'
                                  }`
                        }}
                    </template>
                    <div
                        class="flex items-center justify-center mt-1 text-xs text-gray-600 bg-gray-200 rounded-full w-7 h-7"
                        :style="{
                            'z-index': `4`,
                            transform: `translateX(-24px)`,
                        }"
                    >
                        +{{
                            (type === 'persona'
                                ? item.users?.length
                                : users.length) - 3
                        }}
                    </div>
                </a-tooltip>
            </div>
            <div
                class="flex items-center px-4 py-3 mt-4 border-t border-gray-200"
                @click.stop="$emit('viewAssets', item)"
            >
                <div class="text-sm text-center cursor-pointer text-primary">
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
    import { useTenantStore } from '~/store/tenant'

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
            active: {
                type: Boolean,
                required: true,
            },
            userList: {
                type: Array,
                required: true,
            },
        },
        emits: ['viewAssets', 'overView'],
        setup(props) {
            const tenantStore = useTenantStore()
            const { logoUrl } = toRefs(tenantStore)
            const { classificationList } = useTypedefData()
            const { getConnectorImageMap } = useAssetInfo()
            const { item, type, userList } = toRefs(props)
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
            const users = computed(() => {
                if (type.value === 'purpose') {
                    let isAllUser = false
                    let userPurposes = []
                    const { metadataPolicies, dataPolicies } = item.value
                    dataPolicies.forEach((el) => {
                        if (el.allUsers) {
                            isAllUser = true
                        }
                        userPurposes = [...userPurposes, ...el.users]
                    })
                    metadataPolicies.forEach((el) => {
                        if (el.allUsers) {
                            isAllUser = true
                        }
                        userPurposes = [...userPurposes, ...el.users]
                    })
                    if (!userPurposes.includes('all-users') && !isAllUser) {
                        const result = [...new Set(userPurposes)].map(
                            (el, i) => ({
                                username: el,
                                id: i,
                            })
                        )
                        return result
                    }
                    return [{ username: 'all-users' }]
                }
                if (!userList?.value.length) return []
                if (type.value === 'persona') {
                    const usersItem = item.value?.users?.slice(0, 3) || []
                    const personaUsers = usersItem.map(
                        (el) =>
                            userList?.value?.find(
                                (elc: any) => elc?.id === el
                            ) || el
                    )
                    return personaUsers
                }
                return []
            })
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
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const displayName = computed(() => tenantStore.displayName)
            return {
                connection,
                users,
                classifications,
                listClassifications,
                imageUrl,
                logoUrl,
                displayName,
            }
        },
    })
</script>

<style lang="less">
    .display-name {
        max-width: 131px;
    }
    .pill-class-widget {
        max-width: 60px !important;
    }
</style>
