<template>
    <div class="mb-3">
        <div
            class="relative mx-1 border border-gray-200 rounded-lg cursor-pointer hover:border-primary card-container"
        >
            <div class="flex items-center bg-gray-100 px-3 py-3">
                <div
                    v-if="item.requestType === 'term_link' && isGlossary"
                    class="text-sm font-bold text-gray-500"
                >
                    Link Asset
                </div>
                <div v-else class="text-sm font-bold text-gray-500">
                    {{ typeCopyMapping[item?.requestType] }}
                    {{ destinationAttributeMapping[item.destinationAttribute] }}
                </div>
                <!-- <div class="flex">
                    <span class="ml-1 text-gray-400 truncate"
                        >has requested to</span
                    >
                    <span class="ml-1 font-bold text-gray-700 truncate"
                        >{{
                            item?.requestType === 'attribute'
                                ? `${typeCopyMapping[item?.requestType]} ${
                                      typeCopyMapping[
                                          item?.destinationAttribute
                                      ]
                                  }`
                                : typeCopyMapping[item?.requestType]
                        }}
                    </span>
                    <span
                        v-if="selectedAsset.typeName === 'AtlasGlossaryTerm'"
                        class="ml-1 text-gray-400"
                        >on</span
                    >
                </div> -->
                <div
                    v-if="item.status === 'active'"
                    v-auth="[map.APPROVE_REQUEST]"
                    class="flex -mr-1.5 hover-action linear-gradient"
                >
                    <RequestDropdown
                        :type="'approve'"
                        :is-loading="loadingApproval"
                        :item-drop-down="'Approve with comment'"
                        @submit="(message) => handleApproval(message || '')"
                    >
                        <span class="text-xs text-green-500"> Approve </span>
                    </RequestDropdown>
                    <RequestDropdown
                        :type="'reject'"
                        :is-loading="isLoading"
                        :class="'mr-cta'"
                        :item-drop-down="'Reject with comment'"
                        @submit="(message) => handleRejection(message || '')"
                    >
                        <span class="text-xs text-red-500"> Reject </span>
                    </RequestDropdown>
                </div>
                <!-- hover-reject-approve -->
                <div class="flex items-center justify-end ml-auto">
                    <div
                        v-if="
                            item.status === 'rejected' ||
                            item.status === 'approved'
                        "
                        class="flex items-center justify-end text-xs font-light whitespace-nowrap linear-gradient hover-reject-approve"
                        :class="
                            item.status === 'approved'
                                ? 'text-success'
                                : 'text-error'
                        "
                    >
                        {{
                            item.status === 'approved'
                                ? 'Approved by'
                                : 'Rejected by'
                        }}
                        <div class="flex items-center mx-1 truncate">
                            <Avatar
                                :allow-upload="false"
                                :avatar-name="nameUpdater"
                                :avatar-size="18"
                                :avatar-shape="'circle'"
                                class="mr-1"
                            />

                            <span class="text-xs text-gray-700">{{
                                nameUpdater
                            }}</span>
                        </div>
                    </div>
                    <AtlanIcon
                        v-if="
                            item.status === 'rejected' ||
                            item.status === 'approved'
                        "
                        :class="{
                            'approved-icon text-success':
                                item.status === 'approved',
                            'rejected-icon': item.status === 'rejected',
                        }"
                        :icon="
                            item.status === 'rejected' ? 'CrossCircle' : 'Check'
                        "
                    />
                    <AtlanIcon v-else icon="Clock" class="icon-warning" />
                </div>
            </div>
            <div v-if="item.requestType === 'term_link' && isGlossary">
                <div
                    class="p-3 my-2 mr-1 text-xs bg-gray-100 rounded asset-term"
                >
                    <div class="mb-1 text-primary">
                        {{ assetText[0] }}
                        <CertificateBadge
                            v-if="
                                item.destinationEntity?.attributes
                                    ?.certificateStatus
                            "
                            :status="
                                item.destinationEntity?.attributes
                                    ?.certificateStatus
                            "
                            class="mb-1 ml-1"
                            :username="
                                item.destinationEntity?.attributes
                                    ?.certificateUpdatedBy
                            "
                            :timestamp="timeAgo"
                        />
                    </div>
                    <div class="flex items-center">
                        <AtlanIcon class="mr-1" :icon="assetIcon" />
                        <span
                            class="ml-1 overflow-hidden text-gray-500 overflow-ellipsis"
                            >{{ item.entityType.toUpperCase() }}</span
                        >
                        <AtlanIcon class="mx-1 ml-2" icon="Schema2" />
                        <span
                            class="overflow-hidden text-gray-500 overflow-ellipsis"
                        >
                            {{ assetText[2] }}</span
                        >
                        <AtlanIcon class="mx-1 ml-2" icon="SchemaGray" />

                        <span
                            class="overflow-hidden text-gray-500 overflow-ellipsis"
                        >
                            {{ assetText[1] }}</span
                        >
                    </div>
                </div>
                <!-- <div class="ml-auto text-sm text-right text-gray-500">
                    {{ createdTime(item.createdAt) }}
                </div> -->
            </div>

            <div v-else class="flex items-center justify-between p-3">
                <div
                    v-if="item.requestType === 'attach_classification'"
                    class="w-fit"
                >
                    <Popover
                        v-if="localClassification(item.payload.typeName)"
                        :classification="
                            localClassification(item.payload.typeName)
                        "
                        label-key="displayName"
                        popover-trigger="hover"
                        read-only
                        :is-plain="true"
                        :mouse-enter-delay="mouseEnterDelay"
                        @mouse-entered="enteredPill"
                    >
                        <ClassificationPill
                            class="clasification-pill"
                            :name="
                                localClassification(item.payload.typeName).name
                            "
                            :display-name="
                                localClassification(item.payload.typeName)
                                    ?.displayName
                            "
                            :allow-delete="false"
                            :color="
                                localClassification(item.payload.typeName)
                                    .options?.color
                            "
                            :created-by="
                                localClassification(item.payload.typeName)
                                    ?.createdBy
                            "
                        />
                    </Popover>
                </div>

                <div
                    v-else-if="
                        item.destinationAttribute === 'certificateStatus'
                    "
                >
                    <CertificatePill
                        class="px-2 py-1 text-sm rounded-full classification-pill"
                        :status="item.destinationValue"
                    />
                </div>
                <div v-else-if="item.destinationAttribute === 'ownerUsers'">
                    <!-- <PopOverUser :item="item.destinationValue"> -->
                    <div v-if="item?.destinationValueArray?.length" class=" flex items-center">
                        <UserPill
                            class="classification-pill"
                            :username="item.destinationValueArray[0]"
                        />
                        <a-popover
                            v-if="item?.destinationValueArray?.length > 1"
                        >
                            <template #content>
                                <div class="flex flex-col">
                                    <template
                                        v-for="i in item?.destinationValueArray.slice(
                                            1
                                        )"
                                        :key="i"
                                    >
                                        <span
                                            class="border-gray-200 px-2 py-1 flex items-center"
                                            ><atlan-icon
                                                icon="User"
                                                class="mr-1 h-3"
                                            />{{ i }}</span
                                        >
                                    </template>
                                </div>
                            </template>

                            <span
                                v-if="item?.destinationValueArray?.length > 1"
                                class="text-primary flex items-center cursor-pointer"
                                >+
                                {{
                                    item?.destinationValueArray?.length - 1
                                }}
                                more</span
                            >
                        </a-popover>
                    </div>

                    <UserPill
                        v-else
                        class="classification-pill"
                        :username="item.destinationValue"
                    />
                    <!-- </PopOverUser> -->
                </div>
                <div
                    v-else-if="item.requestType === 'term_link' && !isGlossary"
                >
                    <TermPopover
                        :loading="termLoading"
                        :fetched-term="getFetchedTerm(item.sourceGuid)"
                        :error="termError"
                        trigger="hover"
                        :ready="isReady"
                        :term="{ guid: item.sourceGuid }"
                        @visible="handleTermPopoverVisibility"
                    >
                        <Pill
                            :label="item?.sourceEntity?.attributes?.name"
                            :has-action="false"
                        >
                            <template #prefix>
                                <AtlanIcon icon="Term" />
                            </template>
                        </Pill>
                    </TermPopover>
                </div>
                <TermPiece
                    v-else-if="
                        item?.requestType === 'create_term' && item?.payload
                    "
                    :data="item.payload"
                    :show-label="false"
                    requestType="create_term"
                />
                <CategoryPiece
                    v-else-if="
                        item?.requestType === 'create_category' && item?.payload
                    "
                    :data="item.payload"
                    :show-label="false"
                    requestType="create_category"
                />

                <div v-else class="text-sm text-gray-700 truncate">
                    {{ item.destinationValue }}
                </div>
            </div>

            <div
                class="flex px-3 py-2 mt-2 border-t border-gray-200 text-gray-500"
            >
                <span class="mr-2">by</span>
                <AtlanIcon
                    v-if="item.createdBy?.startsWith('service-account-apikey-')"
                    class="h-3 mt-1"
                    icon="Key"
                />

                <Avatar
                    v-else
                    :allow-upload="false"
                    :avatar-name="item.created_by_user?.username"
                    :avatar-size="16"
                    :avatar-shape="'circle'"
                    :image-url="item.createdBy ? '' : atlanLogo"
                />
                <span class="ml-2 text-gray-500">{{
                    item.createdBy?.startsWith('service-account-apikey-')
                        ? 'API key'
                        : item.createdBy
                }}</span>
                <div class="flex ml-auto">
                    <a-popover
                        v-if="messageUpdate"
                        trigger="hover"
                        placement="bottomLeft"
                        :align="{ offset: [0] }"
                    >
                        <template #content>
                            <div class="comment-delete">
                                <div class="flex">
                                    <component :is="iconQuotes" class="mr-4" />
                                    <p>{{ messageUpdate }}</p>
                                </div>
                                <div class="flex items-center mt-4">
                                    <Avatar
                                        :allow-upload="false"
                                        :avatar-size="16"
                                        :avatar-shape="'circle'"
                                        class="mr-2"
                                    />
                                    <span class="text-gray-700">{{
                                        nameUpdater
                                    }}</span>
                                </div>
                            </div>
                        </template>
                        <div class="flex items-center ml-auto">
                            <AtlanIcon icon="Comment" />
                            <div class="ml-1 text-sm text-right text-gray-500">
                                1
                            </div>
                            <span class="mx-2 text-gray-300">•</span>
                        </div>
                    </a-popover>
                    <div class="text-sm text-right text-gray-500">
                        <a-tooltip placement="topLeft">
                            <template #title>
                                <span>{{
                                    dayjs(item.createdAt).format(
                                        'MMM DD, YYYY, hh:mm:ss a'
                                    )
                                }}</span>
                            </template>
                            {{ createdTime(item.createdAt) }}
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="mx-4 mt-1 border-b border-gray-light" /> -->
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        watch,
        onMounted,
    } from 'vue'
    import { useTimeAgo, useTimeAgo } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import CertificateBadge from '@common/badge/certificate/index.vue'
    import UserPill from '@common/pills/user.vue'
    import CertificatePill from '@common/pills/certificate.vue'
    import dayjs from 'dayjs'
    import atlanLogo from '~/assets/images/atlan-logo.png'
    import Pill from '~/components/UI/pill/pill.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import TermPiece from '@/governance/requests/pieces/term.vue'
    import CategoryPiece from '@/governance/requests/pieces/category.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import {
        typeCopyMapping,
        destinationAttributeMapping,
        requestTypeEventMap,
    } from '~/components/governance/requests/requestType'
    import {
        approveRequest,
        declineRequest,
    } from '~/composables/requests/useRequests'
    import Popover from '@/common/popover/classification/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import Avatar from '~/components/common/avatar/index.vue'
    import TermPopover from '@/common/popover/term/term.vue'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import AtlanButton from '@/UI/button.vue'
    import RequestDropdown from '~/components/common/dropdown/requestDropdown.vue'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'
    import map from '~/constant/accessControl/map'
    import { useRoute } from 'vue-router'
    // import PopOverUser from '@/common/popover/user/user.vue'
    // import PopOverGroup from '@/common/popover/user/groups.vue'

    export default defineComponent({
        name: 'RequestItem',
        components: {
            Pill,
            ClassificationPill,
            Popover,
            AssetLogo,
            CertificateBadge,
            Avatar,
            TermPopover,
            AtlanButton,
            RequestDropdown,
            UserPill,
            CertificatePill,
            TermPiece,
            CategoryPiece,
            // PopOverUser,
            // PopOverGroup,
        },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
            item: {
                type: Object,
                default: () => ({}),
            },
        },
        emits: ['handleUpdateData'],
        setup(props, { emit }) {
            const { item } = toRefs(props)
            const updatedBy = ref({})
            const { classificationList } = useTypedefData()
            const createdTime = (time) => useTimeAgo(time).value
            const isLoading = ref(false)
            const loadingApproval = ref(false)

            const assetText = computed(
                () =>
                    item.value?.destinationQualifiedName
                        ?.split('/')
                        ?.slice(-3)
                        ?.reverse() || 'Link Asset'
            )
            const assetWrappper = computed(() => ({
                attributes: {
                    integrationName:
                        item.value?.destinationQualifiedName.split('/')[1],
                },
            }))
            const localClassification = (typeName) =>
                classificationList.value.find((clsf) => clsf?.name === typeName)

            function raiseErrorMessage(msg?: string) {
                message.error(msg || 'Request modification failed, try again')
            }

            const handleEvent = (action) => {
                console.log(item)
                let request_type
                if (item.value?.destinationAttribute)
                    request_type =
                        requestTypeEventMap[item.value?.destinationAttribute]
                            .requestType
                else
                    request_type =
                        requestTypeEventMap[item.value?.requestType].requestType

                console.log(request_type)
                useAddEvent('governance', 'requests', 'resolved', {
                    action,
                    request_type,
                    widget_type: 'sidebar',
                })
            }
            async function handleApproval(messageProp = '') {
                loadingApproval.value = true
                try {
                    await approveRequest(item.value.id, messageProp)
                    message.success('Request approved')
                    handleEvent('approve')
                    emit('handleUpdateData', item.value)
                } catch (error) {
                    raiseErrorMessage(error.response.data.message)
                }
                loadingApproval.value = false
            }

            async function handleRejection(messageProp = '') {
                isLoading.value = true
                try {
                    await declineRequest(item.value.id, messageProp)
                    // emit('action', item.value)
                    message.success('Request declined')
                    handleEvent('decline')
                    emit('handleUpdateData', item.value)
                } catch (error) {
                    raiseErrorMessage(error.response.data.message)
                    // raiseErrorMessage()
                }
                isLoading.value = false
            }

            const timeAgo = useTimeAgo(
                item.value.destinationEntity?.attributes?.certificateUpdatedAt,
                {
                    max: 'day',
                    fullDateFormatter: (dt: Date): string =>
                        dt.toDateString().split(' ').slice(1).join(' '),
                }
            )
            const assetIcon = computed(() => {
                let name =
                    item.value?.destinationQualifiedName.split('/')[1] || ''
                name = name.toLowerCase()
                // name[0] = name[0].toUpperCase()
                const result = `${name[0]?.toUpperCase() || ''}${name.slice(
                    1,
                    name.length
                )}`
                return result
            })
            const messageUpdate = computed(() => {
                if (item.value.approvedBy) {
                    return item.value.approvedBy[0]?.message
                }
                if (item.value.rejectedBy) {
                    return item.value.rejectedBy[0].message
                }
                return ''
            })
            const {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
            } = useTermPopover()
            // onMounted(() => {
            //     if (
            //         item.value.status === 'approved' ||
            //         item.value.status === 'rejected'
            //     ) {
            //         const userId =
            //             item.value.status === 'approved'
            //                 ? `${item.value.approvedBy[0].userId}`
            //                 : `${item.value.rejectedBy[0].userId}`
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
                if (item.value.status === 'approved') {
                    const userUpdater = item.value?.approvedBy || []
                    return userUpdater[0]?.username || ''
                }
                if (item.value.status === 'rejected') {
                    const userUpdater = item.value?.rejectedBy || []
                    return userUpdater[0]?.username || ''
                }
                return ''
            })
            const { mouseEnterDelay, enteredPill } = useMouseEnterDelay()
            const route = useRoute()
            const isGlossary = computed(
                () => route?.path?.includes('glossary') || null
            )
            return {
                createdTime,
                localClassification,
                handleRejection,
                isLoading,
                handleApproval,
                assetText,
                assetWrappper,
                timeAgo,
                atlanLogo,
                assetIcon,
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
                messageUpdate,
                nameUpdater,
                loadingApproval,
                dayjs,
                typeCopyMapping,
                map,
                destinationAttributeMapping,
                isGlossary,
            }
        },
    })
