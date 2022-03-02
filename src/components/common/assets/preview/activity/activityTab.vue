<template>
    <div class="flex flex-col h-full overflow-y-hidden">
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Activity</span>
            </span>

            <AtlanIcon
                icon="Reload"
                class="w-auto h-3 cursor-pointer text-primary"
                @click="refreshAudits"
            />
        </div>

        <div class="px-5 pb-4 mt-3">
            <ActivityTypeSelect
                v-model="activityType"
                :typeName="selectedAsset.typeName"
                @change="handleActivityTypeChange"
            ></ActivityTypeSelect>
        </div>
        <div
            v-if="auditList.length === 0 && isLoading"
            class="flex items-center justify-center text-sm leading-none"
        >
            <AtlanLoader class="h-5" />
            <span class="ml-1">Getting activity logs</span>
        </div>

        <div
            v-else-if="auditList.length > 0"
            class="flex-grow pt-3 overflow-y-auto"
        >
            <a-timeline class="mx-5" :key="item.guid">
                <a-timeline-item v-for="(log, index) in auditList" :key="index">
                    <template #dot>
                        <div v-if="log?.action === 'BUSINESS_ATTRIBUTE_UPDATE'">
                            <PreviewTabsIcon
                                :icon="
                                    getAuditEventComponent(log)?.icon?.value
                                        ?.options?.icon
                                "
                                :image="
                                    getAuditEventComponent(log)?.icon?.value
                                        ?.options?.image
                                "
                                :emoji="
                                    getAuditEventComponent(log)?.icon?.value
                                        ?.options?.emoji
                                "
                                height="h-4"
                                class="mb-0.5"
                            />
                        </div>
                        <atlan-icon
                            v-else-if="getAuditEventComponent(log)?.icon"
                            :icon="getAuditEventComponent(log)?.icon"
                            class="mb-1"
                        />
                        <div
                            v-else
                            class="mb-1 border ant-timeline-item-dot border-primary"
                        ></div>
                    </template>
                    <div>
                        <ActivityType
                            v-if="getAuditEventComponent(log)?.component"
                            :data="getAuditEventComponent(log)"
                        />
                        <template v-else>
                            <span class="font-bold">Metadata</span> updated
                        </template>

                        <!-- <template
                            v-if="getDetailsForEntityAuditEvent(log)?.component"
                        >
                            <ActivityType
                                :data="getDetailsForEntityAuditEvent(log)"
                            />
                        </template>-->
                    </div>
                    <div
                        v-if="
                            log.entityId !== item.guid &&
                            ['Table', 'View'].includes(item.typeName)
                        "
                        class="flex items-center mt-1 text-gray-700"
                    >
                        {{ getColumnName(log) }} (<span
                            class="tracking-wide text-gray-500 uppercase"
                            >Column</span
                        >)
                    </div>
                    <div
                        v-if="
                            log.entityId !== item.guid &&
                            ['AtlasGlossary'].includes(item.typeName) &&
                            getTermsAndCategoriesDetail(
                                log.detail.guid ??
                                    log.detail?.entityGuid ??
                                    log?.entityId
                            )?.guid
                        "
                        class="flex items-center mt-1 text-gray-700"
                    >
                        <div class="w-4 mr-1">
                            <AtlanIcon
                                :icon="
                                    getEntityStatusIcon(
                                        log.typeName,
                                        certificateStatus(
                                            getTermsAndCategoriesDetail(
                                                log.detail.guid ??
                                                    log.detail?.entityGuid ??
                                                    log?.entityId
                                            )
                                        )
                                    )
                                "
                                class="self-center text-gray-500 align-text-bottom"
                            />
                        </div>
                        <Tooltip
                            :tooltip-text="
                                getTermsAndCategoriesDetail(
                                    log.detail.guid ??
                                        log.detail?.entityGuid ??
                                        log?.entityId
                                )?.attributes?.name ?? ''
                            "
                            :classes="`font-bold`"
                        />
                    </div>

                    <div class="flex items-center mt-1 text-gray-500">
                        <div class="flex items-center">
                            <AtlanIcon icon="User" class="mr-1"></AtlanIcon>
                            {{ getActionUser(log.user) }}
                        </div>
                        <div class="mx-3 timeline-name-time-separator"></div>
                        <div>{{ timeAgo(log.created) }}</div>
                    </div>
                </a-timeline-item>
            </a-timeline>

            <!-- <a-timeline class="mx-5">
                <a-timeline-item v-for="(log, index) in audits" :key="index">
                    <template #dot>
                        <div
                            class="border ant-timeline-item-dot border-primary"
                        ></div>
                    </template>
                    <div>
                        <template
                            v-if="getDetailsForEntityAuditEvent(log)?.component"
                        >
                            <ActivityType
                                :data="getDetailsForEntityAuditEvent(log)"
                            />
                        </template>
                        <template v-else>
                            <div class="mb-3">
                                {{ getEventByAction(log)?.label || 'Event' }}
                            </div>
                        </template>
                    </div>
                    <div class="flex items-center leading-5 text-gray-500">
                        <div class="capitalize">
                            {{ getActionUser(log.user) }}
                        </div>
                        <div class="mx-3 timeline-name-time-separator"></div>
                        <div>{{ timeAgo(log.timestamp) }}</div>
                    </div>
                </a-timeline-item>
            </a-timeline> -->
            <div class="flex justify-center mb-8 text-center">
                <a-button
                    class="flex items-center justify-between py-2 transition-all duration-300 border-none rounded-full bg-primary-light text-primary"
                    @click="handleLoadMore"
                >
                    <template v-if="isLoadMore && !isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown"
                    /></template>

                    <AtlanLoader v-else-if="isLoading" class="h-5" />
                </a-button>
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center h-full">
            <EmptyScreen
                empty-screen="NoAssetsFound"
                image-class="h-44"
                desc="No logs found"
                descClass="text-center text-sm"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        reactive,
        computed,
        defineComponent,
        PropType,
        toRefs,
        ref,
    } from 'vue'

    import { useTimeAgo } from '@vueuse/core'
    import useAssetAudit from '~/composables/discovery/useAssetAudit'
    import EmptyScreen from '@/common/empty/index.vue'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { assetInterface } from '~/types/assets/asset.interface'
    import ActivityType from './activityType.vue'
    import { useAssetAuditSearch } from '~/composables/discovery/useAssetAuditSearch'
    import ActivityTypeSelect from '@/common/select/activityType.vue'
    import { activityTypeMap } from '~/constant/activityType'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { MinimalAttributes } from '~/constant/projection'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import Tooltip from '@/common/ellipsis/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'ActivityTab',
        components: {
            ActivityType,
            EmptyScreen,
            ActivityTypeSelect,
            Tooltip,
            PreviewTabsIcon,
        },

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            tab: {
                type: Object,
                required: false,
            },
        },

        setup(props) {
            const { selectedAsset: item } = toRefs(props)
            const params = reactive({ count: 10 })

            const { getEntityStatusIcon } = useGlossaryData()
            const limit = ref(10)
            const offset = ref(0)
            const fetchMoreAuditParams = reactive({ count: 10, startKey: '' })
            const dependentKey = ref('audit')

            const activityType = ref('all')

            const facets = ref()
            const facetsGTC = ref()
            const termAndCategoriesList = ref()
            const { certificateStatus, title } = useAssetInfo()

            if (['Table', 'View'].includes(item.value.typeName)) {
                facets.value = {
                    entityQualifiedName: item.value.attributes.qualifiedName,
                }
            } else if (['AtlasGlossary'].includes(item.value.typeName)) {
                facets.value = {
                    entityQualifiedName: item.value.attributes.qualifiedName,
                    typeNames: [item.value.typeName],
                }
            } else {
                facets.value = {
                    entityId: item.value.guid,
                }
            }

            const fetchTermsAndCategories = () => {
                const defaultAttributes = ref([...MinimalAttributes])
                const offsetGTC = ref(0)
                facetsGTC.value = {
                    guidList: [],
                    stateList: ['ACTIVE', 'DELETED'],
                }
                auditList.value.forEach((el) => {
                    if (
                        el?.detail?.guid &&
                        !facetsGTC.value?.guidList?.includes(el?.detail?.guid)
                    ) {
                        facetsGTC.value.guidList.push(el.detail.guid)
                    }
                })
                const dependentKeyGTC = ref('term&categories')
                const {
                    list: newList,
                    fetch,
                    error,
                } = useDiscoverList({
                    dependentKey: dependentKeyGTC,
                    limit,
                    offset: offsetGTC,
                    facets: facetsGTC,
                    attributes: defaultAttributes,
                    suppressLogs: true,
                })
                watch(newList, () => {
                    termAndCategoriesList.value = [...newList.value]
                })
            }
            const getTermsAndCategoriesDetail = (guid) => {
                const found = termAndCategoriesList.value?.find(
                    (el) => el?.guid === guid
                )
                return found
            }
            const preference = ref({
                sort: 'created-desc',
            })

            const getColumnName = (log) => {
                if (log.entityQualifiedName) {
                    const splitArray = log.entityQualifiedName.split('/')
                    return splitArray[splitArray.length - 1]
                }
                return ''
            }
            const {
                data,
                list: auditList,
                refresh,
                error,
                fetch,
                isLoading,
                isLoadMore,
                totalCount,
                quickChange,
                isReady,
            } = useAssetAuditSearch({
                guid: item.value.guid,
                isCache: false,
                dependentKey,
                queryText: '',
                limit,
                offset,
                facets,
                preference,
            })

            const { getAuditEventComponent, getActionUser } = useAssetAudit(
                params,
                item.value.guid
            )

            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }

            const refreshAudits = () => {
                refresh()
            }

            const handleLoadMore = () => {
                console.log('load more')
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                console.log('load more')
                quickChange()
            }

            const fetchMore = () => {
                fetchMoreAuditParams.startKey = audits?.value[
                    audits.value?.length - 1
                ].eventKey as string
                fetchMoreAudits(fetchMoreAuditParams)
            }

            // watch(
            //     () => item.value.guid,
            //     (newValue) => {
            //         fetchMoreAuditParams.startKey = ''

            //         facets.value = {
            //             entityId: item.value.guid,
            //         }

            //         fetchAudits(params, newValue)
            //     }
            // )

            const checkAuditsCount = computed(
                () => audits.value?.length < params.count
            )

            const handleActivityTypeChange = () => {
                console.log(activityType.value)

                let found = {}

                found = activityTypeMap.find((i) => {
                    if (!i.isGroup) {
                        if (i.value === activityType.value) {
                            return i
                        }
                    } else {
                        return i.children.some((j) => {
                            if (j.value === activityType.value) {
                                return j
                            }
                        })
                    }
                })

                if (found.isGroup) {
                    found = found.children.find((i) => {
                        if (i.value === activityType.value) {
                            return i
                        }
                    })
                }

                if (found) {
                    if (found?.value === 'all') {
                        facets.value.action = ''
                        facets.value.exists = []
                        facets.value.typeName = ''
                    } else {
                        facets.value.action = found.action || ''
                        facets.value.exists = found.exists
                        facets.value.typeName = found.typeName
                    }
                    quickChange()
                }
            }
            watch(isReady, () => {
                // fetch children terms and categories for glossary wide activity
                if (
                    isReady.value &&
                    ['AtlasGlossary'].includes(item.value.typeName)
                ) {
                    console.log(auditList)
                    fetchTermsAndCategories()
                }
            })

            return {
                error,
                isLoading,
                timeAgo,
                item,
                refreshAudits,
                fetchMore,
                getActionUser,
                emptyScreen,
                limit,
                offset,
                preference,
                facets,
                auditList,
                getAuditEventComponent,
                refresh,
                handleLoadMore,
                isLoadMore,
                totalCount,
                quickChange,
                getColumnName,
                activityType,
                activityTypeMap,
                handleActivityTypeChange,
                glossaryLabel,
                getTermsAndCategoriesDetail,
                getEntityStatusIcon,
                certificateStatus,
                title,
            }
        },
    })
</script>
