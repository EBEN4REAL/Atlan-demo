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
            <div class="flex p-1 bg-gray-100 rounded-lg">
                <div
                    class="flex px-3 py-1 text-sm font-bold rounded cursor-pointer"
                    :class="
                        activeTab === 'persona'
                            ? 'text-primary bg-white active-widget-tab'
                            : 'text-gray-600'
                    "
                    @click="activeTab = 'persona'"
                >
                    Persona
                    <div
                        class="flex items-center justify-center w-5 h-5 ml-1 text-xs rounded-full bg-primary-light"
                    >
                        {{ personas.length }}
                    </div>
                </div>
                <div
                    class="flex px-3 py-1 text-sm font-bold rounded cursor-pointer"
                    :class="
                        activeTab === 'purpose'
                            ? 'text-primary bg-white active-widget-tab'
                            : 'text-gray-600'
                    "
                    @click="activeTab = 'purpose'"
                >
                    Purpose
                    <div
                        class="flex items-center justify-center w-5 h-5 ml-1 text-xs rounded-full bg-primary-light"
                    >
                        {{ purposes.length }}
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
            <img
                :src="
                    activeTab === 'persona'
                        ? illustrationPersonaDemo
                        : illustrationPurposeDemo
                "
                class="ilustration"
            />
            <div class="mt-6 text-base font-bold">
                {{ activeTab === 'persona' ? 'Personas' : 'Purpose' }}
            </div>
            <div class="w-40 mt-1 text-sm text-center text-gray-600">
                {{
                    activeTab === 'persona'
                        ? 'Some description about personas goes here'
                        : 'Some description about purpose goes here'
                }}
            </div>
            <div
                class="flex items-center mt-5 text-sm cursor-pointer text-primary"
            >
                View documentation
                <AtlanIcon icon="External" class="h-4 ml-1" />
            </div>
        </div>
        <div v-else-if="!loadingChange" class="p-6">
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
                        class="z-10 flex items-center justify-center w-8 h-8 text-gray-800 bg-white border border-gray-300 border-solid rounded-full"
                    >
                        <AtlanIcon icon="ChevronLeft" class="w-4 h-4" />
                    </div>
                </template>
                <template #nextArrow>
                    <div
                        class="flex items-center justify-center w-8 h-8 text-gray-800 bg-white border border-gray-300 border-solid rounded-full"
                    >
                        <AtlanIcon icon="ChevronRight" class="w-4 h-4" />
                    </div>
                </template>
                <div v-if="showDemo[activeTab]" class="pr-3">
                    <div
                        class="relative flex flex-col items-center p-4 bg-gray-100 rounded-lg"
                    >
                        <div
                            class="absolute flex items-center justify-center w-5 h-5 bg-white border border-gray-200 rounded-full cursor-pointer -top-2 -right-2"
                            @click="showDemo[activeTab] = false"
                        >
                            <div class="icon-cross">
                                <AtlanIcon icon="Cross" class="w-4 h-4" />
                            </div>
                        </div>
                        <img
                            :src="
                                activeTab === 'persona'
                                    ? illustrationPersonaDemo
                                    : illustrationPurposeDemo
                            "
                            class="ilustration"
                        />
                        <div class="mt-5 text-xs text-center">
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
                        <div
                            class="flex items-center mt-4 text-xs text-gray-700 cursor-pointer"
                        >
                            View documentation
                            <AtlanIcon icon="External" class="h-4 ml-1" />
                        </div>
                    </div>
                </div>
                <Card
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    :type="activeTab"
                    :active="item.id === selectedItem.id"
                    @viewAssets="handleViewAssets"
                    @overView="handleOverView"
                />
            </Carousel>
        </div>
        <div v-else class="flex items-center justify-center h-64">
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
    import { defineComponent, computed, ref, watch } from 'vue'
    import { Carousel } from 'ant-design-vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import Card from './card.vue'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'
    import illustrationPersonaDemo from '~/assets/images/illustrations/illustration-persona-demo.png'
    import illustrationPurposeDemo from '~/assets/images/illustrations/illustration-purpose-demo.png'
    import useUserData from '~/composables/user/useUserData'
    import DrawerWidgetPersonaPurpose from './drawer.vue'

    export default defineComponent({
        name: 'WidgetPersonaPurpose',
        components: { Card, Carousel, AtlanLoader, DrawerWidgetPersonaPurpose },
        props: {},
        setup() {
            const { id, username } = useUserData()
            const activeTab = ref('persona')
            const loadingChange = ref(false)
            const visible = ref(false)
            const selectedItem = ref({})
            const showDemo = ref({
                persona: true,
                purpose: true,
            })
            const personaStore = usePersonaStore()
            const purposeStore = usePurposeStore()
            const personas = computed(
                () =>
                    personaStore.list.filter((persona) => {
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
            const purposes = computed(
                () =>
                    purposeStore.list.filter((purpose) => {
                        const metadataPolicies = purpose?.metadataPolicies || []
                        const dataPolicies = purpose?.dataPolicies || []
                        const policies = [...metadataPolicies, ...dataPolicies]
                        const users = []
                        const groups = []
                        policies.forEach((policy) => {
                            if (policy.users.length) {
                                users.push(...policy.users)
                            }
                            if (policy.groups.length) {
                                groups.push(...policy.groups)
                            }
                        })
                        let found = false
                        if (username) {
                            found =
                                found ||
                                users.some((user) => [username].includes(user))
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
            const handleViewAssets = (item) => {
                selectedItem.value = item
                visible.value = true
            }
            const handleOverView = (item) => {
                selectedItem.value = item
                visible.value = true
            }
            const handleCloseDrawer = () => {
                visible.value = false
                selectedItem.value = {}
            }
            return {
                personas,
                activeTab,
                purposes,
                items,
                loadingChange,
                illustrationPersonaDemo,
                illustrationPurposeDemo,
                showDemo,
                selectedItem,
                visible,
                handleViewAssets,
                handleOverView,
                handleCloseDrawer,
            }
        },
    })
</script>

<style lang="less" scoped>
    .icon-cross {
        transform: scale(0.5);
    }
    .ilustration {
        height: 75px;
        width: 92px;
    }
    .persona-purpose-widget {
        box-shadow: 0px 8px 24px 0px #1920380a;
    }
    .active-widget-tab {
        box-shadow: 0px 1px 4px 0px #0000001f;
    }
</style>
