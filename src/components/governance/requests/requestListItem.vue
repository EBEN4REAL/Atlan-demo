<template>
    <div
        class="grid items-center justify-between grid-cols-10 pl-4 bg-white border-t border-gray-light border-style-500 group gap-x-4 request-card"
        style="height: 72px"
        :class="{
            'bg-primary-light': selected,
            'active-request outline-1 bg-primary-light': active,
            'bg-primary-light': activeHover === request.id,
        }"
        @click="$emit('select')"
    >
        <div
            class="flex items-center overflow-hidden"
            :class="showRequestStatus ? 'col-span-4' : 'col-span-4'"
        >
            <!-- TODO: Uncomment for bulk selection -->
            <!-- <a-checkbox :checked="selected" class="mr-4" /> -->
            <!-- <Popover
                :item="item"
                :show-preview-link="false"
                @previewAsset="handleShowAssetSidebar(item.guid)"
            >
              
            </Popover> -->
            <div
                class="flex items-center cursor-pointer"
                :class="showRequestStatus ? 'w-full' : ''"
                @mouseenter="$emit('mouseEnterAsset')"
                @click="handleShowAssetSidebar(item)"
            >
                <div
                    v-if="
                        [
                            'AtlasGlossaryTerm',
                            'AtlasGlossaryCategory',
                            'AtlasGlossary',
                        ].includes(request?.entityType) &&
                        ![
                            'create_term',
                            'create_category',
                            'create_glossary',
                        ].includes(request?.requestType)
                    "
                >
                    <div class="flex items-center">
                        <span>{{
                            request?.destinationEntity?.attributes?.name
                        }}</span>
                        <CertificateBadge
                            v-if="
                                request?.destinationEntity?.attributes
                                    ?.certificateStatus
                            "
                            :status="
                                request?.destinationEntity?.attributes
                                    ?.certificateStatus
                            "
                            class="mb-1 ml-1"
                            :username="
                                request?.destinationEntity?.attributes
                                    ?.certificateUpdatedBy
                            "
                        />
                    </div>
                    <span
                        class="flex items-center mt-1 space-x-1 text-gray-500"
                    >
                        <atlan-icon
                            :icon="
                                capitalizeFirstLetter(
                                    glossaryLabel[request?.entityType]
                                )
                            "
                            class="mb-1 mr-1"
                        ></atlan-icon>

                        {{
                            capitalizeFirstLetter(
                                glossaryLabel[request?.entityType]
                            )
                        }}
                    </span>
                </div>
                <AssetPiece
                    v-else-if="request.destinationQualifiedName"
                    :asset-qf-name="request.destinationQualifiedName"
                    :entity-type="request?.entityType"
                    :destination-entity="request.destinationEntity"
                    :size="size"
                />
                <GlossaryPopover
                    v-else-if="
                        request?.requestType === 'create_term' ||
                        (request?.requestType === 'create_category' &&
                            request?.payload)
                    "
                    :term="{
                        guid: request?.payload?.relationshipAttributes?.anchor
                            ?.guid,
                    }"
                    placement="right"
                    :mouse-enter-delay="1"
                    :excludeFields="['terms', 'categories']"
                >
                    <div>
                        <span class="mb-1">{{
                            request.payload?.relationshipAttributes?.anchor
                                ?.attributes?.name
                        }}</span>
                        <div class="flex items-center text-gray-500">
                            <atlan-icon icon="Glossary" class="w-4 mr-1" />
                            <span>Glossary</span>
                        </div>
                    </div>
                </GlossaryPopover>
                <span v-else class="text-sm overflow-ellipsis">
                    {{
                        primaryText[request.requestType]
                            ? primaryText[request.requestType](request)
                            : ''
                    }}
                </span>
            </div>
        </div>
        <div
            class="flex items-center col-span-3"
            :class="showActions || showRequestStatus ? '' : 'w-full ml-24'"
        >
            <ClassificationPiece
                v-if="
                    request?.requestType === 'create_typedef' &&
                    request?.payload?.classificationDefs
                "
                :data="request.payload.classificationDefs"
            />
            <ClassificationPiece
                v-else-if="request?.requestType === 'attach_classification'"
                :type-name="request.payload.typeName"
            />

            <TermPiece
                v-else-if="
                    request?.requestType === 'create_term' && request?.payload
                "
                :data="request.payload"
                requestType="create_term"
            />
            <CategoryPiece
                v-else-if="
                    request?.requestType === 'create_category' &&
                    request?.payload
                "
                :data="request.payload"
                requestType="create_category"
            />

            <TermPiece
                v-else-if="request.requestType === 'term_link'"
                :data="request?.sourceEntity?.attributes"
                :request="request"
            />
            <BMPiece
                v-else-if="request.requestType === 'bm_attribute'"
                :data="request"
            />

            <AttrPiece
                v-else-if="request.destinationAttribute"
                :name="request.destinationAttribute"
                :value="request.destinationValue"
                :status="request.status"
                :request="request"
                :value-array="request?.destinationValueArray"
                :loading="state.isLoading"
                :is-approval-loading="state.isApprovalLoading"
                :has-access="hasAccessForAction"
                @accept="(message) => handleApproval(message || '')"
                @reject="(message) => handleRejection(message || '')"
                @switch-popover="
                    (val) => {
                        updatePopoverActive = val
                    }
                "
            />

            <AssetPiece
                v-else-if="request.sourceQualifiedName"
                :asset-qf-name="request.sourceQualifiedName"
                :entity-type="request?.entityType"
            />
        </div>

        <div
            v-if="showActions"
            class="flex items-center justify-end col-span-3"
        >
            <!-- <AtlanIcon
                v-if="state.isLoading"
                icon="CircleLoader"
                class="w-5 h-5 text-gray animate-spin"
            /> -->
            <!-- <div v-else-if="selected"> -->
            <div class="pr-5">
                <div
                    v-if="
                        activeHover === request.id &&
                        request.status === 'active' &&
                        !updatePopoverActive &&
                        hasAccessForAction
                    "
                    v-auth="[map.APPROVE_REQUEST]"
                    class="flex items-center justify-end font-bold"
                >
                    <!-- <AtlanIcon
                        v-if="state.isLoading"
                        icon="CircleLoader"
                        class="w-5 h-5 text-gray animate-spin"
                    /> -->
                    <RequestActions
                        v-if="request.status === 'active'"
                        :request="request"
                        :loading="state.isLoading"
                        :is-approval-loading="state.isApprovalLoading"
                        @accept="handleApproval"
                        @reject="handleRejection"
                    />
                    <div
                        v-else-if="
                            request.status === 'approved' ||
                            request.status === 'rejected'
                        "
                        class="flex items-center justify-end font-light whitespace-nowrap"
                        :class="
                            request.status === 'approved'
                                ? 'text-success'
                                : 'text-error'
                        "
                    >
                        {{
                            request.status === 'approved'
                                ? 'Approved by'
                                : 'Rejected by'
                        }}
                        <div class="flex items-center mx-2 truncate">
                            <Avatar
                                :allow-upload="false"
                                :avatar-name="nameUpdater"
                                :avatar-size="18"
                                :avatar-shape="'circle'"
                                class="mr-2"
                            />

                            <span class="text-gray-700">{{ nameUpdater }}</span>
                        </div>
                        <DatePiece
                            label="Created At"
                            :no-popover="true"
                            class="font-light text-gray-500"
                            :date="updatedAt"
                        />
                        <IconStatus
                            :request="request"
                            :name-updater="nameUpdater"
                        />
                    </div>
                </div>

                <div
                    v-else-if="
                        activeHover === request.id &&
                        request.status === 'active' &&
                        !hasAccessForAction
                    "
                >
                    <p class="text-sm">
                        You don't have access to review this request
                    </p>
                </div>

                <div v-else class="flex justify-end">
                    <div class="flex items-center justify-end gap-x-1">
                        <Avatar
                            :allow-upload="false"
                            :avatar-name="request.created_by_user?.username"
                            avatar-size="24"
                            :avatar-shape="'circle'"
                            :image-url="request.createdBy ? '' : atlanLogo"
                        />

                        <div class="flex flex-col ml-2 avatar-name">
                            <UserPiece
                                :user="{ username: request.createdBy }"
                                :is-pill="false"
                                :default-name="'Atlan Bot'"
                            />
                            <div class="text-xs font-light text-gray-500">
                                {{ createdAt }}
                            </div>
                            <!-- <DatePiece
                                label="Created At"
                                :date="request.createdAt"
                                class="text-gray-500"
                            /> -->
                        </div>
                        <IconStatus
                            :request="request"
                            :name-updater="nameUpdater"
                        />
                    </div>
                    <!-- <div class="flex items-center">
                        <AtlanIcon
                            v-if="
                                request.status === 'approved' &&
                                request.approvedBy[0]?.message
                            "
                            class="mr-3 text-success check-icon"
                            icon="MessageSuccess"
                        />
                        <AtlanIcon
                            v-if="
                                request.status === 'approved' &&
                                !request.approvedBy[0]?.message
                            "
                            class="mr-2 text-success check-icon"
                            icon="Check"
                        />
                        <div
                            class="flex items-center font-light"
                            :class="
                                request.status === 'approved'
                                    ? 'text-success'
                                    : 'text-error'
                            "
                        >
                            {{
                                request.status === 'approved'
                                    ? 'Approved by'
                                    : 'Rejected by'
                            }}

                            <div class="flex items-center mx-2 truncate">
                                <Avatar
                                    :allow-upload="false"
                                    :avatar-name="nameUpdater"
                                    :avatar-size="18"
                                    :avatar-shape="'circle'"
                                    class="mr-2"
                                />

                                <span class="text-gray-700">{{
                                    nameUpdater
                                }}</span>
                            </div>
                            <DatePiece
                                label="Created At"
                                :date="
                                    request.status === 'approved'
                                        ? request.approvedBy[0].timestamp
                                        : request.rejectedBy[0].timestamp
                                "
                                :no-popover="true"
                                class="font-light text-gray-500"
                            />
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <div
            v-if="showRequestStatus"
            class="flex items-center col-span-3 ml-10 text-sm"
        >
            <div v-if="activeHover === request.id" class="flex items-center">
                <div v-if="request.status === 'active'" class="flex flex-col">
                    <span class="flex items-center mb-1 text-yellow-500">
                        Pending</span
                    >
                    <a-popover placement="rightBottom">
                        <template #content>
                            <AdminList></AdminList>
                        </template>
                        <span class="cursor-pointer"
                            >Reviewers<atlan-icon
                                icon="CaretDown"
                                class="mx-0.5 h-3"
                        /></span>
                    </a-popover>
                </div>
                <div
                    :class="
                        request.status === 'approved'
                            ? 'text-success'
                            : 'text-error'
                    "
                    v-else
                >
                    {{
                        request.status === 'approved'
                            ? 'Approved by'
                            : 'Rejected by'
                    }}

                    <div
                        class="flex items-center mt-1 font-light whitespace-nowrap"
                    >
                        <div class="flex items-center truncate">
                            <Avatar
                                :allow-upload="false"
                                :avatar-name="nameUpdater"
                                :avatar-size="18"
                                :avatar-shape="'circle'"
                                class="mr-2"
                            />
                            <span
                                class="text-gray-700 truncate overflow-ellipsis"
                                :style="'max-width: 100px'"
                                >{{ nameUpdater }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="request.status === 'active'" class="flex flex-col">
                    <span class="flex items-center mb-1 text-yellow-500">
                        Pending</span
                    >
                    <span class="text-gray-500">
                        <DatePiece
                            :no-popover="true"
                            class="text-gray-500"
                            :date="request?.createdAt"
                        />
                    </span>
                </div>
                <div
                    :class="
                        request.status === 'approved'
                            ? 'text-success'
                            : 'text-error'
                    "
                    v-else
                >
                    {{
                        request.status === 'approved' ? 'Approved' : 'Rejected'
                    }}
                </div>
            </div>
        </div>
        <AssetDrawer
            key="asset-sidebar-asset-popover"
            :guid="assetGuid"
            :show-drawer="showAssetSidebar"
            @closeDrawer="handleCloseAssetSidebar"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        reactive,
        toRefs,
        onMounted,
        watch,
        ref,
        computed,
        defineAsyncComponent,
    } from 'vue'
    import { message } from 'ant-design-vue'
    // import { useMagicKeys, whenever } from '@vueuse/core'
    import { useTimeAgo } from '@vueuse/core'
    import GlossaryPopover from '@common/popover/glossary/index.vue'
    import atlanLogo from '~/assets/images/atlan-logo.png'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    import RequestActions from './requestActions.vue'
    import Avatar from '~/components/common/avatar/index.vue'
    import { Users } from '~/services/service/users/index'
    import ClassificationPiece from './pieces/classifications.vue'
    import AssetPiece from './pieces/asset.vue'
    import AttrPiece from './pieces/attributeUpdate.vue'
    import UserPiece from './pieces/user.vue'
    import DatePiece from './pieces/date.vue'
    import TermPiece from './pieces/term.vue'
    import BMPiece from './pieces/bm.vue'
    import CategoryPiece from './pieces/category.vue'

    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { handleAccessForRequestAction } from '~/composables/requests/useRequests'

    import map from '~/constant/accessControl/map'

    import IconStatus from './iconStatus.vue'
    import Popover from '@/common/popover/assets/index.vue'
    import { RequestAttributes } from '~/types/atlas/requests'
    import CertificateBadge from '@common/badge/certificate/index.vue'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'
    import { capitalizeFirstLetter } from '~/utils/string'
    import {
        approveRequest,
        declineRequest,
    } from '~/composables/requests/useRequests'
    import {
        primaryText,
        requestTypeIcon,
        requestTypeEventMap,
    } from './requestType'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    export default defineComponent({
        name: 'RequestListItem',
        components: {
            VirtualList,
            CertificateBadge,
            RequestActions,
            ClassificationPiece,
            AssetPiece,
            AttrPiece,
            UserPiece,
            DatePiece,
            TermPiece,
            Avatar,
            IconStatus,
            Popover,
            AssetDrawer,
            CategoryPiece,
            GlossaryPopover,
            BMPiece,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
        },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
            selected: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            active: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            activeHover: {
                type: String,
                default: () => '',
                required: false,
            },
            showActions: {
                type: Boolean,
                required: false,
                default: true,
            },
            size: {
                type: String,
                required: false,
                default: () => 'default',
            },
            showRequestStatus: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['select', 'action'],
        setup(props, { emit }) {
            const { request } = toRefs(props)
            const updatedBy = ref({})
            const updatePopoverActive = ref(false)
            const hasAccessForAction = ref(false)

            const state = reactive({
                isLoading: false,
                isApprovalLoading: false,
                message: '',
            })
            function raiseErrorMessage(msg?: string) {
                message.error(msg || 'Request modification failed, try again')
            }

            const showAssetSidebar = ref(false)
            const assetGuid = ref('false')
            const handleCloseAssetSidebar = () => {
                assetGuid.value = ''
                showAssetSidebar.value = false
            }
            const handleShowAssetSidebar = (asset) => {
                if (
                    [
                        'create_term',
                        'create_category',
                        'create_glossary',
                    ].includes(request.value?.requestType)
                )
                    assetGuid.value =
                        request.value?.payload?.relationshipAttributes?.anchor?.guid
                else assetGuid.value = asset?.guid
                showAssetSidebar.value = true
            }

            const handleEvent = (action) => {
                let request_type
                if (
                    request.value?.destinationAttribute &&
                    requestTypeEventMap[request.value?.destinationAttribute]
                        ?.requestType
                ) {
                    request_type =
                        requestTypeEventMap[request.value?.destinationAttribute]
                            .requestType
                } else
                    request_type =
                        requestTypeEventMap[request.value?.requestType]
                            .requestType

                useAddEvent('governance', 'requests', 'resolved', {
                    action,
                    request_type,
                    widget_type: 'table',
                })
            }
            async function handleApproval(messageProp = '') {
                state.isApprovalLoading = true
                try {
                    await approveRequest(request.value.id, messageProp)
                    request.value.message = state.message
                    request.value.status = 'approved'
                    emit('action', request.value)
                    message.success('Request approved')
                    handleEvent('approve')
                } catch (error) {
                    console.log(error)
                    raiseErrorMessage()
                }
                state.isApprovalLoading = false
            }

            async function handleRejection(messageProp = '') {
                state.isLoading = true
                try {
                    await declineRequest(request.value.id, messageProp)
                    request.value.message = state.message
                    request.value.status = 'rejected'
                    emit('action', request.value)
                    message.success('Request declined')
                    console.log(request.value)
                    handleEvent('decline')
                } catch (error) {
                    raiseErrorMessage()
                }
                state.isLoading = false
            }
            // onMounted(() => {
            //     if (
            //         request.value.status === 'approved' ||
            //         request.value.status === 'rejected'
            //     ) {
            //         const userId =
            //             request.value.status === 'approved'
            //                 ? `${request.value.approvedBy[0].userId}`
            //                 : `${request.value.rejectedBy[0].userId}`
            //         const payloadFilter = {
            //             $and: [
            //                 {
            //                     id: userId,
            //                 },
            //             ],
            //         }
            //         const { data } = Users.List(
            //             {
            //                 limit: 1,
            //                 offset: 0,
            //                 filter: JSON.stringify(payloadFilter),
            //             },
            //             { cacheKey: userId }
            //         )
            //         watch(data, () => {
            //             if (!data?.value?.records) {
            //                 updatedBy.value = {
            //                     username: '',
            //                 }
            //             } else {
            //                 updatedBy.value = data?.value?.records[0]
            //             }
            //         })
            //     }
            // })
            const nameUpdater = computed(() => {
                if (request.value.status === 'approved') {
                    const userUpdater = request.value?.approvedBy || []
                    return userUpdater[0]?.username || ''
                }
                if (request.value.status === 'rejected') {
                    const userUpdater = request.value?.rejectedBy || []
                    return userUpdater[0]?.username || ''
                }
                return ''
            })
            const timeUpdated = computed(() => {
                if (request.value.status === 'approved') {
                    const time = request.value?.approvedBy || []
                    return time[0]?.timestamp || ''
                }
                if (request.value.status === 'rejected') {
                    const time = request.value?.rejectedBy || []
                    return time[0]?.timestamp || ''
                }
                return ''
            })
            const item = computed(() => {
                const name =
                    request?.value?.destinationQualifiedName
                        ?.split('/')
                        ?.slice(-3)
                        ?.reverse() || []
                return {
                    ...request.value,
                    guid: request.value.destinationGuid,
                    displayText:
                        request.value?.destinationEntity?.attributes?.name,
                    typeName: request.value?.entityType,
                    attributes: {
                        connectorName:
                            request.value?.destinationEntity?.attributes.qualifiedName.split(
                                '/'
                            )[1],
                        rowCount: 0,
                        columnCount: 0,
                        schemaName: name[1],
                        ownerUsers: [],
                        tableName: name[2],
                        certificateStatus:
                            request.value?.destinationEntity?.attributes
                                ?.certificateStatus,
                        certificateUpdatedBy:
                            request.value?.destinationEntity?.attributes
                                ?.certificateUpdatedBy,
                        certificateUpdatedAt:
                            request.value?.destinationEntity?.attributes
                                ?.certificateUpdatedAt,
                    },
                }
            })
            const createdAt = useTimeAgo(request.value.createdAt)
            const updatedAt = useTimeAgo(timeUpdated.value)

            onMounted(() => {
                const { hasAccess } = handleAccessForRequestAction(
                    request.value
                )

                hasAccessForAction.value = hasAccess
            })

            return {
                handleApproval,
                handleRejection,
                primaryText,
                requestTypeIcon,
                state,
                atlanLogo,
                nameUpdater,
                item,
                timeUpdated,
                createdAt,
                updatedAt,
                showAssetSidebar,
                assetGuid,
                handleCloseAssetSidebar,
                handleShowAssetSidebar,
                glossaryLabel,
                capitalizeFirstLetter,
                updatePopoverActive,
                hasAccessForAction,
                map,
            }
        },
    })
</script>

<style lang="less" scoped>
    .request-card {
        &.active-request {
            // outline-style: solid !important;
            // outline-color: rgb(82, 119, 215) !important;
        }
        outline-offset: -1px !important;
    }
</style>

<style lang="less">
    .avatar-name {
        width: 85px !important;
        margin-right: 10px !important;
    }
    .message-icon {
        transform: scale(1.4) !important;
    }
    .check-icon {
        transform: scale(1.4) !important;
    }
    .cross-icon {
        transform: scale(1.1) !important;
    }
    .message-cross-icon {
        transform: scale(1.5) !important;
    }
</style>
