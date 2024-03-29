<template>
    <div class="pr-3" :style="{ width: '192px' }">
        <div
            class="border cursor-pointer rounded-xl hover:border-blue-200 shadow-card"
            :class="active ? 'border-primary ' : 'border-gray-300'"
            @click.stop="$emit('overView', { ...item, i })"
        >
            <div v-if="type === 'persona'" class="flex h-9">
                <div class="p-1 bg-gray-100 rounded-tl-xl rounded-br-xl">
                    <div class="p-1.5 bg-white rounded-tl-xl rounded-br-xl">
                        <div
                            v-if="connection.length || haveGlossary"
                            class="flex gap-2"
                        >
                            <div
                                v-for="imgPath in connection.slice(
                                    0,
                                    haveGlossary ? 2 : 3
                                )"
                                :key="imgPath"
                                class="relative bg-white rounded-full fit"
                            >
                                <img class="w-4 h-4" :src="imgPath" />
                            </div>
                            <div
                                v-if="haveGlossary"
                                class="relative w-4 h-4 rounded-full glossary-icon"
                            >
                                <AtlanIcon icon="Glossary" />
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
                    {{ item.displayName }}
                </div>
                <div
                    :class="`w-40 h-8 mb-8 mt-2 ${
                        item.description ? 'text-gray-500' : 'text-gray-400'
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
                <div v-for="(user, index) in users.slice(0, 3)" :key="user.id">
                    <a-tooltip v-if="user.username !== 'all-users'">
                        <template #title>
                            {{ user.username }}
                        </template>
                        <Avatar
                            :class="`${
                                user.type === 'group'
                                    ? 'avatar-group-purple'
                                    : ''
                            }`"
                            :avatar-bg-class="`bg-primary-light border-white border border-3 uppercase`"
                            :initial-name="user.username[0]"
                            :image-url="imageUrl(user.username)"
                            :avatar-size="26"
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
                            is-group
                            class="mb-1 mr-0.5 icon-all-users"
                            :avatar-bg-class="'bg-primary-light border-white border border-3 uppercase'"
                            :avatar-size="20"
                            :avatar-shape="'circle'"
                        />
                        <div class="truncate display-name">All users</div>
                    </div>
                </div>
                <a-tooltip v-if="users.length > 3 && users.length">
                    <template #title>
                        {{ moreUserGroup }}
                    </template>
                    <div
                        class="flex items-center justify-center text-gray-500 bg-gray-200 rounded-full card-avatar-size"
                        :style="{
                            'z-index': `4`,
                            transform: `translateX(-24px)`,
                        }"
                    >
                        +{{ users.length - 3 }}
                    </div>
                </a-tooltip>
            </div>
            <div
                class="flex items-center px-4 py-3 mt-4 border-t border-gray-200"
                @click.stop="$emit('viewAssets', { ...item, i })"
            >
                <div class="text-sm text-center cursor-pointer text-primary">
                    View assets
                </div>
                <AtlanIcon icon="ArrowRight" class="ml-1 text-primary" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref } from 'vue'
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
            i: {
                type: Number,
                required: true,
            },
            groupList: {
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
            const { item, type, userList, groupList } = toRefs(props)
            const usersGroupsPurpose = ref({
                groups: 0,
                users: 0,
            })
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

            const findData = (id) => {
                const user = userList.value.find((el) => el.id === id)
                if (user) {
                    return { ...user, type: 'user' }
                }
                const group = groupList.value.find((el) => el.id === id)
                if (group) {
                    return { ...group, type: 'group', username: group.alias }
                }
                return {}
                // arr.find((item: any) => item?.id === id) || {}
            }
            const setUsersGroupsPurpose = (val) => {
                usersGroupsPurpose.value = val
            }
            const users = computed(() => {
                if (type.value === 'purpose') {
                    let isAllUser = false
                    let usersPurpose = []
                    let groupsPurpose = []
                    const { metadataPolicies, dataPolicies } = item.value
                    dataPolicies.forEach((dataPolicy) => {
                        if (dataPolicy.allUsers) {
                            isAllUser = true
                        }
                        usersPurpose = [...usersPurpose, ...dataPolicy.users]
                        groupsPurpose = [...groupsPurpose, ...dataPolicy.groups]
                    })
                    metadataPolicies.forEach((metadataPolicy) => {
                        if (metadataPolicy.allUsers) {
                            isAllUser = true
                        }
                        usersPurpose = [
                            ...usersPurpose,
                            ...metadataPolicy.users,
                        ]
                        groupsPurpose = [
                            ...groupsPurpose,
                            ...metadataPolicy.groups,
                        ]
                    })
                    if (!usersPurpose.includes('all-users') && !isAllUser) {
                        const resultGroups = [...new Set(groupsPurpose)].map(
                            (el, i) => ({
                                username: el,
                                id: i,
                                type: 'group',
                            })
                        )
                        const resultUsers = [...new Set(usersPurpose)].map(
                            (el, i) => ({
                                username: el,
                                id: i,
                                type: 'user',
                            })
                        )
                        const result = [...resultUsers, ...resultGroups]
                        setUsersGroupsPurpose({
                            groups: resultGroups.length,
                            users: resultUsers.length,
                        })
                        return result
                    }
                    return [{ username: 'all-users' }]
                }
                if (!userList?.value.length && item.value?.users.length)
                    return []
                if (!groupList?.value.length && item.value?.groups.length)
                    return []
                if (type.value === 'persona') {
                    const mergedArr = [
                        ...item.value?.users,
                        ...item.value?.groups,
                    ]
                    const dataSliced = mergedArr || []
                    const personaUsersGroups = dataSliced.map(findData)
                    return personaUsersGroups
                }
                return []
            })
            const connection = computed(() => {
                // const glossary = item.value?.glossaryPolicies?.length || 0
                if (type.value === 'purpose') return []
                const connectionLength = 5
                return getUniqueTypeIcons().connectors.slice(
                    0,
                    connectionLength
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
            const haveGlossary = computed(() => {
                if (type.value === 'persona') {
                    return item.value.glossaryPolicies?.length || false
                }
                return false
            })
            const moreUserGroup = computed(() => {
                const usersCount =
                    type.value === 'persona'
                        ? item.value.users?.length || 0
                        : usersGroupsPurpose.value.users
                const groupsCount =
                    type.value === 'persona'
                        ? item.value.groups?.length || 0
                        : usersGroupsPurpose.value.groups

                const restUsers = usersCount - 3
                const restGroups = restUsers
                    ? groupsCount
                    : restUsers + groupsCount
                return `${
                    restUsers
                        ? `+${restUsers} user${restUsers > 1 ? 's' : ''}`
                        : ''
                }${restUsers && restGroups ? ', ' : ''}${
                    restGroups
                        ? `+${restGroups} group${restGroups > 1 ? 's' : ''}`
                        : ''
                }`
            })
            return {
                connection,
                users,
                classifications,
                listClassifications,
                imageUrl,
                logoUrl,
                displayName,
                haveGlossary,
                moreUserGroup,
            }
        },
    })
</script>
<style scoped lang="less">
    .glossary-icon {
        transform: translateY(-4px);
    }
    .shadow-card {
        transition: all ease 0.3s;
        &:hover {
            box-shadow: 0px 8px 24px rgba(25, 32, 56, 0.04);
        }
    }
    .shadow-connector {
        box-shadow: 1px 2px 3px 3px rgba(0, 0, 0, 0.05);
    }
</style>
<style lang="less">
    .avatar-group-purple {
        .ant-avatar-circle {
            background: rgba(239, 239, 251, 1) !important;
        }
        .initial-text {
            color: rgba(109, 109, 218, 1);
        }
    }
    .icon-all-users {
        transform: scale(0.8);
    }
    .display-name {
        max-width: 131px;
    }
    .pill-class-widget {
        max-width: 60px !important;
    }
    .card-avatar-size {
        width: 24px;
        height: 24px;
        font-size: 10px;
        padding-top: 2px;
    }
</style>
