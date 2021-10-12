<template>
    <div class="popover-container">
        <div class="flex items-center mb-2">
            <p class="text-base font-bold text-gray-700">
                {{ title(item) }}
            </p>
            <div class="ml-2 -mt-0.5">
                <StatusBadge
                    :status-id="item.certificateStatus"
                    :show-chip-style-status="false"
                    :show-no-status="true"
                    :show-label="false"
                    class="p-0 text-xs cursor-pointer"
                ></StatusBadge>
            </div>
        </div>
        <p class="mb-2 text-sm text-gray-500">
            {{ description(item) }}
        </p>

        <!-- <div
            class="flex flex-wrap items-center"
            :class="TAndCList.length > 0 ? 'mb-4' : ''"
        >
            <PillGroup
                :data="TAndCList"
                label-key="displayText"
                read-only
                popover-trigger="hover"
            >
                <template #pillPrefix="{ item }">
                    <AtlanIcon
                        v-if="item && item.type === 'classification'"
                        icon="Shield"
                        class="text-pink-400"
                    />
                    <AtlanIcon v-else icon="Term" class="text-purple-500" />
                </template>
                <template #popover="{ item }">
                    <ClassificationInfoCard
                        v-if="item.type === 'classification'"
                        :classification="item"
                        class="w-32"
                /></template>
                <template #suffix>
                    <span
                        v-if="splittedTAndC.b.length > 0"
                        class="
                            px-1
                            py-0.5
                            text-sm
                            rounded
                            text-primary
                            mr-3
                            cursor-pointer
                        "
                        @click="() => toggleAllTAndC()"
                    >
                        {{
                            showAllTAndC
                                ? 'Show less'
                                : `and ${splittedTAndC.b.length} more`
                        }}
                    </span>
                </template>
            </PillGroup>
        </div> -->

        <div class="">
            <p class="mb-1 text-gray-700">Owned By</p>
            <div
                class="flex items-center justify-between"
                v-if="ownerList.length > 0"
            >
                <PillGroup
                    :data="ownerList"
                    label-key="username"
                    read-only
                    popover-trigger="hover"
                >
                    <template #pillPrefix="{ item }">
                        <avatar
                            class="-ml-2.5"
                            v-if="item && item.type === 'user'"
                            :image-url="
                                KeyMaps.auth.avatar.GET_AVATAR({
                                    username: item.username,
                                })
                            "
                            :allow-upload="false"
                            :avatar-name="item.username"
                            avatar-size="small"
                            :avatar-shape="'circle'"
                        />
                        <AtlanIcon
                            v-else-if="item && item.type === 'group'"
                            icon="Group"
                            class="
                                h-4
                                -ml-0.5
                                text-primary
                                group-hover:text-white
                            "
                        />
                    </template>
                    <template #popover="{ item }"
                        ><OwnerInfoCard :user="item"
                    /></template>
                    <template #suffix>
                        <span
                            v-if="splittedUsers.b.length > 0"
                            class="
                                px-1
                                py-0.5
                                text-sm
                                rounded
                                text-primary
                                mr-3
                                cursor-pointer
                            "
                            @click="() => toggleAllUsers()"
                        >
                            {{
                                showAllUsers
                                    ? 'Show less'
                                    : `and ${splittedUsers.b.length} more`
                            }}
                        </span>
                    </template>
                </PillGroup>
            </div>
            <p class="text-sm text-gray-500" v-else>
                {{ 'None' }}
            </p>
        </div>
        <div class="flex justify-end w-full mt-3 text-primary">
            <div class="flex items-center cursor-pointer" @click="oSidebar">
                View in sidebar
                <AtlanIcon icon="ArrowRight" class="ml-1"></AtlanIcon>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        watch,
        toRefs,
        computed,
        inject,
        Ref,
        toRaw,
        ComputedRef,
    } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { List } from '~/constant/status'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Pill from '~/components/UI/pill/pill.vue'
    import { KeyMaps } from '~/api/keyMap'
    import Avatar from '~/components/common/avatar.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            StatusBadge,
            PillGroup,
            ClassificationInfoCard,
            OwnerInfoCard,
            Pill,
            Avatar,
        },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { openAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )
            const { description, title } = useAssetInfo()

            const {
                mixClassificationsAndTerms,
                mixOwnersAndGroups,
                splitArray,
            } = useSchema()
            const { item } = toRefs(props)
            const mixedTermsAndClassifications = ref([])
            const mixedOwnersAndGroups = ref([])
            const showAllUsers = ref(false)
            const showAllTAndC = ref(false)
            const showPillsCount = ref(4)
            const sidebarDisabled = ref(false)

            const oSidebar = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.assetSidebar.assetInfo = item.value
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy)
            }

            const splittedUsers = ref(splitArray(5, mixedOwnersAndGroups.value))
            const splittedTAndC = ref(
                splitArray(5, mixedTermsAndClassifications.value)
            )

            const ownerList = computed(() =>
                showAllUsers.value
                    ? [...splittedUsers.value.a, ...splittedUsers.value.b]
                    : splittedUsers.value.a
            )
            const TAndCList = computed(() =>
                showAllTAndC.value
                    ? [...splittedTAndC.value.a, ...splittedTAndC.value.b]
                    : splittedTAndC.value.a
            )
            const toggleAllUsers = () => {
                showAllUsers.value = !showAllUsers.value
            }
            const toggleAllTAndC = () => {
                showAllTAndC.value = !showAllTAndC.value
            }

            watch(
                item,
                () => {
                    console.log(item, 'item')
                    mixedTermsAndClassifications.value = []
                    mixedOwnersAndGroups.value = []
                    const classifications = item.value?.classifications ?? []
                    const terms = item.value?.meanings ?? []
                    const groups: string[] =
                        item.value?.attributes?.ownerGroups?.split(',') ?? []
                    const owners: string[] =
                        item.value?.attributes?.ownerUsers?.split(',') ?? []

                    mixedTermsAndClassifications.value =
                        mixClassificationsAndTerms(classifications, terms)
                    mixedOwnersAndGroups.value = mixOwnersAndGroups(
                        owners,
                        groups
                    )
                    splittedUsers.value = splitArray(
                        showPillsCount.value,
                        mixedOwnersAndGroups.value
                    )
                    splittedTAndC.value = splitArray(
                        showPillsCount.value,
                        mixedTermsAndClassifications.value
                    )
                    // console.log(mixedTermsAndClassifications.value, 'mix')
                },
                { immediate: true }
            )
            return {
                title,
                description,
                sidebarDisabled,
                activeInlineTab,
                toggleAllTAndC,
                toggleAllUsers,
                showAllTAndC,
                TAndCList,
                splittedTAndC,
                showAllUsers,
                ownerList,
                oSidebar,
                splittedUsers,
                mixedTermsAndClassifications,
                KeyMaps,
                List,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .popover-container {
        width: 440px !important;
    }
    .horizontal-scrollbar::-webkit-scrollbar {
        width: 0;
    }

    .child {
        transform: translate(-50%, -150%);
        right: 0%;
        height: 31px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
