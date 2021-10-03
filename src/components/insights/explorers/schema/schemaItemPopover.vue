<template>
    <div class="popover-container">
        <div class="flex text-gray-500">
            <div class="flex items-center flex-1 mr-5 text-xs">
                <div class="flex items-center h-full">
                    <div class="relative w-4 h-4 mr-1 overflow-hidden">
                        <div class="absolute absolute-center">
                            <AtlanIcon icon="PublicFolder" class="h-4" />
                        </div>
                        <!-- <div class="absolute absolute-center">
                                <AtlanIcon
                                    icon="PrivateFolder"
                                    class="h-4 m-0 -ml-0.5 -mt-0.5 absolute"
                                />
                            </div> -->
                    </div>

                    <span>Metrics</span>
                </div>
                <div class="w-1 h-1 mx-2 bg-gray-500 rounded-full"></div>
                <div class="flex items-center h-full">
                    <span>Last run 5 days ago</span>
                </div>
                <div class="w-1 h-1 mx-2 bg-gray-500 rounded-full"></div>
                <div class="flex items-center h-full">
                    <span>308 total runs</span>
                </div>
            </div>
            <div>
                <StatusBadge
                    :status-id="item.status"
                    :show-chip-style-status="false"
                    :show-no-status="true"
                    :show-label="true"
                    class="p-0 text-xs cursor-pointer"
                ></StatusBadge>
            </div>
        </div>
        <p class="my-1.5 mb-2 text-base font-bold text-gray-700">
            {{ item.title }}
        </p>
        <p class="mb-2 text-sm text-gray-500">
            {{ item.description === '' ? 'No description' : item.description }}
        </p>

        <div class="flex items-center overflow-y-hidden horizontal-scrollbar">
            <template
                v-for="(item, index) in mixedTermsAndClassifications"
                :key="index"
            >
                <Pill
                    class="flex-none mr-2"
                    :label="item?.displayText"
                    :has-action="false"
                >
                    <template #prefix>
                        <AtlanIcon
                            icon="Shield"
                            class="text-pink-400"
                            v-if="item?.typeName"
                        ></AtlanIcon>
                        <AtlanIcon icon="Term" v-else></AtlanIcon>
                    </template>
                </Pill>
            </template>

            <!-- <PillGroup
                :data="mixedTermsAndClassifications"
                label-key="displayText"
                popover-trigger="hover"
                read-only
            >
                <template #pillPrefix="{ item }">
                    <AtlanIcon
                        icon="Shield"
                        class="text-pink-400"
                        v-if="item?.typeName"
                    ></AtlanIcon>
                    <AtlanIcon icon="Term" v-else></AtlanIcon>
                </template>

                <template #popover="{ item }">
                    <ClassificationInfoCard
                        :classification="item"
                        class="w-32"
                        v-if="item?.typeName"
                /></template>
            </PillGroup> -->
        </div>
        <div
            class="absolute w-6 bg-gradient-to-l from-white via-white child"
        ></div>

        <div>
            <p class="mb-2 text-gray-700">Owned By</p>
            <div class="flex items-center justify-between">
                <Pill class="flex-none" label="Nitya" :has-action="false">
                    <template #prefix>
                        <avatar
                            class="-ml-2.5"
                            :image-url="
                                KeyMaps.auth.avatar.GET_AVATAR({
                                    username: 'nitya',
                                })
                            "
                            :allow-upload="false"
                            avatar-name="'nitya'"
                            avatar-size="small"
                            :avatar-shape="'circle'"
                        />
                    </template>
                </Pill>
                <div class="text-primary">
                    <div
                        class="flex items-center cursor-pointer"
                        @click="oSidebar"
                    >
                        View in sidebar
                        <AtlanIcon icon="ArrowRight" class="ml-1"></AtlanIcon>
                    </div>
                </div>
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
        inject,
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

    export default defineComponent({
        components: {
            StatusBadge,
            PillGroup,
            ClassificationInfoCard,
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
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )
            const { item } = toRefs(props)
            const mixedTermsAndClassifications = ref([])
            const mixClassificationsAndTerms = (
                classifications: any[],
                terms: any[]
            ) => {
                const mix = []
                let i = 0,
                    clength = classifications.length
                let j = 0,
                    tlength = terms.length
                let k = 0
                while (i < clength && j < tlength) {
                    if (k % 2 == 0) {
                        // classifications does not have displayText property
                        mix.push({
                            ...classifications[i],
                            displayText: classifications[i].typeName,
                        })
                        i++
                    } else {
                        // terms already have displayText property
                        mix.push(terms[j])
                        j++
                    }
                    k++
                }
                if (i < clength) {
                    for (let m = i; m < clength; m++) {
                        mix.push({
                            ...classifications[i],
                            displayText: classifications[i].typeName,
                        })
                    }
                }
                if (j < tlength) {
                    for (let m = i; m < tlength; m++) {
                        mix.push(terms[i])
                    }
                }
                return mix
            }
            const oSidebar = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.assetSidebar.assetInfo = item
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy)
            }
            watch(
                item,
                () => {
                    console.log(item.value, 'item')
                    mixedTermsAndClassifications.value = []
                    const classifications = item.value?.classifications ?? []
                    const terms = item.value?.meanings ?? []
                    mixedTermsAndClassifications.value =
                        mixClassificationsAndTerms(classifications, terms)
                },
                { immediate: true }
            )
            return {
                oSidebar,
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