</script>

<style lang="less">
    .icon-warning {
        path {
            stroke: #f7b43d;
        }
    }
    .clasification-pill {
        // @apply hover:text-gray-700 !important;
    }
    .approved-icon {
        transform: scale(1.1);
    }
    .rejected-icon {
        transform: scale(0.8);
    }
    .card-container {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);

        &:hover {
            .asset-term {
                background: transparent !important;
            }
            .hover-action {
                display: flex !important;
            }
            .hover-reject-approve {
                display: flex !important;
            }
        }
        .classification-pill {
            width: fit-content;
        }
        &:hover {
            .actions-container {
                display: flex;
            }
        }
        .actions-container {
            width: 150px;
            height: calc(100% - 2px);
            right: 0;
            top: 1px;
            display: none;
            .action-btn {
                height: 24px;
                width: 32px;
                border-radius: 50%;
                background: white;
                border: 1px solid #e6e6eb;
                .btn-approve {
                    color: #009542;
                }
                .btn-reject {
                    path {
                        stroke: #ec2e3b;
                    }
                }
            }
        }
    }
    .mr-cta {
        margin-left: 8px;
    }
    .hover-action {
        .sparator {
            display: none !important;
        }
        button {
            box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);
            border-radius: 4px !important;
            border: 1px solid rgba(230, 230, 235, 1) !important;
            height: fit-content !important;
            padding: 2px 8px !important;
        }
    }
