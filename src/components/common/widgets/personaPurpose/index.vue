<template>
    <div
        class="bg-white border border-gray-200 rounded-lg persona-purpose-widget"
    >
        <div
            class="flex items-center justify-between px-6 py-5 border-b border-gray-200"
        >
            <div class="text-lg font-bold font-black">
                Personalise your experience
            </div>
            <div class="flex items-center">
                <!-- <a
                    v-if="!showDemo[activeTab]"
                    :href="
                        activeTab === 'persona'
                            ? 'https://ask.atlan.com/hc/en-us/articles/4413870860049-What-are-personas-'
                            : 'https://ask.atlan.com/hc/en-us/articles/4418690792849-What-are-Purposes-in-Atlan-'
                    "
                    target="_blank"
                >
                    <div
                        class="flex items-center mr-3 text-sm text-gray-600 cursor-pointer hover:text-primary get-started-container"
                    >
                        Get started
                        <AtlanIcon
                            icon="QuestionRound"
                            class="w-6 h-6 icon-question-round"
                        />
                    </div>
                </a> -->
                <div class="flex p-1 bg-gray-100 rounded-lg">
                    <div
                        class="flex px-3 py-1 text-sm rounded cursor-pointer"
                        :class="
                            activeTab === 'persona'
                                ? 'text-primary bg-white active-widget-tab font-bold'
                                : 'text-gray-600 font-medium'
                        "
                        @click="activeTab = 'persona'"
                    >
                        Persona
                        <div
                            v-if="personas.length"
                            class="flex items-center justify-center w-5 h-5 ml-1 text-xs rounded-full"
                            :class="`${
                                activeTab === 'persona'
                                    ? 'bg-primary-light'
                                    : 'bg-gray-200'
                            }`"
                        >
                            {{ personas.length || '' }}
                        </div>
                    </div>
                    <div
                        class="flex px-3 py-1 text-sm rounded cursor-pointer"
                        :class="
                            activeTab === 'purpose'
                                ? 'text-primary bg-white active-widget-tab font-bold'
                                : 'text-gray-600 font-medium'
                        "
                        @click="activeTab = 'purpose'"
                    >
                        Purpose
                        <div
                            v-if="purposes.length"
                            :class="`${
                                activeTab === 'purpose'
                                    ? 'bg-primary-light'
                                    : 'bg-gray-200'
                            }`"
                            class="flex items-center justify-center w-5 h-5 ml-1 text-xs rounded-full"
                        >
                            {{ purposes.length || '' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="!items.length"
            class="relative flex flex-col items-center p-4 m-6 bg-gray-100 rounded-xl h-60"
        >
            <div
                class="absolute flex items-center p-2 text-xs text-gray-800 bg-white rounded top-2 right-2"
            >
                <AtlanIcon icon="Info" class="w-3 h-3 mr-1" />
                {{
                    activeTab === 'persona'
                        ? 'You are not part of any persona yet'
                        : 'You are not part of any purpose yet'
                }}
            </div>
            <AtlanIcon
                :icon="
                    activeTab === 'persona'
                        ? 'IllustrationPersonaDemo'
                        : 'IllustrationPurposeDemo'
                "
                class="ilustration-persona-purpose-demo"
            />
            <div class="mt-6 text-base font-bold">
                {{ activeTab === 'persona' ? 'Personas' : 'Purposes' }}
            </div>
            <div class="w-40 mt-1 text-sm text-center text-gray-600">
                {{ `Please ask your admin to assign you a ${activeTab}` }}
            </div>
            <a
                :href="
                    activeTab === 'persona'
                        ? 'https://ask.atlan.com/hc/en-us/articles/4413870860049-What-are-personas-'
                        : 'https://ask.atlan.com/hc/en-us/articles/4418690792849-What-are-Purposes-in-Atlan-'
                "
                target="_blank"
            >
                <div
                    class="flex items-center mt-5 text-sm cursor-pointer text-primary"
                >
                    View documentation
                    <AtlanIcon icon="External" class="h-4 ml-1" />
                </div>
            </a>
        </div>
        <div v-else-if="!loadingChange" class="p-6 carousel-container">
            <Carousel
                :draggable="true"
                :swipe="true"
                :arrows="true"
                :infinite="false"
                :slides-to-show="3"
                :slides-to-scroll="3"
            >
                <template #prevArrow>
                    <div
                        class="z-10 flex items-center justify-center w-8 h-8 ml-2 text-gray-800 bg-white border border-gray-300 border-solid rounded-full"
                    >
                        <AtlanIcon icon="ChevronLeft" class="w-4 h-4" />
                    </div>
                </template>
                <template #nextArrow>
                    <div
                        class="flex items-center justify-center w-8 h-8 mr-5 text-gray-800 bg-white border border-gray-300 border-solid rounded-full"
                    >
                        <AtlanIcon icon="ChevronRight" class="w-4 h-4" />
                    </div>
                </template>
                <!-- <div v-if="showDemo[activeTab]" class="pr-3"> -->
                <div v-if="false" class="pr-3">
                    <div
                        class="relative flex flex-col items-center p-4 bg-gray-100 border border-gray-200 rounded-lg"
                    >
                        <div
                            class="absolute flex items-center justify-center w-5 h-5 bg-white border border-gray-200 rounded-full cursor-pointer -top-2 -right-2"
                            @click="showDemo[activeTab] = false"
                        >
                            <div class="icon-cross">
                                <AtlanIcon
                                    icon="Cross"
                                    class="w-5 h-5 text-gray-700"
                                />
                            </div>
                        </div>
                        <AtlanIcon
                            :icon="
                                activeTab === 'persona'
                                    ? 'IllustrationPersonaDemo'
                                    : 'IllustrationPurposeDemo'
                            "
                            class="ilustration-persona-purpose-demo"
                        />
                        <div class="mt-5 text-sm text-center">
                            {{
                                activeTab === 'persona'
                                    ? 'Some description about personas goes here'
                                    : 'Some description about purpose goes here'
                            }}
                        </div>
                        <div class="h-9" />
                        <!-- <AtlanButton2
                            suffix-icon="ArrowRight"
                            size="sm"
                            class="px-4 py-0 mt-5 text-xs h-7"
                            >Guided demo</AtlanButton2
                        > -->
                        <a
                            :href="
                                activeTab === 'persona'
                                    ? 'https://ask.atlan.com/hc/en-us/articles/4413870860049-What-are-personas-'
                                    : 'https://ask.atlan.com/hc/en-us/articles/4418690792849-What-are-Purposes-in-Atlan-'
                            "
                            target="_blank"
                        >
                            <div
                                class="flex items-center mt-4 text-xs cursor-pointer text-primary"
                            >
                                View documentation
                                <AtlanIcon icon="External" class="h-4 ml-1" />
                            </div>
                        </a>
                    </div>
                </div>
                <Card
                    v-for="(item, i) in items"
                    :key="item.id"
                    :item="item"
                    :type="activeTab"
                    :active="item.id === selectedItem.id"
                    :user-list="userList"
                    :i="i"
                    @viewAssets="handleViewAssets"
                    @overView="handleOverView"
                />
            </Carousel>
        </div>
        <div v-else class="flex items-center justify-center loader-container">
            <AtlanLoader icon="CircleLoader" class="h-8 animate-spin" />
        </div>
        <DrawerWidgetPersonaPurpose
            :active-tab="activeTab"
            :item="selectedItem"
            :visible="visible"
            @close="handleCloseDrawer"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch, onMounted } from 'vue'
    import { Carousel } from 'ant-design-vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import { useRouter } from 'vue-router'
    import Card from './card.vue'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'
    import useUserData from '~/composables/user/useUserData'
    import DrawerWidgetPersonaPurpose from './drawer.vue'
    import { useUsers } from '~/composables/user/useUsers'
    import useAssetStore from '~/store/asset'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'WidgetPersonaPurpose',
        components: { Card, Carousel, AtlanLoader, DrawerWidgetPersonaPurpose },
        props: {},
        setup() {
            const router = useRouter()
            const { id, username } = useUserData()
            const activeTab = ref('persona')
            const loadingChange = ref(false)
            const visible = ref(false)
            const selectedItem = ref({})
            const showDemo = ref({
                persona: true,
                purpose: true,
            })
            const params = ref({ filter: { $or: [] } })
            const { userList, mutate } = useUsers(params, false)
            const personaStore = usePersonaStore()
            const purposeStore = usePurposeStore()
            const personas = computed(
                () =>
                    personaStore.list.filter((persona) => {
                        if (!persona.enabled) return false
                        const users = persona?.users || []
                        // const groups = persona?.groups || []
                        let found = false
                        if (id) {
                            found =
                                found ||
                                users.some((user) => [id].includes(user))
                        }
                        // if (ownerGroups && ownerGroups.length) {
                        //     found =
                        //         found || groups.some((group) => ownerGroups.includes(group))
                        // }
                        return found
                    }) || []
            )
            watch(personas, (newVal) => {
                if (newVal.length && !userList?.value?.length) {
                    let userIds = []
                    personas.value.forEach((el) => {
                        userIds = [...userIds, ...el.users]
                    })
                    userIds = [...new Set(userIds)]
                    const filter = userIds.map((el) => ({ id: el }))
                    params.value = { filter: { $or: filter } }
                }
            })
            const purposes = computed(
                () =>
                    purposeStore.list.filter((purpose) => {
                        if (!purpose.enabled) return false
                        const metadataPolicies = purpose?.metadataPolicies || []
                        const dataPolicies = purpose?.dataPolicies || []
                        const policies = [...metadataPolicies, ...dataPolicies]
                        const users = []
                        const groups = []
                        let isAllUsers = false
                        policies.forEach((policy) => {
                            if (policy.users.length) {
                                users.push(...policy.users)
                            }
                            if (policy.groups.length) {
                                groups.push(...policy.groups)
                            }
                            if (policy?.allUsers) {
                                isAllUsers = true
                            }
                        })
                        let found = false
                        if (username) {
                            found =
                                found ||
                                users.some((user) => [username].includes(user))
                        }
                        if (isAllUsers) {
                            found = isAllUsers
                        }
                        // if (ownerGroups && ownerGroups.length) {
                        //     found =
                        //         found || groups.some((group) => ownerGroups.includes(group))
                        // }
                        return found
                    }) || []
            )
            watch(activeTab, () => {
                loadingChange.value = true
                setTimeout(() => {
                    loadingChange.value = false
                }, 100)
            })
            const items = computed(() =>
                activeTab.value === 'persona' ? personas.value : purposes.value
            )
            const assetStore = useAssetStore()
            const handleViewAssets = (item) => {
                assetStore.setGlobalState([activeTab.value, item.id])
                useAddEvent('governance', activeTab.value, 'home_card_asset', {
                    [`${activeTab.value}_name`]: item.displayName,
                    index: item.i,
                })

                router.push('/assets')
            }
            const handleOverView = (item) => {
                useAddEvent('governance', activeTab.value, 'home_card', {
                    [`${activeTab.value}_name`]: item.displayName,
                    index: item.i,
                })
                selectedItem.value = item
                visible.value = true
            }
            const handleCloseDrawer = () => {
                visible.value = false
                selectedItem.value = {}
            }
            onMounted(() => {
                mutate()
            })
            return {
                personas,
                activeTab,
                purposes,
                items,
                loadingChange,
                showDemo,
                selectedItem,
                visible,
                handleViewAssets,
                handleOverView,
                handleCloseDrawer,
                userList,
            }
        },
    })
</script>

<style lang="less" scoped>
    .loader-container {
        height: 280px;
    }
    .icon-cross {
        transform: scale(0.5);
    }
    .persona-purpose-widget {
        height: 360px;
        box-shadow: 0px 8px 24px 0px #1920380a;
    }
    .active-widget-tab {
        box-shadow: 0px 1px 4px 0px #0000001f;
    }
</style>
<style lang="less">
    .ilustration-persona-purpose-demo {
        height: 70px !important;
        width: 92px !important;
    }
    .get-started-container {
        &:hover {
            path {
                stroke: #3c71df;
            }
        }
    }
    .icon-question-round {
        transform: scale(0.7);
        path {
            stroke: #6a7692;
        }
    }
    .carousel-container {
        .slick-disabled {
            display: none !important;
        }
    }
</style>
