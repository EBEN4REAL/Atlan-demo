<template>
    <div class="w-full px-4 py-3 border-b border-gray-300 bg-gray-100" style='min-width: 374px;'>
        <div v-if='isLoading' class='flex justify-center items-center content-center'>
            <AtlanIcon icon='Loader' class='h-10 animate-spin' />
        </div>
        <div v-else class="flex w-full align-center items-center">
            <ClassificationIcon
                :classification="classification"
                :entity-guid="guid"
                :class-names="'h-6'"
            />
            <p class="text-lg font-gray-700 font-bold max-w-xs truncate mr-1 ml-2">{{ classification.displayName }}</p>
            <a-button class="px-1.5 py-1 ml-auto">
                <AtlanIcon icon="SidebarSwitch" style="height: auto" />
            </a-button>
        </div>
        <div
            v-if="!isPropagated && Object.keys(linkedUser).length > 0"
            class="flex gap-1 mt-1.5 text-sm content-center items-center flex-wrap"
        >
            <span class="text-gray-500">Linked by</span>
            <UserAvatar :username="linkedUser.username" />
            <span class="text-gray-700">{{ linkedUser.name }}</span>
            <span class="text-gray-500">{{ linkedAt }}</span>
        </div>
        <div
            v-else-if="isPropagated && Object.keys(propagatedVia).length > 0"
            class="flex gap-1 mt-1.5 text-sm content-center items-center text-gray-500 flex-wrap"
        >
            Propagated via <AtlanIcon :icon='propagatedViaIcon' /> <span class='text-gray-700'>{{ propagatedVia.displayText }}</span> {{ linkedAt }}
        </div>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import ClassificationIcon from '@/common/icon/classificationIcon.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import { useAssetAuditSearch } from '~/composables/discovery/useAssetAuditSearch'
    import { useUsers } from '~/composables/user/useUsers'
    import UserAvatar from '@/common/avatar/user.vue'
    import useFetchAssetList from '@common/assetList/usefetchAssetList'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { AssetAttributes, InternalAttributes, SQLAttributes } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { and } from '@vueuse/core'

    dayjs.extend(relativeTime)

    export default defineComponent({
        name: 'ClassificationHead',
        components: {
            ClassificationIcon,
            AtlanIcon,
            UserAvatar
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
            entityGuid: {
                type: String,
                required: true,
                default: ''
            }
        },
        setup(props) {
            const classification = ref<ClassificationInterface>(props.classification)
            const guid = ref(props.entityGuid)
            const limit = ref(1)
            const offset = ref(0)
            const dependentKey = ref('CLASSIFICATION_ACCESS_LOG')
            const facets = ref({
                entityId: classification.value.entityGuid,
                action: 'CLASSIFICATION_ADD'
            })
            const preference = ref({
                sort: 'created-desc',
            })

            const linkedByUserName = ref('')

            const isPropagated = computed(() => {
                if (!guid.value) {
                    return false
                }
                return guid.value !== classification.value.entityGuid;
            })

            const {
                list: auditList,
                isLoading: isAuditLoading,
            } = useAssetAuditSearch({
                guid: classification.value.entityGuid,
                isCache: false,
                dependentKey,
                limit,
                offset,
                facets,
                preference,
            })

            const linkedUser = ref({})
            const linkedAt = ref('')

            const propagatedVia = ref({})
            const isUserLoading = ref(false)

            watch(linkedByUserName, () => {
                if (
                    linkedByUserName.value.length === 0
                    || isPropagated.value
                ) {
                    return
                }
                const params = {
                    limit: 1,
                    offset: 0,
                    filter: {
                        $and: [{ username: linkedByUserName.value }],
                    },
                }
                const { userList, isLoading: isUserLoadingInner } = useUsers(params)
                isUserLoading.value = isUserLoadingInner.value
                watch(isUserLoading, () => {
                    isUserLoading.value = isUserLoadingInner.value
                    if (!isUserLoading.value && userList.value.length > 0) {
                        linkedUser.value = { ...userList.value[0] }
                    }
                })
            })

            watch(isAuditLoading, () => {
                if (!isAuditLoading.value && auditList.value.length > 0) {
                    linkedByUserName.value = auditList.value[0].user
                    const created = dayjs(auditList.value[0].created)
                    linkedAt.value = dayjs().to(created)
                }
            })

            const assetFetchData = {
                queryText: ref(''),
                limit: ref(1),
                offset: ref(0),
                facets: computed(() => ({
                    guid: classification.value.entityGuid
                })),
                postFacets: ref({}),
                aggregations: ref([]),
                preference: ref({ sort: 'default', display: [] }),
                isCache: false,
                dependentKey,
                attributes: ref([
                    'certificateStatus'
                ])
            }

            const {
                list,
                isLoading: isAssetLoading
            } = useDiscoverList(assetFetchData)

            watch(isAssetLoading, () => {
                if (!isAssetLoading.value && list.value && list.value.length > 0) {
                    propagatedVia.value = { ...list.value[0] }
                }
            })

            const propagatedViaIcon = computed(() => {
                if (Object.keys(propagatedVia).length > 0) {
                    const typeOfEntity = propagatedVia.value.typeName
                    if (propagatedVia.value?.attributes?.certificateStatus) {
                        switch (propagatedVia.value?.attributes?.certificateStatus) {
                            case 'DRAFT': {
                                return `${typeOfEntity}Draft`
                            }

                            case 'VERIFIED': {
                                return `${typeOfEntity}Verified`
                            }

                            case 'DEPRECATED': {
                                return `${typeOfEntity}Deprecated`
                            }

                            default: {
                                return `${typeOfEntity}`
                            }
                        }
                    }
                    else {
                        return `${typeOfEntity}`
                    }
                }
                return ''
            })

            const isLoading = and(isUserLoading, isAuditLoading, isAssetLoading)

            return {
                linkedUser,
                linkedAt,
                isPropagated,
                guid,
                propagatedVia,
                propagatedViaIcon,
                isLoading
            }
        }
    })
</script>