</style>
<style lang="less" scoped>
    .chevron-icon {
        height: 28px;
        // background: red;
        width: 25px;
        padding-top: 2px;
        // padding-right: 7px;
    }
    .sparator {
        border-right: 1px solid #e6e6eb;
        height: 10px;
        margin: 0 5px;
    }
    .container-loading {
        height: 500px;
    }
    .loading-container {
        z-index: 2;
        width: 150px;
        height: 113px;
        right: 0;
        top: 0;
    }
    .comment-delete {
        // height: 90px;
        width: 200px;
        padding: 12px 12px;
        border-radius: 8px !important;
    }
    .hover-reject-approve {
        position: absolute;
        right: 32px;
        z-index: 2;
        padding-left: 20px;
        display: none !important;
    }
    .hover-action {
        display: none !important;
        position: absolute !important;
        right: 15px;
        padding-left: 20px;
    }
    .linear-gradient {
        // background: rgb(244, 246, 253);
        // background: linear-gradient(
        //     90deg,
        //     rgba(244, 246, 253, 0.8183648459383753) 6%,
        //     rgba(244, 246, 253, 1) 16%
        // );
        background: rgb(255, 255, 255);
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.779171043417367) 32%,
            rgba(255, 255, 255, 1) 53%
        );
    }
</style>
