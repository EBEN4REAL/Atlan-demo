<template>
    <div class="flex items-center justify-between w-full h-full">
        <div class="flex items-center h-full">
            <!-- <AtlanIcon
                v-if="!isHome"
                icon="Dots"
                class="h-6 mr-2 rounded cursor-pointer select-none hover:bg-primary-menu hover:text-primary"
                :class="{ 'text-primary': isSidebarActive }"
                @click="$emit('toggleNavbar')"
            /> -->
            <!-- 
            <div
                v-if="logoUrl && !logoNotFound"
                class="mb-0.5 flex items-center"
            >
                <router-link to="/">
                    <img
                        :src="logoUrl"
                        class="w-auto h-6 cursor-pointer select-none"
                        :alt="defaultLogo"
                        @error="onLogoNotFound"
                    />
                </router-link>
            </div> -->

            <!-- <p
                v-else
                class="text-lg font-bold text-gray-600 bg-white cursor-pointer hover:text-primary mt-0.5"
            >
                {{ logoName }}
            </p> -->

            <div
                class="flex items-center justify-center h-full pr-3 font-semibold leading-none"
            >
                <AtlanIcon :icon="pageIcon" class="h-5 mb-0.5 mr-1"></AtlanIcon>
                <span class="text-base">{{ pageName }}</span>
            </div>

            <div
                v-if="isAssets"
                class="flex items-center h-full transition border-l border-r border-gray-200 hover:bg-primary-menu"
            >
                <GlobalSelection
                    :key="dirtyTimestamp"
                    v-model="globalState"
                    @change="handleGlobalStateChange"
                ></GlobalSelection>
            </div>
            <!-- <div
                class="ml-3"
                v-if="isAssets && globalState?.length > 1"
                @click="handleInfo"
            >
                <a-tooltip title="Click to view details">
                    <a-button class="h-6 px-2 py-0 leading-none">
                        <AtlanIcon
                            icon="Info"
                            class="text-primary"
                        ></AtlanIcon></a-button
                ></a-tooltip>
                <a-modal v-model:visible="infoVisible" :footer="null">
                    <ContextModal :context="globalState"></ContextModal>
                </a-modal>
            </div> -->
        </div>
        <div
            class="flex items-center h-full cursor-pointer justify-self-end gap-x-3"
        >
            <a-dropdown placement="bottomRight">
                <template #overlay>
                    <a-menu>
                        <div class="">
                            <!-- had to replace a-menu-item with divs because v-auth wasn't working with it-->
                            <div
                                v-auth="[map.CREATE_WORKFLOW]"
                                class="menu-item"
                            >
                                <router-link to="/workflows/marketplace">
                                    New Workflow
                                </router-link>
                            </div>
                            <div class="menu-item">
                                <router-link to="/insights">
                                    New Query
                                </router-link>
                            </div>
                            <div
                                v-auth="[map.CREATE_PERSONA]"
                                class="menu-item"
                            >
                                <router-link to="/governance/personas">
                                    New Persona
                                </router-link>
                            </div>
                            <div
                                v-auth="[map.CREATE_PURPOSE]"
                                class="menu-item"
                            >
                                <router-link to="/governance/purposes">
                                    New Purpose
                                </router-link>
                            </div>
                        </div>
                    </a-menu></template
                >

                <a-button
                    size="small"
                    class="text-white bg-green-500 border-green-500"
                    ><AtlanIcon icon="Add" class="text-white"></AtlanIcon> New
                    <AtlanIcon icon="ChevronDown" class="h-3 ml-1"></AtlanIcon>
                </a-button>
            </a-dropdown>
            <a-dropdown placement="bottomRight">
                <template #overlay>
                    <a-menu>
                        <a-menu-item
                            class="menu-item hover:text-primary"
                            @click="toggleHelpWidget"
                        >
                            <AtlanIcon icon="Support" class="mr-2" />
                            Support
                        </a-menu-item>
                        <a-menu-item
                            class="documentation-menu-item menu-item hover:text-primary"
                        >
                            <a target="_blank" :href="documentationLink">
                                <AtlanIcon icon="Documentation" class="mr-2" />
                                Atlan Documentation
                            </a>
                        </a-menu-item>
                    </a-menu></template
                >
                <AtlanButton2
                    color="secondary"
                    class="min-w-0 px-0 text-gray-700 bg-transparent border-none"
                >
                    <AtlanIcon icon="QuestionRound" class="h-6" />
                </AtlanButton2>
            </a-dropdown>
            <div class="announcekit-widget">
                <a-tooltip>
                    <template #title>
                        <span>What's New</span>
                        <span class="text-lg"> ✨ </span>
                    </template>
                    <AtlanIcon icon="Gift" class="h-6" />
                </a-tooltip>
            </div>
            <!-- <atlan-icon icon="Search" class="h-5 mr-3" />

            <atlan-icon icon="Add" class="h-5 mr-3 font-bold text-primary" /> -->
            <!-- <AtlanIcon icon="Notification" class="h-5 mr-3" /> -->
            <div class="pl-3 border-l">
                <UserPersonalAvatar class="self-center" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        ref,
        watch,
        toRefs,
        onMounted,
    } from 'vue'

    import { useRoute, useRouter } from 'vue-router'
    import UserPersonalAvatar from '@/common/avatar/me.vue'
    import GlobalSelection from '@/common/cascade/global.vue'
    import { useTenantStore } from '~/store/tenant'
    import ContextModal from '@/common/modal/context.vue'

    import defaultLogo from '~/assets/images/your_company.png'

    import AssetMenu from '../assets/profile/header/assetMenu.vue'
    import map from '~/constant/accessControl/map'
    import useAssetStore from '~/store/asset'
    import useHelpWidget from '~/composables/helpCenter/useHelpWidget'
    import { helpCenterList } from '~/constant/navigation/helpCentre'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        name: 'Navigation Menu',
        components: {
            UserPersonalAvatar,
            ContextModal,
            AssetMenu,
            GlobalSelection,
        },
        props: {
            page: { type: String, required: false },
            isSidebarActive: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['toggleNavbar', 'openNavbar'],
        setup(props, { emit }) {
            const personaStore = usePersonaStore()
            const purposeStore = usePurposeStore()
            const { page } = useVModels(props, emit)
            const tenantStore = useTenantStore()
            const currentRoute = useRoute()
            const logoNotFound = ref(false)
            const { toggleHelpWidget } = useHelpWidget()

            const infoVisible = ref(false)

            const isHome = computed(() => {
                if (currentRoute.name === 'index') {
                    return true
                }
                return false
            })

            const isAssets = computed(() => {
                if (
                    currentRoute.path.startsWith('/assets') &&
                    !currentRoute.params.id
                ) {
                    return true
                }

                return false
            })

            const { logoUrl } = toRefs(tenantStore)

            const logoName = computed(() => tenantStore.displayName)

            const router = useRouter()
            const handleNewPackage = () => {
                router.push('/packages')
            }

            const onLogoNotFound = () => {
                logoNotFound.value = true
            }

            const assetStore = useAssetStore()
            const globalState = ref([])

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            watch(
                () => [
                    assetStore.globalState,
                    personaStore.list,
                    purposeStore.list,
                ],
                ([newValue, persona, purpose]) => {
                    let payload = newValue
                    if (payload[0] === 'persona') {
                        const finded = persona.find(
                            (el) => el.id === payload[1]
                        )
                        const enable = finded?.enabled || false
                        if (!enable) {
                            assetStore.setGlobalState(['all'])
                        }
                    }
                    if (payload[0] === 'purpose') {
                        const finded = purpose.find(
                            (el) => el.id === payload[1]
                        )
                        const enable = finded?.enabled || false
                        if (!enable) {
                            assetStore.setGlobalState(['all'])
                        }
                    }
                    // console.log(personaStore.list, ' <sdsdsdsd')
                    globalState.value = payload
                    dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                },
                {
                    immediate: true,
                }
            )

            const pageIcon = computed(() => {
                if (currentRoute.path.startsWith('/assets')) {
                    return 'AssetsActive'
                }
                if (currentRoute.path.startsWith('/glossary')) {
                    return 'Glossary'
                }
                if (currentRoute.path.startsWith('/insights')) {
                    return 'InsightsActive'
                }
                if (currentRoute.path.startsWith('/workflows')) {
                    return 'WorkflowsActive'
                }
                if (currentRoute.path.startsWith('/governance')) {
                    return 'GovernanceCenter'
                }
                if (currentRoute.path.startsWith('/admin')) {
                    return 'Admin'
                }
            })

            const pageName = computed(() => {
                if (currentRoute.path.startsWith('/assets')) return 'Assets'
                if (currentRoute.path.startsWith('/glossary')) return 'Glossary'
                if (currentRoute.path.startsWith('/insights')) return 'Insights'
                if (currentRoute.path.startsWith('/workflows'))
                    return 'Workflow Center'
                if (currentRoute.path.startsWith('/governance'))
                    return 'Governance Center'
                if (currentRoute.path.startsWith('/admin'))
                    return 'Admin Center'
                return 'Atlan'
            })

            const handleGlobalStateChange = () => {
                assetStore.setGlobalState(globalState.value)
            }

            const handleInfo = () => {
                infoVisible.value = !infoVisible.value
            }
            const documentationLink = computed(
                () =>
                    helpCenterList.find(
                        (listItem) => listItem.id === 'documentation'
                    )?.link ?? ''
            )
            const { username, email, userId } = whoami()

            onMounted(() => {
                if (window?.announcekit)
                    window.announcekit.push({
                        widget: 'https://announcekit.co/widgets/v2/1JYrEk',
                        selector: '.announcekit-widget',
                        lang: 'en',
                        user: {
                            id: userId.value,
                        },
                        data: {
                            domain: window.location.hostname,
                            username: username.value,
                        },
                    })
            })

            return {
                page,
                isHome,
                logoUrl,
                logoName,
                currentRoute,
                defaultLogo,
                handleNewPackage,
                onLogoNotFound,
                logoNotFound,
                map,
                handleGlobalStateChange,
                globalState,
                isAssets,
                dirtyTimestamp,
                handleInfo,
                infoVisible,
                toggleHelpWidget,
                documentationLink,
                pageName,
                pageIcon,
            }
        },
    })
</script>

<style lang="less" scoped>
    .menu-item {
        @apply px-4 py-2;
        cursor: pointer;
    }
    .menu-item:hover {
        a {
            @apply text-gray-700;
        }
        @apply bg-gray-100;
    }
    .documentation-menu-item:hover {
        a {
            @apply text-primary !important;
        }
    }
</style>
<style lang="less">
    .announcekit-widget {
        .announcekit-widget-badge {
            @apply absolute -right-2 top-4 !important;
        }
    }
    // :globa(.announcekit-widget-badge) {
    //     @apply absolute -right-2 top-5;
    // }
</style>
